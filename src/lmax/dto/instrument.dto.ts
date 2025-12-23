import { INSTRUMENT_TRADDING_DAY_TYPE } from '../constant';

export class InstrumentItemDto {
  instrument_id: string;
  security_id: string;
  symbol: string;
  currency: string;
  unit_of_measure: string;
  quantity_increment: string;
  margin: string;
  minimum_position_size: string;
  maximum_position_size: string;
  trading_days: INSTRUMENT_TRADDING_DAY_TYPE[];
  open_time: string;
  close_time: string;
  time_zone: string;
  minimum_commission: string;
  aggressive_commission_rate: string;
  passive_commission_rate: string;
  price_increment: string;
  minimum_price: string;
  maximum_price: string;
  funding_notification_timestamp: Date;
  short_swap_points: string;
  long_swap_points: string;
  short_swap_cost: string;
  long_swap_cost: string;
  swap_cost_units: string;
  trade_date: Date;
  value_date_from: Date;
  value_date_to: Date;
  asset_class: string;
}

export class InstrumentListResponseDto {
  account_id: string;
  timestamp: string; // ISO 8601 format
  instruments: InstrumentItemDto[];
}

// sample data
// {
//   "account_id": "1653445",
//   "timestamp": "2024-09-05T11:42:00.000Z",
//   "instruments": [
//     {
//       "instrument_id": "eur-usd",
//       "security_id": "4001",
//       "symbol": "EUR/USD",
//       "currency": "USD",
//       "unit_of_measure": "EUR",
//       "quantity_increment": "1000.0000",
//       "margin": "2.00",
//       "minimum_position_size": "1000.0000",
//       "maximum_position_size": "1500000.0000",
//       "trading_days": [
//         "MONDAY",
//         "TUESDAY",
//         "WEDNESDAY",
//         "THURSDAY",
//         "FRIDAY",
//         "SATURDAY",
//         "SUNDAY"
//       ],
//       "open_time": "17:05",
//       "close_time": "17:00",
//       "time_zone": "America/New_York",
//       "minimum_commission": "10.00000",
//       "aggressive_commission_rate": "0.25000",
//       "passive_commission_rate": "0.13000",
//       "price_increment": "0.000010",
//       "minimum_price": "0.000000",
//       "maximum_price": "99999.000000",
//       "funding_notification_timestamp": "2024-09-05T10:42:00.000Z",
//       "short_swap_points": "1.129",
//       "long_swap_points": "1.119",
//       "short_swap_cost": "1.12900",
//       "long_swap_cost": "-1.11900",
//       "swap_cost_units": "10000.0000",
//       "trade_date": "2023-10-11",
//       "value_date_from": "2023-10-13",
//       "value_date_to": "2023-10-14",
//       "asset_class": "CURRENCY"
//     },
//     {
//       "instrument_id": "eur-usd",
//       "security_id": "4001",
//       "symbol": "EUR/USD",
//       "currency": "USD",
//       "unit_of_measure": "EUR",
//       "quantity_increment": "1000.0000",
//       "margin": "2.00",
//       "minimum_position_size": "1000.0000",
//       "maximum_position_size": "1500000.0000",
//       "trading_days": [
//         "MONDAY",
//         "TUESDAY",
//         "WEDNESDAY",
//         "THURSDAY",
//         "FRIDAY",
//         "SATURDAY",
//         "SUNDAY"
//       ],
//       "open_time": "17:05",
//       "close_time": "17:00",
//       "time_zone": "America/New_York",
//       "minimum_commission": "10.00000",
//       "aggressive_commission_rate": "0.25000",
//       "passive_commission_rate": "0.13000",
//       "price_increment": "0.000010",
//       "minimum_price": "0.000000",
//       "maximum_price": "99999.000000",
//       "funding_notification_timestamp": "2024-09-05T10:42:00.000Z",
//       "long_financing_rate": "0.02",
//       "short_financing_rate": "0.03",
//       "funding_base_rate": "LIBOR",
//       "long_financing_premium_rate": "2.52",
//       "short_financing_premium_rate": "2.47",
//       "asset_class": "INDEX"
//     }
//   ]
// }
