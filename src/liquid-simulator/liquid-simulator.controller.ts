import { Controller, Post, Body } from '@nestjs/common';
import { SimulatorDto } from './dto/simulator.dto';
import { LiquidSimulatorService } from './liquid-simulator.service';

@Controller('liquid-simulator')
export class LiquidSimulatorController {
  constructor(
    private readonly liquidSimulatorService: LiquidSimulatorService,
  ) {}

  @Post()
  async runSimulator(@Body() dto: SimulatorDto) {
    return this.liquidSimulatorService.runSimulator(dto);
  }
}
