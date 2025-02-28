# Liquidation Profit Calculation

## Basic Concepts

- `threshold`: Maximum allowed position size (e.g., 10 lots)
- `holdingLots`: Current accumulated position size
- `holdingValue`: Running total of position cost basis
- `baseContractSize`: Standard contract size (100,000 units)

## Real Case Study

### Scenario

Given:

- Threshold: 10 lots
- Two consecutive buy orders:
  1. Buy 9 lots at 1000
  2. Buy 1 lot at 1100
- When threshold reached, entire position is liquidated at current market price (1100)

### Step-by-Step Calculation

1. **First Deal (Buy 9 lots at 1000)**

```
holdingLots = 9
holdingValue += 9 lots × 1000 × 100,000 = 900,000
```

2. **Second Deal (Buy 1 lot at 1100)**

```
holdingLots = 10 (exceeds threshold, triggers liquidation)
holdingValue += 1 lot × 1100 × 100,000 = 110,000
Total holdingValue = 1,010,000
```

3. **Liquidation Calculation**

```
liquidValue = total lots × current price × baseContractSize
           . = 10 × 1100 × 100,000
           . = 1,100,000

liquidProfit = holdingValue - liquidValue
             . =  1,010,000 - 1,100,000
             . = - 90,000
```

4. **Profit Currency Conversion**

Depending on usdPosition setting:

a. Base Currency:

```
finalProfit = 90,000 / 1100 = 81.82 (base currency units)
```

b. Quote Currency:

```
finalProfit = 90,000 (quote currency units)
```

c. Exchange Currency (example with exchangePrice = 1.5):

```
finalProfit = 90,000 / 1.5 = 60,000 (exchange currency units)
```

## Key Points

- Liquidation occurs at the current market price when position size hits threshold
- Profit/loss is calculated based on the difference between:
  - Final liquidation value (entire position × current price)
  - Accumulated cost of building the position (holdingValue)
- After liquidation:
  - holdingLots reset to 0
  - holdingValue reset to 0
  - New accumulation begins
