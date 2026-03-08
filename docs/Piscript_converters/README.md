# 🌲 PineScript Converters & Transpilers

> Коллекция инструментов для конвертации и выполнения Pine Script вне TradingView

---

## 📋 Обзор

Pine Script — это доменно-ориентированный язык программирования, созданный TradingView для написания пользовательских индикаторов и стратегий технического анализа. Данная коллекция содержит инструменты, позволяющие выполнять Pine Script код вне платформы TradingView.

---

## 🗂️ Структура репозиториев

```
📁 Piscript_converters/
│
├── 📄 README.md                    # Этот файл
│
├── 📁 PineTS/                      # 🟢 TypeScript/JavaScript Runtime
├── 📁 pine-transpiler/             # 🔵 Pine → PineJS Transpiler
├── 📁 pynecore/                    # 🟡 Python Runtime (AST Transform)
├── 📁 pinescript-to-python/        # 🟠 Python Backtesting Framework
├── 📁 pinecone/                    # 🔴 Rust Interpreter
├── 📁 npm-packages/                # 📦 NPM Packages
│   └── 📁 vibetrader-pinets/       #    @vibetrader/pinets
│
└── 📁 pinets-jasonborn/            # Fork/Alternative PineTS
```

---

## 🟢 1. PineTS — TypeScript/JavaScript Runtime

**Репозиторий**: `github.com/QuantForgeOrg/PineTS`  
**NPM**: `pinets`  
**Лицензия**: AGPL-3.0 / Commercial

### Описание

PineTS — это open-source транспайлер и runtime, который позволяет выполнять Pine Script в JavaScript/TypeScript окружении. Поддерживает Node.js, браузеры, Deno, Bun.

### Особенности

- ✅ **Native Pine Script v5/v6** — запуск оригинального кода TradingView
- ✅ **60+ технических индикаторов** — SMA, EMA, RSI, MACD, Bollinger Bands и др.
- ✅ **Multi-Timeframe Analysis** — поддержка `request.security()`
- ✅ **Real-time Streaming** — живая обработка данных
- ✅ **Data Providers** — Binance, кастомные API, CSV

### Пример использования

```javascript
import { PineTS, Provider } from 'pinets';

const pineTS = new PineTS(Provider.Binance, 'BTCUSDT', '1h', 100);

const { plots } = await pineTS.run(`
//@version=5
indicator("EMA Cross")
plot(ta.ema(close, 9), "Fast", color.blue)
plot(ta.ema(close, 21), "Slow", color.red)
`);

console.log('EMA values:', plots['Fast'].data);
```

### API Coverage

| Namespace | Coverage | Functions |
|-----------|:--------:|-----------|
| `ta.*` | 85% | 50+ indicators |
| `math.*` | 90% | 25+ functions |
| `array.*` | 80% | Full array ops |
| `matrix.*` | 60% | Basic support |
| `request.*` | 70% | security() |
| `str.*` | 90% | String ops |

### Структура проекта

```
PineTS/
├── 📁 src/
│   ├── 📄 PineTS.class.ts         # Main class
│   ├── 📁 namespaces/
│   │   ├── 📁 ta/                 # Technical Analysis (50+ indicators)
│   │   ├── 📁 math/               # Math functions
│   │   ├── 📁 array/              # Array operations
│   │   ├── 📁 map/                # Map operations
│   │   ├── 📁 matrix/             # Matrix operations
│   │   ├── 📁 input/              # Input handling
│   │   └── 📁 request/            # Multi-timeframe
│   ├── 📁 transpiler/
│   │   ├── 📁 pineToJS/           # Pine → JS transpiler
│   │   └── 📁 transformers/       # AST transformers
│   └── 📁 marketData/
│       ├── 📁 Binance/            # Binance provider
│       └── 📁 Mock/               # Mock provider
├── 📁 docs/
│   ├── 📁 api-coverage/           # API coverage docs
│   └── 📁 architecture/           # Architecture docs
└── 📁 tests/                      # Test suite
```

---

## 🔵 2. Pine Transpiler — Pine → PineJS

**Репозиторий**: `github.com/Opus-Aether-AI/pine-transpiler`  
**NPM**: `@opusaether/pine-transpiler`  
**Лицензия**: AGPL-3.0

### Описание

Транспайлер для конвертации Pine Script в JavaScript код, совместимый с TradingView Charting Library Custom Indicators (`PineJS`).

### Особенности

- ✅ **Pine Script v5/v6 Syntax** — полная поддержка синтаксиса
- ✅ **Standard Library Mapping** — `ta.*`, `math.*`, `time.*`, `str.*`
- ✅ **StdPlus Polyfills** — функции, отсутствующие в `PineJS.Std`
- ✅ **Zero Dependencies** — ядро без зависимостей
- ✅ **TypeScript First** — строгая типизация

### Пример использования

```typescript
import { transpileToPineJS } from '@opusaether/pine-transpiler';

const pineScript = `
//@version=5
indicator("My SMA", overlay=true)
len = input.int(14, "Length")
out = ta.sma(close, len)
plot(out, color=color.blue)
`;

const result = transpileToPineJS(pineScript, 'my-sma', 'My SMA');

if (result.success) {
  const indicator = result.indicatorFactory(PineJS);
  // Register with TradingView Charting Library
}
```

### Поддерживаемые функции

| Категория | Функции |
|-----------|---------|
| **Moving Averages** | `sma`, `ema`, `wma`, `rma`, `vwma`, `swma`, `alma`, `hma`, `linreg` |
| **Oscillators** | `rsi`, `stoch`, `tsi`, `cci`, `mfi`, `roc`, `mom`, `change` |
| **Volatility** | `atr`, `tr`, `stdev`, `variance`, `dev` |
| **Bands** | `bb`, `bbw`, `kc`, `kcw`, `donchian` |
| **Trend** | `adx`, `supertrend`, `sar`, `pivothigh`, `pivotlow` |
| **Cross Detection** | `cross`, `crossover`, `crossunder`, `rising`, `falling` |

### Архитектура

```
Pine Script Source
       │
       ▼
┌─────────────────┐
│  1. LEXER       │  Tokenizes Pine Script
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  2. PARSER      │  Recursive descent parser
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  3. AST         │  Abstract Syntax Tree
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  4. GENERATOR   │  JavaScript output
└─────────────────┘
```

### Структура проекта

```
pine-transpiler/
├── 📁 src/
│   ├── 📄 index.ts               # Main entry
│   ├── 📁 parser/
│   │   ├── 📄 lexer.ts           # Tokenizer
│   │   ├── 📄 parser.ts          # Parser
│   │   └── 📄 ast.ts             # AST definitions
│   ├── 📁 generator/
│   │   ├── 📄 ast-generator.ts   # Code generation
│   │   └── 📄 metadata-visitor.ts
│   ├── 📁 mappings/
│   │   ├── 📄 technical-analysis.ts
│   │   ├── 📄 math.ts
│   │   ├── 📄 time.ts
│   │   └── 📄 price-sources.ts
│   ├── 📁 runtime/
│   │   └── 📁 helpers/
│   └── 📁 cli/
│       └── 📁 commands/
├── 📁 tests/                     # 800+ tests
└── 📄 LIMITATIONS.md
```

---

## 🟡 3. PyneCore — Python Runtime

**Репозиторий**: `github.com/pynesys/pynecore`  
**PyPI**: `pynesys-pynecore`  
**Лицензия**: Apache 2.0

### Описание

PyneCore реализует семантику Pine Script в Python через AST-трансформации. Код Python модифицируется во время импорта, получая поведение bar-by-bar исполнения как в Pine Script.

### Особенности

- ✅ **Native Pine Script Semantics** — bar-by-bar выполнение в Python
- ✅ **AST Transformation** — код трансформируется при импорте
- ✅ **High Performance** — оптимизированная реализация
- ✅ **Series & Persistent Variables** — полная поддержка
- ✅ **Function Isolation** — изолированное состояние функций
- ✅ **Technical Analysis Library** — индикаторы Pine Script

### Пример использования

```python
"""
@pyne
"""
from pynecore import Series
from pynecore.lib import script, close, ta, plot, color, input

@script.indicator(title="Bollinger Bands")
def main(
    length=input.int("Length", 20, minval=1),
    mult=input.float("Multiplier", 2.0, minval=0.1, step=0.1),
    src=input.source("Source", close)
):
    basis = ta.sma(src, length)
    dev = mult * ta.stdev(src, length)
    
    upper = basis + dev
    lower = basis - dev
    
    plot(basis, "Basis", color=color.orange)
    plot(upper, "Upper", color=color.blue)
    plot(lower, "Lower", color=color.blue)
```

### Инновационные концепции

1. **Magic Comment & Import Hook**
```python
"""
@pyne
"""
```

2. **Series Variables**
```python
price: Series[float] = close
previous_price = price[1]  # Доступ к предыдущему бару
```

3. **Persistent Variables**
```python
counter: Persistent[int] = 0
counter += 1  # Сохраняется между барами
```

4. **Function Isolation**
```python
def my_indicator(src, length):
    sum: Persistent[float] = 0
    sum += src
    return sum / length
```

### Структура проекта

```
pynecore/
├── 📁 src/pynecore/
│   ├── 📁 core/
│   │   ├── 📄 series.py           # Series implementation
│   │   ├── 📄 script.py           # Script runner
│   │   ├── 📄 script_runner.py
│   │   └── 📄 pine_cast.py        # Type casting
│   ├── 📁 lib/
│   │   ├── 📄 ta.py               # Technical Analysis
│   │   ├── 📄 math.py             # Math functions
│   │   ├── 📄 array.py            # Array operations
│   │   ├── 📄 strategy/           # Strategy framework
│   │   └── 📄 plot.py             # Plotting
│   ├── 📁 types/
│   │   ├── 📄 series.py
│   │   ├── 📄 color.py
│   │   └── 📄 order.py
│   ├── 📁 transformers/
│   │   ├── 📄 series.py           # AST transformers
│   │   └── 📄 persistent.py
│   └── 📁 cli/
│       └── 📁 commands/
├── 📁 docs/
│   ├── 📁 getting-started/
│   ├── 📁 overview/
│   └── 📁 advanced/
└── 📁 tests/
```

---

## 🟠 4. PineScript-to-Python — Backtesting Framework

**Репозиторий**: `github.com/loponly/pinescript-to-python`  
**Лицензия**: MIT  
**Автор**: Enkhbat.E

### Описание

Комплексный фреймворк для конвертации Pine Script стратегий в Python с продвинутым бэктестингом, оптимизацией и анализом.

### Особенности

- ✅ **Pine Script Conversion** — конвертация стратегий
- ✅ **Enhanced Backtesting** — мульти-таймфрейм бэктестинг
- ✅ **Multi-Stock Optimization** — параллельная оптимизация
- ✅ **Results & Analysis** — SQLite, отчёты, дашборды
- ✅ **Crypto Support** — BTC/USDT и другие пары

### Структура проекта

```
pinescript-to-python/
├── 📁 models/                    # Data classes
│   ├── 📄 strategy_params.py
│   └── 📄 trade_result.py
├── 📁 indicators/                # Technical indicators
│   ├── 📄 moving_averages.py
│   ├── 📄 momentum.py
│   ├── 📄 volatility.py
│   └── 📄 trend.py
├── 📁 signals/                   # Signal generation
├── 📁 trading/                   # Trade simulation
├── 📁 strategy/                  # Strategy orchestration
├── 📁 backtesting/               # Backtesting engine
│   ├── 📄 backtesting_engine.py
│   ├── 📄 timeframe_manager.py
│   └── 📄 performance_metrics.py
├── 📁 optimization/              # Optimization system
│   ├── 📄 optimization_engine.py
│   └── 📄 stock_data_manager.py
├── 📁 analysis/                  # Results analysis
│   ├── 📄 database_manager.py
│   ├── 📄 report_generator.py
│   └── 📄 dashboard.py
└── 📁 tests/
```

### Пример использования

```python
from strategy import create_default_strategy
from btc_data_generator import generate_btc_usdt_data

# Generate BTC/USDT test data
btc_data = generate_btc_usdt_data(periods=1000, base_price=30000)

# Create and run strategy
strategy = create_default_strategy()
result = strategy.run_strategy(btc_data)

# Analyze results
trades = strategy.executed_trades
total_pnl = sum(trade.pnl for trade in trades)
win_rate = len([t for t in trades if t.pnl > 0]) / len(trades)
```

---

## 🔴 5. Pinecone — Rust Interpreter

**Репозиторий**: `github.com/ferranbt/pinecone`  
**Лицензия**: Open Source

### Описание

Модульный интерпретатор Pine Script, написанный на Rust. Поддерживает технический анализ, кастомные индикаторы и бэктестинг стратегий.

### Особенности

- ✅ **Full PineScript v5** — полная поддержка языка
- ✅ **Technical Analysis** — moving averages, oscillators
- ✅ **Drawing Objects** — plots, labels, boxes
- ✅ **Modular Output** — кастомные типы и builtins
- ✅ **Type-Safe** — generics architecture

### Пример использования

```rust
use pine::Script;

let script = Script::compile(r#"
    fast_ma = ta.sma(close, 10)
    slow_ma = ta.sma(close, 20)
    plot(fast_ma, color=color.blue)
    plot(slow_ma, color=color.red)
"#)?;

let output = script.execute(&bar)?;
```

---

## 📦 6. NPM Packages

### @vibetrader/pinets

**NPM**: `@vibetrader/pinets`  
**Версия**: 0.5.4  
**Лицензия**: AGPL-3.0

#### Описание

JavaScript/TypeScript порт TradingView Pine Script. Позволяет мигрировать Pine Script v5+ индикаторы в JS/TS окружение.

#### Особенности

- Pine Script v5+ compatibility
- High precision (до 8-го знака)
- Time-series processing
- Technical analysis functions
- Runtime transpilation

#### Структура пакета

```
vibetrader-pinets/
├── 📁 dist/
│   ├── 📄 pinets.dev.browser.js
│   ├── 📄 pinets.dev.cjs
│   ├── 📄 pinets.dev.es.js
│   ├── 📄 pinets.min.browser.js
│   ├── 📄 pinets.min.cjs
│   └── 📄 pinets.min.es.js
├── 📁 dist/types/
│   ├── 📁 namespaces/
│   │   ├── 📁 ta/              # Technical Analysis types
│   │   ├── 📁 math/            # Math types
│   │   ├── 📁 array/           # Array types
│   │   ├── 📁 input/           # Input types
│   │   └── 📁 request/         # Request types
│   └── 📁 transpiler/
└── 📄 README.md
```

---

## 📊 Сравнительная таблица

| Проект | Язык | Runtime | Transpiler | Backtesting | API Coverage |
|--------|------|:-------:|:----------:|:-----------:|:------------:|
| **PineTS** | TypeScript | ✅ | ✅ | 🚧 | 85% |
| **pine-transpiler** | TypeScript | — | ✅ | — | 70% |
| **PyneCore** | Python | ✅ | ✅ | ✅ | 75% |
| **pinescript-to-python** | Python | ✅ | ✅ | ✅ | 60% |
| **Pinecone** | Rust | ✅ | — | ✅ | 50% |
| **@vibetrader/pinets** | JavaScript | ✅ | ✅ | — | 80% |

---

## 🚀 Use Cases

### 1. Algorithmic Trading
- Запуск Pine Script стратегий на своём сервере
- Интеграция с биржами через API

### 2. Backtesting
- Тестирование стратегий на исторических данных
- Оптимизация параметров

### 3. Real-time Alerts
- Кастомные алерт-системы
- Мониторинг нескольких активов

### 4. Research & Analysis
- Обработка больших датасетов
- ML интеграция

### 5. Custom Dashboards
- Встраивание индикаторов в веб-приложения
- Real-time мониторинг

---

## 📚 Документация

| Проект | Документация |
|--------|--------------|
| PineTS | https://quantforgeorg.github.io/PineTS/ |
| PyneCore | https://pynecore.org/docs |
| pine-transpiler | README.md в репозитории |
| pinescript-to-python | README.md в репозитории |

---

## 🔗 Полезные ссылки

- **Pine Script Documentation**: https://www.tradingview.com/pine-script-docs/
- **TradingView**: https://www.tradingview.com/
- **QuantForge Reddit**: https://www.reddit.com/r/QuantForge/
- **PyneSys Discord**: https://discord.com/invite/jegnhtq6gy

---

## ⚠️ Disclaimer

Все проекты в данной коллекции являются независимыми инициативами и **не аффилированы** с TradingView Inc.

- **TradingView** и **Pine Script** — торговые марки TradingView Inc.
- Используйте инструменты на свой риск
- Авторы не несут ответственности за финансовые потери

---

*Сгенерировано: 2025-03-08*
