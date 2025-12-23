// Order Positions DTOs
export class OrderPositionsRequestDto {
  page_size?: number; // 1-1000, default 1000
  after?: string; // cursor
  before?: string; // cursor
}

export class OrderPositionDto {
  account_id: string;
  order_id: string;
  instrument_id: string;
  instruction_id: string;
  open_quantity: string;
  open_cost: string;
  side: 'BID' | 'ASK' | 'ZERO';
  timestamp: string;
  take_profit_instruction_id?: string;
  take_profit_offset?: string;
  stop_loss_instruction_id?: string;
  stop_loss_offset?: string;
  contingent_order_reference_price?: string;
}

export class OrderPositionsResponseDto {
  before_cursor: string;
  after_cursor: string;
  positions: OrderPositionDto[];
}
