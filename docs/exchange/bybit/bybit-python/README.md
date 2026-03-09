# bybit-python

> Source: https://pypi.org/project/bybit-api/

Python SDK (sync and async) for Bybit cryptocurrency exchange with Rest and WS capabilities.

## Links

- **SDK Documentation**: https://docs.ccxt.com/#/exchanges/bybit
- **Bybit API Docs**: https://bybit.com/apidocs1
- **GitHub Repo**: https://github.com/ccxt/bybit-python
- **PyPI Package**: https://pypi.org/project/bybit-api

---

## Installation

```bash
pip install bybit-api
```

---

## Usage

### Sync Example

```python
from bybit import BybitSync

def main():
    instance = BybitSync({})
    ob = instance.fetch_order_book("BTC/USDC")
    print(ob)
    #
    # balance = instance.fetch_balance()
    # order = instance.create_order("BTC/USDC", "limit", "buy", 1, 100000)

main()
```

### Async Example

```python
import sys
import asyncio
from bybit import BybitAsync

### on Windows, uncomment below:
# if sys.platform == 'win32':
#     asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = BybitAsync({})
    ob = await instance.fetch_order_book("BTC/USDC")
    print(ob)
    #
    # balance = await instance.fetch_balance()
    # order = await instance.create_order("BTC/USDC", "limit", "buy", 1, 100000)

    # once you are done with the exchange
    await instance.close()

asyncio.run(main())
```

### WebSockets Example

```python
import sys
from bybit import BybitWs

### on Windows, uncomment below:
# if sys.platform == 'win32':
#     asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = BybitWs({})
    while True:
        ob = await instance.watch_order_book("BTC/USDC")
        print(ob)
        # orders = await instance.watch_orders("BTC/USDC")

    # once you are done with the exchange
    await instance.close()

asyncio.run(main())
```

### Raw Call Example

You can also construct custom requests to available "implicit" endpoints:

```python
request = {
    'type': 'candleSnapshot',
    'req': {
        'coin': coin,
        'interval': tf,
        'startTime': since,
        'endTime': until,
    },
}
response = await instance.public_post_info(request)
```

---

## Available Methods

### REST Unified

#### Convert Operations
- `create_convert_trade(self, id: str, fromCode: str, toCode: str, amount: Num = None, params={})`

#### Order Management
- `create_expired_option_market(self, symbol: str)`
- `create_market_buy_order_with_cost(self, symbol: str, cost: float, params={})`
- `create_market_sell_order_with_cost(self, symbol: str, cost: float, params={})`
- `create_order_request(self, symbol: str, type: OrderType, side: OrderSide, amount: float, price: Num = None, params={}, isUTA=True)`
- `create_order(self, symbol: str, type: OrderType, side: OrderSide, amount: float, price: Num = None, params={})`
- `create_orders(self, orders: List[OrderRequest], params={})`

#### Account & Balance
- `fetch_all_greeks(self, symbols: Strings = None, params={})`
- `fetch_balance(self, params={})`
- `fetch_bids_asks(self, symbols: Strings = None, params={})`
- `fetch_borrow_interest(self, code: Str = None, params={})`
- `fetch_borrow_rate(self, code: Str = None, params={})`
- `fetch_borrow_rates(self, params={})`
- `fetch_borrow_rate_history(self, code: Str = None, params={})`
- `fetch_currencies(self, params={})`
- `fetch_deposits(self, code: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_deposits_withdrawals(self, code: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_deposit_address(self, code: Str, params={})`
- `fetch_deposit_addresses(self, codes: Strings = None, params={})`

#### Market Data
- `fetch_greeks(self, symbol: str, params={})`
- `fetch_insurance_fund(self, params={})`
- `fetch_leverage(self, symbol: str, params={})`
- `fetch_liquidations(self, symbol: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_margin_mode(self, symbol: Str = None, params={})`
- `fetch_market_cap(self, params={})`
- `fetch_markets(self, params={})`
- `fetch_mark_price(self, symbol: str, params={})`
- `fetch_mark_prices(self, symbols: Strings = None, params={})`
- `fetch_my_liquidations(self, symbol: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_ohlcv(self, symbol: str, timeframe: str = '1m', since: Int = None, limit: Int = None, params={})`
- `fetch_open_interest(self, symbol: str, params={})`
- `fetch_open_interest_history(self, symbol: str, timeframe: str = '1h', since: Int = None, limit: Int = None, params={})`
- `fetch_option(self, symbol: str, params={})`
- `fetch_option_chain(self, symbol: str, params={})`
- `fetch_order(self, id: str, symbol: Str = None, params={})`
- `fetch_order_book(self, symbol: str, limit: Int = None, params={})`
- `fetch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_order_trades(self, id: str, symbol: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_position(self, symbol: str, params={})`
- `fetch_positions(self, symbols: Strings = None, params={})`

#### Position Management
- `fetch_position_mode(self, symbol: Str = None, params={})`
- `fetch_ticker(self, symbol: str, params={})`
- `fetch_tickers(self, symbols: Strings = None, params={})`
- `fetch_time(self, params={})`
- `fetch_trades(self, symbol: str, since: Int = None, limit: Int = None, params={})`
- `fetch_trading_fee(self, symbol: str, params={})`
- `fetch_trading_fees(self, params={})`
- `fetch_transaction_log(self, params={})`
- `fetch_transactions(self, code: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_transfers(self, code: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_underlying_assets(self, params={})`
- `fetch_volatility_history(self, code: str, timeframe: str = '1d', since: Int = None, limit: Int = None, params={})`
- `fetch_withdrawal(self, id: str, code: Str = None, params={})`
- `fetch_withdrawals(self, code: Str = None, since: Int = None, limit: Int = None, params={})`
- `fetch_withdrawal_whitelist(self, params={})`

#### Order Modifications
- `cancel_all_orders(self, symbol: Str = None, params={})`
- `cancel_all_orders_after(self, timeout: int, params={})`
- `cancel_order(self, id: str, symbol: Str = None, params={})`
- `cancel_orders(self, ids: List[str], symbol: Str = None, params={})`
- `edit_order(self, id: str, symbol: str, type: OrderType, side: OrderSide, amount: Num = None, price: Num = None, params={})`

#### Position & Leverage
- `set_leverage(self, leverage: int, symbol: Str = None, params={})`
- `set_margin(self, symbol: str, amount: float, params={})`
- `set_margin_mode(self, marginMode: MarginMode, symbol: Str = None, params={})`
- `set_position_mode(self, hedged: bool, symbol: Str = None, params={})`

#### Transfer Operations
- `transfer(self, code: str, amount: float, fromAccount: str, toAccount: str, params={})`
- `transfer_in(self, code: str, amount: float, fromAccount: str, toAccount: str, params={})`
- `transfer_out(self, code: str, amount: float, fromAccount: str, toAccount: str, params={})`

#### Withdrawal
- `withdraw(self, code: str, amount: float, address: str, tag: Str = None, params={})`

---

## WebSocket Methods

### Public WebSocket Streams
- `watch_bids_asks(self, symbols: Strings = None, params={})`
- `watch_book_snapshot(self, symbol: str, limit: Int = None, params={})`
- `watch_liquidations(self, symbol: Str = None, params={})`
- `watch_liquidations_for_symbols(self, symbols: Strings = None, params={})`
- `watch_my_liquidations(self, symbol: Str = None, params={})`
- `watch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params={})`
- `watch_ohlcv(self, symbol: str, timeframe: str = '1m', since: Int = None, limit: Int = None, params={})`
- `watch_ohlcv_for_symbols(self, symbolsAndTimeframes: List[List[str]], params={})`
- `watch_order_book(self, symbol: str, limit: Int = None, params={})`
- `watch_order_book_for_symbols(self, symbols: Strings, limit: Int = None, params={})`
- `watch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params={})`
- `watch_position(self, symbol: Str = None, params={})`
- `watch_positions(self, symbols: Strings = None, params={})`
- `watch_status(self, params={})`
- `watch_ticker(self, symbol: str, params={})`
- `watch_tickers(self, symbols: Strings = None, params={})`
- `watch_trades(self, symbol: str, since: Int = None, limit: Int = None, params={})`
- `watch_trades_for_symbols(self, symbols: Strings, since: Int = None, limit: Int = None, params={})`

---

## Features

| Feature | Supported |
|---------|-----------|
| Sync REST API | ✅ |
| Async REST API | ✅ |
| WebSocket (Public) | ✅ |
| WebSocket (Private) | ✅ |
| Spot Trading | ✅ |
| Margin Trading | ✅ |
| Futures Trading | ✅ |
| Options Trading | ✅ |
| Unified Account | ✅ |

---

## Requirements

- Python >= 3.8

## License

MIT License

## Maintainers

- carlosmiei
- ttodua
- x84

## Author

CCXT (info@ccxt.trade)

---

## Related Repositories

- [GitHub Repository](https://github.com/ccxt/bybit-python)
- [CCXT Library](https://github.com/ccxt/ccxt)
