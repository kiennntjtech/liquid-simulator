import { Module } from '@nestjs/common';
import { LmaxService } from './lmax.service';
import { LmaxController } from './lmax.controller';

@Module({
  providers: [LmaxService],
  exports: [LmaxService],
  controllers: [LmaxController],
})
export class LmaxModule {}
