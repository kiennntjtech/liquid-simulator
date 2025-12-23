// Trade History DTOs
export class TradeHistoryRequestDto {
  order_information?: boolean; // default false
  start_time?: string; // ISO8601 timestamp
  end_time?: string; // ISO8601 timestamp
  page_size?: number; // 1-1000, default 1000
  after?: string; // cursor
  before?: string; // cursor
}

export class OrderInformationDto {
  instruction_id: string;
  order_placement_timestamp: string;
  limit_price?: string;
  order_type: 'LIMIT' | 'MARKET' | 'STOP' | 'STOP_LIMIT';
  order_quantity: string;
  order_status: 'FILLED' | 'PARTIALLY_FILLED' | 'WORKING' | 'CANCELLED';
}

export class TradeDto {
  account_id: string;
  instrument_id: string;
  execution_id: string;
  timestamp: string;
  price: string;
  quantity: string;
  order_id: string;
  side: 'BID' | 'ASK';
  commission: string;
  order_information?: OrderInformationDto;
}

export class TradeHistoryResponseDto {
  before_cursor: string;
  after_cursor: string;
  trades: TradeDto[];
}
