export const MT5DEAL_ACTION = {
  DEAL_BUY: 0, // buy
  DEAL_SELL: 1, // sell
  DEAL_BALANCE: 2, // deposit operation
  DEAL_CREDIT: 3, // credit operation
  DEAL_CHARGE: 4, // additional charges
  DEAL_CORRECTION: 5, // correction deals
  DEAL_BONUS: 6, // bonus
  DEAL_COMMISSION: 7, // commission
  DEAL_COMMISSION_DAILY: 8, // daily commission
  DEAL_COMMISSION_MONTHLY: 9, // monthly commission
  DEAL_AGENT_DAILY: 10, // daily agent commission
  DEAL_AGENT_MONTHLY: 11, // monthly agent commission
  DEAL_INTERESTRATE: 12, // interest rate charges
  DEAL_BUY_CANCELED: 13, // canceled buy deal
  DEAL_SELL_CANCELED: 14, // canceled sell deal
  DEAL_DIVIDEND: 15, // dividend
  DEAL_DIVIDEND_FRANKED: 16, // franked dividend
  DEAL_TAX: 17, // taxes
  DEAL_AGENT: 18, // instant agent commission
  DEAL_SO_COMPENSATION: 19, // negative balance compensation after stop-out
  //--- enumeration borders
  DEAL_FIRST: 0, // DEAL_BUY,
  DEAL_LAST: 19, // DEAL_SO_COMPENSATION
};
export const MT5DEAL_ENTRY = {
  OPEN: 0, // open
  CLOSE: 1, // close
};
