# Get USDC Session Settlement

> Source: https://bybit-exchange.github.io/docs/v5/asset/settlement

---

On this page
# Get USDC Session Settlement

Query session settlement records of USDC perpetual and futures

info
- During periods of extreme market volatility, this interface may experience increased latency or temporary delays in data delivery

### HTTP Request​

GET `/v5/asset/settlement-record`

### Request Parameters​

| Parameter | Required | Type | Comments |
| --- | --- | --- | --- |
| category | true | string | Product type `linear`(USDC contract) |
| symbol | false | string | Symbol name, like `BTCPERP`, uppercase only |
| startTime | false | integer | The start timestamp (ms) startTime and endTime are not passed, return 30 days by defaultOnly startTime is passed, return range between startTime and startTime + 30 days Only endTime is passed, return range between endTime-30 days and endTimeIf both are passed, the rule is endTime - startTime  symbol | string | Symbol name |
| > side | string | `Buy`,`Sell` |
| > size | string | Position size |
| > sessionAvgPrice | string | Settlement price |
| > markPrice | string | Mark price |
| > realisedPnl | string | Realised PnL |
| > createdTime | string | Created time (ms) |
| nextPageCursor | string | Refer to the `cursor` request parameter |

[RUN >>](https://bybit-exchange.github.io/docs/api-explorer/v5/asset/settlement)
### Request Example​

- HTTP
- Python
- Node.js

```
GET /v5/asset/settlement-record?category=linear HTTP/1.1
Host: api-testnet.bybit.com
X-BAPI-SIGN: XXXXX
X-BAPI-API-KEY: xxxxxxxxxxxxxxxxxx
X-BAPI-TIMESTAMP: 1672284883483
X-BAPI-RECV-WINDOW: 5000

```

```
from pybit.unified_trading import HTTP
session = HTTP(
    testnet=True,
    api_key="xxxxxxxxxxxxxxxxxx",
    api_secret="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
)
print(session.get_usdc_contract_settlement(
    category="linear",
))

```

```
const { RestClientV5 } = require('bybit-api');

const client = new RestClientV5({
  testnet: true,
  key: 'xxxxxxxxxxxxxxxxxx',
  secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});

client
  .getSettlementRecords({ category: 'linear' })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

```

### Response Example​

```
{
    "retCode": 0,
    "retMsg": "OK",
    "result": {
        "nextPageCursor": "116952%3A1%2C116952%3A1",
        "category": "linear",
        "list": [
            {
                "realisedPnl": "-71.28",
                "symbol": "BTCPERP",
                "side": "Buy",
                "markPrice": "16620",
                "size": "1.5",
                "createdTime": "1672214400000",
                "sessionAvgPrice": "16620"
            }
        ]
    },
    "retExtInfo": {},
    "time": 1672284884285
}

```