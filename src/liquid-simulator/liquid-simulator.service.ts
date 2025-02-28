import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThan, Between } from 'typeorm';
import { Mt5Deal, Mt5Symbol, Mt5User } from '@/entities';
import { SimulatorBuilder, Deal } from './simulator/simulator.builder';
import { SimulatorDto } from './dto/simulator.dto';
import { coverGroups } from './cover_group';

@Injectable()
export class LiquidSimulatorService {
  private endTime = new Date('2025-02-27T00:00:00.000Z');
  constructor(
    @InjectRepository(Mt5Deal)
    private readonly mt5DealRepository: Repository<Mt5Deal>,
    @InjectRepository(Mt5Symbol)
    private readonly mt5SymbolRepository: Repository<Mt5Symbol>,
    @InjectRepository(Mt5User)
    private readonly mt5UserRepository: Repository<Mt5User>,
  ) {}

  async runSimulator(dto: SimulatorDto) {
    let startAfterId = 0;
    let isStop = false;
    let baseContractSize = 100000;
    if (dto.symbol.includes('XAU')) {
      baseContractSize = 100;
    }
    const simulator = new SimulatorBuilder({
      threshold: dto.threshold,
      feeRate: dto.feeRate,
      baseContractSize,
      exchangePrice: dto.exchangePrice,
      usdPosition: dto.usdPosition,
    });
    const symbols = await this.getAllSymbolInBase(dto.symbol);
    if (!symbols) {
      throw new Error('No symbol found');
    }

    while (!isStop) {
      const deals = await this.getDeals({
        dto,
        symbolNames: symbols,
        startAfterId,
        baseContractSize,
      });
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
    let baseContractSize = 100000;
    if (dto.symbol.includes('XAU')) {
      baseContractSize = 100;
    }
    const simulators = thresholds.map((threshold) => {
      return new SimulatorBuilder({
        threshold,
        feeRate: dto.feeRate,
        baseContractSize: baseContractSize,
        exchangePrice: dto.exchangePrice,
        usdPosition: dto.usdPosition,
      });
    });
    let startAfterId = 0;
    let isStop = false;
    const symbols = await this.getAllSymbolInBase(dto.symbol);
    if (!symbols) {
      throw new Error('No symbol found');
    }

    while (!isStop) {
      const deals = await this.getDeals({
        dto,
        symbolNames: symbols,
        startAfterId,
        baseContractSize,
      });
      if (deals.length == 0) {
        isStop = true;
        break;
      }
      startAfterId = deals[deals.length - 1].ticket;

      const validDeals = deals.filter((deal) => {
        return coverGroups.includes(deal.group);
      });
      console.log('validDeals', validDeals.length);

      if (validDeals.length) {
        simulators.forEach((simulator) => {
          simulator.pipeDeals(deals);
        });
      }
    }
    console.log('done');
    return simulators.map((simulator) => simulator.summarize());
  }

  private async getDeals(params: {
    dto: SimulatorDto;
    symbolNames: string[];
    startAfterId: number;
    baseContractSize: number;
  }) {
    const { dto, symbolNames, startAfterId, baseContractSize } = params;
    //const startDateInNanoTimestamp = dto.startDate.getTime() * 1000000;
    const rows = await this.mt5DealRepository.find({
      select: [
        'Deal',
        'Symbol',
        'Action',
        'Volume',
        'Symbol',
        'Price',
        'ContractSize',
        'RateProfit',
        'Time',
        'Login',
        'LoginGroup',
      ],
      where: {
        Action: In([0, 1]),
        Symbol: In(symbolNames),
        Time: Between(dto.startDate, this.endTime),

        Deal: MoreThan(startAfterId),
      },
      order: {
        Deal: 'ASC',
      },
      take: 2000,
    });

    const deals: Deal[] = rows.map((row) => {
      const lots = row.Volume / 10000;
      return {
        ticket: row.Deal,
        side: row.Action == 0 ? 'buy' : 'sell',
        lots: lots,
        symbol: row.Symbol,
        price: row.Price,
        rateProfit: row.RateProfit,
        point: lots * row.ContractSize,
        normalizedLots: (lots * row.ContractSize) / baseContractSize,
        time: row.Time,
        login: row.Login,
        group: row.LoginGroup,
      };
    });
    if (deals.length > 0)
      console.log(
        'complete ',
        deals.length,
        deals[0].ticket,
        deals[deals.length - 1].ticket,
      );

    return deals;
  }

  async getAllSymbolInBase(baseSymbol: string): Promise<string[]> {
    const rows = await this.mt5SymbolRepository
      .createQueryBuilder('d')
      .select('d.Symbol as Symbol')
      .where('(d.Symbol =:baseSymbol OR d.Symbol like :baseSymbolLike)', {
        baseSymbolLike: baseSymbol + '.%',
        baseSymbol: baseSymbol,
      })
      .groupBy('d.Symbol')
      .getRawMany();
    return rows.map((row) => row.Symbol);
  }

  async getValidLogins(logins: number[]) {
    const rows = await this.mt5UserRepository.find({
      select: ['Login', 'Group'],
      where: {
        Login: In(logins),
      },
    });

    return rows
      .filter((row) => coverGroups.includes(row.Group))
      .map((row) => row.Login);
  }
}
