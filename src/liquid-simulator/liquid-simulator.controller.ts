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

@Controller('liquid-simulator')
export class LiquidSimulatorController {
  constructor(
    private readonly liquidSimulatorService: LiquidSimulatorService,
    private readonly stepSimulatorService: StepSimulatorService,
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
}
