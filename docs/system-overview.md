# Forex Order Routing Optimization System

## Overview

This system simulates and optimizes the order routing process for Forex brokers by accumulating orders before sending them to liquidity providers, aiming to reduce transaction costs.

## Problem Statement

Traditionally, brokers immediately route each client order to liquidity providers, resulting in high transaction fees. This system proposes accumulating orders until they reach a certain threshold before routing, potentially reducing overall costs.

## System Components

### 1. Simulator Core (simulator.builder.ts)

- Tracks accumulated buy/sell volume
- Calculates costs and profits
- Key metrics:
  - Total fees
  - Maximum accumulated volume
  - Number of routing operations
  - Profit/loss from position holding

### 2. Data Processing (liquid-simulator.service.ts)

- Retrieves historical deal data
- Processes deals in batches of 2000
- Supports multiple currency pairs
- Handles volume normalization

### 3. Multi-threshold Analysis (step-simulator.service.ts)

- Simulates multiple thresholds simultaneously
- Generates comparative results
- Exports results to CSV format

## Output Analysis

The CSV report includes:

1. `threshold`: Volume threshold for order routing
2. `totalFee`: Total fees with new system
3. `estimateFeeDirectLiquid`: Fees under traditional routing
4. `maximumLotsInWindow`: Peak accumulated volume
5. `totalLiquidOrder`: Number of routing operations
6. `totalLiquidProfit`: Profit/loss from position holding
7. `oldCost`: Traditional routing cost
8. `newCost`: Optimized routing cost
9. `revenue`: Cost savings (oldCost - newCost)

### Profit/Loss Calculation (totalLiquidProfit)

The `totalLiquidProfit` represents the profit or loss from holding accumulated positions before routing them to liquidity providers. Here's how it's calculated:

1. Position Accumulation:

   - For each buy order: adds to holding position
   - For each sell order: subtracts from holding position
   - System tracks both volume and price points

2. Profit Calculation Formula:

   ```
   holdingValue = Σ(point × price) for each deal
   liquidValue = accumulatedVolume × currentPrice × baseContractSize
   liquidProfit = holdingValue - liquidValue
   ```

3. Currency Conversion:
   The profit is converted based on USD position in the pair:

   - When USD is base: profit / currentPrice
   - When USD is quote: profit (no conversion needed)
   - When using exchange rate: profit / exchangePrice

4. Example:

   ```
   Scenario:
   - Buy 1 lot at 1.1000
   - Buy 2 lots at 1.1002
   - Current price: 1.1005

   Calculation:
   holdingValue = (1 × 1.1000) + (2 × 1.1002) = 3.3004
   liquidValue = 3 × 1.1005 = 3.3015
   liquidProfit = 3.3004 - 3.3015 = -0.0011
   ```

This profit/loss reflects the market risk during the accumulation period and is factored into the total cost calculation of the optimized routing system.

## Example Calculation

Given:

- Threshold = 5 lots
- Fee Rate = $10/lot

Traditional routing:

```
3 orders: Buy 2 lots, Buy 1 lot, Buy 3 lots Cost = (2 + 1 + 3) × $10 = $60 (3 routing operations)
```

Optimized routing:

```
Accumulate until 5 lots threshold Cost = 5 × $10 = $50 (1 routing operation) Savings = $10
```

## Benefits

1. Reduced transaction costs
2. Optimized routing operations
3. Configurable thresholds per currency pair
4. Risk management through volume monitoring

## Configuration Options

- `threshold`: Volume threshold for routing
- `feeRate`: Cost per lot
- `usdPosition`: USD position in pair (base/quote/exchange)
- `exchangePrice`: Exchange rate for profit calculation
- `symbol`: Currency pair
- `startDate`: Simulation start date

## Risk Considerations

- Market exposure during accumulation
- Price fluctuation impact
- Maximum hold time/volume limits
- Liquidity provider requirements

The simulation results help brokers find optimal thresholds balancing cost reduction with risk management for each currency pair.
