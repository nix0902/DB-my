# 📚 Documentation Hub

> Центральный репозиторий документации для AI-агентов и разработчиков

---

## 🗺️ Обзор структуры

```
📁 docs/
│
├── 📄 README.md                    # Этот файл
│
│   ╔══════════════════════════════════════════════════════════════════════╗
│   ║  📈 EXCHANGE API DOCUMENTATION                                        ║
│   ╚══════════════════════════════════════════════════════════════════════╝
│
├── 📁 exchange/                    # Exchange API Documentation
│   ├── 📁 bitget/                  #    🔷 Bitget Exchange (800+ файлов)
│   ├── 📁 bingx/                   #    🔶 BingX Exchange (50+ файлов)
│   ├── 📁 okx/                     #    🟠 OKX Exchange (150+ файлов)
│   ├── 📁 bybit/                   #    🟡 Bybit Exchange
│   └── 📁 binance/                 #    🟤 Binance Exchange (321 файл)
│
│   ╔══════════════════════════════════════════════════════════════════════╗
│   ║  🌲 PINE SCRIPT CONVERTERS & TRANSPILERS                              ║
│   ╚══════════════════════════════════════════════════════════════════════╝
│
├── 📁 Piscript_converters/         # 🌲 PineScript Converters (6 проектов)
│   ├── 📁 PineTS/                  #    🟢 TypeScript Runtime
│   ├── 📁 pine-transpiler/         #    🔵 Pine → PineJS
│   ├── 📁 pynecore/                #    🟡 Python Runtime
│   ├── 📁 pinescript-to-python/    #    🟠 Backtesting Framework
│   ├── 📁 pinecone/                #    🔴 Rust Interpreter
│   └── 📁 npm-packages/            #    📦 NPM Packages
│
│   ╔══════════════════════════════════════════════════════════════════════╗
│   ║  📊 TRADINGVIEW KNOWLEDGE BASE                                        ║
│   ╚══════════════════════════════════════════════════════════════════════╝
│
├── 📁 TradingView_KB/              # TradingView Platform (2,854 файла)
│   ├── 📁 chart/                   #    📈 Chart types & patterns
│   ├── 📁 drawings/                #    🎨 Drawing tools
│   ├── 📁 screener/                #    🔍 Screeners
│   ├── 📁 trading/                 #    💹 Trading features
│   ├── 📁 heatmap/                 #    🗺️ Heatmaps
│   ├── 📁 news/                    #    📰 News flow
│   └── 📁 curves/                  #    📉 Yield curves
│
│   ╔══════════════════════════════════════════════════════════════════════╗
│   ║  🌐 PINE SCRIPT & LIGHTWEIGHT CHARTS                                  ║
│   ╚══════════════════════════════════════════════════════════════════════╝
│
├── 📁 Pine_Script_KB/              # Pine Script Language (73 файла)
├── 📁 pine-script/                 # Pine Script Documentation
├── 📁 Lightweight_Charts_KB/       # Charts Library (6,000+ файлов)
│
│   ╔══════════════════════════════════════════════════════════════════════╗
│   ║  🤖 TRADING BOT DOCUMENTATION                                         ║
│   ╚══════════════════════════════════════════════════════════════════════╝
│
└── 📁 Cornixbot_KB/                # Cornix Bot (242 файла)
    ├── 📁 account-subscription/
    ├── 📁 channel-admins/
    ├── 📁 backtesting/
    ├── 📁 getting-started/
    ├── 📁 trading-bots/
    ├── 📁 trading-configurations/
    └── 📁 errors-notifications/
```

---

## 📁 Разделы документации

### 📈 Exchange API Documentation

**Путь:** `exchange/`

Полная документация API криптовалютных бирж для интеграции и разработки торговых систем.

| Биржа | Файлов | Описание |
|-------|:------:|----------|
| **Bitget** | 800+ | Spot, Futures, Margin, Broker API |
| **BingX** | 50+ | Spot, Swap V2, Standard Contract |
| **OKX** | 150+ | Trading, Funding, Financial Products |
| **Bybit** | — | Python SDK, Java API, Go API |
| **Binance** | 321 | Spot, Futures, Options, Margin |

**Подробнее:** [exchange/README.md](exchange/README.md)

---

### 🌲 PineScript Converters & Transpilers

**Путь:** `Piscript_converters/`

Коллекция инструментов для конвертации и выполнения Pine Script вне TradingView.

| Проект | Язык | Runtime | Backtesting | API Coverage |
|--------|------|:-------:|:-----------:|:------------:|
| **PineTS** | TypeScript | ✅ | 🚧 | 85% |
| **pine-transpiler** | TypeScript | — | — | 70% |
| **PyneCore** | Python | ✅ | ✅ | 75% |
| **pinescript-to-python** | Python | ✅ | ✅ | 60% |
| **Pinecone** | Rust | ✅ | ✅ | 50% |
| **@vibetrader/pinets** | JavaScript | ✅ | — | 80% |

**Подробнее:** [Piscript_converters/README.md](Piscript_converters/README.md)

---

### 📊 TradingView Knowledge Base

**Путь:** `TradingView_KB/`

Документация платформы TradingView с подробными руководствами.

| Раздел | Описание |
|--------|----------|
| **chart/** | Типы графиков, паттерны свечей, настройки |
| **drawings/** | Инструменты рисования (80+ файлов) |
| **screener/** | Скринеры акций, крипто, ETF, облигаций |
| **trading/** | Торговые функции, Paper Trading |
| **heatmap/** | Тепловые карты рынка |
| **news/** | Новости и фильтрация |
| **curves/** | Кривые доходности |

**Подробнее:** [TradingView_KB/README.md](TradingView_KB/README.md)

---

### 🌐 Pine Script & Lightweight Charts

#### Pine_Script_KB/
Справочник по языку Pine Script для создания индикаторов и стратегий TradingView.

#### pine-script/
Дополнительная документация по Pine Script.

#### Lightweight_Charts_KB/
Документация по библиотеке TradingView Lightweight Charts:
- Полный API справочник
- Примеры кода (Python, Android, TypeScript)
- Туториалы и руководства
- Stack Overflow Q&A

---

### 🤖 Trading Bot Documentation

#### Cornixbot_KB/
Документация Cornix trading bot (242 файла):
- Account and subscription management
- Channel administration
- Backtesting
- Getting started guides
- Trading bots & configurations
- Error notifications

---

## 📊 Статистика

| Knowledge Base | Files | Description |
|----------------|:-----:|-------------|
| **Exchange APIs** | 1,300+ | Bitget, BingX, OKX, Bybit, Binance |
| **TradingView_KB** | 2,854 | Platform documentation |
| **Lightweight_Charts_KB** | 6,000+ | Charts library docs |
| **Cornixbot_KB** | 242 | Trading bot docs |
| **Pine_Script_KB** | 73 | Scripting language |
| **PineScript Converters** | 6 | Transpilers & runtimes |

---

## 🚀 Быстрая навигация

### Для AI-агентов

| Задача | Раздел |
|--------|--------|
| Интеграция с биржей | [exchange/](exchange/) |
| Pine Script конвертация | [Piscript_converters/](Piscript_converters/) |
| TradingView документация | [TradingView_KB/](TradingView_KB/) |
| Lightweight Charts | [Lightweight_Charts_KB/](Lightweight_Charts_KB/) |
| Cornix Bot | [Cornixbot_KB/](Cornixbot_KB/) |

### Для разработчиков

| Язык | SDK |
|------|-----|
| **Python** | Bitget, OKX, Bybit, Binance SDKs |
| **Java** | Bitget, Bybit API |
| **Go** | Bitget, Bybit API |
| **TypeScript** | PineTS, pine-transpiler, @vibetrader/pinets |
| **Rust** | Pinecone |
| **PHP** | Bitget SDK |

---

## 🔗 Внешние ресурсы

### Exchange Documentation
- **Bitget**: https://www.bitget.com/api-doc
- **BingX**: https://bingx-api.github.io/docs/
- **OKX**: https://www.okx.com/docs-v5/
- **Bybit**: https://bybit-exchange.github.io/docs/
- **Binance**: https://binance-docs.github.io/apidocs/

### TradingView Resources
- **Lightweight Charts GitHub**: https://github.com/tradingview/lightweight-charts
- **Pine Script Reference**: https://www.tradingview.com/pine-script-docs/
- **Widget Documentation**: https://www.tradingview.com/widget-docs/

### PineScript Converters
- **PineTS Documentation**: https://quantforgeorg.github.io/PineTS/
- **PyneCore Documentation**: https://pynecore.org/docs

---

## 📝 Примечания

- Все проекты в `Piscript_converters/` являются **независимыми инициативами** и не аффилированы с TradingView Inc.
- **TradingView** и **Pine Script** — торговые марки TradingView Inc.
- API документация может отличаться от официальной — проверяйте актуальность на сайтах бирж

---

*Обновлено: 2025-03-08*
