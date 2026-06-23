const { getSupabase } = require("../../src/supabase");
const {
  hashPassword,
  verifyPassword,
  publicUser,
  ensureDefaultAdmin,
  createSession,
  destroySession,
  getCurrentUser,
  requireUser,
  cookie,
  clearCookie,
  json,
} = require("../../src/auth-supabase");
const { normalizeSymbols, fetchRealtimeQuotes, fetchHistoricalSeries, buildRuleSummary } = require("../../src/stocks");

const DEFAULT_SYMBOLS = ["2330", "2317", "0050", "2454", "2412", "2308", "2882", "3231", "3711", "3008"];

function apiPath(event) {
  const path = event.path || "";
  const match = path.match(/\/api\/(.+)$/) || path.match(/\/\.netlify\/functions\/api\/(.+)$/);
  return `/${match ? match[1] : ""}`;
}

function body(event) {
  if (!event.body) return {};
  return JSON.parse(event.body);
}

function rowToQuote(row) {
  return {
    symbol: row.symbol,
    market: row.market,
    name: row.name,
    price: row.price === null ? null : Number(row.price),
    previousClose: row.previous_close === null ? null : Number(row.previous_close),
    change: row.change === null ? null : Number(row.change),
    changePercent: row.change_percent === null ? null : Number(row.change_percent),
    open: row.open === null ? null : Number(row.open),
    high: row.high === null ? null : Number(row.high),
    low: row.low === null ? null : Number(row.low),
    volume: row.volume === null ? null : Number(row.volume),
    tradeTime: row.trade_time,
    tradeDate: row.trade_date,
    source: row.source,
    status: row.status,
  };
}

async function listUsers() {
  const { data, error } = await getSupabase().from("users").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(publicUser);
}

async function ensureUserStocks(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("user_stocks").select("symbol").eq("user_id", userId).order("sort_order");
  if (error) throw error;
  if (data.length) return data.map((row) => row.symbol);
  const rows = DEFAULT_SYMBOLS.map((symbol, index) => ({ user_id: userId, symbol, sort_order: index + 1 }));
  const { error: insertError } = await supabase.from("user_stocks").insert(rows);
  if (insertError) throw insertError;
  return DEFAULT_SYMBOLS;
}

async function setUserStocks(userId, symbols) {
  const clean = normalizeSymbols(symbols);
  if (clean.length !== 10) throw new Error("請輸入剛好 10 檔有效股票代號。");
  const supabase = getSupabase();
  const { error: deleteError } = await supabase.from("user_stocks").delete().eq("user_id", userId);
  if (deleteError) throw deleteError;
  const rows = clean.map((symbol, index) => ({ user_id: userId, symbol, sort_order: index + 1 }));
  const { error } = await supabase.from("user_stocks").insert(rows);
  if (error) throw error;
  return clean;
}

async function saveSnapshots(userId, quotes) {
  const rows = quotes
    .filter((quote) => quote.status === "ok" && quote.price !== null)
    .map((quote) => ({
      user_id: userId,
      symbol: quote.symbol,
      market: quote.market,
      name: quote.name,
      price: quote.price,
      previous_close: quote.previousClose,
      change: quote.change,
      change_percent: quote.changePercent,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      volume: quote.volume,
      trade_time: quote.tradeTime,
      trade_date: quote.tradeDate,
      source: quote.source,
      status: quote.status,
    }));
  if (!rows.length) return;
  const { error } = await getSupabase().from("quote_snapshots").insert(rows);
  if (error) throw error;
}

async function latestSnapshots(userId, symbols) {
  const { data, error } = await getSupabase()
    .from("quote_snapshots")
    .select("*")
    .eq("user_id", userId)
    .in("symbol", symbols)
    .order("captured_at", { ascending: false });
  if (error) throw error;
  const seen = new Set();
  return data.filter((row) => {
    if (seen.has(row.symbol)) return false;
    seen.add(row.symbol);
    return true;
  }).map(rowToQuote);
}

async function quotesForUser(userId, save) {
  const symbols = await ensureUserStocks(userId);
  try {
    const quotes = await fetchRealtimeQuotes(symbols);
    if (save) await saveSnapshots(userId, quotes);
    return { ok: true, updatedAt: new Date().toISOString(), quotes, summary: buildRuleSummary(quotes), error: null };
  } catch (error) {
    const quotes = await latestSnapshots(userId, symbols);
    return { ok: false, updatedAt: new Date().toISOString(), quotes, summary: buildRuleSummary(quotes), error: error.message };
  }
}

async function historyForUser(userId) {
  const symbols = await ensureUserStocks(userId);
  const since = new Date(Date.now() - 14 * 86400 * 1000).toISOString().slice(0, 10);
  const { data, error } = await getSupabase()
    .from("quote_snapshots")
    .select("*")
    .eq("user_id", userId)
    .gte("trade_date", since)
    .order("trade_date", { ascending: true })
    .order("captured_at", { ascending: true });
  if (error) throw error;
  const byDate = new Map();
  data.forEach((row) => {
    if (!byDate.has(row.trade_date)) byDate.set(row.trade_date, { date: row.trade_date, quotes: [] });
    const snapshot = byDate.get(row.trade_date);
    const quote = rowToQuote(row);
    const index = snapshot.quotes.findIndex((item) => item.symbol === quote.symbol);
    if (index >= 0) snapshot.quotes[index] = quote;
    else snapshot.quotes.push(quote);
  });

  const marketHints = {};
  data.forEach((row) => { if (row.market) marketHints[row.symbol] = row.market; });
  const historical = await fetchHistoricalSeries(symbols, marketHints);
  Object.entries(historical).forEach(([symbol, rows]) => {
    rows.forEach((row) => {
      if (!byDate.has(row.date)) byDate.set(row.date, { date: row.date, quotes: [] });
      const snapshot = byDate.get(row.date);
      if (snapshot.quotes.some((item) => item.symbol === symbol)) return;
      snapshot.quotes.push({
        symbol,
        market: row.market,
        name: "",
        price: row.close,
        previousClose: null,
        change: null,
        changePercent: null,
        open: row.open,
        high: row.high,
        low: row.low,
        volume: row.volume,
        tradeTime: "13:30:00",
        tradeDate: row.date,
        source: row.source,
        status: "ok",
      });
    });
  });
  return {
    snapshots: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
    historicalSource: "daily-history-with-snapshot-fallback",
  };
}

async function handler(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204 };
  await ensureDefaultAdmin();
  const path = apiPath(event);
  const method = event.httpMethod;
  const supabase = getSupabase();

  if (method === "GET" && path === "/session") {
    const user = await getCurrentUser(event);
    return json(200, { ok: true, authenticated: Boolean(user), user: publicUser(user) });
  }

  if (method === "POST" && path === "/login") {
    const input = body(event);
    const username = String(input.username || "").trim().toLowerCase();
    const password = String(input.password || "");
    const { data: user, error } = await supabase.from("users").select("*").eq("username", username).eq("active", true).maybeSingle();
    if (error) throw error;
    if (!user || !verifyPassword(password, user)) return json(401, { ok: false, error: "帳號或密碼不正確。" });
    const token = await createSession(user.id);
    return json(200, { ok: true, user: publicUser(user) }, { "Set-Cookie": cookie(token) });
  }

  if (method === "POST" && path === "/logout") {
    await destroySession(event);
    return json(200, { ok: true }, { "Set-Cookie": clearCookie() });
  }

  if (method === "GET" && path === "/users") {
    const auth = await requireUser(event, true);
    if (auth.response) return auth.response;
    return json(200, { ok: true, users: await listUsers() });
  }

  if (method === "POST" && path === "/users") {
    const auth = await requireUser(event, true);
    if (auth.response) return auth.response;
    const input = body(event);
    const username = String(input.username || "").trim().toLowerCase();
    const password = String(input.password || "");
    const displayName = String(input.displayName || username).trim();
    const role = input.role === "admin" ? "admin" : "user";
    if (!/^[a-z0-9_.-]{3,32}$/.test(username)) throw new Error("帳號需為 3-32 碼，可使用英文、數字、底線、句點與連字號。");
    if (password.length < 6) throw new Error("密碼至少需要 6 碼。");
    const { salt, hash } = hashPassword(password);
    const { error } = await supabase.from("users").insert({
      username,
      display_name: displayName,
      role,
      active: true,
      password_salt: salt,
      password_hash: hash,
    });
    if (error) throw error;
    return json(200, { ok: true, users: await listUsers() });
  }

  if (method === "POST" && path === "/users/update") {
    const auth = await requireUser(event, true);
    if (auth.response) return auth.response;
    const input = body(event);
    const username = String(input.username || "").trim().toLowerCase();
    const { data: user, error: findError } = await supabase.from("users").select("*").eq("username", username).maybeSingle();
    if (findError) throw findError;
    if (!user) throw new Error("找不到這個帳號。");
    const patch = {
      display_name: input.displayName ? String(input.displayName).trim() : user.display_name,
      role: input.role === "admin" || input.role === "user" ? input.role : user.role,
      active: typeof input.active === "boolean" ? input.active : user.active,
      updated_at: new Date().toISOString(),
    };
    if (input.password) {
      if (String(input.password).length < 6) throw new Error("密碼至少需要 6 碼。");
      const next = hashPassword(String(input.password));
      patch.password_salt = next.salt;
      patch.password_hash = next.hash;
    }
    const { error } = await supabase.from("users").update(patch).eq("username", username);
    if (error) throw error;
    return json(200, { ok: true, users: await listUsers() });
  }

  if (method === "POST" && path === "/users/delete") {
    const auth = await requireUser(event, true);
    if (auth.response) return auth.response;
    const username = String(body(event).username || "").trim().toLowerCase();
    if (username === auth.user.username) throw new Error("不能刪除目前登入中的自己。");
    const { error } = await supabase.from("users").delete().eq("username", username);
    if (error) throw error;
    return json(200, { ok: true, users: await listUsers() });
  }

  if (method === "GET" && path === "/settings") {
    const auth = await requireUser(event);
    if (auth.response) return auth.response;
    return json(200, { ok: true, symbols: await ensureUserStocks(auth.user.id) });
  }

  if (method === "POST" && path === "/settings") {
    const auth = await requireUser(event);
    if (auth.response) return auth.response;
    return json(200, { ok: true, symbols: await setUserStocks(auth.user.id, body(event).symbols || []) });
  }

  if (method === "GET" && path === "/quotes") {
    const auth = await requireUser(event);
    if (auth.response) return auth.response;
    return json(200, await quotesForUser(auth.user.id, false));
  }

  if (method === "POST" && path === "/refresh") {
    const auth = await requireUser(event);
    if (auth.response) return auth.response;
    return json(200, await quotesForUser(auth.user.id, true));
  }

  if (method === "GET" && path === "/history") {
    const auth = await requireUser(event);
    if (auth.response) return auth.response;
    return json(200, await historyForUser(auth.user.id), { "Cache-Control": "private, max-age=300" });
  }

  return json(404, { ok: false, error: "找不到 API。" });
}

exports.handler = async (event) => {
  try {
    return await handler(event);
  } catch (error) {
    return json(400, { ok: false, error: error.message || "請求失敗。" });
  }
};
