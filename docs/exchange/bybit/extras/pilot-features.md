# Pilot Features

> Source: https://bybit-exchange.github.io/docs/pilot-feature

---

**On this page
# Pilot Features

## Launch USDT Futures and USDT settled Options​

- Available date: Testnet - alive, Mainnet - 11 Feb & 12 Feb 2025
- Cover: Unified Trading Account
- Details: Gradully change the settlement currency from USDC to USDT for linear Futures and Options, refer to announcement

## Inverse Contract Upgrade​

- Available date: Testnet - alive, Mainnet - 13 Sep 2024 (gradully released)
- Cover: Unified Trading Account
- Details: 1. Upgrade inverse derivatives account to Unified Trading.2. Refer to Different Account Modes

## Open API Supports Demo Trading​

- Available date: Testnet - alive, Mainnet - 3 Apr 2024
- Cover: demo trading account
- Details: You can refer to this page to start demo trading API

## Websocket Place Order Feature​

- Available date: Testnet - alive, Mainnet - TBD
- Cover: UTA Spot/Linear/Option
- Details: You can use websocket to place/amend/cancel the order

## Batch APIs are ready for Spot​

- Available date: Testnet - alive, Mainnet - 5 Mar 2024
- Cover: UTA Spot
- Details: You can use batch API to start Spot trading

## Spot supports bidirectional Tp/Sl​

- Available date: Testnet - alive, Mainnet - 15 Jan 2024
- Cover: UTA Spot
- Details: You can set takeProfit, stopLoss when creating Spot order

## Spot Hedging Feature Is Available​

- Available date: Testnet - alive, Mainnet - 16 Nov 2023
- Cover: Unified account - Portfolio Margin mode
- Details: You can enable Spot Hedging function for Portfolio Margin via Set Spot Hedging

## Spot Supports Amend Order​

- Available date: Testnet - alive, Mainnet - 1 Nov 2023
- Cover: Classic & Unified account Spot
- Details: You can amend your spot orders via Amend Order

## Unified Account Spot Stop Orders logic is changed​

- Available date: Testnet - alive, Mainnet - 26 Oct 2023 (grey scale period, all are effective est. 2th Nov 2023)
- Cover: Unified account Spot Stop Orders
- Details: Once the TP/SL order or Conditional order is triggered, the order ID will be kept the same

## UTA Pro Batch Feature​

- Available date: Testnet - alive, Mainnet - 31 Aug 2023
- Cover: UTA Pro, USDT Perpetual, USDC Perpetual & USDC Futures (linear)
- Details: UTA Pro user can batch create/amend/cancel linear orders

Sample code
- Batch Create
- Batch Amend
- Batch Cancel

```
POST https://api-testnet.bybit.com/v5/order/create-batch

> Request Body
{
    "category": "linear",
    "request": [
        {

            "symbol": "BTCUSDT",
            "orderType": "Limit",
            "side": "Buy",
            "qty": "0.1",
            "price": "25500",
            "timeInForce": "GTC",
            "orderLinkId": "test-03",
            "reduceOnly": false,
            "tpslMode": "Full",
            "takeProfit": "26300",
            "stopLoss": "24800",
            "triggerDirection": null,
            "triggerPrice": null,
            "triggerBy": null,
            "positioIdx": 0,
            "smpType": null,
            "tpLimitPrice": null,
            "slLimitPrice": null,
            "slOrderType": null,
            "tpOrderType": null

        },
        {

            "symbol": "ETHUSDT",
            "orderType": "Limit",
            "side": "Buy",
            "qty": "0.1",
            "price": "1550",
            "timeInForce": "GTC",
            "orderLinkId": "test-04",
            "reduceOnly": false,
            "tpslMode": "Full",
            "takeProfit": "1680",
            "stopLoss": "1490",
            "triggerDirection": null,
            "triggerPrice": null,
            "triggerBy": null,
            "positioIdx": 0,
            "smpType": null,
            "tpLimitPrice": null,
            "slLimitPrice": null,
            "slOrderType": null,
            "tpOrderType": null
        }
    ]
}
> Response
{
    "retCode": 0,
    "retMsg": "OK",
    "result": {
        "list": [
            {
                "category": "linear",
                "symbol": "BTCUSDT",
                "orderId": "6afd7e83-7176-4f73-93e0-44a8f2babd14",
                "orderLinkId": "test-03",
                "createAt": "1693212677410"
            },
            {
                "category": "linear",
                "symbol": "ETHUSDT",
                "orderId": "9eeef30c-c682-42b2-a4a7-7e403db8506c",
                "orderLinkId": "test-04",
                "createAt": "1693212677410"
            }
        ]
    },
    "retExtInfo": {
        "list": [
            {
                "code": 0,
                "msg": "OK"
            },
            {
                "code": 0,
                "msg": "OK"
            }
        ]
    },
    "time": 1693212677411
}

```

```
POST https://api-testnet.bybit.com/v5/order/amend-batch

> Request Body
{
    "category": "linear",
    "request": [
        {
            "symbol": "BTCUSDT",
            "orderType": "Limit",
            "qty": "0.05",
            "price": "25800",
            "orderId": "6afd7e83-7176-4f73-93e0-44a8f2babd14"
        },
        {
            "symbol": "ETHUSDT",
            "orderType": "Limit",
            "qty": "0.05",
            "price": "1495",
            "orderId": "9eeef30c-c682-42b2-a4a7-7e403db8506c"
        }
    ]
}
> Response
{
    "retCode": 0,
    "retMsg": "OK",
    "result": {
        "list": [
            {
                "category": "linear",
                "symbol": "BTCUSDT",
                "orderId": "6afd7e83-7176-4f73-93e0-44a8f2babd14",
                "orderLinkId": "test-03"
            },
            {
                "category": "linear",
                "symbol": "ETHUSDT",
                "orderId": "9eeef30c-c682-42b2-a4a7-7e403db8506c",
                "orderLinkId": "test-04"
            }
        ]
    },
    "retExtInfo": {
        "list": [
            {
                "code": 0,
                "msg": "OK"
            },
            {
                "code": 0,
                "msg": "OK"
            }
        ]
    },
    "time": 1693212802143
}

```

```
POST https://api-testnet.bybit.com/v5/order/cancel-batch

> Request Body
{
    "category": "linear",
    "request": [
        {
            "symbol": "BTCUSDT",
            "orderId": "6afd7e83-7176-4f73-93e0-44a8f2babd14"
        },
        {
            "symbol": "ETHUSDT",
            "orderId": "9eeef30c-c682-42b2-a4a7-7e403db8506c"
        }
    ]
}
> Response
{
    "retCode": 0,
    "retMsg": "OK",
    "result": {
        "list": [
            {
                "category": "linear",
                "symbol": "BTCUSDT",
                "orderId": "6afd7e83-7176-4f73-93e0-44a8f2babd14",
                "orderLinkId": "test-03"
            },
            {
                "category": "linear",
                "symbol": "ETHUSDT",
                "orderId": "9eeef30c-c682-42b2-a4a7-7e403db8506c",
                "orderLinkId": "test-04"
            }
        ]
    },
    "retExtInfo": {
        "list": [
            {
                "code": 0,
                "msg": "OK"
            },
            {
                "code": 0,
                "msg": "OK"
            }
        ]
    },
    "time": 1693212965773
}

```

## Add Customised Disconnection Configuration​

- Available date: Testnet - alive, Mainnet - 16 Aug 2023
- Cover: All kinds of accounts - V5 Websocket Private Connection
- Details: Set `/v5/private?max_active_time=`, supported range is from `30s` to `600s`. For more info, please check here

## Adjust error code​

- Available date: Testnet - alive, Mainnet - 14 Aug 2023
- Cover: Toggle Margin Trade, Set Leverage,
Set Margin ModeSet Margin Mode
- Details: If ins loan account has a liquidation, the error while calling relative API is changed.

| Old error code | New error code | Msg |
| --- | --- | --- |
| 3400128 | 3200320 | Operations Restriction: The current LTV ratio of your Institutional Loan has hit the liquidation threshold. Assets in your account are being liquidated. |
| 176036 | 3200320 | Operations Restriction: The current LTV ratio of your Institutional Loan has hit the liquidation threshold. Assets in your account are being liquidated. |

## UTA borrow quota is shared across main-sub uids​

- Available date: Testnet - alive, Mainnet - 11 Aug 2023
- Cover: UTA account
- Details: Before each uid has an independent borrow quota, but now, main-sub uids share the same borrow quota

## UTA user can set collateral coin​

- Available date: Testnet - alive, Mainnet - 10 Aug 2023
- Cover: UTA account
- Details: User can set collateral coin via API

## User can upgrade account to UTA Pro manually​

- Available date: Testnet - alive, Mainnet - 08 Aug 2023
- Cover: Normal account, UTA account
- Details: User can upgrade account to UTA Pro via API

## OpenAPI supports Spot Conditional Order​

- Available date: Testnet - alive, Mainnet - 07 Aug 2023
- Cover: Normal account, UTA account
- Details: User can place Spot conditional order

## UTA Supports Institutional Lending​

- Available date: Testnet - alive, Mainnet - 24 July 2023
- Cover: UTA
- Details: UTA can have OTC loan

## Support Funding For USDC Perp​

- Available date: Testnet - alive, Mainnet - 13 July 2023
- Cover: UTA USDC Perpetual
- Details: There was no `execType=Funding` in Get Trade History and websocket `execution` stream update. Now you will it.

## New Copy Trading​

- Available date: Testnet - alive, Mainnet - 24 June 2023
- Cover: Copy trading
- Details: Bybit will release uids that allow upgrades in batches starting from 23 June, and if you select to upgrade it, you can only use V5 to copy trade

## Unified Account Supports Isolated Margin And Hedge Mode​

- Available date: Testnet - alive, Mainnet - 1 June 2023
- Cover: Unified trading account only
- Details: Isolated margin mode for UTA is account level. Hedge mode supports USDT perpetual only

## New TP/SL​

- Available date: Testnet - alive, Mainnet - 23 May 2023
- Cover: V5 API
- Details: UTA account: USDT Perpetual, USDC Perpetual and Futures, Inverse contract, Inverse contract Normal account: USDT Perpetual, Inverse contract

## Query Pre-upgrade Records​

- Available date: Testnet - alive, Mainnet - 27 Apr 2023
- Cover: UTA account
- Details: After upgraded to UTA, you can get those order information before upgraded.

## C2C Lending (Abandoned)​

- Available date: Testnet - alive, Mainnet - 22 Apr 2023
- Cover: All users (grey scale in the progress right now)
- Details: You can lend your available assets to platform to earn yield

## Self Match Prevention​

- Available date: Testnet - alive, Mainnet - 20 Apr 2023
- Cover: read here
- Details: Support spot, futures and options

## Upgrade to UTA without closing positions​

- Available date: Testnet - alive, Mainnet - 04 Apr 2023
- Cover: Normal account is upgraded to Unified account
- Details: Do not need to close positions when upgrade. For more details. please refer to upgrade API information

## UTA can trade USDC Futures via V5​

- Available date: Testnet - alive, Mainnet - 20 Mar 2023
- Cover: Unified trading account users only
- Details: Add USDC Futures trading pair

## Institutional Lending V5 API​

- Available date: Testnet - alive, Mainnet - 13 Mar 2023
- Cover: Institutional clients who applied OTC
- Details: Clients can get LTV, lends and repayment information

## Normal account can trade Spot via V5​

- Available date: Testnet - alive, Mainnet - 10 Mar 2023
- Cover: Normal account
- Details: Use V5 API to trade Spot for normal account

## Unify symbol status enums​

- Available date: Testnet - alive, Mainnet - 10 Mar 2023
- Cover: /v5/market/instruments-info `status` field
- Details: Use `Trading`, `Closed`, `Settling`, `PreLaunch`, `Deliverying`

## Release V5 Margin trade (normal account) API​

- Available date: Testnet - alive, Mainnet - 3 Mar 2023
- Cover: Normal account can operate margin trade via V5
- Details: able to loan, repay margins with V5

## UTA can trade Inverse Contract​

- Available date: Testnet - alive, Mainnet - 21 Feb 2023
- Cover: UTA has ability to trade inverse contract via V5 API
- Details: Please note that inverse contract trade is conducted though the CONTRACT wallet

## Merge SPOT account into UNIFIED account(IMPORTANT)​

- Available date: est. March 3rd, 2023
- Cover: UTA users only
- Details: You need to adjust withdrawal logic by transfer funds to `FUND` account first, then call withdraw API

## Use RSA keys to authenticate​

- Available date: Testnet - alive, Mainnet - 21 Feb 2023
- Cover: All V3 & V5 the endpoints need authentication
- Details: Please refer to this guideline to have a quick start

## Add a new enum type for execType​

- Available date: Testnet - alive, Mainnet - 20 Feb 2023
- Cover: Contract V3 - Websocket private channel - execution topic
- Details: Funding execution stream will be pushed depending on the funding interval of the symbol.

## Normal account is supported by V5 API​

- Available date: Testnet - alive, Mainnet - 9 Feb 2023
- Cover: non-unified account can trade USDT perpetual and Inverse contract
- Details: After this release, you may get some 401 errors or 404 errors if you have following actions:

401**: You are using v1/v2 way to pass authentication params:

```
GET https://api.bybit.com/v5/position/list?api_key=xxx&category=linear&recv_window=5000&symbol=ETHUSDT&timestamp=1675929695887&sign=xxx**
```

You should pass them in the request header:

```
Host: api-testnet.bybit.com
-H 'X-BAPI-SIGN: XXXXXXXXXX' \
-H 'X-BAPI-API-KEY: xxxxxxxxxxxxxxxxxx' \
-H 'X-BAPI-TIMESTAMP: 1658384431891' \
-H 'X-BAPI-RECV-WINDOW: 5000'

```

404**: For below APIs, if you use unsuitable category, i.e., you use Normal account to access `category=option/spot`

- Get Open Orders
- Get Order History
- Get Position Info
- Get Trade History

## Adjust error code​

- Available date: Testnet - alive, Mainnet - 19 JAN 2023
- Cover: V5 Set Margin Mode
and V1-USDC Set Margin Mode
- Details:

| Old error code | New error code | Msg |
| --- | --- | --- |
| 3400045 | 110073 | Set margin mode failed |
| 340099 | 10016 | Server error |

## Add level 500 depth​

- Available date: Testnet - 13 JAN 2023, Mainnet - 16 JAN 2023
- Cover: V5 orderbook
- Details: Linear contract and inverse contract supports 500 depth, and the push frequency is 100ms.