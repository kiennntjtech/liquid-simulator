import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('mt5_users')
export class Mt5User {
  @PrimaryColumn('bigint', { unsigned: true })
  Login: number;

  @Column('bigint')
  @Index('IDX_mt5_users_Timestamp')
  Timestamp: number;

  @Column('varchar', { length: 64 })
  Group: string;

  @Column('bigint', { unsigned: true })
  CertSerialNumber: number;

  @Column('bigint', { unsigned: true })
  Rights: number;

  @Column('datetime')
  Registration: Date;

  @Column('datetime')
  LastAccess: Date;

  @Column('datetime')
  LastPassChange: Date;

  @Column('varchar', { length: 128 })
  FirstName: string;

  @Column('varchar', { length: 64 })
  LastName: string;

  @Column('varchar', { length: 64 })
  MiddleName: string;

  @Column('varchar', { length: 64 })
  Company: string;

  @Column('varchar', { length: 32 })
  Account: string;

  @Column('varchar', { length: 32 })
  Country: string;

  @Column('int', { unsigned: true })
  Language: number;

  @Column('bigint', { unsigned: true })
  ClientID: number;

  @Column('varchar', { length: 32 })
  City: string;

  @Column('varchar', { length: 32 })
  State: string;

  @Column('varchar', { length: 16 })
  ZipCode: string;

  @Column('varchar', { length: 128 })
  Address: string;

  @Column('varchar', { length: 32 })
  Phone: string;

  @Column('varchar', { length: 64 })
  Email: string;

  @Column('varchar', { length: 32 })
  ID: string;

  @Column('varchar', { length: 16 })
  Status: string;

  @Column('varchar', { length: 64 })
  Comment: string;

  @Column('int', { unsigned: true })
  Color: number;

  @Column('varchar', { length: 32 })
  PhonePassword: string;

  @Column('int', { unsigned: true })
  Leverage: number;

  @Column('bigint', { unsigned: true })
  Agent: number;

  @Column('varchar', { length: 128 })
  TradeAccounts: string;

  @Column('double')
  LimitPositions: number;

  @Column('int', { unsigned: true })
  LimitOrders: number;

  @Column('varchar', { length: 32 })
  LeadCampaign: string;

  @Column('varchar', { length: 32 })
  LeadSource: string;

  @Column('bigint')
  TimestampTrade: number;

  @Column('double')
  Balance: number;

  @Column('double')
  Credit: number;

  @Column('double')
  InterestRate: number;

  @Column('double')
  CommissionDaily: number;

  @Column('double')
  CommissionMonthly: number;

  @Column('double')
  BalancePrevDay: number;

  @Column('double')
  BalancePrevMonth: number;

  @Column('double')
  EquityPrevDay: number;

  @Column('double')
  EquityPrevMonth: number;

  @Column('varchar', { length: 256 })
  Name: string;

  @Column('varchar', { length: 16 })
  MQID: string;

  @Column('varchar', { length: 32 })
  LastIP: string;

  @Column('varchar', { length: 4000 })
  ApiData: string;
}
