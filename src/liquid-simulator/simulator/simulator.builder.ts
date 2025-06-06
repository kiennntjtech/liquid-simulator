import { SymbolConfigDto } from '../dto/simulator.dto';

export type Deal = {
  ticket: number;
  symbol: string;
  side: 'buy' | 'sell';
  lots: number;
  point: number;
  normalizedLots: number;
  price: number;
  rateProfit: number;
  time: Date;
  login: number;
  group: string;
  spread: number;
  swap: number;
  digits: number;
};

export type ReportSummaryDto = {
  threshold: number;
  totalFee: number;
  estimateFeeDirectLiquid: number;
  maxHoldLots: number;
  totalLiquidOrder: number;
  totalLiquidProfit: number;
  clientSwapPerLot: number;
  totalClientSwap: number;
  totalClientTradeLots: number;
  totalLiquidLots: number;

  totalLiquidProfit10: number;
  totalLiquidProfit30: number;
  totalLiquidProfit50: number;

  unrealizedProfit: number;
  unrealizedProfit10: number;
  unrealizedProfit30: number;
  unrealizedProfit50: number;
};

export class SimulatorBuilder {
  private threshold = 10;
  private feeRate = 0;

  private holdingLots = 0;
  private maxHoldLots = 0;
  private trackHoldLots = 0;
  private estimateFeeDirectLiquid = 0;
  private totalFee = 0;
  private totalLiquidOrder = 0;
  private holdingValue = 0;
  private totalLiquidProfit = 0;
  private totalLiquidLots = 0;
  private totalClientTradeLots = 0;
  private totalClientSwap = 0;
  private spread = 0;

  private totalLiquidProfit10 = 0;
  private totalLiquidProfit30 = 0;
  private totalLiquidProfit50 = 0;

  private baseContractSize = 100000;
  private usdPosition: 'base' | 'quote' | 'exchange' = 'base';
  private exchangePrice = 1;

  private lastDeal: Deal;
  private slippage10 = 0;
  private slippage30 = 0;
  private slippage50 = 0;

  constructor(params: {
    threshold: number;
    feeRate: number;
    baseContractSize: number;
    usdPosition: 'base' | 'quote' | 'exchange';
    exchangePrice?: number;
    spread: number;
  }) {
    this.threshold = params.threshold;
    this.feeRate = params.feeRate;
    this.baseContractSize = params.baseContractSize;
    this.usdPosition = params.usdPosition;
    this.exchangePrice = params.exchangePrice;
    this.spread = params.spread;

    // this.slippage10 = (params.spread * 0.1) / Math.pow(10, params.digits);
    // this.slippage30 = (params.spread * 0.3) / Math.pow(10, params.digits);
    // this.slippage50 = (params.spread * 0.5) / Math.pow(10, params.digits);
  }

  pipeDeals = (deals: Deal[]) => {
    for (let i = 0; i < deals.length; i++) {
      const deal = deals[i];
      this.lastDeal = deal;
      const normalizedLots = +deal.normalizedLots;
      this.estimateFeeDirectLiquid += normalizedLots * this.feeRate;
      this.totalClientSwap += this.exchangeSymbolProfitToUsd(+deal.swap, deal);
      this.totalClientTradeLots += Math.abs(normalizedLots);

      if (deal.side == 'buy') {
        this.holdingLots += normalizedLots;
        this.trackHoldLots += normalizedLots;

        this.holdingValue += deal.point * deal.price;
      } else {
        this.holdingLots -= normalizedLots;
        this.trackHoldLots -= normalizedLots;

        this.holdingValue -= deal.point * deal.price;
      }

      if (Math.abs(this.trackHoldLots) > this.maxHoldLots) {
        this.maxHoldLots = Math.abs(this.trackHoldLots);
      }

      // trigger liquid order
      if (Math.abs(this.holdingLots) > this.threshold) {
        this.totalLiquidLots += Math.abs(this.holdingLots);
        const liquidValue =
          this.holdingLots * deal.price * this.baseContractSize;
        const liquidProfit = this.holdingValue - liquidValue;

        const sideSlippage = this.holdingLots > 0 ? 1 : -1;
        const slippage10 =
          Math.round(this.spread * 0.1) / Math.pow(10, deal.digits);
        const slippage30 =
          Math.round(this.spread * 0.3) / Math.pow(10, deal.digits);
        const slippage50 =
          Math.round(this.spread * 0.5) / Math.pow(10, deal.digits);

        const liquidValue10 =
          this.holdingLots *
          (deal.price + slippage10 * sideSlippage) *
          this.baseContractSize;

        const liquidValue30 =
          this.holdingLots *
          (deal.price + slippage30 * sideSlippage) *
          this.baseContractSize;

        const liquidValue50 =
          this.holdingLots *
          (deal.price + slippage50 * sideSlippage) *
          this.baseContractSize;

        const liquidProfit10 = this.holdingValue - liquidValue10;
        const liquidProfit30 = this.holdingValue - liquidValue30;
        const liquidProfit50 = this.holdingValue - liquidValue50;

        //this.totalLiquidProfit += liquidProfit
        switch (this.usdPosition) {
          case 'base':
            this.totalLiquidProfit += liquidProfit / deal.price;
            this.totalLiquidProfit10 += liquidProfit10 / deal.price;
            this.totalLiquidProfit30 += liquidProfit30 / deal.price;
            this.totalLiquidProfit50 += liquidProfit50 / deal.price;
            break;
          case 'quote':
            this.totalLiquidProfit += liquidProfit;
            this.totalLiquidProfit10 += liquidProfit10;
            this.totalLiquidProfit30 += liquidProfit30;
            this.totalLiquidProfit50 += liquidProfit50;
            break;
          case 'exchange':
            this.totalLiquidProfit += liquidProfit / this.exchangePrice;
            this.totalLiquidProfit10 += liquidProfit10 / this.exchangePrice;
            this.totalLiquidProfit30 += liquidProfit30 / this.exchangePrice;
            this.totalLiquidProfit50 += liquidProfit50 / this.exchangePrice;
            break;
        }

        this.totalFee += Math.abs(this.holdingLots) * this.feeRate;
        this.totalLiquidOrder += 1;
        this.holdingLots = 0;
        this.holdingValue = 0;
      }
    }

    return this;
  };

  exchangeSymbolProfitToUsd = (profit: number, deal: Deal) => {
    switch (this.usdPosition) {
      case 'base':
        return profit / deal.price;
      case 'quote':
        return profit;
      case 'exchange':
        return profit / this.exchangePrice;
    }
    return 0;
  };

  liquidFinalHolding = () => {
    const deal = this.lastDeal;
    if (!deal) {
      return {
        totalLiquidProfit: 0,
        totalLiquidProfit10: 0,
        totalLiquidProfit30: 0,
        totalLiquidProfit50: 0,
        totalFee: 0,
      };
    }
    const liquidValue = this.holdingLots * deal.price * this.baseContractSize;
    const liquidProfit = this.holdingValue - liquidValue;

    const sideSlippage = this.holdingLots > 0 ? 1 : -1;
    const slippage10 =
      Math.round(this.spread * 0.1) / Math.pow(10, deal.digits);
    const slippage30 =
      Math.round(this.spread * 0.3) / Math.pow(10, deal.digits);
    const slippage50 =
      Math.round(this.spread * 0.5) / Math.pow(10, deal.digits);

    const liquidValue10 =
      this.holdingLots *
      (deal.price + slippage10 * sideSlippage) *
      this.baseContractSize;

    const liquidValue30 =
      this.holdingLots *
      (deal.price + slippage30 * sideSlippage) *
      this.baseContractSize;

    const liquidValue50 =
      this.holdingLots *
      (deal.price + slippage50 * sideSlippage) *
      this.baseContractSize;

    const liquidProfit10 = this.holdingValue - liquidValue10;
    const liquidProfit30 = this.holdingValue - liquidValue30;
    const liquidProfit50 = this.holdingValue - liquidValue50;

    //this.totalLiquidProfit += liquidProfit

    const result = {
      totalLiquidProfit: 0,
      totalLiquidProfit10: 0,
      totalLiquidProfit30: 0,
      totalLiquidProfit50: 0,
      totalFee: 0,
    };
    switch (this.usdPosition) {
      case 'base':
        result.totalLiquidProfit += liquidProfit / deal.price;
        result.totalLiquidProfit10 += liquidProfit10 / deal.price;
        result.totalLiquidProfit30 += liquidProfit30 / deal.price;
        result.totalLiquidProfit50 += liquidProfit50 / deal.price;
        break;
      case 'quote':
        result.totalLiquidProfit += liquidProfit;
        result.totalLiquidProfit10 += liquidProfit10;
        result.totalLiquidProfit30 += liquidProfit30;
        result.totalLiquidProfit50 += liquidProfit50;
        break;
      case 'exchange':
        result.totalLiquidProfit += liquidProfit / this.exchangePrice;
        result.totalLiquidProfit10 += liquidProfit10 / this.exchangePrice;
        result.totalLiquidProfit30 += liquidProfit30 / this.exchangePrice;
        result.totalLiquidProfit50 += liquidProfit50 / this.exchangePrice;
        break;
    }

    result.totalFee += Math.abs(this.holdingLots) * this.feeRate;
    return result;
  };

  summarize = (): ReportSummaryDto => {
    const equity = this.liquidFinalHolding();
    const clientSwapPerLot = this.totalClientSwap / this.totalClientTradeLots;
    return {
      threshold: this.threshold,
      totalFee: this.totalFee,
      estimateFeeDirectLiquid: this.estimateFeeDirectLiquid,
      maxHoldLots: this.maxHoldLots,
      totalLiquidOrder: this.totalLiquidOrder,
      totalLiquidProfit: this.totalLiquidProfit,
      clientSwapPerLot: clientSwapPerLot,
      totalClientSwap: this.totalClientSwap,
      totalClientTradeLots: this.totalClientTradeLots,
      totalLiquidLots: this.totalLiquidLots,

      totalLiquidProfit10: this.totalLiquidProfit10,
      totalLiquidProfit30: this.totalLiquidProfit30,
      totalLiquidProfit50: this.totalLiquidProfit50,

      unrealizedProfit: equity.totalLiquidProfit,
      unrealizedProfit10: equity.totalLiquidProfit10,
      unrealizedProfit30: equity.totalLiquidProfit30,
      unrealizedProfit50: equity.totalLiquidProfit50,
    };
  };
}
