import { Injectable, OnApplicationBootstrap, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LmaxApiClient } from './api-client';
import { LmaxSocketClient } from './socket-client';
import { nanoid } from 'nanoid';
import { writeFileSync } from 'fs';

@Injectable()
export class LmaxService {
  private apiClient: LmaxApiClient;
  private socketClient: LmaxSocketClient;
  private serviceId = nanoid();

  constructor(private configService: ConfigService) {
    const serverDomain = this.configService.get<string>('lmax.server')!;
    const clientKeyId = this.configService.get<string>('lmax.clientKeyId')!;
    const clientSecret = this.configService.get<string>('lmax.clientSecret')!;
    const socketUrl = this.configService.get<string>('lmax.socketUrl')!;

    this.apiClient = new LmaxApiClient({
      serverDomain,
      clientKeyId,
      clientSecret,
    });

    this.socketClient = new LmaxSocketClient(socketUrl);
  }

  async onApplicationBootstrap() {
    console.log(
      'LmaxService bootstrap - initializing API client and socket client',
      this.serviceId,
    );
    await this.apiClient.initialize();
    this.socketClient.reconnect(this.apiClient.getCurrentToken());
  }

  async getRelizedProfits() {
    const allTransactions = await this.apiClient.getAccountTransactions({});
    const types = [
      'EXECUTION',
      'MARK_TO_MARKET_PROFIT_LOSS',
      'COMMISSION',
      'COMMISSION_REVENUE',
    ];
    const realizedProfits = allTransactions.reduce((acc, tx) => {
      if (!types.includes(tx.transaction_category)) {
        return acc;
      }
      const profit = tx.amount ? parseFloat(tx.amount) : 0;
      return acc + profit;
    }, 0);
    writeFileSync(
      `lmax-transactions-${this.serviceId}.json`,
      JSON.stringify(allTransactions, null, 2),
    );
    return realizedProfits;
  }

  async getUnrealizedProfits() {
    const positions = await this.apiClient.getInstrumentPositions();

    const unrealizedProfits = positions.positions.reduce((acc, pos) => {
      const profit = pos.open_cost ? parseFloat(pos.open_cost) : 0;
      return acc + profit;
    }, 0);

    return unrealizedProfits;
  }

  async getPositionQuantity(): Promise<Record<string, number>> {
    const positions = await this.apiClient.getInstrumentPositions();

    const positionQuantities: Record<string, number> = {};
    positions.positions.forEach((pos) => {
      const quantity = pos.open_quantity ? parseFloat(pos.open_quantity) : 0;
      positionQuantities[pos.instrument_id] = quantity;
    });

    return positionQuantities;
  }

  async getWalletBalance() {
    const accounts = await this.apiClient.getWalletBalances();
    return accounts;
  }
}
