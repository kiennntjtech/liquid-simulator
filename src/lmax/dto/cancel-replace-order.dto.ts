// Trading - Cancel and Replace Order DTOs
export class CancelReplaceOrderRequestDto {
  instrument_id: string;
  replacement_instruction_id: string; // <= 20 characters
  instruction_id: string; // <= 20 characters - order to cancel
  side: 'BID' | 'ASK';
  quantity: string;
  price: string;
}

export class CancelReplaceOrderResponseDto {
  order_type: 'LIMIT';
  account_id: string;
  order_id: string;
  instruction_id: string;
  instrument_id: string;
  timestamp: string;
  limit_price: string;
  quantity: string;
  unfilled_quantity: string;
  matched_quantity: string;
  cumulative_matched_quantity: string;
  cancelled_quantity: string;
  matched_cost: string;
  commission: string;
  time_in_force: 'GOOD_FOR_DAY' | 'GOOD_TIL_CANCELLED';
  side: 'BID' | 'ASK';
  replaced_instruction_id: string;
}
