# Bybit API Documentation

> Auto-generated from https://bybit-exchange.github.io/docs/

---

## Overview

This directory contains comprehensive documentation for the Bybit exchange API, including:

- **V5 API** - Latest unified API for Spot, Derivatives, and Options trading
- **P2P Trading** - Peer-to-peer trading endpoints
- **Tax API V3** - Tax reporting API
- **Extras** - Changelog, FAQ, and pilot features

---

## V5 API

### Core Documentation

- [Introduction](./v5-api/introduction.md)
- [Integration Guidance](./v5-api/integration-guidance.md)
- [Get Announcement](./v5-api/get-announcement.md)
- [Self Match Prevention](./v5-api/self-match-prevention.md)
- [Copy Trading](./v5-api/copy-trading.md)
- [Demo Trading](./v5-api/demo-trading.md)
- [System Status](./v5-api/system-status.md)
- [Enums Definitions](./v5-api/enums-definitions.md)
- [Error Codes](./v5-api/error-codes.md)

### Market Data

- [Server Time](./v5-api/market/server-time.md)
- [Instrument Info](./v5-api/market/instrument-info.md)
- [Kline (Candlestick)](./v5-api/market/kline.md)
- [Mark Kline](./v5-api/market/mark-kline.md)
- [Index Kline](./v5-api/market/index-kline.md)
- [Tickers](./v5-api/market/tickers.md)
- [Orderbook](./v5-api/market/orderbook.md)
- [Public Trading Records](./v5-api/market/public-trading-records.md)
- [Insurance](./v5-api/market/insurance.md)
- [Funding Rate History](./v5-api/market/funding-rate-history.md)
- [Delivery Price](./v5-api/market/delivery-price.md)

### Trade

- [Place Order](./v5-api/trade/place-order.md)
- [Amend Order](./v5-api/trade/amend-order.md)
- [Cancel Order](./v5-api/trade/cancel-order.md)
- [Open Orders](./v5-api/trade/open-orders.md)
- [Cancel All Orders](./v5-api/trade/cancel-all-orders.md)
- [Order History](./v5-api/trade/order-history.md)
- [Trade History](./v5-api/trade/trade-history.md)
- [Batch Place Order](./v5-api/trade/batch-place-order.md)
- [Set Leverage](./v5-api/trade/set-leverage.md)
- [Set TP/SL](./v5-api/trade/set-tp-sl.md)

### Position

- [Position List](./v5-api/position/position-list.md)
- [Trading Fee](./v5-api/position/trading-fee.md)
- [Position Margin](./v5-api/position/position-margin.md)

### Account

- [Wallet Balance](./v5-api/account/wallet-balance.md)
- [Fee Rate](./v5-api/account/fee-rate.md)
- [Transaction Log](./v5-api/account/transaction-log.md)
- [Contract Transaction](./v5-api/account/contract-transaction.md)
- [API Key Info](./v5-api/account/api-key-info.md)

### Asset

- [Delivery Record](./v5-api/asset/delivery-record.md)
- [Settlement Record](./v5-api/asset/settlement-record.md)
- [Deposit Record](./v5-api/asset/deposit-record.md)
- [Withdraw](./v5-api/asset/withdraw.md)

### User

- [Sub API](./v5-api/user/sub-api.md)
- [Sub UID](./v5-api/user/sub-uid.md)

### Institutional Loan

- [Product Info](./v5-api/institutional-loan/product-info.md)
- [Borrow](./v5-api/institutional-loan/borrow.md)
- [Repay](./v5-api/institutional-loan/repay.md)
- [Assoc UID](./v5-api/institutional-loan/assoc-uid.md)

### Broker

- [Account](./v5-api/broker/account.md)
- [Earnings](./v5-api/broker/earnings.md)

---

## P2P Trading

- [Guide](./p2p-trading/guide.md)
- [Online](./p2p-trading/online.md)
- [Offline](./p2p-trading/offline.md)

---

## Tax API V3

- [Introduction](./tax-api-v3/introduction.md)

---

## Extras

- [Pilot Features](./extras/pilot-features.md)
- [V5 Changelog](./extras/v5-changelog.md)
- [FAQ](./extras/faq.md)

---

## Official Resources

- 📌 [Help Center](https://www.bybit.com/en-US/help-center/bybitHC_Guides?language=en_US)
- 🎉 [Official Python SDK (GitHub)](https://github.com/bybit-exchange/pybit)
- 📁 [Official Python SDK (Local)](./pybit/) - Клонированный репозиторий pybit
- 🎉 [Official Go SDK (GitHub)](https://github.com/bybit-exchange/bybit.go.api)
- 📁 [Official Go SDK (Local)](./bybit.go.api/) - Клонированный репозиторий bybit.go.api
- 🎉 [Official Java SDK (GitHub)](https://github.com/bybit-exchange/bybit-java-api)
- 📁 [Official Java SDK (Local)](./bybit-java-api/) - Клонированный репозиторий bybit-java-api
- 🎉 [Official .NET SDK](https://github.com/bybit-exchange/bybit.net.api)
- 🎉 [Community Node.js SDK (GitHub)](https://github.com/tiagosiebler/bybit-api)
- 📁 [Community Node.js SDK (Local)](./bybit-api-nodejs/) - Клонированный репозиторий bybit-api (Node.js)
- 📁 [Python SDK (PyPI - bybit-api)](./bybit-python/) - Документация Python SDK (bybit-api)
- ✉️ [Telegram - API Discussion Group](https://t.me/BybitAPI)
- ✉️ [Discord](https://discord.gg/3ZDjGBNvKR)
- 💡 [Postman Collection (GitHub)](https://github.com/bybit-exchange/QuickStartWithPostman)
- 📁 [Postman Collection (Local)](./QuickStartWithPostman/) - Клонированный репозиторий с Postman коллекциями
- 💡 [API Usage Examples (GitHub)](https://github.com/bybit-exchange/api-usage-examples)
- 📁 [API Usage Examples (Local)](./api-usage-examples/) - Клонированный репозиторий с примерами кода

---

## API Endpoints

### Testnet
```
https://api-testnet.bybit.com
```

### Mainnet
```
https://api.bybit.com
https://api.bytick.com
```

### Regional Endpoints
- **Netherlands**: `https://api.bybit.nl`
- **Turkey**: `https://api.bybit-tr.com`
- **Kazakhstan**: `https://api.bybit.kz`
- **Georgia**: `https://api.bybitgeorgia.ge`
- **UAE**: `https://api.bybit.ae`
- **EEA**: `https://api.bybit.eu`
- **Indonesia**: `https://api.bybit.id`

---

## Authentication

The following HTTP headers are required for authenticated endpoints:

- `X-BAPI-API-KEY` - API key
- `X-BAPI-TIMESTAMP` - UTC timestamp in milliseconds
- `X-BAPI-SIGN` - Request signature
- `X-BAPI-RECV-WINDOW` - Request validity window (default: 5000ms)

---

*Last updated: $(date)*
