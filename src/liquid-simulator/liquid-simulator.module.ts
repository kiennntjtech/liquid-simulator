import { Module } from '@nestjs/common';
import { LiquidSimulatorService } from './liquid-simulator.service';
import { LiquidSimulatorController } from './liquid-simulator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mt5Deal } from '@/entities';
import { StepSimulatorService } from './step-simulator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mt5Deal])],
  providers: [LiquidSimulatorService, StepSimulatorService],
  controllers: [LiquidSimulatorController],
})
export class LiquidSimulatorModule {}
