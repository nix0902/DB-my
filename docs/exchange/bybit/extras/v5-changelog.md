# V5

> Source: https://bybit-exchange.github.io/docs/changelog/v5

---

**On this page
# V5

## 2026-03-06​

### REST API​

- Asset Overview [NEW]Add a new endpoint to query master account or subaccount's total assets and detailed asset holdings across different accounts and product categories

[Funding Account Transaction History](https://bybit-exchange.github.io/docs/v5/asset/fund-history) [NEW]
- Add a new endpoint to query transaction log in Funding Account, supporting filtering by transaction type and time range

## 2026-03-05​

### REST API​

- Sign Agreement [NEW]Add a new endpoint to sign the trading agreement

## 2026-03-03​

### REST API​

- Get Friend Referrals [NEW]Add a new endpoint to query the frend's invitee data

## 2026-02-12​

### REST API​

- Get Fee Group Structure [UPDATE]Split the USDC contracts into a new fee group `groupId`="8"

## 2026-02-10​

### REST API​

- Set Rate Limit [NEW]Add new endpoint to support exchange broker to set the rate limit for its sub account

[Get Rate Limit Cap](https://bybit-exchange.github.io/docs/v5/broker/exchange-broker/rate-limit/query-cap) [NEW]
- Add new endpoint to query the EB cap once specially configured.

[Get All Rate Limits](https://bybit-exchange.github.io/docs/v5/broker/exchange-broker/rate-limit/query-all) [NEW]
- Add new endpoint to query all configured rate limit data

[Modify Master API Key](https://bybit-exchange.github.io/docs/v5/user/modify-master-apikey) [UPDATE]
- Remove request fields "ips", modifying, adding, or deleting IP addresses via API is prohibited.
- For Read_Write apikey, adding or deleting FiatP2P, FiatBybitPay, and FiatConvertBroker is prohibited.

[Spot DMM Listing Integration](https://bybit-exchange.github.io/docs/institutional/dmm-listing/spot) [NEW]
- Add Spot DMM listing integration description

## 2026-02-04​

### REST API​

- Get Affiliate User List [UPDATE]Add new response fields "tradfiTradeVol", "tradfiTradeVol30Day", "tradfiTradeVol365Day", "commissionsVol", "commissions30Day", "commissions365Day"

[Get Affiliate User Info](https://bybit-exchange.github.io/docs/v5/affiliate/affiliate-info) [UPDATE]
- Add new response fields "tradfiTradeVol30Day", "tradfiTradeVol365Day", "commissions30Day", "commissions365Day"

## 2026-01-28​

### REST API​

- Upgrade to Unified Account Pro [UPDATE]New threshold restrictions added for UTA users upgrading to PRO.

## 2026-01-16​

### REST API​

- Obtain Max Loan Amount [NEW]Add a new endpoint to check the maximum borrowable amount & remaining individual platform limit for crypto loans.

## 2026-01-13​

### REST API​

- Get Trade History [UPDATE]Add new request param "settleCoin" for `linear`,`inverse`,`option`

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- Add new response field "breakEvenPrice" for `linfear`,`inverse`

### WebSocket API​

- Position [UPDATE]Add new response fields `breakEvenPrice` for `linear`,`inverse`

## 2026-01-08​

### REST API​

- Repay [NEW]Add a new endpoint that allows INS loan clients to repay their loans independently.

## 2026-01-07​

### REST API​

- Get Open Orders [UPDATE]add `parentOrderLinkId` response field for take profit & stop loss orders to link its parent order.

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- add `parentOrderLinkId` response field for take profit & stop loss orders to link its parent order.

### WebSocket API​

- Order [UPDATE]add `parentOrderLinkId` response field for take profit & stop loss orders to link its parent order.

## 2026-01-06​

### REST API​

- Set Auto Repay Mode [NEW]Add new endpoint to set spot automatic repayment mode

[Get Auto Repay Mode](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/get-auto-repay-mode) [NEW]
- Add new endpoint to get spot automatic repayment mode

## 2026-01-05​

### REST API​

- Withdraw [UPDATE]For beneficiary information, add `beneficiaryTransactionPurpose`, `beneficiaryRepresentativeFirstName`, `beneficiaryRepresentativeLastName` mandatory required parameters when withdraw to company account via Krean CODE channel

## 2025-12-25​

### REST API​

- Get LTV [UPDATE]Add new field `liqStatus`

## 2025-12-24​

### REST API​

- Fiat Convert [NEW]Added Fiat Conversion Feature

## 2025-12-23​

- Convert Small Balances [NEW]Added Convert Small Balances Feature

## 2025-12-18​

### REST API​

- Accept non-LP Quote[NEW]Add new endpoint for accept non-LP Quote

[Get RFQs (real-time)](https://bybit-exchange.github.io/docs/v5/rfq/trade/rfq-realtime)[UPDATE]
- Add new response filed `acceptOtherQuoteStatus`

[Get RFQs](https://bybit-exchange.github.io/docs/v5/rfq/trade/rfq-list)[UPDATE]
- Add new response filed `acceptOtherQuoteStatus`

[Get ADL Alert](https://bybit-exchange.github.io/docs/v5/market/adl-alert) [UPDATE]
- For shared insurance pool, the "balance" field will follow a T+1 refresh mechanism and will be updated daily at 00:00 UTC.
- The "maxBalance" field will be deprecated and will return an empty string.

[Manual Repay](https://bybit-exchange.github.io/docs/v5/account/repay) [UPDATE]
- MNT will temporarily not be used for repayment, and repaying MNT liabilities through convert-repay is not supported. However, you may still use Manual Repay Without Asset Conversion to repay MNT using your existing balance.

### WebSocket API​

- ADL Alert [UPDATE]For shared insurance pool, the "b" field will follow a T+1 refresh mechanism and will be updated daily at 00:00 UTC.
- The "mb" field will be deprecated and will return an empty string.

[RFQ](https://bybit-exchange.github.io/docs/v5/rfq/websocket/private/inquiry) [UPDATE]
- Add new response filed `acceptOtherQuoteStatus`

## 2025-12-16​

- SBE Level 50 Integration [UPDATE]SBE Level 50 for Futures will be released on the mainnet at 7:00 AM (UTC+0) on December 16th

## 2025-12-02​

### SBE API​

- SBE Basic Info [NEW]Add SBE basic information description

[SBE BBO Integration](https://bybit-exchange.github.io/docs/v5/sbe/bbo/sbe-bbo) [NEW]
- Add SBE BBO market data endpoint
- SBE BBO for Spot was released on the mainnet on  September 18th
- SBE BBO for Futures was released on the mainnet on  November 4th

[SBE Level 50 Integration](https://bybit-exchange.github.io/docs/v5/sbe/level-50/sbe-level-50) [NEW]
- Add SBE Level 50 market data endpoint
- SBE Level 50 for Spot was released on the mainnet at 7:00 AM (UTC+0) on December 2nd

## 2025-11-27​

### REST API​

- Renew Borrow Order [NEW]Add new endpoint to Renew fixed crypto loan

[Get Renew Order Info](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/fixed/renew-order) [NEW]
- Add new endpoint to get renew fixed crypto loan info

## 2025-11-25​

### REST API​

- Get Instruments Info [UPDATE]Add new response field `skipCallAuction` for USDT pre-market contract

[Get Account Instruments Info](https://bybit-exchange.github.io/docs/v5/account/instrument) [UPDATE]
- Add new response field `skipCallAuction` for USDT pre-market contract

### Websocket API​

- Orderbook [UPDATE]The push frequency of Orderbook Level 1000 data is changed from 300ms to 200ms.

## 2025-11-17​

### REST API​

- We have deprecated the Legacy Crypto Loan Borrow API, since the new crypto loan service is now online.Legacy Crypto Loan Borrow

## 2025-11-13​

### REST API​

- Get Transaction Log [UPDATE]Add new request param `transSubType`, it is used to filter Move Position trans log only.

## 2025-11-11​

### REST API​

- Get Instruments Info [UPDATE]Add new response field `postOnlyMaxLimitOrderSize` for spot, each trading pair has its own configuration defining the maximum limit order size for Post-only and RPI orders

[Get Account Instruments Info](https://bybit-exchange.github.io/docs/v5/account/instrument) [UPDATE]
- Add new response field `postOnlyMaxLimitOrderSize` for spot, each trading pair has its own configuration defining the maximum limit order size for Post-only and RPI orders

## 2025-11-04​

### REST API​

- Place Order [UPDATE]Option trading supports `slippageToleranceType`

[Get Public Trades](https://bybit-exchange.github.io/docs/v5/market/recent-trade) [UPDATE]
- The interval between the order transaction's startTime and endTime has been changed from 7 days to 30 days

### Websocket API​

- Tickers [UPDATE]Spot Push frequency changes from Real-time to 50ms

## 2025-11-03​

### REST API​

- Manual Repay Without Asset Conversion [NEW]Add a new endpoint to manual repay without asset conversion

## 2025-10-23​

### REST API​

- Manual Borrow [NEW]Add a new endpoint for UTA manual borrow

[Get Max Borrowable Amount](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/max-borrowable) [NEW]

- Add a new endpoint to get max borrowable amount

[Get Position Tiers](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/position-tiers) [NEW]

- Add a new endpoint to get loan position risk information.

[Set Leverage](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/set-leverage) [UPDATE]

- Add a new input parameter `currency` to set leverage by `currency`

[Get Coin State](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/coinstate) [NEW]

- Add a new endpoint to get currency leverage information

[Get Available Amount to Repay](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/repayment-available-amount) [NEW]

- Add a new endpoint to get available amount to repay

[Get Transaction Log](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]

- Add new type Enums `MANUAL_LOANS_BORROW`, `MANUAL_LOANS_REPAY`, `AUTO_LOANS_BORROW`, `AUTO_LOANS_REPAY`

[Get Tickers](https://bybit-exchange.github.io/docs/v5/market/tickers) [UPDATE]

- Add new response fields  `basisRateYear`, `fundingIntervalHour`, `fundingCap`

## 2025-10-22​

### REST API​

- Get Affiliate User List [UPDATE]Add new request fields `startDate`, `endDate`
- Add new response fields `takerVol`, `makerVol`, `tradeVol`, `startDate`, `endDate`

## 2025-10-21​

### REST API​

- Get Withdrawal Address List [NEW]We have launched a new endpoint to query the withdrawal addresses in the address book.

[Get Instruments Info](https://bybit-exchange.github.io/docs/v5/market/instrument) [UPDATE]

- Add `symbolType` request parameter to filter instrument records for`spot`
- Add new response field `forbidUplWithdrawal`

[Get Account Instruments Info](https://bybit-exchange.github.io/docs/v5/account/instrument) [NEW]

- Add category = `spot` to support querying `spot` instruments

[Place Order](https://bybit-exchange.github.io/docs/v5/order/create-order) [UPDATE]

- Add new input parameters `bboSideType`, `bboLevel` to suppot to place a BBO order

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]

- `createType` has new enumeration value: `CreateByBboOrder`, used to indicate BBO Order

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]

- `createType` has new enumeration value: `CreateByBboOrder`, used to indicate BBO Order

### WebSocket API​

- Order [UPDATE]`createType` has new enumeration value: `CreateByBboOrder`, used to indicate BBO Order

[Execution](https://bybit-exchange.github.io/docs/v5/websocket/private/execution) [UPDATE]
- `createType` has new enumeration value: `CreateByBboOrder`, used to indicate BBO Order

## 2025-10-16​

### REST API​

- Get Account Instruments Info [NEW]This new endpoint supports querying whether the current account has trading permissions, whether it has RPI permissions, and whether the current symbol is among the public RPI symbols

[Get Flexible Loans](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/flexible/unpaid-loan-order) [UPDATE]
- Add response parameters `unpaidAmount`, `unpaidInterest`, to distinguish unpaid principal and unpaid interest from `totalDebt`

[Manual Repay](https://bybit-exchange.github.io/docs/v5/account/repay) [NEW]
- Add a new endpoint for UTA manual repay

### WebSocket API​

- Ticker [UPDATE]Add new response fields  `basisRateYear`, `fundingIntervalHour`, `fundingCap`

## 2025-10-14​

### REST API​

- Get Sub UID List (Limited) [UPDATE]Update response parameter `accountMode`, now support distinguish to Classic Account, UTA1.0, UTA1.0 Pro, UTA2.0, UTA2.0 Pro

[Get Sub UID List (Unlimited)](https://bybit-exchange.github.io/docs/v5/user/page-subuid) [UPDATE]
- Update response parameter `accountMode`, now support distinguish to Classic Account, UTA1.0, UTA1.0 Pro, UTA2.0, UTA2.0 Pro

## 2025-10-10​

### REST API​

- RFQ APIs and WebSockets [NEW]We have launched Bybit RFQ (Request for Quote). Please see our basic workflow and the help centre for details.

Earn API [NEW]
- Get Yield History
- Get Hourly Yield History

Earn API [UPDATE]
- Get Stake/Redeem Order History
- Add request parameters `productId`,`startTime`,`endTime`,`limit`,`cursor`  to support batch query of orders

## 2025-10-09​

### REST API​

- Place Order [UPDATE]The value range of `slippageTolerance` has been adjusted, where: `TickSize` has changed from [5, 2000] to [1, 10000],`Percent` has changed from [0.05, 1] to [0.01, 10]

[Get Instruments Info](https://bybit-exchange.github.io/docs/v5/market/instrument) [UPDATE]
- Add `symbolType` request parameter to filter instrument records, only for `linear`,`inverse`

[Get Instruments Info](https://bybit-exchange.github.io/docs/v5/market/instrument) [UPDATE]
- category=`spot` adds new response fields `maxLimitOrderQty`, `maxMarketOrderQty`, will becomes effective on Oct 16th, refer to the announcement to get more details

## 2025-09-28​

### REST API​

- Rate Limit [UPDATE]Set Rate LimitChange the input parameter `limit` to `rate`, and change the returned field `limit` to `rate`.

[Get Rate Limit](https://bybit-exchange.github.io/docs/v5/rate-limit/rules-for-pros/apilimit-query)
- Change returned field `limit` to `rate`.

[Rate Limit](https://bybit-exchange.github.io/docs/v5/rate-limit) [NEW]
- Add endpoints Get Rate Limit Cap and Get All Rate Limits

## 2025-09-25​

### REST API​

- Get Fee Group Structure [NEW]
- Get Instruments Info [UPDATE]category=`option`,`linear`,`spot` adds a new response field `symbolType`
- `innovation` field is deprecated, always `0`

## 2025-09-24​

### REST API​

- Create Borrow Order [UPDATE]Add a new input parameter `repayType`

[Get Borrow Contract Info](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/fixed/borrow-contract) [UPDATE]
- Add a new response field `repayType`

[Get Borrow Order Info](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/fixed/borrow-order) [UPDATE]
- Add a new response field `repayType`

[Get Repayment History](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/fixed/repay-history) [UPDATE]
- Add a new enum `8`(transfer to flexible loan) for field `repayType`

## 2025-09-23​

### REST API​

- Get ADL Alert [NEW]
- Get Index Price Components [NEW]

### WebSocket API​

- ADL Alert [NEW]Add new topic to push grouped insurance pool ADL alert and information

## 2025-09-18​

### REST API​

- Get RPI Orderbook [NEW]
- Get Open & Closed Orders [UPDATE]Add a new response field `cumFeeDetail` to return trading fee details instead of `cumExecFee`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Add a new response field `cumFeeDetail` to return trading fee details instead of `cumExecFee`

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- Response field `feeCurrency` supports derivatives trading

### WebSocket API​

- Execution [UPDATE]Add `feeCurrency` to return trading fee currency

[Order](https://bybit-exchange.github.io/docs/v5/websocket/private/order) [UPDATE]
- Add a new response field `cumFeeDetail` to return trading fee details instead of `cumExecFee` and `feeCurrency`

[Order](https://bybit-exchange.github.io/docs/v5/spread/websocket/private/order) [UPDATE]
- Add a new response field `cumFeeDetail` to return trading fee details instead of `cumExecFee` and `feeCurrency`

## 2025-09-16​

### REST API​

- Get Wallet Balance [UPDATE]Add new response fields: `spotBorrow`

### WebSocket API​

- Wallet [UPDATE]Add new response fields: `spotBorrow`

## 2025-09-15​

### REST API​

- Get Transaction Log [UPDATE]Add new type enums `PLATFORM_TOKEN_MNT_LIQRECALLEDMMNT`, `PLATFORM_TOKEN_MNT_LIQRETURNEDMNT`

## 2025-09-11​

### WebSocket API​

- Orderbook [REMOVE]Remove level 500 orderbooks for futures

## 2025-09-09​

### REST API​

- Cancel all [UPDATE]orderFilter adds a new enum value `StopOrder` for option product types

## 2025-09-08​

### REST API​

- Collateral Repayment [NEW]Add fixed collateral repayment endpoint

[Get Repayment History](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/fixed/repay-history) [UPDATE]
- Add a new repayType Enum `7: Repay by Currency` for current repayment records

[Collateral Repayment](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/flexible/repay-collateral) [NEW]
- Add flexible collateral repayment endpoint

[Get Repayment History](https://bybit-exchange.github.io/docs/v5/new-crypto-loan/flexible/repay-orders) [UPDATE]
- Add a new repayType Enum `7: Repay by Currency` for current repayment records

[Move Positions](https://bybit-exchange.github.io/docs/v5/position/move-position) [UPDATE]
- Newly add category = inverse, only supports UTA 2.0

## 2025-09-04​

### REST API​

- Get Limit Price Behaviour [NEW]Add a new endpoint to get configuration how the system behaves when your limit order price exceeds the highest bid or lowest ask price

## 2025-08-28​

### REST API​

- Get Risk Limit [UPDATE]Add support for querying risk limit tables of pre-market trading contract pairs

## 2025-08-26​

### REST API​

- Get New Delivery Price [NEW]Add a new endpoint to query historical option delivery price

[Stake / Redeem](https://bybit-exchange.github.io/docs/v5/earn/create-order) [UPDATE]

- Add a new input parameter `toAccountType`

## 2025-08-14​

### WebSocket API​

- Orderbook [UPDATE]Add level 1000 orderbooks for spot and futures

## 2025-08-13​

### REST API​

- Rate Limit [UPDATE]Add endpoints to set api rate limit and query api rate limit

## 2025-08-07​

### REST API​

- Get Recent Public Trades [UPDATE]Add a new response field `seq`

[Get Recent Public Trades](https://bybit-exchange.github.io/docs/v5/spread/market/recent-trade) [UPDATE]

- Add a new response field `seq` for spread trading

## 2025-08-06​

### REST API​

- Withdraw [UPDATE]Request parameter `accountType` becomes mandatory, and supports withdrawing from multiple wallets.

[Get Delay Withdraw Amount](https://bybit-exchange.github.io/docs/v5/asset/balance/delay-amount)

- Support returning UTA wallet balance

## 2025-08-05​

### Websocket API​

- Trade [UPDATE]Add `seq`
- Futures and Spot public trade message will be split into multiple messages when it exceeds 1024 trades

[Trade](https://bybit-exchange.github.io/docs/v5/spread/websocket/public/trade) [UPDATE]

- Add `seq` in spread trading
- Futures and Spot public trade message will be split into multiple messages when it exceeds 1024 trades

## 2025-07-31​

### REST API​

- Set Limit Price Behaviour [NEW]This endpoint is used to select the system behaviour when the limit order price exceeds the price boundary

## 2025-07-25​

### REST API​

- New Crypto Loan [UPDATE]Add new response fields: `flexibleAnnualizedInterestRate`,`annualizedInterestRate7D`,`annualizedInterestRate14D`,`annualizedInterestRate30D`,`annualizedInterestRate60D`,`annualizedInterestRate90D`,`annualizedInterestRate180D`

## 2025-07-22​

### REST API​

- Get Order History [UPDATE]Add new enum "VAT" for `extraFees` field for ARE VAT tax

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]

- Add new enum "VAT" for `extraFees` field for ARE VAT tax

[Get Transaction Log (UTA)](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]

- Add new enum "VAT" for `extraFees` field for ARE VAT tax

### Websocket API​

- RPI Orderbook [UPDATE]Support Perpetual & Futures

## 2025-07-17​

### REST API​

- New Crypto Loan [NEW]Crypto Loan (New) now is available

## 2025-07-16​

### REST API​

- Get Transaction Log (UTA) [UPDATE]Add new types `DEFI_INVESTMENT_SUBSCRIPTION`, `DEFI_INVESTMENT_REFUND`, `DEFI_INVESTMENT_REDEMPTION`

## 2025-07-15​

### Websocket API​

- RPI Orderbook [NEW]Add new topic to push the orderbook feed with RPI quote

## 2025-07-08​

### REST API​

- Get System Status [NEW]Add new endpoint to get system status

### Websocket API​

- Websocket GET System Status [NEW]Add new topic to get system status

## 2025-07-04​

### REST API​

- Add new api hostname `https://api.bybitgeorgia.ge` for Georgia users

### Websocket API​

- Add new stream hostname `wss://stream.bybitgeorgia.ge` for Georgia users

## 2025-07-03​

### REST API​

- Get Wallet Balance [UPDATE]Add new response fields: `totalMaintenanceMarginByMp`,`accountMMRateByMp`,`accountIMRateByMp`,`totalInitialMarginByMp`

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- Add new response fields: `positionIMByMp`,`positionMMByMp`

### Websocket API​

- Wallet [UPDATE]Add new fields: `accountIMRateByMp`,`accountMMRateByMp`,`totalInitialMarginByMp`,`totalMaintenanceMarginByMp`

[Position](https://bybit-exchange.github.io/docs/v5/websocket/private/position) [UPDATE]
- Add new fields: `positionIMByMp`,`positionMMByMp`

## 2025-06-30​

### REST API​

- Get Order History [UPDATE]Add new enum "GST" for `extraFees` field for Indian GST tax

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- Add new enum "GST" for `extraFees` field for Indian GST tax

[Get Transaction Log (UTA)](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]
- Add new enum "GST" for `extraFees` field for Indian GST tax

### Websocket API​

- Execution [UPDATE]Add `extraFees` for Indian GST tax

BTC and ETH leveraged tokens are delisted, and the API service will be terminated on 4 July, 2025**
## 2025-06-26​

### REST API​

- Get Spread Trade History [UPDATE]Add `execFeeV2` for Spot leg trading fee
- Add `feeCurrency` for all legs trading fee currency

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATED]
- Add `execFeeV2` for FutureSpread Spot leg trading fee only

### Websocket API​

- Spread Execution [UPDATE]Add `execFeeV2` for Spot leg trading fee
- Add `feeCurrency` for all legs trading fee currency

## 2025-06-24​

### REST API​

- Get Closed Options Positions [NEW]Add new endpoint which is used to get closed options positions

[Get Closed PnL](https://bybit-exchange.github.io/docs/v5/position/close-pnl) [UPDATE]
- Add new response fields `openFee`, `closeFee`
- Add new enum "option" for `category` field to support getting option closed pnl records

[Get Delivery Record](https://bybit-exchange.github.io/docs/v5/asset/delivery) [UPDATE]
- Add new response field `entryPrice`

[Get Transaction Log (UTA)](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]
- Add new types `ONCHAINEARN_SUBSCRIPTION`, `ONCHAINEARN_REDEMPTION`, `ONCHAINEARN_REFUND`,
`STRUCTURE_PRODUCT_SUBSCRIPTION`, `STRUCTURE_PRODUCT_REFUND`, `CLASSIC_WEALTH_MANAGEMENT_SUBSCRIPTION`,
`PREMIMUM_WEALTH_MANAGEMENT_SUBSCRIPTION`, `PREMIMUM_WEALTH_MANAGEMENT_REFUND`, `LIQUIDITY_MINING_SUBSCRIPTION`,
`LIQUIDITY_MINING_REFUND`, `FLEXIBLE_STAKING_REFUND`, `FIXED_STAKING_REFUND`, `PWM_SUBSCRIPTION`, `PWM_REFUND`

## 2025-06-19​

### REST API​

- Get Order Price Limit [NEW]Add new endpoint which is used to get order price limit

### WebSocket API​

- Order Price Limit [NEW]Add new websocket topic "priceLimit" which is used to get order price limit

## 2025-06-12​

### REST API​

- Get Deposit Records (on-chain) [UPDATE]Add `id`, `txID` request parameters to filter deposit records
- Add `id`, an internal unique key field in the response

[Get Sub Deposit Records (on-chain)](https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-record) [UPDATE]
- Add `id`, `txID` request parameters to filter deposit records
- Add `id`, an internal unique key field in the response

[Get Sub Account Deposit Records](https://bybit-exchange.github.io/docs/v5/broker/exchange-broker/sub-deposit-record) [UPDATE]
- Add `id`, `txID` request parameters to filter deposit records
- Add `id`, an internal unique key field in the response

[Get Coin Information](https://bybit-exchange.github.io/docs/v5/asset/coin-info) [UPDATE]
- Add `safeConfirmNumber` to indicate the number of security confirmations of deposit

## 2025-06-10​

### REST API​

- Pre Check Order [NEW]Add new endpoint which is used to calculate the changes in IMR and MMR of UTA account before and after placing an order.

## 2025-05-28​

### REST API​

- Get Order History [UPDATE]Add new response field `extraFees` which is only used for Indonesian site or EU site

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- Add new response field `extraFees` which is only used for Indonesian site or EU site

[Get Transaction Log (UTA)](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]
- Add new response field `extraFees` which is only used for Indonesian site or EU site

## 2025-05-27​

### REST API​

- Get Delivery Price [UPDATE]Add query parameter `settleCoin`, and support settleCoin=USDT

## 2025-05-23​

### REST API​

- Get Insurance [UPDATE]The balance data update frequency has been changed from every 24 hours to every 1 minute

[Insurance Pool](https://bybit-exchange.github.io/docs/v5/websocket/public/insurance-pool) [NEW]
- A new WebSocket topic has been introduced to allow users to listen for updates to the insurance pool balance

## 2025-05-06​

### REST API​

- Spread Trading Rate limit [UPDATE]Modify the rate limit for create/amend/cancel from 100/min to 20/sec
- Modify the rate limit for cancel-all from 100/min to 5/sec

## 2025-04-24​

### REST API​

- Get Transaction Log (UTA) [UPDATE]Add new response field `transSubType`, used for trans log generated by move position now
- Modify the default time range from 7 days to 24 hours when `startTime` & `endTime` are not passed together

[Get Spread Order History](https://bybit-exchange.github.io/docs/v5/spread/trade/order-history) [UPDATE]
- Add response field `cxlRejReason`
- Remove redundent field `orderPrice`

## 2025-04-22​

### REST API​

- Get Instruments Info [UPDATE]category=`option` adds a new response field `displayName`
- category=`linear` adds a new response field `displayName`

## 2025-04-17​

### REST API​

- Request a Quote [UPDATE]Add a new response param `extTaxAndFee`

## 2025-04-16​

### REST API​

- Get Internal Transfer Records [UPDATE]Add 7 days restriction to `startTime` & `endTime`

[Get Universal Transfer List](https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer-list) [UPDATE]
- Add 7 days restriction to `startTime` & `endTime`

[Get API Key Information](https://bybit-exchange.github.io/docs/v5/user/apikey-info) [UPDATE]
- `NFT` field is deprecated, always `[]`

[Create Sub UID API Key](https://bybit-exchange.github.io/docs/v5/user/create-subuid-apikey) [UPDATE]
- `NFT` field is deprecated, always `[]`

[Get Sub Account All API Keys](https://bybit-exchange.github.io/docs/v5/user/list-sub-apikeys) [UPDATE]
- `NFT` field is deprecated, always `[]`

[Modify Master API Key](https://bybit-exchange.github.io/docs/v5/user/modify-master-apikey) [UPDATE]
- `NFT` field is deprecated, always `[]`

[Modify Sub API Key](https://bybit-exchange.github.io/docs/v5/user/modify-sub-apikey) [UPDATE]
- `NFT` field is deprecated, always `[]`

## 2025-04-14​

### REST API​

- Spread Trading API [NEW]

## 2025-04-11​

### REST API​

- Earn API [UPDATE]Add category `OnChain`.

## 2025-04-02​

### REST API​

- Withdraw [UPDATE]Add request parameter `beneficiaryAddressCountry`, `beneficiaryAddressState`, `beneficiaryAddressCity` they are used for users from Bybit Indonesia to fill travel rule info

## 2025-04-01​

### REST API​

- Place Order [UPDATE]"timeInForce" request parameter supports `RPI`, refer to Retail Price Improvement (RPI) Order to get more details

[Batch Place Order](https://bybit-exchange.github.io/docs/v5/order/batch-place) [UPDATE]
- "timeInForce" request parameter supports `RPI`

[Get Open & Closed Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- Response field "timeInForce" supports `RPI`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Response field "timeInForce" supports `RPI`

[Get Public Recent Trading History](https://bybit-exchange.github.io/docs/v5/market/recent-trade) [UPDATE]
- Add a new response field `isRPITrade`

### Websocket API​

- Websocket Trade Service[UPDATE]"timeInForce" request parameter supports `RPI` when creating orders

[Order](https://bybit-exchange.github.io/docs/v5/websocket/private/order) [UPDATE]
- Response field "timeInForce" supports `RPI`

[Trade](https://bybit-exchange.github.io/docs/v5/websocket/public/trade) [UPDATE]
- Inverse Perpetual & Inverse Futures are effective, and the rest will be done in a week.

## 2025-03-20​

### WebSocket API​

- Orderbook [UPDATE]Spot and Futures orderbook.1 pushes snapshot message only

## 2025-03-05​

### REST API​

- Withdraw [UPDATE]Add request parameter `beneficiaryLegalType`, `beneficiaryWalletType`, `beneficiaryUnhostedWalletType`, `beneficiaryPoiNumber`, `beneficiaryPoiType`, `beneficiaryPoiIssuingCountry`, `beneficiaryPoiExpiredDate` they are used for users from Bybit Turkey and Bybit Kazakhstan to fill travel rule info

## 2025-02-27​

### REST API​

- Place Order [UPDATE]Add `slippageToleranceType` request parameter, used to select slippage type for Spot and Futures market orders
- Add `slippageTolerance` request parameter, used to set slippage value based on the type of slippage

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Add a new response param `slippageToleranceType`
- Add a new response param `slippageTolerance`

### Websocket API​

- Order [UPDATE]Add a new response param `slippageToleranceType`
- Add a new response param `slippageTolerance`

## 2025-02-26​

### Websocket API​

- Websocket Trade Service [UPDATE]Add a new response field `retExtInfo` in each create/amend/cancel order response
- Support batch create/amend/cancel request

## 2025-02-20​

### REST API​

- Earn API [NEW]Get Product Info
- Stake / Redeem
- Get Stake/Redeem Order History
- Get Staked Position

### Websocket API​

- All Liquidation [NEW]A new topic to get full liquidation occurred in Bybit exchange.

Liquidation [DEPRECATE]
- The old one only pushes 1 liquidation per second, it can be discarded.

## 2025-02-19​

### REST API​

- Get Affiliate User List [UPDATE]Add new response fields `takerVol30Day`, `makerVol30Day`, `tradeVol30Day`, `depositAmount30Day`, `takerVol365Day`, `makerVol365Day`, `tradeVol365Day`, `depositAmount365Day`

## 2025-02-18​

### REST API​

- Get Tiered Collateral Ratio [NEW]A new endpoint introduced to get tiered collateral ratio in UTA loan

[Get Unified Wallet Transferable Amount](https://bybit-exchange.github.io/docs/v5/account/unified-trans-amnt) [UPDATE]
- `coinName` supports query up to 20 coins per request
- Add new response field `availableWithdrawalMap` to support multiple coins

[Get Historical Volatility](https://bybit-exchange.github.io/docs/v5/market/iv) [UPDATE]
- Add new request parameter `quoteCoin`, the input value can be "USD" or "USDT"

[Place Order](https://bybit-exchange.github.io/docs/v5/order/create-order) [UPDATE]
- "timeInForce" request parameter supports `RPI`, refer to Retail Price Improvement (RPI) Order to get more details

[Batch Place Order](https://bybit-exchange.github.io/docs/v5/order/batch-place) [UPDATE]
- "timeInForce" request parameter supports `RPI`

[Get Open & Closed Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- Response field "timeInForce" supports `RPI`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Response field "timeInForce" supports `RPI`

[Get Public Recent Trading History](https://bybit-exchange.github.io/docs/v5/market/recent-trade) [UPDATE]
- Add a new response field `isRPITrade`

### Websocket API​

- Websocket Trade Service[UPDATE]"timeInForce" request parameter supports `RPI` when creating orders

[Order](https://bybit-exchange.github.io/docs/v5/websocket/private/order) [UPDATE]
- Response field "timeInForce" supports `RPI`

[Trade](https://bybit-exchange.github.io/docs/v5/websocket/public/trade) [UPDATE]
- Four symbols (MASKUSDT, IOUSDT, ZROUSDT, TWTUSDT) now have `RPI` response field, full release will be 20th Feb.

## 2025-02-17​

### REST API​

- Create Sub UID API Key [UPDATE]Support creating the key for Fund Custodial sub acct.

[Modify Sub API Key](https://bybit-exchange.github.io/docs/v5/user/modify-sub-apikey) [UPDATE]
- Support updating the key of Fund Custodial sub acct by custodial institional account.

[Delete Sub API Key](https://bybit-exchange.github.io/docs/v5/user/rm-sub-apikey) [UPDATE]
- Support deleting the key of Fund Custodial sub acct by custodial institional account.

[Get Fund Custodial Sub](https://bybit-exchange.github.io/docs/v5/user/fund-subuid-list) [NEW]
- Provide a new endpoint to get Fund Custodial sub acct list by custodial institional account.

[Get Sub Account All API Keys](https://bybit-exchange.github.io/docs/v5/user/list-sub-apikeys) [UPDATE]
- Support Fund Custodial sub acct

## 2025-02-13​

### REST API​

- Get Transaction Log (UTA) [UPDATE]New transaction type value `PEF_TRANSFER_IN`, `PEF_TRANSFER_OUT`, `PEF_PROFIT_SHARE`

[Get Collateral Info](https://bybit-exchange.github.io/docs/v5/account/collateral-info) [UPDATE]
- The field `collateralRatio` field will be no longer useful due to the transition from a single conversion rate to a tiered collateral value ratio starting from 19 Feb, 2025, refer to announcement

[Get VIP Margin Data](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/vip-margin) [UPDATE]
- The field `collateralRatio` field will be no longer useful due to the transition from a single conversion rate to a tiered collateral value ratio starting from 19 Feb, 2025

## 2025-02-07​

### REST API​

- Cancel All Orders [UPDATE]Option orders can be cancelled by specifying `settleCoin`, and choose cancel all USDT or USDC Option orders

## 2025-01-14​

### REST API​

- Get Instruments Info [UPDATE]For category=`spot`, replace `limitParameter` and `marketParamter` with `priceLimitRatioX`, `priceLimitRatioY`, please refer to this change

## 2025-01-09​

### REST API​

- Get Sub Account Deposit Records (Exchange Broker) [UPDATE]Add a new response field `fromAddress`, source address of the deposit

[Get Deposit Records (on chain)](https://bybit-exchange.github.io/docs/v5/asset/deposit/deposit-record) [UPDATE]
- Add new response field `fromAddress`, source address of the deposit

[Get Sub Deposit Records (on chain)](https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-record) [UPDATE]
- Add new response field `fromAddress`, source address of the deposit

[Get Master Deposit Address](https://bybit-exchange.github.io/docs/v5/asset/deposit/master-deposit-addr) [UPDATE]
- Add a new response field `contractAddress`, show last 6 characters

[Get Sub Deposit Address](https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-addr) [UPDATE]
- Add a new response field `contractAddress`, show last 6 characters

[Get Coin Information](https://bybit-exchange.github.io/docs/v5/asset/coin-info) [UPDATE]
- Add a new response field `contractAddress`, show complete token contract address

[Get Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance) [UPDATE]
- For accountType=`UNIFIED`, the response field `availableToWithdraw` is deprecated, it always returns `""`

[Get All Coins Balance](https://bybit-exchange.github.io/docs/v5/asset/balance/all-balance) [UPDATE]
- For accountType=`UNIFIED`, "coin" request parameter becomes mandatory, and it supports up to 10 coins in one request

[Get Exchange Broker Earning](https://bybit-exchange.github.io/docs/v5/broker/exchange-broker/exchange-earning) [UPDATE]
- Add a new response field `execId`

### Websocket API​

- Wallet [UPDATE]For accountType=`UNIFIED`, the response field `availableToWithdraw` is deprecated, it always returns `""`

## 2025-01-02​

### REST API​

- Get Instruments Info [UPDATE]For category=`linear` and `inverse`, added response field `riskParameters`, `priceLimitRatioX`, `priceLimitRatioY`, please refer to this change

## 2024-12-12​

### REST API​

- Get Risk Limit [UPDATE]When query category="linear", API returned 30 symbols data set each request before, but now it returns 15.

[Withdraw](https://bybit-exchange.github.io/docs/v5/asset/withdraw) [UPDATE]
- API rate limit is raised from 1 req to 5 reqs per second

## 2024-12-09​

### REST API​

- Get Unified Wallet Transferable Amount [NEW]Add a new endpoint to get the transferrable amount of a specific coin in the Unified wallet

## 2024-12-04​

### REST API​

- Get Affiliate User List [NEW]For Affiliate user, you can use this endpoint to query user list information

## 2024-11-19​

### REST API​

- Get Instruments Info [UPDATE]For category=`spot`, added response field `stTag`

## 2024-11-14​

### REST API​

- Get Long Short Ratio [UPDATE]Add request parameter `startTime`, `endTime`, used to query historical data by filter time range

## 2024-11-05​

- Kazakhstan users registered from "www.bybit.kz", please use "api.bybit.kz" and "stream.bybit.kz" hostnames.

## 2024-10-30​

### REST API​

- Get Collateral Info [UPDATE]Add a new response field `otherBorrowAmount`

## 2024-10-15​

### Websocket API​

- Add websocket domain `stream.bybit-tr.com` for the users registered with www.bybit-tr.com. These users can now
use this domain to place orders via websocket trade service.

## 2024-10-11​

### REST API​

- Crypto Loan APIs are released to production [NEW]

## 2024-09-29​

### Websocket API​

- Order [UPDATE]Add new response field `closedPnl`

[Execution](https://bybit-exchange.github.io/docs/v5/websocket/private/execution) [UPDATE]
- Add a response field `execPnl`

## 2024-09-12​

### REST API​

- Query Voucher Spec [NEW]Add voucher API for exchange broker clients

[Issue Voucher](https://bybit-exchange.github.io/docs/v5/broker/reward/issue-voucher) [NEW]
- Add voucher API for exchange broker clients

[Query Issued Voucher](https://bybit-exchange.github.io/docs/v5/broker/reward/get-issue-voucher) [NEW]
- Add voucher API for exchange broker clients

## 2024-08-29​

### REST API​

- Get Order History [UPDATE]Classic account Spot trading supports getting the past 2 years Filled, Triggered orders
- Support using `startTime` and `endTime`

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- Classic account Spot trading supports getting the past 2 years trades
- Support using `startTime` and `endTime`

[Get Pre-upgrade Order History](https://bybit-exchange.github.io/docs/v5/pre-upgrade/order-list) [UPDATE]
- Support using `startTime` and `endTime`

[Get Pre-upgrade Trade History](https://bybit-exchange.github.io/docs/v5/pre-upgrade/execution) [UPDATE]
- Support using `startTime` and `endTime`

## 2024-08-13​

### REST API​

- Get Loan Orders [UPDATE]Add a new response param `reserveToken`, `reserveQuantity`

## 2024-08-07​

### REST API​

- Request a Quote [UPDATE]Add two new request parameter for API broker client, `paramType`, `paramValue`

[Get Convert History](https://bybit-exchange.github.io/docs/v5/asset/convert/get-convert-history) [UPDATE]
- Add two new response `paramType`, `paramValue` in the "extInfo" object

## 2024-08-06​

### REST API​

- Demo Trading Service [UPDATE]Add request param `adjustType` to determine adding or reducing the demo funds

## 2024-07-30​

### Websocket API​

- Fast Execution [UPDATE]Add response field `isMaker`
- Supports Spot execution

## 2024-07-25​

### REST API​

- Get Historical Interest Rate [NEW]Add a new endpoint to query historical borrowing interest rate of Margin trading

## 2024-07-09​

### Websocket API​

- Fast Execution [UPDATE]Add categorised topic, `execution.fast.linear`, `execution.fast.inverse`

## 2024-07-04​

### REST API​

- New feature: open api supports the conversion of crypto assetsGet Convert Coin List [NEW]
- Request a Quote [NEW]
- Confirm a Quote [NEW]
- Get Convert Status [NEW]
- Get Convert history [NEW]

## 2024-07-03​

- Get Exchange Broker Earning [UPDATE]Request parameter `bizType` adds a new enum value "CONVERT"
- Response parameter `bizType` adds a new enum value "CONVERT"
- Add new response fields `convert`

[Get Exchange Broker Account Info](https://bybit-exchange.github.io/docs/v5/broker/exchange-broker/account-info) [UPDATE]
- Add new response fields `convert`

## 2024-07-01​

- Integration Guidance [UPDATE]To obey the compliance rule, the new domain is added for Turkey region users.

## 2024-06-27​

### REST API​

- Get Instruments Info [UPDATE]Pre-market contract: add new response fields `isPreListing`, `preListingInfo`, `curAuctionPhase`, `phases`, `startTime`, `endTime`, `auctionFeeInfo`, `auctionFeeRate`, `takerFeeRate`, `makerFeeRate`
- Request parameter `status` supports `Closed`, `Delivering`, `PreLaunch` for category="inverse" and "linear"
- When category=linear&status=PreLaunch, you can get pre-market perpetual

[Get Tickers](https://bybit-exchange.github.io/docs/v5/market/tickers) [UPDATE]
- Pre-market contract: add new response fields  `preOpenPrice`, `preQty`, `curPreListingPhase`

New error codes related to pre-market perpetual trading
- `110095`: You cannot create, modify or cancel Pre-Market Perpetual orders during the Call Auction.
- `110096`: Pre-Market Perpetual Trading does not support Portfolio Margin mode.
- `110097`: Non-UTA users cannot access Pre-Market Perpetual Trading. To place, modify or cancel Pre-Market Perpetual orders, please upgrade your Standard Account to UTA.
- `110098`: Only Good-Till-Canceled (GTC) orders are supported during Call Auction.
- `110099`: You cannot create TP/SL orders during the Call Auction for Pre-Market Perpetuals.
- `110100`: You cannot place, modify, or cancel Pre-Market Perpetual orders when you are in Demo Trading.
- `3777029`: You currently have orders for pre-market trading that can’t be bind UIDs
- `3200419`: Unable to switch to Portfolio margin due to active pre-market Perpetual orders and positions

### Websocket API​

- Tickers [UPDATE]Pre-market contract: add new response fields  `preOpenPrice`, `preQty`, `curPreListingPhase`

## 2024-06-20​

### REST API​

- Place Order [UPDATE]`marketUnit` field now supports orderFilter=tpslOrder, StopOrder when placing Spot market order (UTA)

[Batch Place Order](https://bybit-exchange.github.io/docs/v5/order/batch-place) [UPDATE]
- `marketUnit` field now supports orderFilter=tpslOrder, StopOrder when placing Spot market order (UTA)

## 2024-06-18​

### REST API​

- Set Disconnect Cancel All [UPDATE]Add `product` request parameter, support `DERIVATIVES`, `SPOT` and `OPTIONS`

[Get Account Info](https://bybit-exchange.github.io/docs/v5/account/account-info) [UPDATE]
- Deprecate the fields `dcpStatus`, `timeWindow`

[Get DCP Info](https://bybit-exchange.github.io/docs/v5/account/dcp-info) [NEW]
- Add a new API used to query dcp config data

### Websocket API​

- DCP [UPDATE]Deprecate the topic name `dcp`
- Add new topic names `dcp.future`, `dcp.spot`, `dcp.option`

## 2024-06-14​

### Websocket API​

- Fast Execution [UPDATE]`orderLinkId` will be also output for a maker trade, but the value will be `""` all the time.

## 2024-06-13​

### REST API​

- Get Exchange Broker Earning [UPDATE]Changed from support query for the past 6 months to query for the past 1 month

## 2024-06-06​

### REST API​

- Get Affiliate User Info [UPDATE]Add a new response field `KycLevel`

### Websocket API​

- Fast Execution [NEW]Provide a lower latency execution event

## 2024-06-04​

### REST API​

- Get Orderbook [UPDATE]A new response field `cts` added when category=spot, and it is matched with the "cts" from ws ob.200

## 2024-05-30​

### REST API​

- Get Orderbook [UPDATE]A new response field `cts` added when category=linear & inverse, and it is matched with the "cts" from ws ob.500

## 2024-05-09​

### REST API​

- Get Risk Limit [UPDATE]When query category="linear", API returns 30 symbols data set each request, please add request parameter `cursor` paginate
- Add new response parameter `nextPageCursor`

[Withdraw](https://bybit-exchange.github.io/docs/v5/asset/withdraw) [UPDATE]
- Add request parameter `beneficiary`, `vaspEntityId`, `beneficiaryName`, they are only used for kyc=KOR (Korean users) to fill travel rule info

[Get Exchange Entity List](https://bybit-exchange.github.io/docs/v5/asset/withdraw/vasp-list) [NEW]
- Add a new API for kyc=KOR users to query target exchange info when fill travel rule info

[Create Internal Transfer](https://bybit-exchange.github.io/docs/v5/asset/transfer/create-inter-transfer) [UPDATE]
- Add new response field `status`. When you get "PENDING", please call query API to check the final status after a while

[Create Universal Transfer](https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer) [UPDATE]
- Add new response field `status`. When you get "PENDING", please call query API to check the final status after a while

## 2024-05-06​

### Websocket API​

- Websocket Trade Guideline [UPDATE]The websocket order entry feature is officially launched on 06/May/2024 8AM UTC.

## 2024-04-25​

### REST API​

- Get Transaction Log (UTA) [UPDATE]New transaction type value `ADL`

[Get Transaction Log (Classic)](https://bybit-exchange.github.io/docs/v5/abandon/contract-transaction-log) [NEW]
- New endpoint for Classic account derivatives wallet, and Unified account inverse derivatives wallet

[Get Insurance](https://bybit-exchange.github.io/docs/v5/market/insurance) [UPDATE]
- Add a new response field `symbols`

## 2024-04-23​

### REST API​

- Get Internal Transfer Records [UPDATE]When `startTime` & `endTime` are not passed together, API returns 30 days data by default

[Get Universal Transfer List](https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer-list) [UPDATE]
- When `startTime` & `endTime` are not passed together, API returns 30 days data by default

### Websocket API​

- Websocket Trade Guideline [UPDATE]Request parameter of Create/Amend/Cancel is changed from `headers` to `header`

## 2024-04-15​

### REST API​

- Demo Trading Service [NEW]Request demo funds API update

## 2024-04-11​

### REST API​

- Get Instruments Info [UPDATE]Add response fields `minNotionalValue`

## 2024-04-03​

### REST API​

- Get Sub Account Deposit Records [NEW]Add a new endpoint for exchange broker user to query sub account deposit records

[API adds support for Demo Trading](https://bybit-exchange.github.io/docs/v5/demo) [NEW]
## 2024-04-01​

### REST API​

- Get Sub UID List (Unlimited) [NEW]Add a new API to get sub uid entry. This supports pagnation.

[Get Sub UID List (Limited)](https://bybit-exchange.github.io/docs/v5/user/subuid-list) [UPDATE]
- Return up to 10k sub accounts

### Websocket API​

- Websocket Trade Guideline [UPDATE]URL uses `wss` as prefix

## 2024-03-28​

### Websocket API​

- Websocket Trade Guideline [UPDATE]Create/Amend/Cancel request adds required header parameter `X-BAPI-TIMESTAMP`

## 2024-03-22​

- Integration Guidance [UPDATE]To obey the compliance rule, two new domains are added for Netherlands users and Hong Kong users repectively.

[Create Internal Transfer](https://bybit-exchange.github.io/docs/v5/asset/transfer/create-inter-transfer) [UPDATE]
- API rate limit is increase from 20req/min to 60req/min

## 2024-03-21​

- Get Orderbook [UPDATE]linear & inverse supports up to limit=500
- linear & inverse, field `u` is matched with the `u` in ws 500 level

## 2024-03-13​

### REST API​

- Set Deposit Account [UPDATE]`OPTION`(USDC Contract wallet) is no longer supported to set for classic account

[Get Announcement](https://bybit-exchange.github.io/docs/v5/announcement) [UPDATE]
- Add a new response field `publishTime`

## 2024-03-12​

### REST API​

- Set Risk Limit [Deprecate]Since auto risk limit has been launched, it is meaningless to use this API

## 2024-03-11​

### REST API​

- Get Order History [UPDATE]UTA(spot, linear, option) can only query last 24 hours full cancelled orders records

## 2024-03-06​

### REST API​

- Batch Place Order [UPDATE]Support Spot trading (UTA, UTA Pro)

[Batch Amend Order](https://bybit-exchange.github.io/docs/v5/order/batch-amend) [UPDATE]
- Support Spot trading (UTA, UTA Pro)

[Batch Cancel Order](https://bybit-exchange.github.io/docs/v5/order/batch-cancel) [UPDATE]
- Support Spot trading (UTA, UTA Pro)

## 2024-03-05​

### REST API​

- Get Position Info [UPDATE]Add new response field `sessionAvgPrice` for USDC contracts
- Add new response field `curRealisedPnl` for Perps, Futures and Option
- `cumRealisedPnl` is deprecated for Option
- Add new response fields `delta`, `vega`, `theta`, `gamma` for Option

### Websocket API​

- Position [UPDATE]Add new response field `sessionAvgPrice` for USDC contracts
- Add new response field `curRealisedPnl` for Perps, Futures and Option
- `cumRealisedPnl` is deprecated for Option
- Add new response fields `delta`, `vega`, `theta`, `gamma` for Option

## 2024-03-04​

### REST API​

- Get Public Recent Trading History [UPDATE]Add new response fields for Option only. `mP`, `iP`, `mIv`, `iv`

### Websocket API​

- Trade [UPDATE]Add new stream fields for Option only. `mP`, `iP`, `mIv`, `iv`

## 2024-03-01​

### REST API​

- All C2C-Lending APIs are abandoned due to the merge between Lending and Flexible SavingsGet Lending Coin Info
- Deposit Funds
- Redeem Funds
- Cancel Redeem
- Get Order Records
- Get Lending Account Info

## 2024-02-29​

### REST API​

- Get Borrow History [UPDATE]`startTime` & `endTime` are restricted to 30 days time range
- Support getting up to 2 years data

[Get Delivery Record](https://bybit-exchange.github.io/docs/v5/asset/delivery) [UPDATE]
- Add query parameter `startTime` & `endTime`, and 30 days times range per request
- Support getting up to 2 years data

[Get USDC Session Settlement](https://bybit-exchange.github.io/docs/v5/asset/settlement) [UPDATE]
- Add query parameter `startTime` & `endTime`, and 30 days times range per request
- Support getting up to 2 years data

[Get Orderbook](https://bybit-exchange.github.io/docs/v5/market/orderbook) [UPDATE]
- Add a new response field `seq` for linear, inverse & spot

## 2024-02-28​

### REST API​

- Get Withdrawal Records [UPDATE]New withdraw status enum value `MoreInformationRequired`

## 2024-02-21​

### REST API​

- Get Instruments Info [UPDATE]Add response fields `maxMktOrderQty`
- `postOnlyMaxOrderQty` is useless, use `maxOrderQty` for Limit and PostOnly order

## 2024-02-06​

### REST API​

- Get Instruments Info [UPDATE]Add response fields `upperFundingRate` and `lowerFundingRate`

## 2024-02-05​

### REST API​

- Get Order History [UPDATE]UTA (linear,spot,option) does not support querying open status orders any more
- Add a new error code: "181017", error message: "OrderStatus must be final status"

## 2024-01-18​

### REST API​

- Get Instruments Info [UPDATE]Add new response fields `riskParameters`, `limitParameter`, `marketParameter`

## 2024-01-16​

### REST API​

- Get Withdrawal Records [UPDATE]Add a new request param `txID`
- The withdrawal between Bybit account returns `txID`

[Get Internal Deposit Records (off-chain)](https://bybit-exchange.github.io/docs/v5/asset/deposit/internal-deposit-record) [UPDATE]
- Add a new request param `txID`
- Add a new response field `txID`

## 2024-01-15​

### REST API​

- Place Order [UPDATE]Spot(UTA) can use `takeProfit`, `stopLoss`, `tpLimitPrice`, `slLimitPrice`, `tpOrderType`, `slOrderType` to set Market TPSL or Limit TPSL when creating Spot limit order.

[Amend Order](https://bybit-exchange.github.io/docs/v5/order/amend-order) [UPDATE]
- Spot(UTA) can amend `takeProfit`, `stopLoss`, `tpLimitPrice`, `slLimitPrice` if the original order has related attributes

[Cancel All Orders](https://bybit-exchange.github.io/docs/v5/order/cancel-all) [UPDATE]
- Add new enums "OcoOrder", "BidirectionalTpslOrder" for `orderFilter`. You can only cancel all untriggered "BidirectionalTpslOrder"

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- Add new enum "BidirectionalTpslOrder" for `orderFilter`
- Add new enum "BidirectionalTpslOrder" for `stopOrderType`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Add new enum "BidirectionalTpslOrder" for `orderFilter`
- Add new enum "BidirectionalTpslOrder" for `stopOrderType`

### Websocket API​

- Order [UPDATE]Add new enum "BidirectionalTpslOrder" for `stopOrderType`

## 2024-01-11​

### REST API​

- Get Transaction Log [UPDATE]new type enums `FLEXIBLE_STAKING_SUBSCRIPTION`, `FLEXIBLE_STAKING_REDEMPTION`, `FIXED_STAKING_SUBSCRIPTION`

## 2024-01-09​

### REST API​

- Batch Set Collateral Coin [NEW]Add a new endpoint to batch set collateral coin for Unified account

## 2024-01-08​

### REST API​

- Get Trade History [UPDATE]Add a new response field `feeCurrency` for UTA Spot trading fee currency

## 2024-01-02​

### REST API​

- Move Position [NEW]Add a new endpoint to move your positions between the main-sub, sub-sub accounts

[Get Move Position History](https://bybit-exchange.github.io/docs/v5/position/move-position-history) [NEW]
- Add a new endpoint to query move position history

[Get Status And Leverage](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/status) [UPDATE]
- Add a new response param `effectiveLeverage`.

Add error codes for transfer endpoints:
| New error code | Description |
| --- | --- |
| 131231 | Transfers into this account are not supported |
| 131232 | Transfers out this account are not supported |

## 2023-12-28​

### REST API​

- Get Loan Orders [UPDATE]Add a new response param `deferredLiquidationLine`, `deferredLiquidationTime`

[Get LTV](https://bybit-exchange.github.io/docs/v5/otc/ltv-convert) [UPDATE]
- Add a new response param `rst`.

[Get Product Info](https://bybit-exchange.github.io/docs/v5/otc/margin-product-info) [UPDATE]
- Add a new response param `deferredLiquidationLine`, `deferredLiquidationTime`

## 2023-12-22​

### REST API​

- Place Order [UPDATE]Add a new request param `marketUnit`, the value are `baseCoin`, `quoteCoin`. It can be used to select `qty` unit for Spot market order (Unified account)

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- Add a new response param `marketUnit`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Add a new response param `marketUnit`

### Websocket API​

- Order [UPDATE]Add a new response param `marketUnit`

## 2023-12-20​

### REST API​

- Get Account Info [UPDATE]`smpGroup` is deprecated, please use Get SMP Group ID

## 2023-12-14​

### Websocket API​

- Orderbook [UPDATE]Add a new field `cts`

## 2023-12-12​

### REST API​

- Get Order History [UPDATE]Add a response field `createType`

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- Add a response field `createType`

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- Add a response field `createType`

[Get SMP Group ID](https://bybit-exchange.github.io/docs/v5/account/smp-group) [NEW]
- Add a new endpoint to get smp group ID

### Websocket API​

- Order [UPDATE]Add a response field `createType`

[Execution](https://bybit-exchange.github.io/docs/v5/websocket/private/execution) [UPDATE]
- Add a response field `createType`

## 2023-12-07​

### REST API​

- Repay Liability [NEW]Add a new endpoint to repay the liability of Unified Account

## 2023-12-04​

### REST API​

- Get Broker Earning [deprecated]deprecated, replaced by Get Exchange Broker Earning

[Get Exchange Broker Earning](https://bybit-exchange.github.io/docs/v5/broker/exchange-broker/exchange-earning) [NEW]
- Add a new endpoint to query exchange broker earning information

[Get Exchange Broker Account Info](https://bybit-exchange.github.io/docs/v5/broker/exchange-broker/account-info) [NEW]
- Add a new endpoint to query exchange broker main account information

## 2023-11-16​

### REST API​

- Set Spot Hedging [NEW]Add a new endpoint to enable or disable Spot hedging function for Portfolio margin mode

[Get Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance) [UPDATE]
- Add a new response field `spotHedgingQty`

[Get Account Info](https://bybit-exchange.github.io/docs/v5/account/account-info) [UPDATE]
- Add a new response field `spotHedgingStatus`

### Websocket API​

- Wallet [UPDATE]Add a new response field `spotHedgingQty`

## 2023-11-14​

### REST API​

- Withdraw [UPDATE]The rate limit is changed from 10 req/min to 1 req/s

## 2023-11-09​

### REST API​

- Get Open Orders [UPDATE]Classic account Spot can use `orderFilter`="OcoOrder"

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params
- Classic account Spot can use `orderFilter`="OcoOrder"

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params

[Get Closed PnL](https://bybit-exchange.github.io/docs/v5/position/close-pnl) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params
- Classic account data is sort by `updatedTime`

[Get Transaction Log](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params

[Get Pre-upgrade Order History](https://bybit-exchange.github.io/docs/v5/pre-upgrade/order-list) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params

[Get Pre-upgrade Trade History](https://bybit-exchange.github.io/docs/v5/pre-upgrade/execution) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params

[Get Pre-upgrade Closed PnL](https://bybit-exchange.github.io/docs/v5/pre-upgrade/close-pnl) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params
- Classic account data is sort by `updatedTime`

[Get Pre-upgrade Transaction Log](https://bybit-exchange.github.io/docs/v5/pre-upgrade/transaction-log) [UPDATE]
- Add the time range limitation for `startTime` and `endTime` request params

[Get Sub Account All API Keys](https://bybit-exchange.github.io/docs/v5/user/list-sub-apikeys) [NEW]
- Add new endpoint for master account to query all api keys of a sub UID

## 2023-11-08​

### REST API​

- Bind Or Unbind UID [NEW]Add a new endpoint to bind or unbind UID for OTC loan products

## 2023-11-02​

### REST API​

- Amend Order [UPDATE]Add `tpslMode` in the request parameter

[Batch Amend Order](https://bybit-exchange.github.io/docs/v5/order/batch-amend) [UPDATE]
- Add `tpslMode` in the request parameter

[Get Borrow Quota (Spot)](https://bybit-exchange.github.io/docs/v5/order/spot-borrow-quota) [UPDATE]
- Add new response fields `spotMaxTradeQty`, `spotMaxTradeAmount`

[Withdraw](https://bybit-exchange.github.io/docs/v5/asset/withdraw) [UPDATE]
- Add new enum value for `forceChain` parameter. You can withdraw between Bybit main accounts via inputting UID

[Delete Sub UID](https://bybit-exchange.github.io/docs/v5/user/rm-subuid) [NEW]
- Add new endpoint to delete sub account

## 2023-11-01​

### REST API​

- Amend Order [UPDATE]Spot supports amending order, category=`spot`

## 2023-10-26​

### REST API​

- Get Trade History [UPDATE]UTA Spot: `stopOrderType`, `""` for normal order, `tpslOrder` for TP/SL order, `Stop` for conditional order, `OcoOrder` for OCO order

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- UTA Spot: add new response field `ocoTriggerBy`, and the value can be `OcoTriggerByUnknown`, `OcoTriggerByTp`, `OcoTriggerBySl`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- UTA Spot: add new response field `ocoTriggerBy`, and the value can be `OcoTriggerByUnknown`, `OcoTriggerByTp`, `OcoTriggerBySl`

### Websocket API​

- Order [UPDATE]UTA Spot: add new response field `ocoTriggerBy`, and the value can be `OcoTriggerByUnknown`, `OcoTriggerByTp`, `OcoTriggerBySl`

## 2023-10-25​

### REST API​

- Get Position Info [UPDATE]Add response field `isReduceOnly`, `mmrSysUpdatedTime`, `leverageSysUpdatedTime`

[Confirm New Risk Limit](https://bybit-exchange.github.io/docs/v5/position/confirm-mmr) [NEW]
- Add a new endpoint

### Websocket API​

- Position [UPDATE]Add response field `isReduceOnly`, `mmrSysUpdatedTime`, `leverageSysUpdatedTime`

## 2023-10-17​

### REST API​

- Get API Key Information [UPDATE]Add a new response field `kycLevel`, `kycRegion`

[Get Borrow History](https://bybit-exchange.github.io/docs/v5/account/borrow-history) [UPDATE]
- Add new response fields `borrowAmount`, `unrealisedLoss`, `freeBorrowedAmount`

## 2023-10-09​

### Websocket API​

- Orderbook [Spot]Add a new level 200 data with frequency 200ms

## 2023-09-28​

### REST API​

- Get Long Short Ratio [NEW]Add a new endpoint to query long short ratio market data

## 2023-09-25​

### REST API​

- Get Open Orders [UPDATE]`stopOrderType` has new enumeration value: `OcoOrder`, used to indicate the Spot OCO Order (Unified Trading Account)

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- `stopOrderType` has new enumeration value: `OcoOrder`, used to indicate the Spot OCO Order (Unified Trading Account)

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- `execType` has new enumeration value: `MovePosition`, used to indicate the position movement execution (Unified Trading Account)

[Get Transaction Log](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]
- `type` has new enumeration values: `TRANSFER_IN_INS_LOAN`, `TRANSFER_OUT_INS_LOAN` (Unified Trading Account)

[Get Transaction Log](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]
- `type` has new enumeration values: `SPOT_REPAYMENT_SELL`, `SPOT_REPAYMENT_BUY` (Unified Trading Account)

### Websocket API​

- Order [UPDATE]`stopOrderType` has new enumeration value: `OcoOrder`, used to indicate the Spot OCO Order (Unified Trading Account)

## 2023-09-21​

### REST API​

- Get Trade History [UPDATE]Add response field `seq`

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- Add response field `seq`

[Get Collateral Info](https://bybit-exchange.github.io/docs/v5/account/collateral-info) [UPDATE]
- Added "freeBorrowAmount" field: This field represents the amount of borrowing within your total borrowing amount that is exempt from interest charges
- deprecated "freeBorrowingAmount" field: The value of this field has been migrated to "freeBorrowingLimit", and it keeps empty string.
- Added "freeBorrowingLimit" field: This field indicates the maximum limit for interest-free borrowing. If the unrealized loss portion exceeds this limit, all borrowings will be subject to interest.

### WebSocket API​

- Position [UPDATE]Add response field `seq`
- Can subscribe specific category position

[Execution](https://bybit-exchange.github.io/docs/v5/websocket/private/execution) [UPDATE]
- Add response field `seq`
- Can subscribe specific category position

[Order](https://bybit-exchange.github.io/docs/v5/websocket/private/order) [UPDATE]
- Can subscribe specific category position

## 2023-09-18​

### REST API​

- Create Sub UID API Key [UPDATE]Request parameter `ips` is actually string type. array can be used, but string is more explicit
- Request parameter `Derivatives` has been deprecated due to auto identification by system

[Modify Master API Key](https://bybit-exchange.github.io/docs/v5/user/modify-master-apikey) [UPDATE]
- Request parameter `ips` is actually string type. array can be used, but string is more explicit
- Request parameter `Derivatives` has been deprecated due to auto identification by system

[Modify Sub API Key](https://bybit-exchange.github.io/docs/v5/user/modify-sub-apikey) [UPDATE]
- Add a new request param `apikey`, which can be used for Master account to manage sub account api key
- Request parameter `ips` is actually string type. array can be used, but string is more explicit
- Request parameter `Derivatives` has been deprecated due to auto identification by system

[Delete Sub API Key](https://bybit-exchange.github.io/docs/v5/user/rm-sub-apikey) [UPDATE]
- Add a new request param `apikey`, which can be used for Master account to delete sub account api key

## 2023-09-14​

### REST API​

- Get Product Info [UPDATE]Add a new response field `spotMarginTrading`
- You can use api key and secret to call this endpoint to get your private data if you are eligible.

[Get Margin Coin Info](https://bybit-exchange.github.io/docs/v5/otc/margin-coin-convert-info) [UPDATE]
- You can use api key and secret to call this endpoint to get your private data if you are eligible.

[Get Loan Orders](https://bybit-exchange.github.io/docs/v5/otc/loan-info) [UPDATE]
- Add a new response field `spotMarginTrading`
- The meaning of `parentUid` is changed. After the change, it represents the uid that bound with OTC loan product

[Get LTV](https://bybit-exchange.github.io/docs/v5/otc/ltv-convert) [NEW]
- The meaning of `parentUid` is changed. After the change, it represents the uid that bound with OTC loan product

## 2023-09-07​

### REST API​

- Get Open Orders [UPDATE]By `/v5/order/realtime?category=inverse`, you can get all inverse contracts opening orders

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- By `/v5/position/list?category=inverse`, you can get all inverse contracts holding positions
- `symbol` supports multiple values for category=inverse

## 2023-09-04​

### REST API​

- Batch Place Order [UPDATE]UTA Pro: support USDT perp, USDC perp & USDC Futures batch place orders

[Batch Amend Order](https://bybit-exchange.github.io/docs/v5/order/batch-amend) [UPDATE]
- UTA Pro: support USDT perp, USDC perp & USDC Futures batch amend orders

[Batch Cancel Order](https://bybit-exchange.github.io/docs/v5/order/batch-cancel) [UPDATE]
- UTA Pro: support USDT perp, USDC perp & USDC Futures batch cancel orders

## 2023-08-31​

### REST API​

- Cancel All Orders [UPDATE]add new request params `stopOrderType`
- enumerations `Order` and `StopOrder` for orderFilter support linear and inverse product types

[Get Deposit Records (on chain)](https://bybit-exchange.github.io/docs/v5/asset/deposit/deposit-record) [UPDATE]
- Add a new response field `depositType`. You can process deposit assets when the deposit has daily deposit limit or abnormal deposit issue.

[Get Sub Deposit Records (on chain)](https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-record) [UPDATE]
- Add a new response field `depositType`. You can process deposit assets when the deposit has daily deposit limit or abnormal deposit issue.

## 2023-08-30​

### REST API​

- Get API Key Information [UPDATE]Add a new response field `parentUid`

## 2023-08-25​

### REST API​

- Enable Universal Transfer for Sub UID [DEPRECATE]Deprecate this endpoint due to business logic is updated

## 2023-08-24​

### REST API​

- Get VIP Margin Data [NEW]Add new endpoint used to query margin data for different VIP levels (Unified Account)

[Toggle Margin Trade](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/switch-mode) [UPDATE]
- Adjust error code

| Old error code | New error code | Msg |
| --- | --- | --- |
| 110075 | 182021 | Cannot enable spot margin while in isolated margin mode. Please switch to cross margin mode or portfolio margin mode to trade spot with margin. |

## 2023-08-22​

### REST API​

- Get Transaction Log [UPDATE]Add a new response field `id`, which is a unique id for each transaction log

[Get Status And Leverage](https://bybit-exchange.github.io/docs/v5/spot-margin-uta/status) [NEW]
- Add a new endpoint to query margin trade status and leverage of Unified account

## 2023-08-17​

### REST API​

- Get Deposit Records (on chain) [UPDATE]Add a new response field `batchReleaseLimit`, which means the daily deposit limit amount

[Get Sub Deposit Records (on chain)](https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-record) [UPDATE]
- Add a new response field `batchReleaseLimit`, which means the daily deposit limit amount

[Get Master Deposit Address](https://bybit-exchange.github.io/docs/v5/asset/deposit/master-deposit-addr) [UPDATE]
- Add a new response field `batchReleaseLimit`, which means the daily deposit limit amount

[Get Sub Deposit Address](https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-addr) [UPDATE]
- Add a new response field `batchReleaseLimit`, which means the daily deposit limit amount

## 2023-08-11​

### REST API​

- Get Wallet Balance [UPDATE]`availableToBorrow` always returns `""` because main-sub uids share borrow quota

[Get Collateral Info](https://bybit-exchange.github.io/docs/v5/account/collateral-info) [UPDATE]
- Add new response field `borrowUsageRate`
- `availableToBorrow` is a shared value across main-sub uids

### Websocket API​

- Wallet [UPDATE]`availableToBorrow` always returns `""` because main-sub uids share borrow quota

## 2023-08-10​

### REST API​

- Set Collateral Coin [NEW]Add a new endpoint to set collateral coin in the Unified account

[Get Account Info](https://bybit-exchange.github.io/docs/v5/account/account-info) [UPDATE]
- Add a new response field `isMasterTrader` to indicate if the account is master trader (copytrading)

## 2023-08-08​

### REST API​

- Upgrade to Unified Account [UPDATE]Supports account upgraded to UTA Pro

[Get Account Info](https://bybit-exchange.github.io/docs/v5/account/account-info) [UPDATE]
- "unifiedMarginStatus" has a new enum `4` to indicate UTA Pro

## 2023-08-07​

### REST API​

- Place Order [UPDATE]Spot supports conditional order, orderFilter adds a new enum value `StopOrder`

[Cancel Order](https://bybit-exchange.github.io/docs/v5/order/cancel-order) [UPDATE]
- Spot supports conditional order, orderFilter adds a new enum value `StopOrder`

[Cancel All Orders](https://bybit-exchange.github.io/docs/v5/order/cancel-all) [UPDATE]
- Spot supports conditional order, orderFilter adds a new enum value `StopOrder`

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- Spot supports conditional order, orderFilter adds a new enum value `StopOrder`, stopOrderType reuses `Stop` for Futures and Spot conditional order

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Spot supports conditional order, orderFilter adds a new enum value `StopOrder`, stopOrderType reuses `Stop` for Futures and Spot conditional order

### Websocket API​

- Order [UPDATE]stopOrderType reuses `Stop` for Futures and Spot conditional order
- Add new field `feeCurrency`, which is used to identify Spot trading fee asset
- `updatedTime` has value for classic account Spot trading

## 2023-07-31​

### REST API​

- Get Position InfoAdjust `liqPrice` value logic. It only has value when minPrice [Get Collateral Info](https://bybit-exchange.github.io/docs/v5/account/collateral-info)
- Add new response field `collateralSwitch`

[Get Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance)
- Add new response field `collateralSwitch`

### WebSocket API​

- PositionAdjust `liqPrice` value logic. It only has value when minPrice [Wallet](https://bybit-exchange.github.io/docs/v5/websocket/private/wallet)
- Add new response field `collateralSwitch`

## 2023-07-24​

### REST API​

- Get Product InfoAdd new Response fields: `USDTPerpetualOpenLine``USDCContractOpenLine`, `USDCOptionsOpenLine`, `USDTPerpetualCloseLine`,
`USDCContractCloseLine`, `USDCOptionsCloseLine`, `USDCContractSymbols`, `USDCOptionsSymbols`, `marginLeverage`,
`USDTPerpetualLeverage`, `symbol`, `leverage`, `USDCContractLeverage`

[Get Loan Orders](https://bybit-exchange.github.io/docs/v5/otc/loan-info)
- Add new Response fields: `USDTPerpetualOpenLine`, `USDCContractOpenLine`, `USDCOptionsOpenLine`, `USDTPerpetualCloseLine`,
`USDCContractCloseLine`, `USDCOptionsCloseLine`, `USDCContractSymbols`, `USDCOptionsSymbols`, `marginLeverage`,
`USDTPerpetualLeverage`, `symbol`, `leverage`, `USDCContractLeverage`

[Get Single Coin Balance](https://bybit-exchange.github.io/docs/v5/asset/balance/account-coin-balance)
- Add new request param: `toAccountType`, `toMemberId`, `withLtvTransferSafeAmount`
- Add new response field: `ltvTransferSafeAmount`

Add error codes for UTA with OTC loan when trade Spot, Futures and Option
| New error code | Description |
| --- | --- |
| 30133 | USDT Perp: When the trading pair is not in the whitelist |
| 30134 | USDC Contract: When the trading pair is not in the whitelist |
| 30135 | USDT Perp: When you try to change a leverage higher than the maximum leverage in OTC loan |
| 30136 | USDC Contract: When you try to change a leverage higher than the maximum leverage in OTC loan |
| 3200316 | Option: restrict to trade |
| 3200317 | Option: restrict to buy |
| 170709 | Spot: When the trading pair is not in the whitelist |
| 170215 | Spot: restrict to buy |
| 170216 | Spot: margin leverage exceeded |
| 170220 | Spot: restrict to trade |

## 2023-07-13​

### REST API​

- Get Sub UID ListAdd a new response field `accountMode` to distinguish the account mode

[Get Kline](https://bybit-exchange.github.io/docs/v5/market/kline)
- Increase max limit from 200 to 1000

[Get Mark Price Kline](https://bybit-exchange.github.io/docs/v5/market/mark-kline)
- Increase max limit from 200 to 1000

[Get Index Price Kline](https://bybit-exchange.github.io/docs/v5/market/index-kline)
- Increase max limit from 200 to 1000

[Get Premium Index Price Kline](https://bybit-exchange.github.io/docs/v5/market/premium-index-kline)
- Increase max limit from 200 to 1000

## 2023-07-04​

### REST API​

- Get Bybit Sever TimeAdd a new API to get server time

[Set Disconnect Cancel All](https://bybit-exchange.github.io/docs/v5/order/dcp) [Option]
- Expand configurable disconnection window time from [10, 300] to [3, 300] seconds

## 2023-06-26​

### WebSocket API​

- Orderbook [Spot]Improve the push frequency from 100ms to 20ms of level 50

## 2023-06-24​

### REST API​

- Get Instruments Info [UPDATE]When category=linear, add a new response params `copyTrading` to indicate this trading pair supporting copy trade or not for UTA and normal account

## 2023-06-15​

### REST API​

- Get Pre-upgrade Transaction Log [NEW]A brand new endpoint to for Unified account to query pre-upgrade USDC Derivatives transaction logs

[Get Pre-upgrade Delivery Record](https://bybit-exchange.github.io/docs/v5/pre-upgrade/delivery) [NEW]
- A brand new endpoint to for Unified account to query pre-upgrade Option delivery records

[Get Pre-upgrade USDC Session Settlement](https://bybit-exchange.github.io/docs/v5/pre-upgrade/settlement) [NEW]
- A brand new endpoint to for Unified account to query pre-upgrade USDC Perpetual session settlement

[Create Sub UID](https://bybit-exchange.github.io/docs/v5/user/create-subuid) [UPDATE]
- Support to create a UTA sub account

[Modify Master API Key](https://bybit-exchange.github.io/docs/v5/user/modify-master-apikey) [UPDATE]
- "permissions" becomes non-mandatory param

[Modify Sub API Key](https://bybit-exchange.github.io/docs/v5/user/modify-sub-apikey) [UPDATE]
- "permissions" becomes non-mandatory param

[Get UID Wallet Type](https://bybit-exchange.github.io/docs/v5/user/wallet-type) [NEW]
- A brand new endpoint to check the wallet types supported

## 2023-06-14​

### REST API​

- Get Broker Earning [NEW]A brand new endpoint for exchange broker to get the earnings.

## 2023-06-08​

### REST API​

- Get Fee Rate [UPDATE]Support to get USDC perp & USDC futures trading fee rate

## 2023-06-07​

### REST API​

- Withdraw [UPDATE]Add new request param `feeType`, which is used to select the withdrawal fee operation type when withdraw

## 2023-06-02​

### REST API​

- Get Affiliate User Info [New]A brand new endpoint, which is used for affiliate to check the basic information of their users

## 2023-06-01​

### REST API​

- Set Margin Mode [UPDATE]UTA account supports isolated margin, a new enum `ISOLATED_MARGIN` for request param "setMarginMode"

[Switch Position Mode](https://bybit-exchange.github.io/docs/v5/position/position-mode) [UPDATE]
- UTA account supports Hedge mode for USDT Perp when it is isolated margin or cross margin mode

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- Add new response field `positionBalance`

[Get Account Info](https://bybit-exchange.github.io/docs/v5/account/account-info) [UPDATE]
- "marginTrade" field has a new enum value - `ISOLATED_MARGIN`

[Set Auto Add Margin](https://bybit-exchange.github.io/docs/v5/position/auto-add-margin) [UPDATE]
- add category enum `linear` for UTA

[Add Or Reduce Margin](https://bybit-exchange.github.io/docs/v5/position/manual-add-margin) [UPDATE]
- A brand new endpoint is used to add or reduce specific margin you want

### WebSocket API​

- Position [UPDATE]Add new response param `positionBalance`

## 2023-05-30​

### REST API​

- Get Instruments Info [UPDATE]When category=spot, add a new response params `marginTrading` to indicate this trading pair supporting margin trade or not for UTA and normal account

## 2023-05-23​

### REST API​

- Place Order [UPDATE]Add new request params for new TP/SL `tpslMode`, `tpLimitPrice`, `slLimitPrice`, `tpOrderType`, `slOrderType`

[Amend Order](https://bybit-exchange.github.io/docs/v5/order/amend-order) [UPDATE]
- Add new request params for new TP/SL `tpLimitPrice`, `slLimitPrice`

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- Add new response params for new TP/SL `tpslMode`, `tpLimitPrice`, `slLimitPrice`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- Add new response params for new TP/SL `tpslMode`, `tpLimitPrice`, `slLimitPrice`

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- `tpslMode` in the position is deprecated

[Set Trading Stop](https://bybit-exchange.github.io/docs/v5/position/trading-stop) [UPDATE]
- Add new request params for new TP/SL `tpslMode`, `tpLimitPrice`, `slLimitPrice`, `tpOrderType`, `slOrderType`

### WebSocket API​

- Position [UPDATE]`tpslMode` in the position is deprecated

[Order](https://bybit-exchange.github.io/docs/v5/websocket/private/order) [UPDATE]
- Add new response params for new TP/SL `tpslMode`, `tpLimitPrice`, `slLimitPrice`

## 2023-05-10​

### REST API​

- Set Risk Limit [UPDATE]Adjust the error code

| Old error code | New error code | Msg |
| --- | --- | --- |
| 10001 | 110075 | RiskId is not modified |

## 2023-05-05​

### REST API​

- Get Margin Coin Info With Conversion Rate [NEW]add new endpoint to query Margin Coin Info With Conversion Rate

[Get LTV with Ladder Conversion Rate](https://bybit-exchange.github.io/docs/v5/otc/ltv-convert) [NEW]
- add new endpoint to query LTV With Conversion Rate

## 2023-05-04​

### REST API​

- Get Trade History [UPDATE]`symbol` is no longer mandatory for normal account when get derivatives

[Get Closed PnL](https://bybit-exchange.github.io/docs/v5/position/close-pnl) [UPDATE]
- `symbol` is no longer mandatory for normal account when get derivatives

## 2023-04-20​

### REST API​

- Place Order [UPDATE]add new request param `smpType` used to select SMP execution type

[Get Open Orders](https://bybit-exchange.github.io/docs/v5/order/open-order) [UPDATE]
- add new response fields `smpType`, `smpOrderId`, `smpGroup`
- add new enum `cancelBySmp` of `cancelType`

[Get Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) [UPDATE]
- add new response fields `smpType`, `smpOrderId`, `smpGroup`
- add new enum `cancelBySmp` of `cancelType`

[Get Account Info](https://bybit-exchange.github.io/docs/v5/account/account-info) [UPDATE]
- add new response fields `dcpStatus`, `timeWindow`, `smpGroup`

### WebSocket API​

- Order [UPDATE]add new response fields `smpType`, `smpOrderId`, `smpGroup`
- add new enum `cancelBySmp` of `cancelType`

## 2023-04-06​

### REST API​

- Get Instruments Info [UPDATE]add request param `status` to filter symbol status

## 2023-04-04​

### REST API​

- Get Instruments Info [UPDATE]add request param `startTime` `endTime`, effective for UTA mode
- add response param `placeType`, used for option

## 2023-04-04​

### REST API​

- Get Order History [UPDATE]add request param `startTime` `endTime`, effective for UTA mode
- add response param `placeType`, used for option

[Get Trade History](https://bybit-exchange.github.io/docs/v5/order/execution) [UPDATE]
- add response param `closedSize`

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- add response param `adlRankIndicator`

### WebSocket API​

- Position [UPDATE]add response param `adlRankIndicator`
- `category` field is added to UTA stream

[Order](https://bybit-exchange.github.io/docs/v5/websocket/private/order) [UPDATE]
- add response param `placeType`, used for option

[Execution](https://bybit-exchange.github.io/docs/v5/websocket/private/execution) [UPDATE]
- add response param `closedSize`

## 2023-03-24​

### REST API​

- Get Fee Rate [UPDATE]Support to get Spot fee rate

## 2023-03-23​

### REST API​

- Get Wallet Balance [UPDATE]Add a new response field `accountLTV`

[Create Sub UID API Key](https://bybit-exchange.github.io/docs/v5/user/create-subuid-apikey) [UPDATE]
- Add a new permission value `SubMemberTransferList` for Sub account Wallet

[Create Universal Transfer](https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer) [UPDATE]
- Support to use Sub acct api key to request

[Get Universal Transfer List](https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer-list) [UPDATE]
- Support to use Sub acct api key to request

### WebSocket API​

- Wallet [UPDATE]Add a new response field `accountLTV`

## 2023-03-22​

### REST API​

- Get Announcement [NEW]A brand new API to get Bybit announcements

## 2023-03-15​

### REST API​

- Get Single Coin Balance [UPDATE]Add a new request param `withTransferSafeAmount` and a new response field `transferSafeAmount`

## 2023-03-10​

### REST API​

- Get Instruments Info [UPDATE]Unify the enums of `status` for Spot, Derivatives and Options. Use `Trading`, `Closed`, `Settling`, `PreLaunch`, `Deliverying`
- Remove duplicate `category` field in the Options response

[Get Fee Rate](https://bybit-exchange.github.io/docs/v5/account/fee-rate) [UPDATE]
- Support to get Options trading fee rate

## 2023-03-09​

### REST API​

- Set Leverage [UPDATE]UTA user can set up to 10X for margin trade

[Get Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance) [UPDATE]
- Before adjustment: normal account gets error code and message when call accountType=UNIFIED.After adjustment: normal account gets http code 400 when call accountType=UNIFIED

## 2023-02-28​

### REST API​

- IP Rate Limit [UPDATE]Due to the switch to CloudFront, the IP limit rules have been adjusted appropriately

[Get Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance) [UPDATE]
- Add a new response field `bonus`

[Get Transaction Log](https://bybit-exchange.github.io/docs/v5/account/transaction-log) [UPDATE]
- Add a new response field `bonusChange`

[Get Coin Information](https://bybit-exchange.github.io/docs/v5/asset/coin-info) [UPDATE]
- Add a new response field `withdrawPercentageFee`

[Create Sub UID](https://bybit-exchange.github.io/docs/v5/user/create-subuid) [UPDATE]
- Add a new request param `password`

[Get API Key Information](https://bybit-exchange.github.io/docs/v5/user/apikey-info) [UPDATE]
- Add a new response field `isMaster`

[Get Delay Withdraw Amount](https://bybit-exchange.github.io/docs/v5/asset/balance/delay-amount) [NEW]
- New api to know that how much amount cannot be withdrawn temporarily due to risk

[Get Internal Deposit Records (across Bybit)](https://bybit-exchange.github.io/docs/v5/asset/deposit/internal-deposit-record) [NEW]
- New api to get internal deposit on Bybit platform

### WebSocket API​

- Wallet [UPDATE]Add a new field `bonus`

## 2023-02-20​

### REST API​

- Set Deposit Account [NEW]You can set auto-transfer-to account type after deposit

[Get API Key Information](https://bybit-exchange.github.io/docs/v5/user/apikey-info) [UPDATE]
- Add a new response filed: `rsaPublicKey`

[Create Universal Transfer](https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer) [UPDATE]
- Change rate limit from 20 req/min to 1 req/sec

[Get Universal Transfer List](https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer-list) [UPDATE]
- Change rate limit from 60 req/min to 2 req/sec

## 2023-02-15​

### REST API​

- User [NEW]Add a set of user & api key related endpoints for V5

## 2023-02-14​

### REST API​

- Get Fee Rate (Derivatives) [NEW]Get the trading fee rate for derivatives

[Withdraw](https://bybit-exchange.github.io/docs/v5/asset/withdraw) [UPDATE]
- Select the wallet to be withdrawn from
- The default withdrawn wallet is Spot wallet

| Req param | Required | Type | Comments |
| --- | --- | --- | --- |
| accountType | false | string | Select the wallet to be withdrawn from `SPOT`: spot wallet (default)`FUND`: Funding wallet |

## 2023-02-09​

### REST API​

- Get All Coins Balance [NEW]Get all coins balance of a specified account in one request

[Set Disconnect Cancel All](https://bybit-exchange.github.io/docs/v5/order/dcp) [NEW]
- Set DCP for Options trade

[Set MMP](https://bybit-exchange.github.io/docs/v5/account/set-mmp) [NEW]
- Set MMP for Options tarde

[Reset MMP](https://bybit-exchange.github.io/docs/v5/account/reset-mmp) [NEW]
- To release MMP frozen status

[Get MMP State](https://bybit-exchange.github.io/docs/v5/account/get-mmp-state) [NEW]
- Get MMP settings info

## 2023-01-19​

### REST API​

- Set Margin Mode [UPDATE]Portfolio margin mode supports USDT Perpetual

[Get Position Info](https://bybit-exchange.github.io/docs/v5/position) [UPDATE]
- For portfolio margin mode, `positionIM`, `positionMM`, `leverage`, `riskLimitValue` returns "", `riskId` returns 0

[Get Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance) [UPDATE]
- For portfolio margin mode, `totalOrderIM`, `totalPositionIM`, `totoalPositionMM` returns ""

### WebSocket API​

- Position [UPDATE]For portfolio margin mode, `positionIM`, `positionMM`, `leverage`, `riskLimitValue` returns "", `riskId` returns 0

[Wallet](https://bybit-exchange.github.io/docs/v5/websocket/private/wallet) [UPDATE]
- For portfolio margin mode, `totalOrderIM`, `totalPositionIM`, `totoalPositionMM` returns ""

## 2023-01-16​

### REST API​

- Get Tickers [spot]`usdIndexPrice` has been added to response. It means USD index price, which can be empty.

### WebSocket API​

- Tickers [spot]`usdIndexPrice` has been added to stream. It means USD index price, which can be empty.

[Orderbook](https://bybit-exchange.github.io/docs/v5/websocket/public/orderbook) [linear contract & inverse contract]
- Add 500 level depth, push frequency is 100ms

## 2023-01-09​

### WebSocket API​

- Tickers [linear contract & inverse contract]`nextFundingTime` has been changed from dataTime `2023-01-05T08:00:00Z` to timestamp (ms) `1672905600000`
- `predicatedFundingRate` has been removed from stream