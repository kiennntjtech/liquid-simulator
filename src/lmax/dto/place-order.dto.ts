// Trading - Place Order DTOs
export class PlaceOrderRequestDto {
  instrument_id: string;
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  side: 'BID' | 'ASK';
  quantity: string;
  price?: string; // Required for LIMIT and STOP_LIMIT
  stop_price?: string; // Required for STOP and STOP_LIMIT
  trigger_method?: 'ONE_TOUCH' | 'BID_OFFER'; // For STOP and STOP_LIMIT orders
  instruction_id: string; // <= 20 characters
  time_in_force:
    | 'FILL_OR_KILL'
    | 'IMMEDIATE_OR_CANCEL'
    | 'GOOD_FOR_DAY'
    | 'GOOD_TIL_CANCELLED';

  // Contingent orders
  take_profit_offset?: string;
  take_profit_instruction_id?: string; // <= 20 characters
  stop_loss_offset?: string;
  stop_loss_instruction_id?: string; // <= 20 characters
}

export class PlaceOrderResponseDto {
  order_type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
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
}
