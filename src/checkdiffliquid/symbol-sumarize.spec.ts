/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import * as path from 'path';
import { readAndSummarizeSymbols, getUniqueSymbols } from './symbol-sumarize';

describe('SymbolSumarizeSpec', () => {
  it('readAndSummarizeSymbols blue', async () => {
    const csvFilePath = path.join(
      process.cwd(),
      'public',
      'assets',
      'check',
      'BlueDragon-Deals.csv',
    );
    const rs = await readAndSummarizeSymbols(csvFilePath);
    console.log(rs);
    expect(rs).toBeDefined();
  });

  it('readAndSummarizeSymbols gtc', async () => {
    const csvFilePath = path.join(
      process.cwd(),
      'public',
      'assets',
      'check',
      'GTC-ReportHistory.csv',
    );
    const rs = await readAndSummarizeSymbols(csvFilePath);
    console.log(rs);
    expect(rs).toBeDefined();
  });

  it('getUniqueSymbols blue', async () => {
    const csvFilePath = path.join(
      process.cwd(),
      'public',
      'assets',
      'check',
      'BlueDragon-Deals.csv',
    );
    const rs = await getUniqueSymbols(csvFilePath);
    console.log(rs);
    expect(rs).toBeDefined();
  });

  it('getUniqueSymbols gtc', async () => {
    const csvFilePath = path.join(
      process.cwd(),
      'public',
      'assets',
      'check',
      'GTC-ReportHistory.csv',
    );
    const rs = await getUniqueSymbols(csvFilePath);
    console.log(rs);
    expect(rs).toBeDefined();
  });
});
