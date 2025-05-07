/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { convertBlueCsvToDeals, convertGTCCsvToDeals } from './csvConverter';
import * as path from 'path';

describe('CsvConverterSpec', () => {
  it('convertBlueCsvToDeals', () => {
    const filePath = path.join(
      process.cwd(),
      'public',
      'assets',
      'check',
      'BlueDragon-Deals.csv',
    );
    const deals = convertBlueCsvToDeals(filePath);
    expect(deals).toBeDefined();
  });

  it('convertGTCCsvToDeals', () => {
    const filePath = path.join(
      process.cwd(),
      'public',
      'assets',
      'check',
      'GTC-ReportHistory.csv',
    );
    const deals = convertGTCCsvToDeals(filePath);
    expect(deals).toBeDefined();
  });
});
