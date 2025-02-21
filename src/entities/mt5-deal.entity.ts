import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('mt5_deals')
export class Mt5Deal {
  @PrimaryColumn('bigint', { unsigned: true })
  Deal: number;

  @Column('bigint')
  Timestamp: number;

  @Column('varchar', { length: 32 })
  ExternalID: string;

  @Column('bigint', { unsigned: true })
  Login: number;

  @Column('bigint', { unsigned: true })
  Dealer: number;

  @Column('bigint', { unsigned: true })
  Order: number;

  @Column('int', { unsigned: true })
  Action: number;

  @Column('int', { unsigned: true })
  Entry: number;

  @Column('int', { unsigned: true })
  Reason: number;

  @Column('int', { unsigned: true })
  Digits: number;

  @Column('int', { unsigned: true })
  DigitsCurrency: number;

  @Column('double')
  ContractSize: number;

  @Column('datetime')
  Time: Date;

  @Column('datetime', { precision: 6 })
  TimeMsc: Date;

  @Column('varchar', { length: 32 })
  Symbol: string;

  @Column('double')
  Price: number;

  @Column('bigint', { unsigned: true })
  VolumeExt: number;

  @Column('double')
  Profit: number;

  @Column('double')
  Storage: number;

  @Column('double')
  Commission: number;

  @Column('double')
  Fee: number;

  @Column('double')
  RateProfit: number;

  @Column('double')
  RateMargin: number;

  @Column('bigint', { unsigned: true })
  ExpertID: number;

  @Column('bigint', { unsigned: true })
  PositionID: number;

  @Column('varchar', { length: 32 })
  Comment: string;

  @Column('double')
  ProfitRaw: number;

  @Column('double')
  PricePosition: number;

  @Column('double')
  PriceSL: number;

  @Column('double')
  PriceTP: number;

  @Column('bigint', { unsigned: true })
  VolumeClosedExt: number;

  @Column('double')
  TickValue: number;

  @Column('double')
  TickSize: number;

  @Column('bigint', { unsigned: true })
  Flags: number;

  @Column('varchar', { length: 16 })
  Gateway: string;

  @Column('double')
  PriceGateway: number;

  @Column('int', { unsigned: true })
  ModifyFlags: number;

  @Column('double')
  MarketBid: number;

  @Column('double')
  MarketAsk: number;

  @Column('double')
  MarketLast: number;

  @Column('bigint', { unsigned: true })
  Volume: number;

  @Column('bigint', { unsigned: true })
  VolumeClosed: number;

  @Column('varchar', { length: 4000 })
  ApiData: string;
}
