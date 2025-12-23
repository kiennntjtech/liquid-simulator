// Withdrawal DTOs
export class WithdrawalRequestStatusResponseDto {
  withdrawal_request_id: string;
  status: 'PENDING' | 'COMPLETE' | 'FAILED' | 'CANCELLED';
}

export class WithdrawalRequestsRequestDto {
  page_size?: number; // 1-1000, default 1000
  after?: string; // cursor
  before?: string; // cursor
}

export class WithdrawalDto {
  withdrawal_request_id: string;
  account_id: string;
  client_reference?: string;
  address: string;
  asset: string;
  blockchain: string;
  amount: string;
  status: 'PENDING' | 'COMPLETE' | 'FAILED' | 'CANCELLED';
  requested_at: string;
  processed_at?: string;
  transaction_hash_id?: string;
  address_label?: string;
}

export class WithdrawalRequestsResponseDto {
  before_cursor: string;
  after_cursor: string;
  withdrawals: WithdrawalDto[];
}

// Submit withdrawal request
export class BlockchainWithdrawalRequestDto {
  address: string; // <= 255 characters
  amount: string; // <= 22 characters
  currency: string; // <= 8 characters
  client_reference?: string; // <= 32 characters
  type: 'BLOCKCHAIN';
}

export class SubmitWithdrawalResponseDto {
  withdrawal_request_id: string;
}
