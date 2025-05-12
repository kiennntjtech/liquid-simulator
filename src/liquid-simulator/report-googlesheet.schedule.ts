import { Injectable } from '@nestjs/common';
import { ReportGoogleSheetService } from './report-googlesheet.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReportGoogleSheetSchedule {
  constructor(
    private readonly reportGoogleSheetService: ReportGoogleSheetService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    console.log('Running report google sheet schedule');
    await this.reportGoogleSheetService.runSimulator();
    console.log('Report google sheet schedule is done');
  }
}
