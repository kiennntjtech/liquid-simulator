import { SymbolConfigDto } from '../dto/simulator.dto';

export type Deal = {
  ticket: number;
  symbol: string;
  side: 'buy' | 'sell';
  lots: number;
};

export class SimulatorBuilder {
  private threshold = 10;
  private feeRate = 0;
  private symbolsContractSizes: Record<string, number> = {};
  private lotsInWindow = 0;
  private maxHoldLots = 0;
  private trackHoldLots = 0;
  private estimateFeeDirectLiquid = 0;
  private totalFee = 0;
  private maximumLotsInWindow = 0;
  private totalLiquidOrder = 0;

  constructor(params: {
    threshold: number;
    feeRate: number;
    symbolsContractSizes: SymbolConfigDto[];
  }) {
    this.symbolsContractSizes = params.symbolsContractSizes.reduce(
      (acc, symbol) => {
        acc[symbol.symbol] = symbol.contractSize;
        return acc;
      },
      {},
    );
    this.threshold = params.threshold;
    this.feeRate = params.feeRate;
  }

  pipeDeals = (deals: Deal[]) => {
    for (let i = 0; i < deals.length; i++) {
      const deal = deals[i];
      const contractSize = this.symbolsContractSizes[deal.symbol] || 1;
      const lots = +deal.lots / contractSize;
      this.estimateFeeDirectLiquid += lots * this.feeRate;
      if (deal.side == 'buy') {
        this.lotsInWindow += lots;
        this.trackHoldLots += lots;
      } else {
        this.lotsInWindow -= lots;
        this.trackHoldLots -= lots;
      }
      if (Math.abs(this.lotsInWindow) > Math.abs(this.maximumLotsInWindow)) {
        this.maximumLotsInWindow = Math.abs(this.lotsInWindow);
      }
      if (Math.abs(this.trackHoldLots) > this.maxHoldLots) {
        this.maxHoldLots = Math.abs(this.trackHoldLots);
      }

      // trigger liquid order
      if (Math.abs(this.lotsInWindow) > this.threshold) {
        this.totalFee += Math.abs(this.lotsInWindow) * this.feeRate;
        this.totalLiquidOrder += 1;
        this.lotsInWindow = 0;
      }
    }

    // if (this.lotsInWindow != 0) {
    //   this.totalFee += this.lotsInWindow * this.feeRate;
    // }

    return this;
  };

  summarize = () => {
    return {
      threshold: this.threshold,
      totalFee: this.totalFee,
      estimateFeeDirectLiquid: this.estimateFeeDirectLiquid,
      maximumLotsInWindow: this.maxHoldLots,
      totalLiquidOrder: this.totalLiquidOrder,
    };
  };
}
