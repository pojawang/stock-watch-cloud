const { getSupabase } = require("../../src/supabase");
const { ensureDefaultAdmin, json } = require("../../src/auth-supabase");
const { fetchRealtimeQuotes, buildRuleSummary } = require("../../src/stocks");

exports.config = {
  schedule: "30 1 * * *",
};

async function userSymbols(userId) {
  const { data, error } = await getSupabase()
    .from("user_stocks")
    .select("symbol")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data.map((row) => row.symbol);
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

exports.handler = async () => {
  try {
    await ensureDefaultAdmin();
    const supabase = getSupabase();
    const { data: users, error } = await supabase.from("users").select("id").eq("active", true);
    if (error) throw error;
    const results = [];
    for (const user of users) {
      const symbols = await userSymbols(user.id);
      if (!symbols.length) continue;
      const quotes = await fetchRealtimeQuotes(symbols);
      await saveSnapshots(user.id, quotes);
      results.push({ userId: user.id, count: quotes.length, summary: buildRuleSummary(quotes)[0] });
    }
    return json(200, { ok: true, refreshed: results.length, results });
  } catch (error) {
    return json(500, { ok: false, error: error.message });
  }
};
