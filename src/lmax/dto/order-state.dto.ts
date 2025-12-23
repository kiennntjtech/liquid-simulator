// Order State DTOs
export class OrderStateRequestDto {
  instruction_id?: string;
  order_id?: string;
  instrument_id?: string;
}

export class OrderStateResponseDto {
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
  order_type: 'LIMIT' | 'MARKET' | 'STOP' | 'STOP_LIMIT';
  order_status: 'PARTIALLY_FILLED' | 'FILLED' | 'WORKING' | 'CANCELLED';
}
