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
    const mergeDeals = [...blueDealsForSymbol, ...gtcDealsForSymbol];
    // sort by time, broker, ticket
    mergeDeals.sort((a, b) => {
      if (a.time !== b.time) {
        // string comparison
        return a.time < b.time ? -1 : 1;
      }
      if (a.broker != b.broker) {
        return a.broker == 'blue' ? -1 : 1;
      }
      return a.ticket - b.ticket;
    });

    let row: DiffRow = new DiffRow();
    let routeValueInPoint = 0;
    let routeVolume = 0;
    let BlueAccumulatedLots = 0;
    let BlueAvgPriceInPoint = 0;
    let BlueRemainLots = 0;
    let blueAbsRouteVolume = 0;
    let blueAbsRouteValueInPoint = 0;

    for (let j = 0; j < mergeDeals.length; j++) {
      const deal = mergeDeals[j];
      if (deal.broker === 'blue') {
        row = new DiffRow();
        row.Symbol = symbol;
        row.setBlueDeal(deal);

        const blueLotWithSide = deal.type === 'buy' ? deal.lots : -deal.lots;
        routeValueInPoint += blueLotWithSide * deal.priceInPoint;
        routeVolume += blueLotWithSide * 10000;
        blueAbsRouteVolume += Math.abs(deal.lots * 10000);
        blueAbsRouteValueInPoint += Math.abs(deal.lots * deal.priceInPoint);

        BlueAccumulatedLots = routeVolume / 10000;
        BlueAvgPriceInPoint = blueAbsRouteVolume
          ? (blueAbsRouteValueInPoint * 10000) / blueAbsRouteVolume
          : BlueAvgPriceInPoint;

        BlueRemainLots = BlueAccumulatedLots;
        row.BlueAccumulatedLots = BlueAccumulatedLots;
        row.BlueAvgPriceInPoint = BlueAvgPriceInPoint;
        row.BlueRemainLots = BlueRemainLots;
      } else {
        row = new DiffRow();
        row.Symbol = symbol;
        row.setGtcDeal(deal);
        row.DiffPoint = BlueAvgPriceInPoint - deal.priceInPoint;

        const gtcLotWithSide = deal.type === 'buy' ? deal.lots : -deal.lots;
        const gtcVolume = gtcLotWithSide * 10000;

        const liquidVolume = gtcVolume;

        row.LiquidProfit =
          (liquidVolume / 10000) * row.DiffPoint * SymbolPointMap[symbol];
        if (symbol.includes('XAU')) {
          row.LiquidProfit = row.LiquidProfit * 100;
        } else {
          if (!symbol.includes('BTCUSD')) {
            row.LiquidProfit = row.LiquidProfit * 100000;
          }
        }

        row.BlueAccumulatedLots = routeVolume / 10000;
        routeVolume -= liquidVolume;

        BlueRemainLots = routeVolume / 10000;
        routeValueInPoint -= (liquidVolume / 10000) * BlueAvgPriceInPoint;

        row.BlueRemainLots = BlueRemainLots;
        blueAbsRouteVolume = Math.abs(BlueRemainLots * 10000);
        blueAbsRouteValueInPoint = Math.abs(
          BlueRemainLots * BlueAvgPriceInPoint,
        );
        row.BlueAvgPriceInPoint = BlueAvgPriceInPoint;
      }
      result[symbol].push(row);
    }

    if (!mergeDeals.length) {
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
  console.log('Exporting', symbol, row.length);
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
