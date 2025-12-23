// Transactions DTOs
export class TransactionsRequestDto {
  start_time?: string; // ISO8601 timestamp
  end_time?: string; // ISO8601 timestamp
  page_size?: number; // 1-1000, default 1000
  after?: string; // cursor
  before?: string; // cursor
  transaction_categories?: string; // comma-separated
}

// Base transaction interface
export interface BaseTransactionDto {
  transaction_category:
    | 'EXECUTION'
    | 'COMMISSION'
    | 'DEBIT_CREDIT'
    | 'BANK_TRANSFER_CURRENCY_CONVERSION'
    | 'BASE_CURRENCY_SWEEP'
    | 'COMMISSION_REVENUE'
    | 'DELIVERABLE'
    | 'DIVIDEND'
    | 'FOREIGN_CURRENCY_SWEEP'
    | 'FUNDING'
    | 'FX_FUNDING'
    | 'MARK_TO_MARKET_PROFIT_LOSS';
  account_id: string;
  account_statement_id: string;
  amount: string;
  currency_balance: string;
  currency: string;
  timestamp: string;
}

// Execution transaction
export interface ExecutionTransactionDto extends BaseTransactionDto {
  transaction_category: 'EXECUTION';
  execution_type: 'EXECUTION';
  trade_date: string;
  instrument_id: string;
  execution_id: string;
  quantity_closed: string;
  opening_order_id: string;
  opening_price: string;
  closing_order_id: string;
  closing_price: string;
  side: 'BID' | 'ASK';
}

// Commission transaction
export interface CommissionTransactionDto extends BaseTransactionDto {
  transaction_category: 'COMMISSION';
  commission_type: 'EXECUTION_COMMISSION';
  instrument_id: string;
  trade_date: string;
  order_id: string;
  quantity: string;
  side: 'BID' | 'ASK';
  execution_id: string;
  vwap: string;
  minimum_commission: string;
  commission_per_unit_of_measure: string;
}

// Debit/Credit transaction
export interface DebitCreditTransactionDto extends BaseTransactionDto {
  transaction_category: 'DEBIT_CREDIT';
  debit_credit_type: 'PAYMENT_CARD' | string;
  reference: string;
}

export type TransactionDto =
  | ExecutionTransactionDto
  | CommissionTransactionDto
  | DebitCreditTransactionDto;

export class TransactionsResponseDto {
  before_cursor: string;
  after_cursor: string;
  status: 'COMPLETED' | 'PENDING';
  transactions: TransactionDto[];
}
