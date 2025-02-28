import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('mt5_symbols')
export class Mt5Symbol {
  @PrimaryColumn('bigint', { unsigned: true })
  Symbol_ID: number;

  @Column('varchar', { length: 32 })
  Symbol: string;

  @Column('bigint')
  Timestamp: number;

  @Column('varchar', { length: 128 })
  Path: string;
}
