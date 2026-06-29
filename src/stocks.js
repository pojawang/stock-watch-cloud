function toNumber(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim().replaceAll(",", "");
  if (!text || text === "-" || text === "--") return null;
  const number = Number(text);
  return Number.isFinite(number) ? Math.round(number * 10000) / 10000 : null;
}

function firstQuotePrice(value) {
  if (!value) return null;
  for (const part of String(value).split("_")) {
    const price = toNumber(part);
    if (price && price > 0) return price;
  }
  return null;
}

function normalizeSymbols(symbols) {
  return [...new Set((symbols || [])
    .map((symbol) => String(symbol).trim())
    .filter((symbol) => /^\d{4,6}$/.test(symbol)))];
}

function formatTradeDate(value) {
  const text = String(value || "");
  if (/^\d{8}$/.test(text)) return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  return new Date().toISOString().slice(0, 10);
}

function taipeiDateKey(timestamp) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp * 1000));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function rocDateKey(value) {
  const match = String(value || "").trim().match(/^(\d{2,3})\/(\d{1,2})\/(\d{1,2})$/);
  if (!match) return null;
  return `${Number(match[1]) + 1911}-${String(match[2]).padStart(2, "0")}-${String(match[3]).padStart(2, "0")}`;
}

async function fetchJsonWithTimeout(url, timeoutMs = 3500) {
  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), timeoutMs);
  let rejectTimer;
  try {
    const response = await Promise.race([
      fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 StockWatchCloud/1.0",
          Accept: "application/json,text/plain,*/*",
        },
        signal: controller.signal,
      }),
      new Promise((_, reject) => {
        rejectTimer = setTimeout(() => reject(new Error("Historical quote timeout")), timeoutMs + 200);
      }),
    ]);
    if (!response.ok) throw new Error(`Historical quote HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(abortTimer);
    clearTimeout(rejectTimer);
  }
}

async function fetchTwseMonth(symbol, monthDate) {
  const date = `${monthDate.getUTCFullYear()}${String(monthDate.getUTCMonth() + 1).padStart(2, "0")}01`;
  const url = `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date=${date}&stockNo=${encodeURIComponent(symbol)}&response=json`;
  const payload = await fetchJsonWithTimeout(url);
  if (!Array.isArray(payload?.data)) return [];
  return payload.data.map((row) => {
    const dateKey = rocDateKey(row?.[0]);
    const close = toNumber(row?.[6]);
    if (!dateKey || close === null) return null;
    return {
      date: dateKey,
      close,
      open: toNumber(row?.[3]),
      high: toNumber(row?.[4]),
      low: toNumber(row?.[5]),
      volume: toNumber(row?.[1]) || 0,
      market: "TWSE",
      source: "TWSE daily history",
    };
  }).filter(Boolean);
}

async function fetchTwseHistory(symbol) {
  const now = new Date();
  const months = [3, 2, 1, 0].map((offset) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1)));
  const results = await Promise.allSettled(months.map((month) => fetchTwseMonth(symbol, month)));
  const rows = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const byDate = new Map();
  rows.forEach((row) => byDate.set(row.date, row));
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchYahooHistory(symbol, suffix) {
  const ticker = `${symbol}.${suffix}`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=3mo&interval=1d&events=history`;
  const payload = await fetchJsonWithTimeout(url, 2500);
  const result = payload?.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const quote = result?.indicators?.quote?.[0] || {};
  const adjusted = result?.indicators?.adjclose?.[0]?.adjclose || [];
  return timestamps.map((timestamp, index) => {
    const close = toNumber(adjusted[index] ?? quote.close?.[index]);
    if (close === null) return null;
    return {
      date: taipeiDateKey(timestamp),
      close,
      open: toNumber(quote.open?.[index]),
      high: toNumber(quote.high?.[index]),
      low: toNumber(quote.low?.[index]),
      volume: toNumber(quote.volume?.[index]) || 0,
      market: suffix === "TWO" ? "TPEx" : "TWSE",
      source: "Yahoo Finance history",
    };
  }).filter(Boolean);
}

async function fetchHistoricalSeries(symbols, marketHints = {}) {
  const cleanSymbols = normalizeSymbols(symbols);
  const entries = await Promise.all(cleanSymbols.map(async (symbol) => {
    const preferred = marketHints[symbol] === "TPEx" ? "TWO" : "TW";
    const alternate = preferred === "TW" ? "TWO" : "TW";
    try {
      let rows = preferred === "TW" ? await fetchTwseHistory(symbol) : [];
      if (rows.length >= 5) return [symbol, rows.slice(-80)];
      rows = await fetchYahooHistory(symbol, preferred);
      if (!rows.length) rows = await fetchYahooHistory(symbol, alternate);
      return [symbol, rows.slice(-80)];
    } catch (_) {
      return [symbol, []];
    }
  }));
  return Object.fromEntries(entries);
}

async function fetchFundamentalMetrics(symbols) {
  const wanted = new Set(normalizeSymbols(symbols));
  if (!wanted.size) return {};

  const output = {};
  const sources = await Promise.allSettled([
    fetchJsonWithTimeout("https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL", 4500),
    fetchJsonWithTimeout("https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis", 4500),
  ]);

  const twseRows = sources[0].status === "fulfilled"
    ? (Array.isArray(sources[0].value) ? sources[0].value : sources[0].value?.value || [])
    : [];
  twseRows.forEach((row) => {
    const symbol = String(row.Code || "").trim();
    if (!wanted.has(symbol)) return;
    output[symbol] = {
      peRatio: toNumber(row.PEratio),
      dividendYield: toNumber(row.DividendYield),
      fundamentalsDate: row.Date || null,
      fundamentalsSource: "TWSE OpenAPI",
    };
  });

  const tpexRows = sources[1].status === "fulfilled"
    ? (Array.isArray(sources[1].value) ? sources[1].value : sources[1].value?.value || [])
    : [];
  tpexRows.forEach((row) => {
    const symbol = String(row.SecuritiesCompanyCode || "").trim();
    if (!wanted.has(symbol)) return;
    output[symbol] = {
      peRatio: toNumber(row.PriceEarningRatio),
      dividendYield: toNumber(row.YieldRatio),
      fundamentalsDate: row.Date || null,
      fundamentalsSource: "TPEx OpenAPI",
    };
  });

  return output;
}

async function fetchRealtimeQuotes(symbols) {
  const cleanSymbols = normalizeSymbols(symbols);
  if (!cleanSymbols.length) return [];

  const channels = cleanSymbols.flatMap((symbol) => [`tse_${symbol}.tw`, `otc_${symbol}.tw`]);
  const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${encodeURIComponent(channels.join("|"))}&json=1&delay=0&_=${Date.now()}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 StockWatchCloud/1.0",
      "Referer": "https://mis.twse.com.tw/stock/index.jsp",
    },
  });
  if (!response.ok) throw new Error("無法取得公開行情資料。");
  const payload = await response.json();
  const items = Array.isArray(payload.msgArray) ? payload.msgArray : [];
  const fundamentals = await fetchFundamentalMetrics(cleanSymbols);

  return cleanSymbols.map((symbol) => {
    const row = items.find((item) => item.c === symbol && ["tse", "otc"].includes(item.ex));
    const metrics = fundamentals[symbol] || {};
    if (!row) {
      return {
        symbol,
        market: null,
        name: "",
        price: null,
        previousClose: null,
        peRatio: metrics.peRatio ?? null,
        dividendYield: metrics.dividendYield ?? null,
        change: null,
        changePercent: null,
        open: null,
        high: null,
        low: null,
        volume: null,
        tradeTime: null,
        tradeDate: new Date().toISOString().slice(0, 10),
        source: "TWSE MIS",
        status: "not-found",
      };
    }

    const open = toNumber(row.o);
    const high = toNumber(row.h);
    const low = toNumber(row.l);
    const bid = firstQuotePrice(row.b);
    const ask = firstQuotePrice(row.a);
    let price = toNumber(row.z);
    const previousClose = toNumber(row.y);
    if (price && high && low && (price > high || price < low)) price = null;
    if (!price) {
      if (bid && ask) price = Math.round(((bid + ask) / 2) * 100) / 100;
      else if (bid) price = bid;
      else if (ask) price = ask;
      else if (open) price = open;
      else price = previousClose;
    }

    let change = null;
    let changePercent = null;
    if (price !== null && previousClose) {
      change = Math.round((price - previousClose) * 100) / 100;
      changePercent = Math.round(((price - previousClose) / previousClose) * 10000) / 100;
    }

    return {
      symbol,
      market: row.ex === "otc" ? "TPEx" : "TWSE",
      name: row.n || "",
      price,
      previousClose,
      peRatio: metrics.peRatio ?? null,
      dividendYield: metrics.dividendYield ?? null,
      fundamentalsDate: metrics.fundamentalsDate ?? null,
      fundamentalsSource: metrics.fundamentalsSource ?? null,
      change,
      changePercent,
      open,
      high,
      low,
      volume: toNumber(row.v),
      tradeTime: row.t || null,
      tradeDate: formatTradeDate(row.d),
      source: "TWSE MIS",
      status: "ok",
    };
  });
}

function buildRuleSummary(quotes) {
  const valid = quotes.filter((quote) => quote.status === "ok" && quote.price !== null);
  if (!valid.length) return ["目前沒有足夠資料產生摘要。"];
  const avg = valid.reduce((sum, quote) => sum + Number(quote.changePercent || 0), 0) / valid.length;
  const ranked = [...valid].sort((a, b) => Number(b.changePercent || 0) - Number(a.changePercent || 0));
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];
  const tone = avg > 1 ? "整體偏強" : avg < -1 ? "整體偏弱" : "多空混合";
  return [
    `目前監看清單呈現${tone}，平均漲跌幅約 ${avg.toFixed(2)}%。`,
    `相對強勢為 ${strongest.symbol} ${strongest.name || ""}，漲跌幅 ${Number(strongest.changePercent || 0).toFixed(2)}%。`,
    `相對弱勢為 ${weakest.symbol} ${weakest.name || ""}，漲跌幅 ${Number(weakest.changePercent || 0).toFixed(2)}%。`,
    "本摘要為規則式分析，不構成投資建議。",
  ];
}

module.exports = {
  normalizeSymbols,
  fetchRealtimeQuotes,
  fetchHistoricalSeries,
  buildRuleSummary,
};
