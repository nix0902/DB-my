# Bybit Python SDK - Examples

> Source: https://github.com/ccxt/bybit-python

---

## Table of Contents

1. [Sync Example](#sync-example)
2. [Async Example](#async-example)
3. [WebSocket Example](#websocket-example)
4. [Authentication](#authentication)
5. [Common Operations](#common-operations)

---

## Sync Example

```python
import os
import sys

root = os.path.dirname(os.path.dirname((os.path.abspath(__file__))))
sys.path.append(root + '/')

from bybit import BybitSync


def main():
    instance = BybitSync({})
    instance.load_markets()
    symbol = "BTC/USDC"

    # fetch ticker
    ticker = instance.fetch_ticker(symbol)
    print(ticker)

    # create order
    order = instance.create_order("BTC/USDC", "limit", "buy", 1, 123456.789)
    print(order)

main()
```

---

## Async Example

```python
import os
import sys
import asyncio

# if CCXT is included locally
# sys.path.append(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))) + '/')

from bybit import BybitAsync

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = BybitAsync({})
    await instance.load_markets()
    symbol = "BTC/USDC"

    # fetch ticker
    ticker = await instance.fetch_ticker(symbol)
    print(ticker)

    # create order
    order = await instance.create_order("BTC/USDC", "limit", "buy", 1, 123456.789)
    print(order)

    # close after you finish
    await instance.close()

asyncio.run(main())
```

---

## WebSocket Example

```python
import os
import sys
import asyncio

# if CCXT is included locally
# sys.path.append(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))) + '/')

from bybit import BybitWs

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def my_watch_ticker(exchange, symbol):
    while True:
        result = await exchange.watch_ticker(symbol)
        print(result)


async def my_watch_orderbook(exchange, symbol):
    while True:
        result = await exchange.watch_order_book(symbol)
        print(result)


async def main():
    instance = BybitWs({})
    await instance.load_markets()
    symbol = "BTC/USDC"

    # watch ticker
    ticker = my_watch_ticker(instance, symbol)

    # watch orderbook
    ob = my_watch_orderbook(instance, symbol)
   
    await asyncio.gather(ticker, ob)

    # close after you finish
    await instance.close()


asyncio.run(main())
```

---

## Authentication

### API Key Configuration

```python
from bybit import BybitSync

# Public API (no authentication needed)
instance = BybitSync({})

# Private API (authentication required)
instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
})

# Testnet
instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
    'sandboxMode': True,  # Use testnet
})
```

### Async Authentication

```python
from bybit import BybitAsync

async def main():
    instance = BybitAsync({
        'apiKey': 'YOUR_API_KEY',
        'secret': 'YOUR_API_SECRET',
    })
    
    # Your operations here
    
    await instance.close()

asyncio.run(main())
```

---

## Common Operations

### Market Data

```python
from bybit import BybitSync

instance = BybitSync({})
instance.load_markets()

# Get ticker
ticker = instance.fetch_ticker("BTC/USDT")
print(ticker)

# Get order book
orderbook = instance.fetch_order_book("BTC/USDT", limit=50)
print(orderbook)

# Get recent trades
trades = instance.fetch_trades("BTC/USDT", limit=100)
print(trades)

# Get OHLCV (candlestick data)
ohlcv = instance.fetch_ohlcv("BTC/USDT", "1h", limit=100)
print(ohlcv)

# Get all tickers
tickers = instance.fetch_tickers()
print(tickers)
```

### Account Operations

```python
from bybit import BybitSync

instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
})

# Get balance
balance = instance.fetch_balance()
print(balance)

# Get open orders
orders = instance.fetch_open_orders("BTC/USDT")
print(orders)

# Get order history
history = instance.fetch_orders("BTC/USDT")
print(history)

# Get my trades
trades = instance.fetch_my_trades("BTC/USDT")
print(trades)
```

### Order Management

```python
from bybit import BybitSync

instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
})

# Create limit order
order = instance.create_order(
    symbol="BTC/USDT",
    type="limit",
    side="buy",
    amount=0.001,
    price=50000
)
print(order)

# Create market order
order = instance.create_order(
    symbol="BTC/USDT",
    type="market",
    side="sell",
    amount=0.001
)
print(order)

# Cancel order
result = instance.cancel_order(order_id, "BTC/USDT")
print(result)

# Cancel all orders
result = instance.cancel_all_orders("BTC/USDT")
print(result)

# Edit order
result = instance.edit_order(
    id=order_id,
    symbol="BTC/USDT",
    type="limit",
    side="buy",
    amount=0.002,
    price=49000
)
print(result)
```

### Position Management (Futures)

```python
from bybit import BybitSync

instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
})

# Set leverage
result = instance.set_leverage(10, "BTC/USDT:USDT")
print(result)

# Get positions
positions = instance.fetch_positions(["BTC/USDT:USDT"])
print(positions)

# Get position
position = instance.fetch_position("BTC/USDT:USDT")
print(position)

# Set margin mode
result = instance.set_margin_mode("isolated", "BTC/USDT:USDT")
print(result)
```

### WebSocket Streams

```python
from bybit import BybitWs
import asyncio

async def main():
    instance = BybitWs({})
    await instance.load_markets()
    
    # Watch order book
    while True:
        ob = await instance.watch_order_book("BTC/USDT")
        print(f"Order book: {ob}")
        
    await instance.close()

asyncio.run(main())
```

### Watch Multiple Symbols

```python
from bybit import BybitWs
import asyncio

async def main():
    instance = BybitWs({})
    await instance.load_markets()
    
    symbols = ["BTC/USDT", "ETH/USDT", "XRP/USDT"]
    
    async def watch_orderbooks():
        while True:
            ob = await instance.watch_order_book_for_symbols(symbols)
            print(ob)
    
    async def watch_tickers():
        while True:
            tickers = await instance.watch_tickers(symbols)
            print(tickers)
    
    await asyncio.gather(watch_orderbooks(), watch_tickers())
    await instance.close()

asyncio.run(main())
```

---

## Error Handling

```python
from bybit import BybitSync
import ccxt

instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
})

try:
    order = instance.create_order(
        symbol="BTC/USDT",
        type="limit",
        side="buy",
        amount=0.001,
        price=50000
    )
except ccxt.InsufficientFunds as e:
    print(f"Insufficient funds: {e}")
except ccxt.InvalidOrder as e:
    print(f"Invalid order: {e}")
except ccxt.RateLimitExceeded as e:
    print(f"Rate limit exceeded: {e}")
except ccxt.ExchangeError as e:
    print(f"Exchange error: {e}")
```

---

## Rate Limiting

The SDK automatically handles rate limiting. You can also configure custom rate limits:

```python
from bybit import BybitSync

instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
    'enableRateLimit': True,  # Enable rate limiting (default: True)
})
```

---

## Pagination

```python
from bybit import BybitSync

instance = BybitSync({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_API_SECRET',
})

# Fetch orders with pagination
since = instance.milliseconds() - 86400000  # 24 hours ago
all_orders = []
limit = 50

while True:
    orders = instance.fetch_orders("BTC/USDT", since=since, limit=limit)
    if len(orders) == 0:
        break
    all_orders.extend(orders)
    since = orders[-1]['timestamp'] + 1

print(f"Total orders: {len(all_orders)}")
```

---

## Sandbox/Testnet Mode

```python
from bybit import BybitSync

# Use testnet
instance = BybitSync({
    'apiKey': 'YOUR_TESTNET_API_KEY',
    'secret': 'YOUR_TESTNET_API_SECRET',
    'sandboxMode': True,
})
```

---

## Additional Resources

- [CCXT Documentation](https://docs.ccxt.com/)
- [Bybit API Documentation](https://bybit.com/apidocs1)
- [GitHub Repository](https://github.com/ccxt/bybit-python)
- [PyPI Package](https://pypi.org/project/bybit-api)
