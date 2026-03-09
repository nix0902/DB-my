# Get Orderbook

> Source: https://bybit-exchange.github.io/docs/v5/market/orderbook

---

**On this page
# Get Orderbook

Query for orderbook depth data.

> Covers: Spot / USDT contract / USDC contract / Inverse contract / Option**

- Contract: 1000-level of orderbook data
- Spot: 1000-level of orderbook data
- Option: 25-level of orderbook data

> **note**
> 
> 

> **note**
> 
> 

### HTTP Request​

GET `/v5/market/orderbook`

### Request Parameters​

| Parameter | Required | Type | Comments |
| --- | --- | --- | --- |
| category | true | string | Product type. `spot`, `linear`, `inverse`, `option` |
| symbol | true | string | Symbol name, like `BTCUSDT`, uppercase only |
| limit | false | integer | Limit size for each bid and ask`spot`: [`1`, `200`]. Default: `1`.`linear`&`inverse`: [`1`, `500`]. Default: `25`.`option`: [`1`, `25`]. Default: `1`. |

### Response Parameters​

| Parameter | Type | Comments |
| --- | --- | --- |
| s | string | Symbol name |
| b | array | Bid, buyer. Sorted by price in descending order |
| > b[0] | string | Bid price |
| > b[1] | string | Bid size |
| a | array | Ask, seller. Sorted by price in ascending order |
| > a[0] | string | Ask price |
| > a[1] | string | Ask size |
| ts | integer | The timestamp (ms) that the system generates the data |
| u | integer | Update ID, is always in sequenceFor contract, corresponds to `u` in the 1000-level WebSocket orderbook streamFor spot, corresponds to `u` in the 1000-level WebSocket orderbook stream |
| seq | integer | Cross sequence You can use this field to compare different levels orderbook data, and for the smaller seq, then it means the data is generated earlier. |
| cts | integer | The timestamp from the matching engine when this orderbook data is produced. It can be correlated with `T` from public trade channel |

[RUN >>](https://bybit-exchange.github.io/docs/api-explorer/v5/market/orderbook)
---

### Request Example​

- HTTP
- Python
- Go
- Java
- Node.js

```
GET /v5/market/orderbook?category=spot&symbol=BTCUSDT HTTP/1.1
Host: api-testnet.bybit.com

```

```
from pybit.unified_trading import HTTP
session = HTTP(testnet=True)
print(session.get_orderbook(
 category="linear",
 symbol="BTCUSDT",
))

```

```
import (
 "context"
 "fmt"
 bybit "github.com/bybit-exchange/bybit.go.api"
)
client := bybit.NewBybitHttpClient("", "", bybit.WithBaseURL(bybit.TESTNET))
params := map[string]interface{}{"category": "spot", "symbol": "BTCUSDT"}
client.NewUtaBybitServiceWithParams(params).GetOrderBookInfo(context.Background())

```

```
import com.bybit.api.client.domain.CategoryType;
import com.bybit.api.client.domain.market.*;
import com.bybit.api.client.domain.market.request.MarketDataRequest;
import com.bybit.api.client.service.BybitApiClientFactory;
var client = BybitApiClientFactory.newInstance().newAsyncMarketDataRestClient();
var orderbookRequest = MarketDataRequest.builder().category(CategoryType.SPOT).symbol("BTCUSDT").build();
client.getMarketOrderBook(orderbookRequest,System.out::println);

```

```
const { RestClientV5 } = require('bybit-api');

const client = new RestClientV5({
 testnet: true,
});

client
 .getOrderbook({
 category: 'linear',
 symbol: 'BTCUSDT',
 })
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
 "s": "BTCUSDT",
 "a": [
 [
 "65557.7",
 "16.606555"
 ]
 ],
 "b": [
 [
 "65485.47",
 "47.081829"
 ]
 ],
 "ts": 1716863719031,
 "u": 230704,
 "seq": 1432604333,
 "cts": 1716863718905
 },
 "retExtInfo": {},
 "time": 1716863719382
}

```