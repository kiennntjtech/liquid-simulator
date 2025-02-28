import { Module } from '@nestjs/common';
import { LiquidSimulatorService } from './liquid-simulator.service';
import { LiquidSimulatorController } from './liquid-simulator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mt5Deal, Mt5Symbol, Mt5User } from '@/entities';
import { StepSimulatorService } from './step-simulator.service';
import { AutoRunService } from './auto-run.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mt5Deal, Mt5Symbol, Mt5User])],
  providers: [LiquidSimulatorService, StepSimulatorService, AutoRunService],
  controllers: [LiquidSimulatorController],
})
export class LiquidSimulatorModule {}
