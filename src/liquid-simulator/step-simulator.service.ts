import { BadRequestException, Injectable } from '@nestjs/common';

import { StepSimulatorDto, GetFileResultDto } from './dto/simulator.dto';
import { LiquidSimulatorService } from './liquid-simulator.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StepSimulatorService {
  private isRunning = false;

  constructor(
    private readonly liquidSimulatorService: LiquidSimulatorService,
  ) {}

  async stepSimulator(dto: StepSimulatorDto, fileName?: string) {
    if (this.isRunning) {
      throw new BadRequestException('Simulator is already running');
    }
    fileName = fileName ? fileName : `result-${new Date().getTime()}.csv`;

    this.runSimulator(dto, fileName);

    return { fileName: '/assets/liquid-simulator/' + fileName };
  }

  async getFileResult(dto: GetFileResultDto) {
    const filePath = path.join(
      __dirname,
      '../../public/assets/liquid-simulator',
      dto.fileName,
    );

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    return { fileName: '/assets/liquid-simulator/' + dto.fileName };
  }

  async runSimulator(dto: StepSimulatorDto, fileName: string) {
    if (this.isRunning) {
      throw new BadRequestException('Simulator is already running');
    }
    this.isRunning = true;
    const thresholds = [];
    for (
      let threshold = dto.startThreshold;
      threshold <= dto.endThreshold;
      threshold += dto.step
    ) {
      thresholds.push(threshold);
    }

    const results =
      await this.liquidSimulatorService.runSimulatorMultiThreadhold(
        {
          threshold: dto.startThreshold,
          feeRate: dto.feeRate,
          symbol: dto.symbol,
          startDate: dto.startDate,
          endDate: dto.endDate,
          usdPosition: dto.usdPosition,
          exchangePrice: dto.exchangePrice,
          spread: dto.spread,
        },
        thresholds,
      );

    // save result to csv file in folder public/liquid-simulator
    const filePath = path.join(
      __dirname,
      '../../public/assets/liquid-simulator',
    );
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const file = fs.createWriteStream(path.join(filePath, fileName));
    let maxThreshold = 200;
    if (results.length > 0) {
      maxThreshold = Math.ceil(results[0].maxHoldLots);
    }
    file.write(
      [
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
      ].join(',') + '\n',
    );
    results
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
        file.write(
          [
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
          ].join(',') + '\n',
        );
      });
    file.end();
    this.isRunning = false;

    return { fileName };
  }
}
