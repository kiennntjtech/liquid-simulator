import {
  Controller,
  Post,
  Body,
  Res,
  StreamableFile,
  Query,
  Get,
} from '@nestjs/common';
import {
  SimulatorDto,
  StepSimulatorDto,
  GetFileResultDto,
} from './dto/simulator.dto';
import { LiquidSimulatorService } from './liquid-simulator.service';
import { StepSimulatorService } from './step-simulator.service';
import { AutoRunService } from './auto-run.service';

@Controller('liquid-simulator')
export class LiquidSimulatorController {
  constructor(
    private readonly liquidSimulatorService: LiquidSimulatorService,
    private readonly stepSimulatorService: StepSimulatorService,
    private readonly autoRunService: AutoRunService,
  ) {}

  @Post()
  async runSimulator(@Body() dto: SimulatorDto) {
    return this.liquidSimulatorService.runSimulator(dto);
  }

  @Post('step')
  async stepSimulator(@Body() dto: StepSimulatorDto) {
    return this.stepSimulatorService.stepSimulator(dto);
  }

  @Get('result')
  async getFileResult(@Query() dto: GetFileResultDto, @Res() res) {
    const rs = await this.stepSimulatorService.getFileResult(dto);
    return rs;
  }

  @Post('auto-run')
  async autoRun() {
    this.autoRunService.autoRun();
    return {
      message: 'Auto run simulator started',
    };
  }
}
