import { Test, TestingModule } from '@nestjs/testing';
import { LmaxService } from '../shared/lmax/lmax.service';

describe('LmaxService', () => {
  let service: LmaxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LmaxService],
    }).compile();

    service = module.get<LmaxService>(LmaxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
