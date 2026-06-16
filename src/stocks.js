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

  return cleanSymbols.map((symbol) => {
    const row = items.find((item) => item.c === symbol && ["tse", "otc"].includes(item.ex));
    if (!row) {
      return {
        symbol,
        market: null,
        name: "",
        price: null,
        previousClose: null,
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
  buildRuleSummary,
};
