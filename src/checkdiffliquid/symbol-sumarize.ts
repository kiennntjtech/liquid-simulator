import * as fs from 'fs';
import * as path from 'path';

/**
 * Read CSV file and extract unique symbols
 * @returns An object with symbol names as keys and their occurrence count as values
 */
export async function readAndSummarizeSymbols(
  csvFilePath: string,
): Promise<Record<string, number>> {
  try {
    // Get the file path

    // Read the file content
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');

    // Split the content into lines
    const lines = fileContent.split('\n');

    // Get the headers from first line
    const headers = lines[0].split(',');

    // Find the index of the Symbol column
    const symbolIndex = headers.findIndex(
      (header) => header.trim() === 'Symbol',
    );

    if (symbolIndex === -1) {
      throw new Error('Symbol column not found in CSV file');
    }

    // Parse the data and collect symbols
    const symbolCounts: Record<string, number> = {};

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      // Split the line by comma
      const values = line.split(',');

      if (values.length > symbolIndex) {
        const symbol = values[symbolIndex].trim();
        if (symbol) {
          symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        }
      }
    }

    return symbolCounts;
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    return {};
  }
}

/**
 * Gets a list of unique symbols from the BlueDragon-Deals.csv file
 * @returns An array of unique symbol names
 */
export async function getUniqueSymbols(filePath: string): Promise<string[]> {
  const symbolCounts = await readAndSummarizeSymbols(filePath);
  return Object.keys(symbolCounts);
}

/**
 * Gets complete summary of symbols with their counts
 * @returns An object containing symbols and their counts, sorted by frequency
 */
export async function getSymbolSummary(
  filePath: string,
): Promise<{ symbol: string; count: number }[]> {
  const symbolCounts = await readAndSummarizeSymbols(filePath);

  return Object.entries(symbolCounts)
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count);
}
