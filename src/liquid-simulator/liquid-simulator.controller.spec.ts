import { Test, TestingModule } from '@nestjs/testing';
import { LiquidSimulatorController } from './liquid-simulator.controller';

describe('LiquidSimulatorController', () => {
  let controller: LiquidSimulatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiquidSimulatorController],
    }).compile();

    controller = module.get<LiquidSimulatorController>(LiquidSimulatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
