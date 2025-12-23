// Instrument Positions DTOs
export class InstrumentPositionDto {
  account_id: string;
  timestamp: string;
  instrument_id: string;
  open_quantity: string;
  open_cost: string;
  unfilled_buy_quantity: string;
  unfilled_buy_cost: string;
  unfilled_sell_quantity: string;
  unfilled_sell_cost: string;
  currency: string;
  side: 'BID' | 'ASK' | 'ZERO';
}

export class InstrumentPositionsResponseDto {
  positions: InstrumentPositionDto[];
}
