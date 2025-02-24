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

  async stepSimulator(dto: StepSimulatorDto) {
    if (this.isRunning) {
      throw new BadRequestException('Simulator is already running');
    }
    const fileName = `result-${new Date().getTime()}.csv`;

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

  private async runSimulator(dto: StepSimulatorDto, fileName: string) {
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
          symbols: dto.symbols,
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
    file.write(
      'threshold,totalFee,estimateFeeDirectLiquid,maximumLotsInWindow,totalLiquidOrder\n',
    );
    results.forEach((result) => {
      file.write(
        `${result.threshold},${result.totalFee},${result.estimateFeeDirectLiquid},${result.maximumLotsInWindow},${result.totalLiquidOrder}\n`,
      );
    });
    file.end();
    this.isRunning = false;

    return { fileName };
  }
}
