# Get Bybit Server Time

> Source: https://bybit-exchange.github.io/docs/v5/market/time

---

# Get Bybit Server Time

> **NOTE**
> 
> 

> **NOTE**
> 
> 

### HTTP Request​

GET `/v5/market/time`

### Request Parameters​

None

### Response Parameters​

| Parameter | Type | Comments |
| --- | --- | --- |
| timeSecond | string | Bybit server timestamp (sec) |
| timeNano | string | Bybit server timestamp (nano) |

[RUN >>](https://bybit-exchange.github.io/docs/api-explorer/v5/market/time)
---

### Request Example​

- HTTP
- Python
- Java
- Go
- Node.js

```
GET /v5/market/time HTTP/1.1
Host: api.bybit.com

```

```
from pybit.unified_trading import HTTP
session = HTTP(testnet=True)
print(session.get_server_time())

```

```
import com.bybit.api.client.service.BybitApiClientFactory;
var client = BybitApiClientFactory.newInstance().newAsyncMarketDataRestClient();
client.getServerTime(System.out::println);

```

```
import (
 "context"
 "fmt"
 bybit "github.com/bybit-exchange/bybit.go.api"
)
client := bybit.NewBybitHttpClient("", "", bybit.WithBaseURL(bybit.TESTNET))
client.NewUtaBybitServiceNoParams().GetServerTime(context.Background())

```

```
const { RestClientV5 } = require('bybit-api');

const client = new RestClientV5({
 testnet: true,
});

client
 .getServerTime()
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
 "timeSecond": "1688639403",
 "timeNano": "1688639403423213947"
 },
 "retExtInfo": {},
 "time": 1688639403423
}

```