import {
  AuthenticateRequestDto,
  AuthenticateResponseDto,
  InstrumentListResponseDto,
  OrderStateRequestDto,
  OrderStateResponseDto,
  WorkingOrdersRequestDto,
  WorkingOrdersResponseDto,
  OrderPositionsRequestDto,
  OrderPositionsResponseDto,
  InstrumentPositionsResponseDto,
  WalletBalancesResponseDto,
  CollateralizedCreditResponseDto,
  TransactionsRequestDto,
  TransactionsResponseDto,
  TradeHistoryRequestDto,
  TradeHistoryResponseDto,
  WithdrawalRequestStatusResponseDto,
  WithdrawalRequestsRequestDto,
  WithdrawalRequestsResponseDto,
  CurrentTimeResponseDto,
  VersionResponseDto,
  WorkingOrderDto,
  OrderPositionDto,
  TransactionDto,
  TradeDto,
} from './dto';

export interface ILmaxApiClient {
  // Utility
  getCurrentToken(): string | null;

  // Authentication
  authenticate(): Promise<AuthenticateResponseDto>;
  heartbeat(): Promise<void>;
  logout(): Promise<void>;

  // Account Data
  getInstrumentData(): Promise<InstrumentListResponseDto>;
  getOrderState(request: OrderStateRequestDto): Promise<OrderStateResponseDto>;
  getWorkingOrders(
    request?: WorkingOrdersRequestDto,
  ): Promise<WorkingOrderDto[]>;
  getOrderPositions(
    request?: OrderPositionsRequestDto,
  ): Promise<OrderPositionDto[]>;
  getInstrumentPositions(): Promise<InstrumentPositionsResponseDto>;
  getWalletBalances(): Promise<WalletBalancesResponseDto>;
  getCollateralizedCredit(): Promise<CollateralizedCreditResponseDto>;
  getAccountTransactions(
    request: TransactionsRequestDto,
  ): Promise<TransactionDto[]>;
  getTradeHistory(request: TradeHistoryRequestDto): Promise<TradeDto[]>;
  getWithdrawalStatus(id: string): Promise<WithdrawalRequestStatusResponseDto>;
  listWithdrawals(
    request?: WithdrawalRequestsRequestDto,
  ): Promise<WithdrawalRequestsResponseDto>;

  // Public Data
  getCurrentTime(): Promise<CurrentTimeResponseDto>;
  getApiVersion(): Promise<VersionResponseDto>;
}
