import { Test, TestingModule } from '@nestjs/testing';
import { LmaxController } from './lmax.controller';

describe('LmaxController', () => {
  let controller: LmaxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LmaxController],
    }).compile();

    controller = module.get<LmaxController>(LmaxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
