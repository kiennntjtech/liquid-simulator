import { Deal, DiffRow, DiffRowHeader } from './types';
import { convertBlueCsvToDeals, convertGTCCsvToDeals } from './csvConverter';
import { getUniqueSymbols } from './symbol-sumarize';
import { SymbolPointMap } from './config';
import * as fs from 'fs';

export async function buildDiffRows() {
  const blueDeals = convertBlueCsvToDeals(
    'public/assets/check/BlueDragon-Deals.csv',
  );
  const gtcDeals = convertGTCCsvToDeals(
    'public/assets/check/GTC-ReportHistory.csv',
  );

  const symbols = await getUniqueSymbols(
    'public/assets/check/BlueDragon-Deals.csv',
  );
  const result: Record<string, DiffRow[]> = {};
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    result[symbol] = [];
    const blueDealsForSymbol = blueDeals.filter(
      (deal) => deal.symbol === symbol,
    );
    const gtcDealsForSymbol = gtcDeals.filter((deal) => deal.symbol === symbol);

    let routeValueInPoint = 0;

    let routeVolume = 0;
    let gtcDeal = gtcDealsForSymbol.shift();
    let totalBlueFee = 0;
    let totalGtcFee = 0;
    let totalLiquidProfit = 0;

    for (let j = 0; j < blueDealsForSymbol.length; j++) {
      const blueDeal = blueDealsForSymbol[j];
      const blueLotWithSide =
        blueDeal.type === 'buy' ? blueDeal.lots : -blueDeal.lots;
      routeValueInPoint += blueLotWithSide * blueDeal.priceInPoint;
      routeVolume += blueLotWithSide * 10000;
      totalBlueFee += blueDeal.fee + blueDeal.swap + blueDeal.commission;

      const row = new DiffRow();
      row.Symbol = symbol;
      row.setBlueDeal(blueDeal);
      row.BlueAccumulatedLots = routeVolume / 10000;
      row.BlueAvgPriceInPoint = routeValueInPoint / row.BlueAccumulatedLots;
      if (gtcDeal) {
        const gtcLotWithSide =
          gtcDeal.type === 'buy' ? gtcDeal.lots : -gtcDeal.lots;
        const gtcVolume = gtcLotWithSide * 10000;
        if (Math.abs(gtcVolume) <= Math.abs(routeVolume)) {
          row.setGtcDeal(gtcDeal);
          row.DiffPoint = gtcDeal.priceInPoint - row.BlueAvgPriceInPoint;
          if (blueDeal.type === 'buy') {
            row.DiffPoint = -row.DiffPoint;
          }
          const liquidVolume = gtcVolume;
          row.LiquidProfit =
            (liquidVolume / 10000) * row.DiffPoint * SymbolPointMap[symbol];

          routeVolume -= liquidVolume;
          row.BlueRemainLots = routeVolume / 10000;
          routeValueInPoint = (routeVolume / 10000) * row.BlueAvgPriceInPoint;
          totalLiquidProfit += row.LiquidProfit;
          totalGtcFee += gtcDeal.fee + gtcDeal.swap + gtcDeal.commission;
          gtcDeal = gtcDealsForSymbol.shift();
        }
      }

      result[symbol].push(row);
    }
    for (let k = 0; k < gtcDealsForSymbol.length; k++) {
      const gtcDeal = gtcDealsForSymbol[k];
      const row = new DiffRow();
      row.Symbol = symbol;
      row.setGtcDeal(gtcDeal);

      row.BlueAccumulatedLots = routeVolume / 10000;
      row.BlueAvgPriceInPoint = routeValueInPoint / row.BlueAccumulatedLots;
      if (gtcDeal) {
        const gtcLotWithSide =
          gtcDeal.type === 'buy' ? gtcDeal.lots : -gtcDeal.lots;
        const gtcVolume = gtcLotWithSide * 10000;
        if (Math.abs(gtcVolume) <= Math.abs(routeVolume)) {
          row.setGtcDeal(gtcDeal);
          row.DiffPoint = gtcDeal.priceInPoint - row.BlueAvgPriceInPoint;
          if (gtcDeal.type === 'buy') {
            row.DiffPoint = -row.DiffPoint;
          }
          const liquidVolume = gtcVolume;
          row.LiquidProfit =
            (liquidVolume / 10000) * row.DiffPoint * SymbolPointMap[symbol];

          routeVolume -= liquidVolume;
          row.BlueRemainLots = routeVolume / 10000;
          routeValueInPoint = (routeVolume / 10000) * row.BlueAvgPriceInPoint;
          totalLiquidProfit += row.LiquidProfit;
          totalGtcFee += gtcDeal.fee + gtcDeal.swap + gtcDeal.commission;
        }
      }

      result[symbol].push(row);
    }

    if (!result[symbol].length) {
      console.log(`Symbol ${symbol} has no deals`);
      continue;
    }
    exportCsv(symbol, result[symbol]);
  }

  console.log('Done');
  return result;
}

function exportCsv(symbol: string, row: DiffRow[]) {
  const header = DiffRowHeader;
  const content = row
    .map((row) =>
      header
        .map((header) => {
          return row[header];
        })
        .join(','),
    )
    .join('\n');
  const csv = `${header}\n${content}`;

  fs.writeFileSync(`public/assets/check/${symbol}-diff.csv`, csv);
}
