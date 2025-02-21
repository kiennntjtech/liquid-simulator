import { Test, TestingModule } from '@nestjs/testing';
import { LiquidSimulatorService } from './liquid-simulator.service';

describe('LiquidSimulatorService', () => {
  let service: LiquidSimulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiquidSimulatorService],
    }).compile();

    service = module.get<LiquidSimulatorService>(LiquidSimulatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
