// WebSocket DTOs
export type WebSocketChannelType =
  | 'INSTRUMENT_POSITIONS'
  | 'WALLET_BALANCES'
  | 'WORKING_ORDERS'
  | 'ORDER_POSITIONS'
  | 'COLLATERALIZED_CREDIT'
  | 'TRADES';

export class WebSocketSubscribeRequestDto {
  type: 'SUBSCRIBE';
  channels: WebSocketChannelType[];
}

export class WebSocketUnsubscribeRequestDto {
  type: 'UNSUBSCRIBE';
  channels: WebSocketChannelType[];
}

export class WebSocketSubscriptionsResponseDto {
  type: 'SUBSCRIPTIONS';
  channels: WebSocketChannelType[];
}

export class WebSocketErrorResponseDto {
  type: 'ERROR';
  error_code:
    | 'ACCESS_DENIED'
    | 'CHANNEL_UNAVAILABLE'
    | 'INTERNAL_SERVER_ERROR'
    | 'PARSING_ERROR'
    | 'SERVICE_UNAVAILABLE'
    | 'TOO_MANY_REQUESTS'
    | 'UNAUTHORIZED';
  error_message: string;
}

// WebSocket message types
export class WebSocketWalletBalanceDto {
  type: 'WALLET_BALANCES';
  account_id: string;
  timestamp: string;
  wallets: Array<{
    currency: string;
    cash: string;
    credit: string;
    balance: string;
  }>;
}

export class WebSocketInstrumentPositionDto {
  type: 'INSTRUMENT_POSITION';
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

export class WebSocketCollateralizedCreditDto {
  type: 'COLLATERALIZED_CREDIT';
  account_id: string;
  timestamp: string;
  currency: string;
  cash: string;
  total_collateralized_credit: string;
  used_collateralized_credit: string;
}

export class WebSocketOrderPositionDto {
  type: 'ORDER_POSITION';
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

export class WebSocketWorkingOrderDto {
  type: 'WORKING_ORDER';
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
  stop_loss_offset?: string;
  stop_loss_instruction_id?: string;
  trailing_stop_loss?: string;
  take_profit_instruction_id?: string;
  take_profit_offset?: string;
  contingent_order_reference_price?: string;
  time_in_force:
    | 'FILL_OR_KILL'
    | 'IMMEDIATE_OR_CANCEL'
    | 'GOOD_FOR_DAY'
    | 'GOOD_TIL_CANCELLED';
  side: 'BID' | 'ASK';
  order_type:
    | 'TRAILING_STOP'
    | 'LIMIT'
    | 'SETTLEMENT'
    | 'REVERSAL'
    | 'MANUAL'
    | 'STOP'
    | 'STOP_LIMIT'
    | 'MARKET'
    | 'STOP_LOSS'
    | 'TAKE_PROFIT';
  replaced_instruction_id?: string;
  parent_order_instruction_id?: string;
}

export class WebSocketTradeDto {
  type: 'TRADE';
  account_id: string;
  instrument_id: string;
  execution_id: string;
  timestamp: string;
  price: string;
  quantity: string;
  order_id: string;
  side: 'BID' | 'ASK';
  commission: string;
  order_information?: {
    instruction_id: string;
    order_placement_timestamp: string;
    limit_price?: string;
    order_type: 'LIMIT' | 'MARKET' | 'STOP' | 'STOP_LIMIT';
    order_quantity: string;
    order_status: 'FILLED' | 'PARTIALLY_FILLED' | 'WORKING' | 'CANCELLED';
  };
}

export type WebSocketMessageDto =
  | WebSocketSubscriptionsResponseDto
  | WebSocketErrorResponseDto
  | WebSocketWalletBalanceDto
  | WebSocketInstrumentPositionDto
  | WebSocketCollateralizedCreditDto
  | WebSocketOrderPositionDto
  | WebSocketWorkingOrderDto
  | WebSocketTradeDto;
