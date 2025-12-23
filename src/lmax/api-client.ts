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
  BlockchainWithdrawalRequestDto,
  SubmitWithdrawalResponseDto,
  CurrentTimeResponseDto,
  VersionResponseDto,
  WorkingOrderDto,
  OrderPositionDto,
  TransactionDto,
  TradeDto,
} from './dto';
import { ILmaxApiClient } from './api-client.interface';
import { LMAX_ENDPOINTS } from './constant';
import axios, { Axios } from 'axios';
import { nanoid } from 'nanoid';
import * as CryptoJS from 'crypto';
import { RateLimitCaller } from './ratelimit-caller';

export class LmaxApiClient implements ILmaxApiClient {
  private token: string | null = null;
  private refreshIntervalId: NodeJS.Timeout | null = null;
  private rateLimitByScope: Record<string, RateLimitCaller> = {
    Authentication: new RateLimitCaller(1),
    Account_Data: new RateLimitCaller(50),
    Account_Maintenance: new RateLimitCaller(50),
    Public_Data: new RateLimitCaller(1),
    Query: new RateLimitCaller(1),
    Default: new RateLimitCaller(1),
  };
  constructor(
    private config: {
      serverDomain: string;
      clientKeyId: string;
      clientSecret: string;
    },
  ) {}

  async initialize() {
    console.log('Initializing LMAX API Client...');
    const authResponse = await this.authenticate();
    this.token = authResponse.token;

    this.refreshIntervalId = setInterval(
      async () => {
        try {
          await this.heartbeat();
        } catch (error) {
          console.error('Heartbeat failed:', error);
        }
      },
      4 * 60 * 1000,
    ); // every 4 minutes, lifetime of token is 5 minutes
  }

  getCurrentToken(): string | null {
    return this.token;
  }

  private request = async <T>(
    endpoint: {
      endpoint: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      authenticate: boolean;
      scope?: string;
    },
    body?: any,
  ): Promise<T> => {
    const url = `${this.config.serverDomain}${endpoint.endpoint}`;
    console.log(`Requesting ${endpoint.method} ${url}`);
    const headers: any = {
      'Content-Type': 'application/json',
    };
    if (endpoint.authenticate && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const axiosConfig = { url, method: endpoint.method, headers };
    if (endpoint.method === 'GET') {
      axiosConfig['params'] = body;
    } else {
      axiosConfig['data'] = body ? JSON.stringify(body) : undefined;
    }
    if (this.rateLimitByScope[endpoint.scope || 'Default']) {
      await this.rateLimitByScope[endpoint.scope || 'Default'].waitToCall();
    } else {
      await this.rateLimitByScope['Default'].waitToCall();
    }
    return await axios(axiosConfig)
      .then((response) => response.data as T)
      .catch((error) => {
        // Handle error appropriately
        throw error;
      });
  };

  private pullAllByPagination = async <T>(
    endpoint: {
      endpoint: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      authenticate: boolean;
      scope?: string;
    },
    itemKey: string,
    body?: any,
  ): Promise<T[]> => {
    let allResults: T[] = [];
    let beforeToken: string = null;
    let hasMore: boolean = true;

    while (hasMore) {
      const paginatedBody = { ...(body || {}) };
      if (beforeToken) {
        paginatedBody['before'] = beforeToken;
      }
      const response = await this.request<{
        before_cursor: string;
        after_cursor: string;
        [key: string]: any;
      }>(endpoint, paginatedBody);
      const items: T[] = response[itemKey];
      allResults = allResults.concat(items);

      beforeToken = response.before_cursor;
      hasMore = items.length > 0 && !!beforeToken;
    }
    return allResults;
  };

  authenticate(): Promise<AuthenticateResponseDto> {
    const timestamp = new Date().toISOString();
    const nonce = nanoid();
    // Here you would generate the signature using your client secret and the request details
    // For simplicity, we'll assume the signature is provided in the request object
    const message = this.config.clientKeyId + nonce + timestamp;

    const decodedSecret = Buffer.from(this.config.clientSecret, 'base64');

    const signature = CryptoJS.createHmac(
      'sha256',
      decodedSecret as CryptoJS.BinaryLike,
    )
      .update(message)
      .digest('base64');

    return this.request<AuthenticateResponseDto>(LMAX_ENDPOINTS.AUTHENTICATE, {
      client_key_id: this.config.clientKeyId,
      timestamp,
      nonce,
      signature,
    });
  }

  heartbeat(): Promise<void> {
    return this.request<void>(LMAX_ENDPOINTS.HEARTBEAT);
  }

  logout(): Promise<void> {
    if (this.refreshIntervalId) clearInterval(this.refreshIntervalId!);
    return this.request<void>(LMAX_ENDPOINTS.LOGOUT);
  }

  getInstrumentData(): Promise<InstrumentListResponseDto> {
    return this.request<InstrumentListResponseDto>(
      LMAX_ENDPOINTS.INSTRUMENT_DATA,
    );
  }

  getOrderState(request: OrderStateRequestDto): Promise<OrderStateResponseDto> {
    return this.request<OrderStateResponseDto>(
      LMAX_ENDPOINTS.ORDER_STATE,
      request,
    );
  }

  getWorkingOrders(
    request?: WorkingOrdersRequestDto,
  ): Promise<WorkingOrderDto[]> {
    return this.pullAllByPagination<WorkingOrderDto>(
      LMAX_ENDPOINTS.WORKING_ORDERS,
      'orders',
      request,
    );
  }

  getOrderPositions(
    request?: OrderPositionsRequestDto,
  ): Promise<OrderPositionDto[]> {
    return this.pullAllByPagination<OrderPositionDto>(
      LMAX_ENDPOINTS.ORDER_POSITIONS,
      'positions',
      request,
    );
  }

  getInstrumentPositions(): Promise<InstrumentPositionsResponseDto> {
    return this.request<InstrumentPositionsResponseDto>(
      LMAX_ENDPOINTS.INSTRUMENT_POSITIONS,
    );
  }

  getWalletBalances(): Promise<WalletBalancesResponseDto> {
    return this.request<WalletBalancesResponseDto>(
      LMAX_ENDPOINTS.WALLET_BALANCES,
    );
  }

  getCollateralizedCredit(): Promise<CollateralizedCreditResponseDto> {
    return this.request<CollateralizedCreditResponseDto>(
      LMAX_ENDPOINTS.COLLATERALIZED_CREDIT,
    );
  }

  getAccountTransactions(
    request: TransactionsRequestDto,
  ): Promise<TransactionDto[]> {
    return this.pullAllByPagination<TransactionDto>(
      LMAX_ENDPOINTS.ACCOUNT_TRANSACTIONS,
      'transactions',
      request,
    );
  }

  getTradeHistory(request: TradeHistoryRequestDto): Promise<TradeDto[]> {
    return this.pullAllByPagination<TradeDto>(
      LMAX_ENDPOINTS.TRADE_HISTORY,
      'trades',
      request,
    );
  }

  getWithdrawalStatus(id: string): Promise<WithdrawalRequestStatusResponseDto> {
    const endpoint = {
      ...LMAX_ENDPOINTS.WITHDRAWAL_STATUS,
      endpoint: LMAX_ENDPOINTS.WITHDRAWAL_STATUS.endpoint.replace(':id', id),
    };
    return this.request<WithdrawalRequestStatusResponseDto>(endpoint);
  }

  listWithdrawals(
    request?: WithdrawalRequestsRequestDto,
  ): Promise<WithdrawalRequestsResponseDto> {
    return this.request<WithdrawalRequestsResponseDto>(
      LMAX_ENDPOINTS.LIST_WITHDRAWALS,
      request,
    );
  }

  // Account Maintenance
  submitWithdrawal(
    request: BlockchainWithdrawalRequestDto,
  ): Promise<SubmitWithdrawalResponseDto> {
    return this.request<SubmitWithdrawalResponseDto>(
      LMAX_ENDPOINTS.SUBMIT_WITHDRAWAL,
      request,
    );
  }

  // Public Data
  getCurrentTime(): Promise<CurrentTimeResponseDto> {
    return this.request<CurrentTimeResponseDto>(LMAX_ENDPOINTS.CURRENT_TIME);
  }

  getApiVersion(): Promise<VersionResponseDto> {
    return this.request<VersionResponseDto>(LMAX_ENDPOINTS.API_VERSION);
  }
}
