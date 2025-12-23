// Working Orders DTOs
export class WorkingOrdersRequestDto {
  page_size?: number; // 1-1000, default 1000
  after?: string; // cursor
  before?: string; // cursor
}

export class WorkingOrderDto {
  account_id: string;
  order_id: string;
  instruction_id: string;
  instrument_id: string;
  timestamp: string;
  limit_price?: string;
  stop_price?: string;
  quantity: string;
  unfilled_quantity: string;
  matched_quantity: string;
  cumulative_matched_quantity: string;
  cancelled_quantity: string;
  matched_cost: string;
  commission: string;
  time_in_force:
    | 'FILL_OR_KILL'
    | 'IMMEDIATE_OR_CANCEL'
    | 'GOOD_FOR_DAY'
    | 'GOOD_TIL_CANCELLED';
  side: 'BID' | 'ASK';
  order_type:
    | 'LIMIT'
    | 'MARKET'
    | 'STOP'
    | 'STOP_LIMIT'
    | 'TRAILING_STOP'
    | 'SETTLEMENT'
    | 'REVERSAL'
    | 'MANUAL'
    | 'STOP_LOSS'
    | 'TAKE_PROFIT';
  stop_loss_offset?: string;
  stop_loss_instruction_id?: string;
  trailing_stop_loss?: string;
  take_profit_instruction_id?: string;
  take_profit_offset?: string;
  contingent_order_reference_price?: string;
  replaced_instruction_id?: string;
  parent_order_instruction_id?: string;
}

export class WorkingOrdersResponseDto {
  before_cursor: string;
  after_cursor: string;
  orders: WorkingOrderDto[];
}
