import { Controller, Get } from '@nestjs/common';
import { LmaxService } from './lmax.service';

@Controller('lmax')
export class LmaxController {
  constructor(private readonly lmaxService: LmaxService) {}

  @Get('realized-profits')
  async getRealizedProfits() {
    return this.lmaxService.getRelizedProfits();
  }

  @Get('unrealized-profits')
  async getUnrealizedProfits() {
    return this.lmaxService.getUnrealizedProfits();
  }

  @Get('position-quantities')
  async getPositionQuantities() {
    return this.lmaxService.getPositionQuantity();
  }

  @Get('wallet-balances')
  async getWalletBalances() {
    return this.lmaxService.getWalletBalance();
  }
}
