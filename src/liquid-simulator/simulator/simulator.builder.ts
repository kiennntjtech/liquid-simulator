export type Deal = {
  ticket: number;
  side: 'buy' | 'sell';
  lots: number;
};

export class SimulatorBuilder {
  private threshold = 10;
  private feeRate = 0.001;
  private lotsInWindow = 0;
  private estimateFeeDirectLiquid = 0;
  private totalFee = 0;

  constructor(params: { threshold: number; feeRate: number }) {
    this.threshold = params.threshold;
    this.feeRate = params.feeRate;
  }

  pipeDeals = (deals: Deal[]) => {
    for (let i = 0; i < deals.length; i++) {
      const deal = deals[i];

      this.estimateFeeDirectLiquid += deal.lots * this.feeRate;
      if (deal.side == 'buy') {
        this.lotsInWindow += deal.lots;
      } else {
        this.lotsInWindow -= deal.lots;
      }
      if (Math.abs(this.lotsInWindow) > this.threshold) {
        this.totalFee += this.lotsInWindow * this.feeRate;
        this.lotsInWindow = 0;
      }
    }

    if (this.lotsInWindow != 0) {
      this.totalFee += this.lotsInWindow * this.feeRate;
    }

    return this;
  };

  summarize = () => {
    return {
      totalFee: this.totalFee,
      estimateFeeDirectLiquid: this.estimateFeeDirectLiquid,
    };
  };
}
