export type Deal = {
  broker: 'blue' | 'gtc';
  ticket: number;
  symbol: string;

  price: number;
  priceInPoint: number;
  type: 'buy' | 'sell';
  commission: number;
  swap: number;
  fee: number;
  lots: number;
  time: string;
};

export class DiffRow {
  Symbol: string;
  BlueDeal: number;
  BlueLots: number;
  BlueLotsWithSize: number;
  BluePrice: number;
  BluePriceInPoint: number;
  BlueTime: string;
  BlueType: 'buy' | 'sell';
  BlueCommission: number;
  BlueSwap: number;
  BlueFee: number;
  BlueAccumulatedLots: number;
  BlueRemainLots: number;
  BlueAvgPriceInPoint: number;

  GTCDeal: number;
  GTCLots: number;
  GTCLotsWithSize: number;
  GTCPrice: number;
  GTCPriceInPoint: number;
  GTCType: 'buy' | 'sell';
  GTCCommission: number;
  GTCSwap: number;
  GTCFee: number;
  GTCTime: string;

  DiffPoint: number;
  LiquidProfit: number;

  setBlueDeal(deal: Deal) {
    this.BlueDeal = deal.ticket;
    this.BlueLots = deal.lots;
    this.BlueLotsWithSize = deal.type === 'buy' ? deal.lots : -deal.lots;
    this.BluePrice = deal.price;
    this.BluePriceInPoint = deal.priceInPoint;
    this.BlueTime = deal.time;
    this.BlueType = deal.type;
    this.BlueCommission = deal.commission;
    this.BlueSwap = deal.swap;
    this.BlueFee = deal.fee;
  }

  setGtcDeal(deal: Deal) {
    this.GTCDeal = deal.ticket;
    this.GTCLots = deal.lots;
    this.GTCLotsWithSize = deal.type === 'buy' ? deal.lots : -deal.lots;
    this.GTCPrice = deal.price;
    this.GTCPriceInPoint = deal.priceInPoint;
    this.GTCTime = deal.time;
    this.GTCType = deal.type;
    this.GTCCommission = deal.commission;
    this.GTCSwap = deal.swap;
    this.GTCFee = deal.fee;
  }
}

export const DiffRowHeader = [
  'Symbol',
  'BlueDeal',
  'BlueLots',
  'BlueLotsWithSize',
  'BluePrice',
  'BluePriceInPoint',
  'BlueTime',
  'BlueType',
  'BlueCommission',
  'BlueSwap',
  'BlueFee',

  'BlueAvgPriceInPoint',

  'BlueAccumulatedLots',
  'GTCLotsWithSize',
  'BlueRemainLots',

  'GTCDeal',
  'GTCLots',
  'GTCPrice',
  'GTCPriceInPoint',
  'GTCTime',
  'GTCType',
  'GTCCommission',
  'GTCSwap',
  'GTCFee',
  'DiffPoint',
  'LiquidProfit',
];
