// Trading - Amend and Remove Take Profit DTOs
export class AmendTakeProfitRequestDto {
  instrument_id: string;
  instruction_id: string;
  take_profit_offset: string;
  take_profit_instruction_id: string; // <= 20 characters
}

export class AmendTakeProfitResponseDto {
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
  take_profit_instruction_id: string;
  take_profit_offset: string;
  contingent_order_reference_price: string;
  time_in_force: 'GOOD_FOR_DAY' | 'GOOD_TIL_CANCELLED';
  side: 'BID' | 'ASK';
}

export class RemoveTakeProfitRequestDto {
  instrument_id: string;
  instruction_id: string;
}

export class RemoveTakeProfitResponseDto {
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
}
