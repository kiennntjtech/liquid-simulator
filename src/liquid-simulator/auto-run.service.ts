import { autorunInput } from './autorun.input';
import { StepSimulatorService } from './step-simulator.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AutoRunService {
  private isRunning = false;

  constructor(private readonly stepSimulatorService: StepSimulatorService) {}

  async autoRun() {
    if (this.isRunning) {
      throw new BadRequestException('Simulator is already running');
    }
    this.isRunning = true;

    for (const input of autorunInput) {
      console.log(`Running simulator for ${input.symbol} ${input.startDate}`);
      await this.stepSimulatorService.runSimulator(
        {
          ...input,
          startDate: new Date(input.startDate),
          usdPosition: input.usdPosition as 'base' | 'quote' | 'exchange',
        },
        `result-${input.symbol}-${input.startDate}.csv`,
      );
      console.log(`Simulator for ${input.symbol} ${input.startDate} is done`);
    }

    this.isRunning = false;
  }
}
