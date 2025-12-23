// Trading - Close Order DTOs
export class CloseOrderRequestDto {
  instrument_id: string;
  closing_instruction_id: string; // <= 20 characters
  instruction_id?: string; // <= 20 characters - optional, to close specific order
  side: 'BID' | 'ASK';
  quantity: string;
}

export class CloseOrderResponseDto {
  closed_instruction_id?: string;
  order_type: 'MARKET';
  account_id: string;
  order_id: string;
  instruction_id: string;
  instrument_id: string;
  timestamp: string;
  quantity: string;
  unfilled_quantity: string;
  matched_quantity: string;
  cumulative_matched_quantity: string;
  cancelled_quantity: string;
  matched_cost: string;
  commission: string;
  time_in_force: 'IMMEDIATE_OR_CANCEL';
  side: 'BID' | 'ASK';
}
