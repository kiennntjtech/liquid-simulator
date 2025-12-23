// Trading - Amend and Remove Stop Loss DTOs
export class AmendStopLossRequestDto {
  instrument_id: string;
  instruction_id: string;
  stop_loss_offset: string;
  stop_loss_instruction_id: string; // <= 20 characters
  trigger_method: 'ONE_TOUCH' | 'BID_OFFER';
}

export class AmendStopLossResponseDto {
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
  stop_loss_offset: string;
  stop_loss_instruction_id: string;
  trailing_stop_loss: string;
  contingent_order_reference_price: string;
  time_in_force: 'GOOD_FOR_DAY' | 'GOOD_TIL_CANCELLED';
  side: 'BID' | 'ASK';
}

export class RemoveStopLossRequestDto {
  instrument_id: string;
  instruction_id: string;
}

export class RemoveStopLossResponseDto {
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
