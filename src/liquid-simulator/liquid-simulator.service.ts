import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThan } from 'typeorm';
import { Mt5Deal } from '@/entities';
import { SimulatorBuilder, Deal } from './simulator/simulator.builder';
import { SimulatorDto } from './dto/simulator.dto';

@Injectable()
export class LiquidSimulatorService {
  constructor(
    @InjectRepository(Mt5Deal)
    private readonly mt5DealRepository: Repository<Mt5Deal>,
  ) {}

  async runSimulator(dto: SimulatorDto) {
    let startAfterId = 0;
    let isStop = false;
    const simulator = new SimulatorBuilder({
      threshold: dto.threshold,
      feeRate: dto.feeRate,
      symbolsContractSizes: dto.symbols,
    });
    while (!isStop) {
      const deals = await this.getDeals(dto, startAfterId);
      if (deals.length == 0) {
        isStop = true;
        break;
      }

      simulator.pipeDeals(deals);

      startAfterId = deals[deals.length - 1].ticket;
    }

    return simulator.summarize();
  }

  async runSimulatorMultiThreadhold(dto: SimulatorDto, thresholds: number[]) {
    const simulators = thresholds.map((threshold) => {
      return new SimulatorBuilder({
        threshold,
        feeRate: dto.feeRate,
        symbolsContractSizes: dto.symbols,
      });
    });
    let startAfterId = 0;
    let isStop = false;

    while (!isStop) {
      const deals = await this.getDeals(dto, startAfterId);
      if (deals.length == 0) {
        isStop = true;
        break;
      }

      simulators.forEach((simulator) => {
        simulator.pipeDeals(deals);
      });

      startAfterId = deals[deals.length - 1].ticket;
    }

    return simulators.map((simulator) => simulator.summarize());
  }

  private async getDeals(dto: SimulatorDto, startAfterId: number) {
    const symbolNames = dto.symbols.map((s) => s.symbol);

    const rows = await this.mt5DealRepository.find({
      select: ['Deal', 'Symbol', 'Action', 'Volume', 'Symbol'],
      where: {
        Symbol: In(symbolNames),
        Deal: MoreThan(startAfterId),
        Action: In([0, 1]),
      },
      order: {
        Deal: 'ASC',
      },
      take: 1000,
    });

    const deals: Deal[] = rows.map((row) => {
      return {
        ticket: row.Deal,
        side: row.Action == 0 ? 'buy' : 'sell',
        lots: row.Volume / 10000,
        symbol: row.Symbol,
      };
    });

    return deals;
  }
}
