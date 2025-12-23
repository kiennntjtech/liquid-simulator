import { authenticate } from 'passport';

export type INSTRUMENT_TRADDING_DAY_TYPE =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export const LMAX_ENDPOINTS = {
  // Authentication
  AUTHENTICATE: {
    endpoint: '/v1/authenticate',
    method: 'POST',
    authenticate: false,
    scope: 'Authentication',
  },
  LOGOUT: {
    endpoint: '/v1/logout',
    method: 'POST',
    authenticate: true,
    scope: 'Authentication',
  },
  HEARTBEAT: {
    endpoint: '/v1/heartbeat',
    method: 'GET',
    authenticate: true,
    scope: 'Authentication',
  },

  // Account Data
  INSTRUMENT_DATA: {
    endpoint: '/v1/account/instrument-data',
    method: 'GET',
    authenticate: true,
    scope: 'Query',
  },
  ORDER_STATE: {
    endpoint: '/v1/account/order-state',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },
  WORKING_ORDERS: {
    endpoint: '/v1/account/working-orders',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },
  ORDER_POSITIONS: {
    endpoint: '/v1/account/order-positions',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },
  INSTRUMENT_POSITIONS: {
    endpoint: '/v1/account/positions',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },
  WALLET_BALANCES: {
    endpoint: '/v1/account/wallets',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },
  COLLATERALIZED_CREDIT: {
    endpoint: '/v1/account/collateralized-credit',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },
  ACCOUNT_TRANSACTIONS: {
    endpoint: '/v1/account/account-transactions',
    method: 'GET',
    authenticate: true,
    scope: 'Query',
  },
  TRADE_HISTORY: {
    endpoint: '/v1/account/trades',
    method: 'GET',
    authenticate: true,
    scope: 'Query',
  },
  WITHDRAWAL_STATUS: {
    endpoint: '/v1/account/withdrawal/:id',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },
  LIST_WITHDRAWALS: {
    endpoint: '/v1/account/withdrawals',
    method: 'GET',
    authenticate: true,
    scope: 'Account_Information',
  },

  // Account_Maintenance
  SUBMIT_WITHDRAWAL: {
    endpoint: '/v1/account/withdrawal',
    method: 'POST',
    authenticate: true,
    scope: 'Account_Maintenance',
  },

  // Trading
  PLACE_ORDER: {
    endpoint: '/v1/account/place-order',
    method: 'POST',
    authenticate: true,
    scope: 'Trading',
  },
  CANCEL_ORDER: {
    endpoint: '/v1/account/cancel-order',
    method: 'POST',
    authenticate: true,
    scope: 'Trading',
  },
  CANCEL_REPLACE_ORDER: {
    endpoint: '/v1/account/cancel-and-replace-order',
    method: 'POST',
    authenticate: true,
    scope: 'Trading',
  },
  CANCEL_ALL_ORDERS: {
    endpoint: '/v1/account/cancel-all-orders',
    method: 'POST',
    authenticate: true,
    scope: 'Trading',
  },
  CLOSE_ORDER: {
    endpoint: '/v1/account/close-order',
    method: 'POST',
    authenticate: true,
    scope: 'Trading',
  },
  AMEND_TAKE_PROFIT: {
    endpoint: '/v1/account/take-profit',
    method: 'PUT',
    authenticate: true,
    scope: 'Trading',
  },
  REMOVE_TAKE_PROFIT: {
    endpoint: '/v1/account/take-profit',
    method: 'POST',
    authenticate: true,
    scope: 'Trading',
  },
  AMEND_STOP_LOSS: {
    endpoint: '/v1/account/stop-loss',
    method: 'PUT',
    authenticate: true,
    scope: 'Trading',
  },
  REMOVE_STOP_LOSS: {
    endpoint: '/v1/account/stop-loss',
    method: 'POST',
    authenticate: true,
    scope: 'Trading',
  },

  // Public Data
  CURRENT_TIME: {
    endpoint: '/v1/time',
    method: 'GET',
    authenticate: false,
    scope: 'Public_Data',
  },
  API_VERSION: {
    endpoint: '/v1/version',
    method: 'GET',
    authenticate: false,
    scope: 'Public_Data',
  },

  // WebSocket
  WEBSOCKET: {
    endpoint: '/v1/web-socket',
    method: 'WS',
    authenticate: true,
  },
} as const;
