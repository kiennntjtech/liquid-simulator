// Wallet Balances DTOs
export class WalletBalanceDto {
  currency: string;
  cash: string;
  credit: string;
  balance: string;
}

export class WalletBalancesResponseDto {
  account_id: string;
  timestamp: string;
  wallets: WalletBalanceDto[];
}
