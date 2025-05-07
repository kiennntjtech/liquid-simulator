import * as fs from 'fs';
import * as path from 'path';
import { Deal } from './types';
import * as moment from 'moment';
import { SymbolPointMap } from './config';

const coverTypes = ['buy', 'sell'];
const startTime = '2025.03.13 11:15:00';
const endTime = '2025.03.14 23:59:59';
export function convertBlueCsvToDeals(filePath: string): Deal[] {
  // Read file content
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Split by lines and get headers
  const lines = fileContent.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());

  // Map each line to a Deal object
  const deals: Deal[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = lines[i].split(',').map((value) => value.trim());
    const row: Record<string, string> = {};

    // Create an object with header keys and corresponding values
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    if (!coverTypes.includes(row.Type)) {
      continue;
    }
    if (row.Comment.startsWith('MM #')) {
      continue;
    }
    if (row.Time < startTime || row.Time > endTime) {
      continue;
    }

    // Convert row to Deal object
    deals.push({
      broker: 'blue',
      ticket: +(row.Deal || '0'),
      symbol: row.Symbol || '',
      lots: parseFloat(row.Volume || '0'),
      price: parseFloat(row.Price || '0'),
      priceInPoint: priceInPointConvent(
        row.Symbol,
        parseFloat(row.Price || '0'),
      ),
      type: row.Type?.toLowerCase() === 'buy' ? 'buy' : 'sell',
      commission: parseFloat(row.Commission || '0'),
      swap: parseFloat(row.Swap || '0'),
      fee: parseFloat(row.Fee || '0'),
      time: row.Time.substring(0, 19),
    });
  }

  deals.sort((a, b) => {
    return a.ticket - b.ticket;
  });
  return deals;
}

export function convertGTCCsvToDeals(filePath: string): Deal[] {
  // Read file content
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Split by lines and get headers
  const lines = fileContent.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());

  // Map each line to a Deal object
  const deals: Deal[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = lines[i].split(',').map((value) => value.trim());
    const row: Record<string, string> = {};

    // Create an object with header keys and corresponding values
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    if (!coverTypes.includes(row.Type)) {
      continue;
    }
    const time = row.Time.substring(0, 19);
    if (time < startTime || time > endTime) {
      continue;
    }
    //Time,Deal,Symbol,Type,Direction,Volume,Price,Order,Commission,Fee,Swap,Profit,Balance,Comment
    // Convert row to Deal object
    const symbol = row.Symbol.split('.')[0];
    deals.push({
      broker: 'gtc',
      ticket: +(row.Deal || '0'),
      symbol: symbol,
      lots: parseFloat(row.Volume || '0'),
      price: parseFloat(row.Price || '0'),
      priceInPoint: priceInPointConvent(symbol, parseFloat(row.Price || '0')),
      type: row.Type?.toLowerCase() === 'buy' ? 'buy' : 'sell',
      commission: parseFloat(row.Commission || '0'),
      swap: parseFloat(row.Swap || '0'),
      fee: parseFloat(row.Fee || '0'),

      time: row.Time.substring(0, 19),
    });
  }

  return deals;
}

// Example usage
// const filePath = path.resolve(__dirname, '../../data/BlueDragon-Deals.csv');
// const deals = convertCsvToDeals(filePath);
// console.log(`Loaded ${deals.length} deals`);

function priceInPointConvent(symbol: string, price: number): number {
  const pointer = SymbolPointMap[symbol];
  if (pointer) {
    return Math.round(price / pointer);
  }
  return price;
}
