import { Module } from '@nestjs/common';
import { LiquidSimulatorService } from './liquid-simulator.service';
import { LiquidSimulatorController } from './liquid-simulator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mt5Deal } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Mt5Deal])],
  providers: [LiquidSimulatorService],
  controllers: [LiquidSimulatorController],
})
export class LiquidSimulatorModule {}
