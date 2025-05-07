import { Injectable } from '@nestjs/common';
import { LiquidSimulatorService } from './liquid-simulator.service';
import { google, sheets_v4, drive_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { ReportSummaryDto } from './simulator/simulator.builder';
import { autorunInput } from './autorun.input';
import * as moment from 'moment';

@Injectable()
export class ReportGoogleSheetService {
  private isRunning = false;
  private sheet: sheets_v4.Sheets;
  private drive: drive_v3.Drive;

  constructor(private readonly liquidSimulatorService: LiquidSimulatorService) {
    const auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    this.sheet = google.sheets({ version: 'v4', auth });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async runSimulator() {
    if (this.isRunning) {
      throw new Error('Simulator is already running');
    }
    this.isRunning = true;
    console.log('Start upgrade data');
    await this.liquidSimulatorService.upgradeData();
    console.log('Upgrade data done');

    const startOfThisWeek = moment().startOf('week').toDate();
    const startOfLastWeek = moment()
      .subtract(1, 'week')
      .startOf('week')
      .toDate();
    const startOfToday = moment().startOf('day').toDate();

    const thisWeekReport = await this.createReport({
      startDate: startOfThisWeek,
      endDate: startOfToday,
    });
    const lastWeekReport = await this.createReport({
      startDate: startOfLastWeek,
      endDate: startOfThisWeek,
    });

    const thisweekFilename = `${moment(startOfToday).format(
      'YYYY-MM-DD',
    )}-this-week`;
    const lastweekFilename = `${moment(startOfToday).format(
      'YYYY-MM-DD',
    )}-last-week`;

    const thisWeekSheetUrl = await this.writeToSheet(
      thisweekFilename,
      thisWeekReport,
    );
    console.log('thisWeekSheetUrl', thisWeekSheetUrl);
    const lastWeekSheetUrl = await this.writeToSheet(
      lastweekFilename,
      lastWeekReport,
    );
    this.isRunning = false;
    console.log('lastWeekSheetUrl', lastWeekSheetUrl);
    return {
      thisWeekSheetUrl,
      lastWeekSheetUrl,
    };
  }

  private async createReport(params: { startDate: Date; endDate: Date }) {
    this.isRunning = true;
    const thresholds = [];
    for (let threshold = 0; threshold <= 200; threshold += 1) {
      thresholds.push(threshold);
    }

    const results: Record<string, ReportSummaryDto[]> = {};

    for (const input of autorunInput) {
      results[input.symbol] = [];

      const result =
        await this.liquidSimulatorService.runSimulatorMultiThreadhold(
          {
            threshold: 0,
            feeRate: input.feeRate,
            symbol: input.symbol,
            startDate: params.startDate,
            endDate: params.endDate,
            usdPosition: input.usdPosition as 'base' | 'quote' | 'exchange',
            exchangePrice: input.exchangePrice,
            spread: input.spread,
          },
          thresholds,
        );

      results[input.symbol].push(...result);
    }

    return results;
  }

  private async writeToSheet(
    filename: string,
    report: Record<string, ReportSummaryDto[]>,
  ) {
    const sheets: sheets_v4.Schema$Sheet[] = Object.entries(report).map(
      ([key, values], index) => {
        const sheetDefine = this.toSheetData(values, index);
        return {
          properties: { title: key, sheetId: index },
          data: [
            {
              startRow: 29,
              startColumn: 0,
              rowData: sheetDefine.data,
            },
          ],
          charts: [sheetDefine.chartRevenue, sheetDefine.chartBenefit],
        };
      },
    );

    // const fileMetadata = {
    //   name: filename,
    //   mimeType: 'application/vnd.google-apps.spreadsheet',
    //   parents: ['1IBk16Qa_s2fh6LZT1FCiaw6J19onObt3'],
    // };

    // const file = await this.drive.files.create({
    //   requestBody: fileMetadata,
    //   fields: 'id',
    // });

    //const fileId = file.data.id;
    //const sheetUrl = `https://docs.google.com/spreadsheets/d/${fileId}`;

    const spreadsheet = await this.sheet.spreadsheets.create({
      requestBody: {
        properties: {
          title: filename,
        },
        sheets: sheets,
      },
    });
    const spreadsheetId = spreadsheet.data.spreadsheetId!;
    await this.deleteOldFile(filename);
    const file = await this.drive.files.get({
      fileId: spreadsheetId,
      fields: 'parents',
    });
    const originalParents = file.data.parents?.join(',') || '';

    await this.drive.files.update({
      fileId: spreadsheetId,
      addParents: process.env.GOOGLE_FOLDER_ID,
      removeParents: originalParents,
      fields: 'id, parents',
    });
    return spreadsheet.data.spreadsheetUrl;
  }

  private async deleteOldFile(fileName: string) {
    const files = await this.drive.files.list({
      q: `'${process.env.GOOGLE_FOLDER_ID}' in parents and name = '${fileName}' and trashed = false`,
      fields: 'files(id, name)',
    });

    const oldFile = files.data.files?.[0];
    if (oldFile) {
      await this.drive.files.delete({ fileId: oldFile.id });
      console.log('🗑️ Đã xóa file cũ:', oldFile.name);
    }
  }

  private toSheetData(
    items: ReportSummaryDto[],
    sheetId,
  ): {
    data: sheets_v4.Schema$RowData[];
    chartRevenue: sheets_v4.Schema$EmbeddedChart;
    chartBenefit: sheets_v4.Schema$EmbeddedChart;
  } {
    const rows: sheets_v4.Schema$RowData[] = [];
    const headers = [
      'threshold',
      '[1] total client trade lots',
      '[2] total client swap',
      '[3] client swap per lot',
      '[4] total commission on LP',
      '[5] total commission on LP (current)',
      '[6] max absolute NOP',
      '[7] total Liquid Order',
      '[8] total liquid lots',
      '[9] LP Pnl spread 0',
      '[10] LP Pnl spread 10',
      '[11] LP Pnl spread 30',
      '[12] LP Pnl spread 50',
      '[13] LP estimate swap = [3] x [8] x 0.5',
      '[14] revenue current [14] = -[3] - [5]',
      '[15] revenue at spread 0 = [9] - [4] - [13]',
      '[16] revenue at spread 10 = [10] - [4] - [13]',
      '[17] revenue at spread 30 = [11] - [4] - [13]',
      '[18] revenue at spread 50 = [12] - [4] - [13]',
      '[19] benefit at spread 0 = [15] - [14]',
      '[20] benefit at spread 10 = [16] - [14]',
      '[21] benefit at spread 30 = [17] - [14]',
      '[22] benefit at spread 50 = [18] - [14]',

      '[23] unrealized revenue at spread 0',
      '[24] unrealized revenue at spread 10',
      '[25] unrealized revenue at spread 30',
      '[26] unrealized revenue at spread 50',
    ];
    rows.push({
      values: headers.map((header) => ({
        userEnteredValue: { stringValue: header },
      })),
    });

    let maxThreshold = 200;
    if (items.length > 0) {
      maxThreshold = Math.ceil(items[0].maxHoldLots);
    }

    items
      .filter((i) => i.threshold <= maxThreshold)
      .forEach((result) => {
        const liquidSwap =
          result.clientSwapPerLot * result.totalLiquidLots * 0.5;
        const revenue0 =
          result.totalLiquidProfit - result.totalFee - liquidSwap;
        let revenue10 =
          result.totalLiquidProfit10 - result.totalFee - liquidSwap;
        let revenue30 =
          result.totalLiquidProfit30 - result.totalFee - liquidSwap;
        let revenue50 =
          result.totalLiquidProfit50 - result.totalFee - liquidSwap;
        const oldRevenue = -result.totalClientSwap - result.totalFee;

        if (result.threshold === 0) {
          revenue10 = revenue0;
          revenue30 = revenue0;
          revenue50 = revenue0;
        }

        const ceillData = [
          result.threshold,
          result.totalClientTradeLots,
          result.totalClientSwap,
          result.clientSwapPerLot,
          result.totalFee,
          result.estimateFeeDirectLiquid,
          result.maxHoldLots,
          result.totalLiquidOrder,
          result.totalLiquidLots,
          result.totalLiquidProfit,
          result.totalLiquidProfit10,
          result.totalLiquidProfit30,
          result.totalLiquidProfit50,
          liquidSwap,
          oldRevenue,
          revenue0,
          revenue10,
          revenue30,
          revenue50,
          revenue0 - oldRevenue,
          revenue10 - oldRevenue,
          revenue30 - oldRevenue,
          revenue50 - oldRevenue,

          result.unrealizedProfit,
          result.unrealizedProfit10,
          result.unrealizedProfit30,
          result.unrealizedProfit50,
        ];
        rows.push({
          values: ceillData.map((data) => ({
            userEnteredValue: { numberValue: data },
          })),
        });
      });

    const chartRevenue: sheets_v4.Schema$EmbeddedChart = {
      position: {
        overlayPosition: {
          anchorCell: {
            sheetId: sheetId,
            rowIndex: 3,
            columnIndex: 1,
          },
          offsetXPixels: 0,
          offsetYPixels: 0,
          widthPixels: 700,
          heightPixels: 400,
        },
      },
      spec: {
        title: 'Doanh thu',
        basicChart: {
          chartType: 'LINE',
          axis: [
            {
              title: 'Doanh thu',
              position: 'LEFT_AXIS',
            },
            {
              title: 'Threshold',
              position: 'BOTTOM_AXIS',
            },
          ],
          domains: [
            {
              domain: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 29,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 0,
                      endColumnIndex: 1,
                    },
                  ],
                },
              },
            },
          ],
          series: [
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 29,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 14,
                      endColumnIndex: 15,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 29,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 15,
                      endColumnIndex: 16,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 29,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 16,
                      endColumnIndex: 17,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 29,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 17,
                      endColumnIndex: 18,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 29,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 18,
                      endColumnIndex: 19,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
          ],
        },
      },
    };

    const chartBenefit: sheets_v4.Schema$EmbeddedChart = {
      position: {
        overlayPosition: {
          anchorCell: {
            sheetId: sheetId,
            rowIndex: 3,
            columnIndex: 11,
          },
          offsetXPixels: 0,
          offsetYPixels: 0,
          widthPixels: 700,
          heightPixels: 400,
        },
      },
      spec: {
        title: 'Lợi nhuận',
        basicChart: {
          chartType: 'LINE',
          axis: [
            {
              title: 'Lợi nhuận',
              position: 'LEFT_AXIS',
            },
            {
              title: 'Threshold',
              position: 'BOTTOM_AXIS',
            },
          ],
          domains: [
            {
              domain: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 30,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 0,
                      endColumnIndex: 1,
                    },
                  ],
                },
              },
            },
          ],
          series: [
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 30,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 19,
                      endColumnIndex: 20,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 30,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 20,
                      endColumnIndex: 21,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 30,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 21,
                      endColumnIndex: 22,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
            {
              series: {
                sourceRange: {
                  sources: [
                    {
                      startRowIndex: 30,
                      endRowIndex: 29 + rows.length,
                      startColumnIndex: 22,
                      endColumnIndex: 23,
                    },
                  ],
                },
              },
              targetAxis: 'LEFT_AXIS',
            },
          ],
        },
      },
    };

    return {
      chartBenefit,
      chartRevenue,
      data: rows,
    };
  }
}
