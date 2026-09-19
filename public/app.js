const state = {
  user: null,
  symbols: [],
  quotes: [],
  history: { snapshots: [] },
  refreshTimer: null,
};

const colors = ["#52c8ff", "#ff3333", "#21d86b", "#ffd84d", "#b86cff", "#00e5ff", "#ff6b9a", "#7cff9b", "#f59cff", "#d9ecff"];
const recommendationUniverse = [
  { symbol: "0050", name: "元大台灣50", type: "etf", categories: ["balanced", "highDividend"], risk: 1, minAmount: 10000 },
  { symbol: "0056", name: "元大高股息", type: "etf", categories: ["highDividend", "balanced"], risk: 1, minAmount: 10000 },
  { symbol: "00878", name: "國泰永續高股息", type: "etf", categories: ["highDividend", "balanced"], risk: 1, minAmount: 10000 },
  { symbol: "006208", name: "富邦台50", type: "etf", categories: ["balanced"], risk: 1, minAmount: 10000 },
  { symbol: "00713", name: "元大台灣高息低波", type: "etf", categories: ["highDividend", "balanced"], risk: 1, minAmount: 10000 },
  { symbol: "00919", name: "群益台灣精選高息", type: "etf", categories: ["highDividend"], risk: 2, minAmount: 10000 },
  { symbol: "00929", name: "復華台灣科技優息", type: "etf", categories: ["highDividend", "semiconductor", "aiElectric"], risk: 2, minAmount: 10000 },
  { symbol: "0052", name: "富邦科技", type: "etf", categories: ["semiconductor", "aiElectric"], risk: 2, minAmount: 10000 },
  { symbol: "00881", name: "國泰台灣5G+", type: "etf", categories: ["semiconductor", "aiElectric"], risk: 2, minAmount: 10000 },
  { symbol: "00922", name: "國泰台灣領袖50", type: "etf", categories: ["balanced"], risk: 2, minAmount: 10000 },
  { symbol: "2330", name: "台積電", type: "stock", categories: ["semiconductor", "balanced", "aiElectric"], risk: 2, minAmount: 50000 },
  { symbol: "2317", name: "鴻海", type: "stock", categories: ["aiElectric", "balanced"], risk: 2, minAmount: 30000 },
  { symbol: "2454", name: "聯發科", type: "stock", categories: ["semiconductor", "aiElectric"], risk: 3, minAmount: 50000 },
  { symbol: "2308", name: "台達電", type: "stock", categories: ["aiElectric", "balanced"], risk: 2, minAmount: 30000 },
  { symbol: "2303", name: "聯電", type: "stock", categories: ["semiconductor"], risk: 2, minAmount: 20000 },
  { symbol: "3711", name: "日月光投控", type: "stock", categories: ["semiconductor"], risk: 2, minAmount: 20000 },
  { symbol: "2379", name: "瑞昱", type: "stock", categories: ["semiconductor", "aiElectric"], risk: 3, minAmount: 30000 },
  { symbol: "3034", name: "聯詠", type: "stock", categories: ["semiconductor"], risk: 3, minAmount: 30000 },
  { symbol: "2382", name: "廣達", type: "stock", categories: ["aiElectric"], risk: 3, minAmount: 30000 },
  { symbol: "3231", name: "緯創", type: "stock", categories: ["aiElectric"], risk: 3, minAmount: 20000 },
  { symbol: "2356", name: "英業達", type: "stock", categories: ["aiElectric"], risk: 2, minAmount: 20000 },
  { symbol: "2324", name: "仁寶", type: "stock", categories: ["aiElectric"], risk: 2, minAmount: 20000 },
  { symbol: "2882", name: "國泰金", type: "stock", categories: ["finance", "balanced", "highDividend"], risk: 1, minAmount: 20000 },
  { symbol: "2881", name: "富邦金", type: "stock", categories: ["finance", "balanced"], risk: 1, minAmount: 20000 },
  { symbol: "2891", name: "中信金", type: "stock", categories: ["finance", "highDividend"], risk: 1, minAmount: 20000 },
  { symbol: "2886", name: "兆豐金", type: "stock", categories: ["finance", "highDividend"], risk: 1, minAmount: 20000 },
  { symbol: "5880", name: "合庫金", type: "stock", categories: ["finance", "highDividend"], risk: 1, minAmount: 20000 },
  { symbol: "5871", name: "中租-KY", type: "stock", categories: ["finance", "balanced"], risk: 2, minAmount: 20000 },
  { symbol: "2412", name: "中華電", type: "stock", categories: ["balanced", "highDividend"], risk: 1, minAmount: 20000 },
  { symbol: "3008", name: "大立光", type: "stock", categories: ["semiconductor", "aiElectric"], risk: 3, minAmount: 80000 },
];
const $ = (selector) => document.querySelector(selector);
const els = {
  loginView: $("#loginView"),
  loginForm: $("#loginForm"),
  loginUsername: $("#loginUsername"),
  loginPassword: $("#loginPassword"),
  loginMessage: $("#loginMessage"),
  appHeader: $("#appHeader"),
  appMain: $("#appMain"),
  statusText: $("#statusText"),
  userBadge: $("#userBadge"),
  refreshBtn: $("#refreshBtn"),
  proDashboardToggle: $("#proDashboardToggle"),
  settingsToggle: $("#settingsToggle"),
  usersToggle: $("#usersToggle"),
  logoutBtn: $("#logoutBtn"),
  settingsPanel: $("#settingsPanel"),
  investAmount: $("#investAmount"),
  productType: $("#productType"),
  stockCategory: $("#stockCategory"),
  riskPreference: $("#riskPreference"),
  investmentHorizon: $("#investmentHorizon"),
  generateRecommendationBtn: $("#generateRecommendationBtn"),
  recommendationResult: $("#recommendationResult"),
  symbolsInput: $("#symbolsInput"),
  saveSettingsBtn: $("#saveSettingsBtn"),
  settingsMessage: $("#settingsMessage"),
  usersPanel: $("#usersPanel"),
  userForm: $("#userForm"),
  usersList: $("#usersList"),
  usersMessage: $("#usersMessage"),
  newUsername: $("#newUsername"),
  newDisplayName: $("#newDisplayName"),
  newPassword: $("#newPassword"),
  newRole: $("#newRole"),
  quotesBody: $("#quotesBody"),
  quoteMeta: $("#quoteMeta"),
  metricCount: $("#metricCount"),
  metricAdvancers: $("#metricAdvancers"),
  metricAverage: $("#metricAverage"),
  metricAlerts: $("#metricAlerts"),
  chartRange: $("#chartRange"),
  chartSymbol: $("#chartSymbol"),
  historyChart: $("#historyChart"),
  chartEmpty: $("#chartEmpty"),
  singleStockSymbol: $("#singleStockSymbol"),
  singleStockRange: $("#singleStockRange"),
  singleStockName: $("#singleStockName"),
  singleStockStats: $("#singleStockStats"),
  singleStockChart: $("#singleStockChart"),
  singleStockMessage: $("#singleStockMessage"),
  summaryBox: $("#summaryBox"),
  boardDate: $("#boardDate"),
  boardTime: $("#boardTime"),
  intentBars: $("#intentBars"),
  intentConclusion: $("#intentConclusion"),
  riskBars: $("#riskBars"),
  riskScore: $("#riskScore"),
  radarChart: $("#radarChart"),
  radarSummary: $("#radarSummary"),
  scenarioList: $("#scenarioList"),
  energyBars: $("#energyBars"),
  energyText: $("#energyText"),
  costChart: $("#costChart"),
  costText: $("#costText"),
  volumeProfile: $("#volumeProfile"),
  healthGauges: $("#healthGauges"),
  trafficLights: $("#trafficLights"),
  predictionChart: $("#predictionChart"),
  sentimentNeedle: $("#sentimentNeedle"),
  sentimentLabel: $("#sentimentLabel"),
  sentimentScore: $("#sentimentScore"),
  finalAdvice: $("#finalAdvice"),
  supportResistanceBox: $("#supportResistanceBox"),
  movingAverageBox: $("#movingAverageBox"),
  volumeMultipleBox: $("#volumeMultipleBox"),
  valuationBox: $("#valuationBox"),
  marketTrendBox: $("#marketTrendBox"),
  marketTrendMeta: $("#marketTrendMeta"),
  marketPowerBox: $("#marketPowerBox"),
  marketPowerMeta: $("#marketPowerMeta"),
  sectorTideBox: $("#sectorTideBox"),
  sectorTideMeta: $("#sectorTideMeta"),
  proDashboardPanel: $("#proDashboardPanel"),
  proSymbol: $("#proSymbol"),
  proStockName: $("#proStockName"),
  proSummaryStats: $("#proSummaryStats"),
  proDataMeta: $("#proDataMeta"),
  proKChart: $("#proKChart"),
  proDecisionCore: $("#proDecisionCore"),
  proMultiRadar: $("#proMultiRadar"),
  proMultiRead: $("#proMultiRead"),
  proHeatMap: $("#proHeatMap"),
  proRiskRadar: $("#proRiskRadar"),
  proRiskText: $("#proRiskText"),
  proPredictionChart: $("#proPredictionChart"),
  proCostDistribution: $("#proCostDistribution"),
  proCostText: $("#proCostText"),
  proInstitutional: $("#proInstitutional"),
  proOvernightRisk: $("#proOvernightRisk"),
  proEnergy: $("#proEnergy"),
  proHealth: $("#proHealth"),
  proSignal: $("#proSignal"),
  proSentiment: $("#proSentiment"),
  proConfidence: $("#proConfidence"),
  proChipSummary: $("#proChipSummary"),
  proBuyingPower: $("#proBuyingPower"),
  proStrength: $("#proStrength"),
  proConclusion: $("#proConclusion"),
  proExportCsv: $("#proExportCsv"),
  proPrint: $("#proPrint"),
};

function fmt(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString("zh-TW", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function intFmt(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

function pct(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return `${fmt(value)}%`;
}

function ratioFmt(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return fmt(value);
}

function trendClass(value) {
  return Number(value) > 0 ? "up" : Number(value) < 0 ? "down" : "";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function avg(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("zh-TW", { hour12: false });
}

function marketStatusText(updatedAt) {
  const now = updatedAt ? new Date(updatedAt) : new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const open = 9 * 60;
  const close = 13 * 60 + 30;
  if (day === 0 || day === 6) return "休市日，顯示最近可取得行情";
  if (minutes < open) return "盤前，顯示最近可取得行情";
  if (minutes <= close) return "盤中更新中";
  return "已收盤，顯示今日收盤行情";
}

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const payload = await response.json();
  if (response.status === 401) showLogin();
  if (!response.ok) throw new Error(payload.error || "請求失敗。");
  return payload;
}

function showLogin(message = "") {
  state.user = null;
  if (state.refreshTimer) window.clearInterval(state.refreshTimer);
  setProDashboard(false);
  els.loginView.classList.remove("hidden");
  els.appHeader.classList.add("hidden");
  els.appMain.classList.add("hidden");
  els.loginMessage.textContent = message;
  els.loginPassword.value = "";
}

function showApp(user) {
  state.user = user;
  els.loginView.classList.add("hidden");
  els.appHeader.classList.remove("hidden");
  els.appMain.classList.remove("hidden");
  els.userBadge.textContent = `${user.displayName || user.username} / ${user.role === "admin" ? "管理員" : "使用者"}`;
  els.usersToggle.classList.toggle("hidden", user.role !== "admin");
  if (user.role !== "admin") els.usersPanel.classList.add("hidden");
}

function setStatus(text, warn = false) {
  els.statusText.textContent = text;
  els.statusText.className = warn ? "warn" : "";
}

function selectedSymbol() {
  return els.chartSymbol.value || state.symbols[0];
}

function selectedChartRange() {
  return els.chartRange?.value || "week";
}

function rowsForSymbol(symbol) {
  const rows = (state.history.snapshots || [])
    .map((snapshot) => {
      const quote = (snapshot.quotes || []).find((item) => item.symbol === symbol);
      if (!quote || quote.price === null) return null;
      const close = Number(quote.price);
      return {
        date: snapshot.date,
        open: Number.isFinite(Number(quote.open)) ? Number(quote.open) : close,
        high: Number.isFinite(Number(quote.high)) ? Number(quote.high) : close,
        low: Number.isFinite(Number(quote.low)) ? Number(quote.low) : close,
        close,
        volume: Number(quote.volume || 0),
      };
    })
    .filter(Boolean)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const byDate = new Map();
  rows.forEach((row) => byDate.set(row.date, row));
  return [...byDate.values()];
}

function shiftedWeekRows(symbol) {
  const rows = rowsForSymbol(symbol);
  const today = new Date();
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() - 7);
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  const startKey = localDateKey(start);
  const endKey = localDateKey(end);
  const exactWindow = rows.filter((row) => row.date >= startKey && row.date <= endKey).slice(-7);
  if (exactWindow.length >= 4) return exactWindow;
  return rows.filter((row) => row.date <= endKey).slice(-7);
}

function chartRangeRows(symbol) {
  const rows = rowsForSymbol(symbol);
  const range = selectedChartRange();
  if (range === "month") return rows.slice(-22);
  if (range === "quarter") return rows.slice(-66);
  return rows.slice(-7);
}

function syntheticRowsFromQuote(quote) {
  if (!quote || !Number.isFinite(Number(quote.price))) return [];
  const price = Number(quote.price);
  const previous = Number.isFinite(Number(quote.previousClose)) ? Number(quote.previousClose) : price;
  const date = quote.tradeDate || localDateKey(new Date());
  return [
    { date: "前收", open: previous, high: previous, low: previous, close: previous, volume: 0 },
    { date, open: previous, high: Math.max(previous, price), low: Math.min(previous, price), close: price, volume: Number(quote.volume || 0) },
  ];
}

function chartRowsForSymbol(symbol, quote) {
  const range = selectedChartRange();
  if (range === "week") {
    const shifted = shiftedWeekRows(symbol);
    if (shifted.length >= 4) return { rows: shifted, source: "shifted" };
  }
  const recent = chartRangeRows(symbol);
  if (recent.length >= 4) return { rows: recent, source: range };
  return { rows: syntheticRowsFromQuote(quote), source: "quote" };
}

function weightedCostValues(rows) {
  return rows.map((_, index) => {
    const windowRows = rows.slice(Math.max(0, index - 2), index + 1);
    const totalVolume = windowRows.reduce((sum, row) => sum + Math.max(1, Number(row.volume || 0)), 0);
    return windowRows.reduce((sum, row) => sum + Number(row.close) * Math.max(1, Number(row.volume || 0)), 0) / totalVolume;
  });
}

function chartLabel(date) {
  return String(date || "").includes("-") ? String(date).slice(5) : String(date || "");
}


function renderSettings() {
  els.symbolsInput.value = state.symbols.join(", ");
  const current = els.chartSymbol.value;
  const currentSingle = els.singleStockSymbol.value;
  els.chartSymbol.innerHTML = state.symbols.map((symbol) => `<option value="${symbol}">${symbol}</option>`).join("");
  els.singleStockSymbol.innerHTML = state.symbols.map((symbol) => `<option value="${symbol}">${symbol}</option>`).join("");
  els.proSymbol.innerHTML = state.symbols.map((symbol) => `<option value="${symbol}">${symbol}</option>`).join("");
  if (state.symbols.includes(current)) els.chartSymbol.value = current;
  if (state.symbols.includes(currentSingle)) els.singleStockSymbol.value = currentSingle;
  if (state.symbols.includes(current)) els.proSymbol.value = current;
}

function recommendationRiskLevel(value) {
  if (value === "conservative") return 1;
  if (value === "aggressive") return 3;
  return 2;
}

function scoreRecommendation(item, profile) {
  let score = 100;
  const targetRisk = recommendationRiskLevel(profile.riskPreference);
  if (profile.productType === "etf" && item.type !== "etf") score -= 70;
  if (profile.productType === "stock" && item.type !== "stock") score -= 34;
  if (profile.productType === "mixed" && item.type === "etf") score += 6;
  if (item.categories.includes(profile.stockCategory)) score += 34;
  if (profile.stockCategory === "balanced" && item.categories.includes("balanced")) score += 20;
  score -= Math.abs(item.risk - targetRisk) * 18;
  if (profile.investAmount > 0 && item.minAmount > profile.investAmount) score -= 22;
  if (profile.investmentHorizon === "short" && item.risk === 3) score += 8;
  if (profile.investmentHorizon === "long" && item.risk <= 2) score += 8;
  if (profile.riskPreference === "conservative" && item.type === "etf") score += 10;
  if (profile.riskPreference === "aggressive" && item.type === "stock") score += 10;
  return score;
}

function buildRecommendationProfile() {
  return {
    investAmount: Number(els.investAmount.value || 0),
    productType: els.productType.value,
    stockCategory: els.stockCategory.value,
    riskPreference: els.riskPreference.value,
    investmentHorizon: els.investmentHorizon.value,
  };
}

function generateRecommendations() {
  const profile = buildRecommendationProfile();
  const ranked = recommendationUniverse
    .map((item) => ({ ...item, score: scoreRecommendation(item, profile) }))
    .sort((a, b) => b.score - a.score);
  const selected = [];
  ranked.forEach((item) => {
    if (selected.length < 10 && !selected.some((picked) => picked.symbol === item.symbol)) selected.push(item);
  });
  els.symbolsInput.value = selected.map((item) => item.symbol).join(", ");
  els.recommendationResult.classList.remove("hidden");
  els.recommendationResult.innerHTML = `
    <strong>已產生 10 檔候選清單</strong>
    <div class="recommendationChips">
      ${selected.map((item) => `<span>${item.symbol} ${item.name}</span>`).join("")}
    </div>
    <p>這是依照你填寫的條件產生的規則式候選清單，可再自行修改代號後儲存。內容不構成投資建議或買賣訊號。</p>
  `;
  els.settingsMessage.textContent = "確認清單後，請按「儲存並更新儀表板」。";
}

function renderQuotes(payload) {
  state.quotes = payload.quotes || [];
  const marketText = marketStatusText(payload.updatedAt);
  els.quoteMeta.textContent = payload.ok ? `資料刷新時間 ${formatDateTime(payload.updatedAt)}` : `資料來源暫時失敗，顯示快取資料`;
  setStatus(payload.ok ? marketText : `資料來源暫時失敗：${payload.error || "顯示快取資料"}`, !payload.ok);
  els.quotesBody.innerHTML = "";
  state.quotes.forEach((quote) => {
    const trend = trendClass(quote.change);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${quote.symbol}</td><td>${quote.name || "-"}</td><td>${quote.market || "-"}</td>
      <td>${fmt(quote.price)}</td><td>${fmt(quote.previousClose)}</td><td>${ratioFmt(quote.peRatio)}</td><td>${pct(quote.dividendYield)}</td><td class="${trend}">${fmt(quote.change)}</td><td class="${trend}">${pct(quote.changePercent)}</td>
      <td>${intFmt(quote.volume)}</td><td>${quote.tradeTime || "-"}</td>
    `;
    els.quotesBody.appendChild(tr);
  });
  if (!state.quotes.length) els.quotesBody.innerHTML = `<tr><td colspan="11" class="warn">目前沒有報價資料。</td></tr>`;
  renderSummary(payload.summary || []);
  renderDashboard();
}

function renderSummary(lines) {
  els.summaryBox.innerHTML = lines.length
    ? lines.map((line) => `<p>${line}</p>`).join("")
    : `<p>目前沒有足夠資料產生摘要。</p>`;
}

function renderMetrics(alerts) {
  const valid = state.quotes.filter((quote) => quote.status === "ok" && quote.price !== null);
  const changes = valid.map((quote) => Number(quote.changePercent || 0));
  els.metricCount.textContent = valid.length;
  els.metricAdvancers.textContent = `${changes.filter((value) => value > 0).length}/${valid.length}`;
  const average = avg(changes);
  els.metricAverage.textContent = pct(average);
  els.metricAverage.className = trendClass(average);
  els.metricAlerts.textContent = alerts.length;
}

function drawHistoryChart() {
  const symbol = selectedSymbol();
  const quote = state.quotes.find((item) => item.symbol === symbol);
  const { rows, source } = chartRowsForSymbol(symbol, quote);
  const canvas = els.historyChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  if (!rows.length) {
    els.chartEmpty.textContent = "目前沒有足夠 K 線資料，請等待排程累積或手動刷新建立快照。";
    return;
  }
  const rangeLabel = selectedChartRange() === "quarter" ? "三個月" : selectedChartRange() === "month" ? "一個月" : "一週";
  els.chartEmpty.textContent = ["shifted", "week", "month", "quarter"].includes(source) ? `目前顯示${rangeLabel} K 線資料。` : source === "recent"
    ? "尚未累積完整快照，暫以最近可用資料顯示。"
    : "尚未累積歷史快照，暫以今日報價與前收估算顯示。";
  drawCandlestickChart(ctx, width, height, rows);
}

function drawCandlestickChart(ctx, width, height, rows) {
  const candles = rows.map((row) => {
    const close = Number(row.close);
    const open = Number.isFinite(Number(row.open)) ? Number(row.open) : close;
    const high = Number.isFinite(Number(row.high)) ? Math.max(Number(row.high), open, close) : Math.max(open, close);
    const low = Number.isFinite(Number(row.low)) ? Math.min(Number(row.low), open, close) : Math.min(open, close);
    return { ...row, open, high, low, close };
  }).filter((row) => Number.isFinite(row.close));
  if (!candles.length) return;

  const maSeries = (field, length) => candles.map((_, index) => {
    const slice = candles.slice(Math.max(0, index - length + 1), index + 1)
      .map((row) => Number(row[field]))
      .filter(Number.isFinite);
    return slice.length ? avg(slice) : null;
  });
  const ma5 = maSeries("close", 5);
  const ma20 = maSeries("close", 20);
  const ma60 = maSeries("close", 60);
  const volMa5 = maSeries("volume", 5);
  const volMa20 = maSeries("volume", 20);
  const volMa60 = maSeries("volume", 60);

  const priceValues = [...candles.map((row) => row.low), ...candles.map((row) => row.high), ...ma5, ...ma20, ...ma60]
    .filter((value) => Number.isFinite(Number(value)));
  let min = Math.min(...priceValues);
  let max = Math.max(...priceValues);
  if (min === max) { min -= 1; max += 1; }
  const spread = max - min;
  min -= spread * 0.08;
  max += spread * 0.08;
  const pad = { left: 76, right: 26, top: 54, bottom: 44 };
  const priceH = Math.round(height * 0.62);
  const volumeTop = priceH + 44;
  const volumeH = height - volumeTop - pad.bottom;
  const plotW = width - pad.left - pad.right;
  const xFor = (index) => pad.left + (plotW * index) / Math.max(1, candles.length - 1);
  const priceY = (value) => pad.top + priceH - ((value - min) / (max - min)) * priceH;
  const maxVolume = Math.max(1, ...candles.map((row) => Number(row.volume || 0)), ...volMa5, ...volMa20, ...volMa60);
  const volumeY = (value) => volumeTop + volumeH - (Number(value || 0) / maxVolume) * volumeH;

  ctx.fillStyle = "#05070d";
  ctx.fillRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.textAlign = "right";
  for (let index = 0; index <= 6; index += 1) {
    const y = pad.top + (priceH * index) / 6;
    const price = max - ((max - min) * index) / 6;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.strokeStyle = "rgba(150, 160, 180, 0.24)";
    ctx.stroke();
    ctx.fillStyle = "#f1ff3d";
    ctx.font = "28px Microsoft JhengHei, Arial";
    ctx.fillText(fmt(price, 0), pad.left - 8, y + 9);
  }

  const drawSeries = (values, color, yScale, lineWidth = 2) => {
    ctx.beginPath();
    values.forEach((value, index) => {
      if (!Number.isFinite(Number(value))) return;
      const x = xFor(index);
      const y = yScale(value);
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = color;
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const last = candles[candles.length - 1];
  const arrow = (value, previous) => Number(value || 0) >= Number(previous || value) ? "↑" : "↓";
  ctx.textAlign = "left";
  ctx.font = "28px Microsoft JhengHei, Arial";
  ctx.fillStyle = "#f1ff3d";
  ctx.fillText(`均價線5 ${fmt(ma5.at(-1))} ${arrow(ma5.at(-1), ma5.at(-2))}`, 0, 32);
  ctx.fillStyle = "#ff23d7";
  ctx.fillText(`均價線20 ${fmt(ma20.at(-1))} ${arrow(ma20.at(-1), ma20.at(-2))}`, 300, 32);
  ctx.fillStyle = "#20efe8";
  ctx.fillText(`均價線60 ${fmt(ma60.at(-1))} ${arrow(ma60.at(-1), ma60.at(-2))}`, 628, 32);

  const candleW = clamp(plotW / Math.max(12, candles.length) * 0.58, 8, 22);
  candles.forEach((row, index) => {
    const x = xFor(index);
    const up = row.close >= row.open;
    const color = up ? "#ff1744" : "#00d084";
    const bodyTop = priceY(Math.max(row.open, row.close));
    const bodyBottom = priceY(Math.min(row.open, row.close));
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, priceY(row.high));
    ctx.lineTo(x, priceY(row.low));
    ctx.stroke();
    ctx.fillRect(x - candleW / 2, bodyTop, candleW, Math.max(3, bodyBottom - bodyTop));
  });
  drawSeries(ma5, "#f1ff3d", priceY, 2);
  drawSeries(ma20, "#ff23d7", priceY, 2);
  drawSeries(ma60, "#20efe8", priceY, 2);

  const highIndex = candles.reduce((best, row, index) => row.high > candles[best].high ? index : best, 0);
  const lowIndex = candles.reduce((best, row, index) => row.low < candles[best].low ? index : best, 0);
  ctx.font = "24px Microsoft JhengHei, Arial";
  ctx.fillStyle = "#ff1744";
  ctx.textAlign = "center";
  ctx.fillText(fmt(candles[highIndex].high), xFor(highIndex), priceY(candles[highIndex].high) - 12);
  ctx.fillStyle = "#00d084";
  ctx.fillText(fmt(candles[lowIndex].low), xFor(lowIndex), priceY(candles[lowIndex].low) + 26);

  ctx.strokeStyle = "rgba(150, 160, 180, 0.34)";
  for (let index = 0; index <= 3; index += 1) {
    const y = volumeTop + (volumeH * index) / 3;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = "#f1ff3d";
    ctx.textAlign = "right";
    ctx.font = "24px Microsoft JhengHei, Arial";
    const volumeLabel = maxVolume - (maxVolume * index) / 3;
    ctx.fillText(volumeLabel >= 1000 ? `${Math.round(volumeLabel / 1000)}K` : intFmt(volumeLabel), pad.left - 8, y + 8);
  }
  ctx.textAlign = "left";
  ctx.font = "25px Microsoft JhengHei, Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`成交量 ${intFmt(last.volume)} ${arrow(last.volume, candles.at(-2)?.volume)}`, 0, volumeTop - 14);
  ctx.fillStyle = "#f1ff3d";
  ctx.fillText(`均量5 ${intFmt(volMa5.at(-1))} ${arrow(volMa5.at(-1), volMa5.at(-2))}`, 250, volumeTop - 14);
  ctx.fillStyle = "#ff23d7";
  ctx.fillText(`均量20 ${intFmt(volMa20.at(-1))} ${arrow(volMa20.at(-1), volMa20.at(-2))}`, 520, volumeTop - 14);

  candles.forEach((row, index) => {
    const x = xFor(index);
    const up = row.close >= row.open;
    ctx.fillStyle = up ? "#ff1744" : "#00d084";
    ctx.fillRect(x - candleW / 2, volumeY(row.volume), candleW, Math.max(2, volumeTop + volumeH - volumeY(row.volume)));
  });
  drawSeries(volMa5, "#f1ff3d", volumeY, 2);
  drawSeries(volMa20, "#ff23d7", volumeY, 2);
  drawSeries(volMa60, "#20efe8", volumeY, 2);

  ctx.textAlign = "center";
  ctx.fillStyle = "#f1ff3d";
  ctx.font = "26px Microsoft JhengHei, Arial";
  const labelStep = Math.max(1, Math.ceil(candles.length / 7));
  candles.forEach((row, index) => {
    if (index % labelStep === 0 || index === candles.length - 1) ctx.fillText(chartLabel(row.date), xFor(index), height - 20);
  });
}

function drawLine(ctx, width, height, values, labels = [], color = "#52c8ff", showLabels = false, predict = false) {
  const list = values.filter((value) => Number.isFinite(value));
  if (!list.length) return;
  const extended = [...list];
  const actualCount = list.length;
  if (predict && list.length > 1) {
    const sample = list.slice(-Math.min(5, list.length));
    const xMean = (sample.length - 1) / 2;
    const yMean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
    const denominator = sample.reduce((sum, _, index) => sum + (index - xMean) ** 2, 0) || 1;
    const rawSlope = sample.reduce((sum, value, index) => sum + (index - xMean) * (value - yMean), 0) / denominator;
    const last = list[list.length - 1];
    const slope = clamp(rawSlope, -last * 0.03, last * 0.03);
    extended.push(last + slope, last + slope * 2, last + slope * 3);
  } else if (predict && list.length === 1) {
    extended.push(list[0] * 1.005, list[0] * 0.995);
  }
  let min = Math.min(...extended);
  let max = Math.max(...extended);
  if (min === max) { min -= 1; max += 1; }
  const pad = { left: 56, right: 24, top: 24, bottom: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const xFor = (index) => pad.left + (plotW * index) / Math.max(1, extended.length - 1);
  const yFor = (value) => pad.top + plotH - ((value - min) / (max - min)) * plotH;
  ctx.strokeStyle = "#123b5e";
  ctx.fillStyle = "#8cc9f7";
  ctx.font = "12px Microsoft JhengHei, Arial";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (plotH * i) / 4;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
  }
  ctx.beginPath();
  list.forEach((value, index) => {
    const x = xFor(index);
    const y = yFor(value);
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(82, 200, 255, 0.75)";
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;
  if (predict && extended.length > actualCount) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xFor(actualCount - 1), yFor(extended[actualCount - 1]));
    extended.slice(actualCount).forEach((value, offset) => {
      ctx.lineTo(xFor(actualCount + offset), yFor(value));
    });
    ctx.strokeStyle = "#ffd84d";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();
  }
  list.forEach((value, index) => {
    ctx.beginPath();
    ctx.fillStyle = index === list.length - 1 ? "#ffd84d" : "#d9ecff";
    ctx.arc(xFor(index), yFor(value), index === list.length - 1 ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
  });
  if (showLabels) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#8cc9f7";
    const displayLabels = predict ? [...labels, "+1", "+2", "+3"] : labels;
    displayLabels.forEach((label, index) => {
      if (index % Math.ceil(displayLabels.length / 7) === 0 || index === displayLabels.length - 1) ctx.fillText(label, xFor(index), height - pad.bottom + 18);
    });
  }
}

function renderSingleStockChart() {
  const symbol = els.singleStockSymbol.value || state.symbols[0];
  const quote = state.quotes.find((item) => item.symbol === symbol);
  const range = Math.max(7, Number(els.singleStockRange.value || 7));
  let rows = rowsForSymbol(symbol);
  if (quote && Number.isFinite(Number(quote.price))) {
    const liveRow = {
      date: quote.tradeDate || localDateKey(new Date()),
      close: Number(quote.price),
      volume: Number(quote.volume || 0),
    };
    const sameDate = rows.findIndex((row) => row.date === liveRow.date);
    if (sameDate >= 0) rows[sameDate] = liveRow;
    else rows.push(liveRow);
  }
  rows = rows.sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-range);
  if (rows.length < 2) rows = syntheticRowsFromQuote(quote);

  const canvas = els.singleStockChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  els.singleStockName.textContent = quote ? `${symbol} ${quote.name || ""}` : symbol || "-";

  if (rows.length < 2) {
    els.singleStockStats.innerHTML = "";
    els.singleStockMessage.textContent = "目前沒有足夠資料繪製單檔走勢。";
    return;
  }

  const values = rows.map((row) => Number(row.close)).filter(Number.isFinite);
  const latest = values[values.length - 1];
  const first = values[0];
  const high = Math.max(...values);
  const low = Math.min(...values);
  const periodChange = first ? ((latest - first) / first) * 100 : 0;
  const trend = trendClass(periodChange);
  els.singleStockStats.innerHTML = `
    <div class="singleStockStat"><span>最新價</span><strong>${fmt(latest)}</strong></div>
    <div class="singleStockStat"><span>期間漲跌幅</span><strong class="${trend}">${periodChange >= 0 ? "+" : ""}${fmt(periodChange)}%</strong></div>
    <div class="singleStockStat"><span>期間最高</span><strong>${fmt(high)}</strong></div>
    <div class="singleStockStat"><span>期間最低</span><strong>${fmt(low)}</strong></div>
  `;
  els.singleStockMessage.textContent = rows[0].date === "前收" ? "歷史資料不足，目前以昨收與最新成交價顯示。" : `資料期間 ${rows[0].date} 至 ${rows[rows.length - 1].date}`;

  const spread = Math.max(high - low, Math.abs(latest) * 0.01, 1);
  const min = low - spread * 0.12;
  const max = high + spread * 0.12;
  const pad = { left: 82, right: 34, top: 28, bottom: 54 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const xFor = (index) => pad.left + (plotW * index) / Math.max(1, rows.length - 1);
  const yFor = (value) => pad.top + plotH - ((value - min) / (max - min)) * plotH;

  ctx.font = "13px Microsoft JhengHei, Arial";
  ctx.lineWidth = 1;
  for (let index = 0; index <= 5; index += 1) {
    const y = pad.top + (plotH * index) / 5;
    const price = max - ((max - min) * index) / 5;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.strokeStyle = "rgba(27, 117, 188, 0.45)";
    ctx.stroke();
    ctx.fillStyle = "#8cc9f7";
    ctx.textAlign = "right";
    ctx.fillText(fmt(price), pad.left - 10, y + 4);
  }

  ctx.beginPath();
  rows.forEach((row, index) => {
    const x = xFor(index);
    const y = yFor(row.close);
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.lineTo(xFor(rows.length - 1), pad.top + plotH);
  ctx.lineTo(xFor(0), pad.top + plotH);
  ctx.closePath();
  const area = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
  area.addColorStop(0, "rgba(82, 200, 255, 0.42)");
  area.addColorStop(1, "rgba(82, 200, 255, 0.02)");
  ctx.fillStyle = area;
  ctx.fill();

  ctx.beginPath();
  rows.forEach((row, index) => {
    const x = xFor(index);
    const y = yFor(row.close);
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#52c8ff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(82, 200, 255, 0.8)";
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const labelStep = Math.max(1, Math.ceil(rows.length / 7));
  rows.forEach((row, index) => {
    const x = xFor(index);
    const y = yFor(row.close);
    ctx.beginPath();
    ctx.arc(x, y, index === rows.length - 1 ? 6 : 3, 0, Math.PI * 2);
    ctx.fillStyle = index === rows.length - 1 ? "#ffd84d" : "#d9ecff";
    ctx.fill();
    if (index % labelStep === 0 || index === rows.length - 1) {
      ctx.fillStyle = "#8cc9f7";
      ctx.textAlign = "center";
      ctx.fillText(chartLabel(row.date), x, height - 22);
    }
  });
}

function renderBars(container, rows) {
  container.innerHTML = rows.map((row) => `
    <div class="barRow"><span>${row.label}</span><div class="barTrack"><div class="barFill" style="width:${clamp(row.value, 0, 100)}%"></div></div><strong>${row.tag || Math.round(row.value)}</strong></div>
  `).join("");
}

function averageLast(values, length) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return null;
  return avg(clean.slice(-Math.min(length, clean.length)));
}

function compactLevelRow(label, value, note = "") {
  return `<div class="levelRow"><span>${label}</span><strong>${value}</strong>${note ? `<small>${note}</small>` : ""}</div>`;
}

function renderSupportResistance(selected, rows) {
  const price = Number(selected.price || rows.at(-1)?.close || 0);
  const prices = rows.map((row) => Number(row.close)).filter(Number.isFinite);
  if (!price || !prices.length) {
    els.supportResistanceBox.innerHTML = `<p class="message">尚無足夠價格資料。</p>`;
    return;
  }
  const recent = prices.slice(-20);
  const support = Math.min(...recent);
  const resistance = Math.max(...recent);
  const range = Math.max(resistance - support, price * 0.01);
  const position = clamp(((price - support) / range) * 100, 0, 100);
  const tone = position > 78 ? "靠近壓力區" : position < 22 ? "靠近支撐區" : "位於區間中段";
  els.supportResistanceBox.innerHTML = `
    <div class="zoneMeter">
      <div class="zoneLabels"><span>支撐 ${fmt(support)}</span><strong>${tone}</strong><span>壓力 ${fmt(resistance)}</span></div>
      <div class="zoneTrack"><i style="left:${position}%"></i></div>
      <div class="zoneNow">目前價 ${fmt(price)}，區間位置 ${Math.round(position)}%</div>
    </div>
  `;
}

function renderMovingAverages(selected, rows) {
  const price = Number(selected.price || rows.at(-1)?.close || 0);
  const values = rows.map((row) => Number(row.close)).filter(Number.isFinite);
  const ma5 = averageLast(values, 5);
  const ma10 = averageLast(values, 10);
  const ma20 = averageLast(values, 20);
  if (!price || !ma5) {
    els.movingAverageBox.innerHTML = `<p class="message">尚無足夠均線資料。</p>`;
    return;
  }
  const ordering = ma20 && ma5 > ma10 && ma10 > ma20 ? "多頭排列" : ma20 && ma5 < ma10 && ma10 < ma20 ? "空頭排列" : "均線糾結";
  const above = [ma5, ma10, ma20].filter((value) => value && price >= value).length;
  const maValues = [price, ma5, ma10, ma20].filter((value) => Number.isFinite(value));
  const min = Math.min(...maValues);
  const max = Math.max(...maValues);
  const pos = (value) => max === min ? 50 : clamp(((value - min) / (max - min)) * 100, 4, 96);
  els.movingAverageBox.innerHTML = `
    <div class="maStatus ${ordering === "多頭排列" ? "bull" : ordering === "空頭排列" ? "bear" : "flat"}">${ordering}<small>價格站上 ${above}/3 條均線</small></div>
    <div class="maChart">
      <div class="maLine ma5"><span>MA5 ${fmt(ma5)}</span><i style="left:${pos(ma5)}%"></i></div>
      <div class="maLine ma10"><span>MA10 ${fmt(ma10)}</span><i style="left:${ma10 ? pos(ma10) : 50}%"></i></div>
      <div class="maLine ma20"><span>MA20 ${fmt(ma20)}</span><i style="left:${ma20 ? pos(ma20) : 50}%"></i></div>
      <b style="left:${pos(price)}%">現價</b>
    </div>
  `;
}

function renderVolumeMultiple(selected, rows) {
  const currentVolume = Number(selected.volume || rows.at(-1)?.volume || 0);
  const volumes = rows.map((row) => Number(row.volume || 0)).filter((value) => Number.isFinite(value) && value > 0);
  const averageVolume = averageLast(volumes.slice(0, -1).length ? volumes.slice(0, -1) : volumes, 5);
  if (!currentVolume || !averageVolume) {
    els.volumeMultipleBox.innerHTML = `<p class="message">尚無足夠成交量資料。</p>`;
    return;
  }
  const multiple = currentVolume / averageVolume;
  const score = clamp((multiple / 3) * 100, 0, 100);
  const label = multiple >= 2 ? "明顯放量" : multiple >= 1.2 ? "溫和放量" : multiple <= 0.65 ? "量縮" : "量能持平";
  els.volumeMultipleBox.innerHTML = `
    <div class="volumeGauge">
      <strong>${fmt(multiple)}x</strong><span>${label}</span>
      <div class="volumeScale"><i style="left:${score}%"></i></div>
      <div class="scaleTicks"><span>0.5x</span><span>1x</span><span>2x</span><span>3x</span></div>
    </div>
    ${compactLevelRow("目前成交量", intFmt(currentVolume))}
    ${compactLevelRow("近 5 日均量", intFmt(averageVolume))}
  `;
}

function renderValuation(valid, selected) {
  const pe = selected.peRatio === null || selected.peRatio === undefined ? NaN : Number(selected.peRatio);
  const yieldRate = selected.dividendYield === null || selected.dividendYield === undefined ? NaN : Number(selected.dividendYield);
  const peValues = valid.map((quote) => Number(quote.peRatio)).filter(Number.isFinite).sort((a, b) => a - b);
  const yieldValues = valid.map((quote) => Number(quote.dividendYield)).filter(Number.isFinite).sort((a, b) => b - a);
  const peRank = Number.isFinite(pe) && peValues.length ? peValues.findIndex((value) => value >= pe) + 1 : null;
  const yieldRank = Number.isFinite(yieldRate) && yieldValues.length ? yieldValues.findIndex((value) => value <= yieldRate) + 1 : null;
  const peTone = !Number.isFinite(pe) ? "資料不足" : pe <= 12 ? "估值偏低" : pe <= 25 ? "估值中性" : "估值偏高";
  const yieldTone = !Number.isFinite(yieldRate) ? "資料不足" : yieldRate >= 5 ? "收益較高" : yieldRate >= 2.5 ? "收益中性" : "收益偏低";
  const pePos = Number.isFinite(pe) ? clamp((pe / 40) * 100, 0, 100) : 50;
  const yieldPos = Number.isFinite(yieldRate) ? clamp((yieldRate / 8) * 100, 0, 100) : 50;
  els.valuationBox.innerHTML = `
    <div class="valuationMeter">
      <span>本益比 ${ratioFmt(pe)}</span>
      <div class="valuationTrack pe"><i style="left:${pePos}%"></i></div>
      <small>低估 / 合理 / 偏高${peRank ? `，10 檔中第 ${peRank} 低` : ""}</small>
    </div>
    <div class="valuationMeter">
      <span>殖利率 ${pct(yieldRate)}</span>
      <div class="valuationTrack yield"><i style="left:${yieldPos}%"></i></div>
      <small>偏低 / 中性 / 較高${yieldRank ? `，10 檔中第 ${yieldRank} 高` : ""}</small>
    </div>
    ${compactLevelRow("綜合", peTone, yieldTone)}
    <p class="miniNote">估值僅作觀測，不代表合理買賣價格。</p>
  `;
}

function renderDonutSet(container, items, accent = "#1b75bc") {
  container.innerHTML = items.map((item) => `
    <div class="marketDonut">
      <div class="donutRing" style="--value:${clamp(item.value, 0, 100)}; --accent:${item.color || accent};">
        <strong>${Math.round(item.value)}%</strong>
      </div>
      <span>${item.label}</span>
    </div>
  `).join("");
}

function stockProfile(symbol) {
  return recommendationUniverse.find((item) => item.symbol === symbol) || {
    symbol,
    name: symbol,
    categories: ["balanced"],
    type: "stock",
    risk: 2,
  };
}

function primarySector(symbol) {
  const category = stockProfile(symbol).categories[0] || "balanced";
  return {
    semiconductor: "半導體",
    finance: "金融",
    highDividend: "高股息",
    aiElectric: "AI 電子",
    balanced: "大型權值",
  }[category] || "其他";
}

function marketStats(valid, avgChange, focus, risk) {
  const advancers = valid.filter((quote) => Number(quote.changePercent || 0) > 0).length;
  const decliners = valid.filter((quote) => Number(quote.changePercent || 0) < 0).length;
  const total = Math.max(1, valid.length);
  const volumeTotal = valid.reduce((sum, quote) => sum + Number(quote.volume || 0), 0);
  const buyPower = clamp(50 + avgChange * 10 + focus * 0.35, 0, 100);
  const sellPower = clamp(50 - avgChange * 10 + (decliners / total) * 35, 0, 100);
  return {
    bigBuy: clamp(buyPower + Math.min(20, volumeTotal / 200000), 0, 100),
    retailBuy: clamp(focus + 18, 0, 100),
    retailSell: clamp(sellPower, 0, 100),
    bigLong: clamp(buyPower + (100 - risk) * 0.16, 0, 100),
    retailLong: clamp(50 + (advancers / total) * 42, 0, 100),
    retailShort: clamp(sellPower + risk * 0.12, 0, 100),
  };
}

function renderMarketOverview(valid, avgChange, focus, risk) {
  const stats = marketStats(valid, avgChange, focus, risk);
  renderDonutSet(els.marketTrendBox, [
    { label: "大戶買盤", value: stats.bigBuy, color: "#ff3333" },
    { label: "散戶買盤", value: stats.retailBuy, color: "#ff8c00" },
    { label: "散戶賣壓", value: stats.retailSell, color: "#21d86b" },
  ]);
  renderDonutSet(els.marketPowerBox, [
    { label: "大戶買盤", value: stats.bigLong, color: "#1b75bc" },
    { label: "散戶買盤", value: stats.retailLong, color: "#1b75bc" },
    { label: "散戶賣壓", value: stats.retailShort, color: "#1b75bc" },
  ], "#1b75bc");
  const level = stats.bigLong >= 75 ? "1 級區" : stats.bigLong >= 60 ? "2 級區" : stats.bigLong >= 45 ? "3 級區" : "4 級區";
  const time = new Date().toLocaleString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  els.marketTrendMeta.textContent = `資料時間：${time}`;
  els.marketPowerMeta.textContent = `信號等級：${level}`;
}

function renderSectorTide(valid) {
  const maxVolume = Math.max(1, ...valid.map((quote) => Number(quote.volume || 0)));
  const sectors = new Map();
  valid.forEach((quote) => {
    const sector = primarySector(quote.symbol);
    const change = Number(quote.changePercent || 0);
    const volumeScore = Number(quote.volume || 0) / maxVolume;
    const force = change * (0.7 + volumeScore);
    if (!sectors.has(sector)) sectors.set(sector, { name: sector, count: 0, force: 0, volume: 0, symbols: [] });
    const item = sectors.get(sector);
    item.count += 1;
    item.force += force;
    item.volume += Number(quote.volume || 0);
    item.symbols.push(quote.symbol);
  });
  const list = [...sectors.values()].map((item) => {
    const avgForce = item.force / Math.max(1, item.count);
    const acceleration = avgForce - avg(valid.map((quote) => Number(quote.changePercent || 0))) * 0.55;
    return { ...item, avgForce, acceleration };
  });
  const strongest = list.sort((a, b) => b.avgForce - a.avgForce)[0];
  els.sectorTideBox.innerHTML = `
    <div class="tideCurrent"></div>
    <div class="tideAxis horizontal"><span>加速流出</span><span>資金流入</span></div>
    <div class="tideAxis vertical"><span>流出但放緩</span><span>加速流入</span></div>
    ${list.map((item) => {
      const x = clamp(50 + item.avgForce * 9, 8, 92);
      const y = clamp(50 - item.acceleration * 11, 10, 90);
      const size = clamp(48 + Math.sqrt(Math.max(0, item.volume)) / 28, 48, 96);
      const hot = item.avgForce > 0 ? "inflow" : "outflow";
      const label = `${item.avgForce >= 0 ? "+" : ""}${fmt(item.avgForce)}%`;
      const driftX = clamp(item.avgForce * 2.2, -18, 18);
      const driftY = clamp(item.acceleration * -2.4, -18, 18);
      const speed = clamp(7 - Math.abs(item.avgForce) * 0.35, 3.8, 7.5);
      const delay = (item.name.charCodeAt(0) % 7) * -0.45;
      return `<div class="tideBubble ${hot}" style="left:${x}%; top:${y}%; width:${size}px; height:${size}px; --drift-x:${driftX}px; --drift-y:${driftY}px; --speed:${speed}s; --delay:${delay}s;"><strong>${item.name}</strong><span>${label}</span></div>`;
    }).join("")}
  `;
  els.sectorTideMeta.textContent = strongest
    ? `法人資金流向推估：${strongest.name} 相對偏強，成分 ${strongest.symbols.join("、")}。`
    : "法人資金流向推估：尚無足夠資料。";
}

function drawRadar(values) {
  const canvas = els.radarChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const labels = ["趨勢", "量能", "主力", "流向", "風險", "熱度"];
  const cx = width / 2;
  const cy = height / 2 + 8;
  const radius = 78;
  ctx.strokeStyle = "#335b80";
  for (let ring = 1; ring <= 4; ring += 1) {
    ctx.beginPath();
    labels.forEach((_, i) => {
      const a = -Math.PI / 2 + (Math.PI * 2 * i) / labels.length;
      const x = cx + Math.cos(a) * radius * ring / 4;
      const y = cy + Math.sin(a) * radius * ring / 4;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath(); ctx.stroke();
  }
  ctx.beginPath();
  values.forEach((value, i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / labels.length;
    const x = cx + Math.cos(a) * radius * clamp(value, 0, 100) / 100;
    const y = cy + Math.sin(a) * radius * clamp(value, 0, 100) / 100;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 51, 51, 0.35)";
  ctx.strokeStyle = "#ff4d4d";
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#d9ecff";
  ctx.font = "12px Microsoft JhengHei, Arial";
  ctx.textAlign = "center";
  labels.forEach((label, i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / labels.length;
    ctx.fillText(label, cx + Math.cos(a) * (radius + 24), cy + Math.sin(a) * (radius + 20));
  });
}

function renderProBars(container, items) {
  container.innerHTML = items.map(({ label, value, text, tone = "cyan" }) => {
    const score = clamp(Number(value || 0), 0, 100);
    return `<div class="proBarRow"><div><span>${label}</span><strong>${text || `${Math.round(score)}%`}</strong></div><div class="proBarTrack"><i class="${tone}" style="width:${score}%"></i></div></div>`;
  }).join("");
}

function drawProRadar(canvas, values, labels, accent = "#ff6259") {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2 + 8;
  const radius = Math.min(width, height) * 0.31;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, width, height);
  for (let ring = 1; ring <= 4; ring += 1) {
    ctx.beginPath();
    labels.forEach((_, index) => {
      const angle = -Math.PI / 2 + Math.PI * 2 * index / labels.length;
      const x = cx + Math.cos(angle) * radius * ring / 4;
      const y = cy + Math.sin(angle) * radius * ring / 4;
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = "rgba(82, 129, 177, 0.34)";
    ctx.stroke();
  }
  ctx.beginPath();
  values.forEach((value, index) => {
    const angle = -Math.PI / 2 + Math.PI * 2 * index / labels.length;
    const x = cx + Math.cos(angle) * radius * clamp(value, 0, 100) / 100;
    const y = cy + Math.sin(angle) * radius * clamp(value, 0, 100) / 100;
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = `${accent}35`;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#9bb2d2";
  ctx.font = "13px Microsoft JhengHei, Arial";
  ctx.textAlign = "center";
  labels.forEach((label, index) => {
    const angle = -Math.PI / 2 + Math.PI * 2 * index / labels.length;
    ctx.fillText(label, cx + Math.cos(angle) * (radius + 30), cy + Math.sin(angle) * (radius + 22));
  });
}

function drawProCostDistribution(canvas, rows) {
  const ctx = canvas.getContext("2d");
  const closes = rows.map((row) => Number(row.close)).filter(Number.isFinite);
  const costs = weightedCostValues(rows).filter(Number.isFinite);
  const all = [...closes, ...costs];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!all.length) return;
  let min = Math.min(...all);
  let max = Math.max(...all);
  if (min === max) { min -= 1; max += 1; }
  const pad = { left: 58, right: 18, top: 24, bottom: 38 };
  const x = (index) => pad.left + (canvas.width - pad.left - pad.right) * index / Math.max(1, closes.length - 1);
  const y = (value) => pad.top + (canvas.height - pad.top - pad.bottom) * (1 - (value - min) / (max - min));
  for (let index = 0; index <= 4; index += 1) {
    const lineY = pad.top + (canvas.height - pad.top - pad.bottom) * index / 4;
    ctx.beginPath(); ctx.moveTo(pad.left, lineY); ctx.lineTo(canvas.width - pad.right, lineY);
    ctx.strokeStyle = "rgba(67, 111, 156, .3)"; ctx.stroke();
  }
  const draw = (values, color, fill = false) => {
    ctx.beginPath();
    values.forEach((value, index) => index ? ctx.lineTo(x(index), y(value)) : ctx.moveTo(x(index), y(value)));
    if (fill) {
      ctx.lineTo(x(values.length - 1), canvas.height - pad.bottom);
      ctx.lineTo(x(0), canvas.height - pad.bottom);
      ctx.closePath(); ctx.fillStyle = `${color}22`; ctx.fill();
      ctx.beginPath();
      values.forEach((value, index) => index ? ctx.lineTo(x(index), y(value)) : ctx.moveTo(x(index), y(value)));
    }
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = color; ctx.shadowBlur = 5; ctx.stroke(); ctx.shadowBlur = 0;
  };
  draw(closes, "#638ff3", true);
  draw(costs, "#ffd84d");
  ctx.fillStyle = "#91a8c7"; ctx.font = "12px Microsoft JhengHei, Arial"; ctx.textAlign = "left";
  ctx.fillText("收盤價", pad.left, canvas.height - 12);
  ctx.fillStyle = "#ffd84d"; ctx.fillText("量價成本線", pad.left + 72, canvas.height - 12);
}

function proDonut(label, value, color) {
  const score = Math.round(clamp(value, 0, 100));
  return `<div class="proDonut"><div style="--value:${score};--accent:${color}"><strong>${score}%</strong></div><span>${label}</span></div>`;
}

function renderProDashboard() {
  if (!els.proDashboardPanel) return;
  const valid = state.quotes.filter((quote) => quote.status === "ok" && Number.isFinite(Number(quote.price)));
  const symbol = els.proSymbol.value || selectedSymbol() || valid[0]?.symbol;
  const selected = valid.find((quote) => quote.symbol === symbol) || valid[0];
  if (!selected) return;
  if (els.proSymbol.value !== selected.symbol) els.proSymbol.value = selected.symbol;

  let rows = rowsForSymbol(selected.symbol).slice(-66);
  if (rows.length < 4) rows = syntheticRowsFromQuote(selected);
  const changes = valid.map((quote) => Number(quote.changePercent || 0));
  const avgChange = avg(changes);
  const maxVolume = Math.max(1, ...valid.map((quote) => Number(quote.volume || 0)));
  const volumeRatio = Number(selected.volume || 0) / maxVolume;
  const change = Number(selected.changePercent || 0);
  const risk = clamp(Math.abs(change) * 12 + volumeRatio * 36, 0, 100);
  const trend = clamp(50 + change * 8, 0, 100);
  const momentum = clamp(50 + change * 10 + (volumeRatio - 0.4) * 20, 0, 100);
  const breadth = clamp(valid.filter((quote) => Number(quote.changePercent || 0) > 0).length / Math.max(1, valid.length) * 100, 0, 100);
  const confidence = clamp(avg([trend, momentum, breadth, 100 - risk]), 0, 100);
  const mainForce = clamp(50 + change * 7 + (volumeRatio - 0.4) * 30, 0, 100);
  const flow = clamp(50 + avgChange * 9, 0, 100);
  const lastDate = selected.tradeDate || rows.at(-1)?.date || "-";

  els.proStockName.textContent = selected.name || selected.symbol;
  els.proDataMeta.textContent = `最新交易日 ${lastDate}｜歷史資料 ${rows.length} 筆｜更新 ${selected.tradeTime || "-"}`;
  const summaryItems = [
    ["成交價", fmt(selected.price)], ["漲跌", fmt(selected.change)], ["漲幅", pct(selected.changePercent)],
    ["成交量", intFmt(selected.volume)], ["昨收", fmt(selected.previousClose)], ["開盤", fmt(selected.open)],
    ["最高", fmt(selected.high)], ["最低", fmt(selected.low)], ["本益比", ratioFmt(selected.peRatio)], ["殖利率", pct(selected.dividendYield)],
  ];
  els.proSummaryStats.innerHTML = summaryItems.map(([label, value], index) => `<div><span>${label}</span><strong class="${index === 1 || index === 2 ? trendClass(selected.change) : ""}">${value}</strong></div>`).join("");

  const kCtx = els.proKChart.getContext("2d");
  kCtx.clearRect(0, 0, els.proKChart.width, els.proKChart.height);
  drawCandlestickChart(kCtx, els.proKChart.width, els.proKChart.height, rows);

  const decisionTone = risk >= 70 ? "高風險" : trend >= 62 ? "偏多觀察" : trend <= 38 ? "偏空防守" : "中性等待";
  els.proDecisionCore.innerHTML = `
    <div class="proDecisionBadge ${risk >= 70 ? "danger" : trend >= 58 ? "positive" : "caution"}">${decisionTone}</div>
    <dl><div><dt>趨勢判斷</dt><dd>${trend >= 58 ? "偏多" : trend <= 42 ? "偏空" : "盤整"}</dd></div><div><dt>量價狀態</dt><dd>${volumeRatio >= 0.7 ? "量能活躍" : "量能一般"}</dd></div><div><dt>市場廣度</dt><dd>${Math.round(breadth)} / 100</dd></div><div><dt>風險等級</dt><dd>${Math.round(risk)} / 100</dd></div></dl>`;
  drawProRadar(els.proMultiRadar, [trend, momentum, mainForce, volumeRatio * 100, 100 - risk], ["趨勢", "動能", "主力", "量能", "穩定"], "#ff6259");
  els.proMultiRead.innerHTML = `<strong>綜合評分 ${Math.round(confidence)} / 100</strong><span>${confidence >= 65 ? "A 級" : confidence >= 50 ? "B 級" : "C 級"}</span>`;

  const heatRows = rows.slice(-20);
  const maxHeatVolume = Math.max(1, ...heatRows.map((row) => Number(row.volume || 0)));
  els.proHeatMap.innerHTML = heatRows.slice(-10).reverse().map((row) => `<div class="heatBand"><span>${fmt(row.close)}</span><i style="width:${clamp(Number(row.volume || 0) / maxHeatVolume * 100, 8, 100)}%"></i><small>${intFmt(row.volume)}</small></div>`).join("");
  drawProRadar(els.proRiskRadar, [risk, 100 - trend, volumeRatio * 100, Math.abs(change) * 15, 100 - confidence], ["波動", "反轉", "流動", "跳空", "模型"], "#e86a5f");
  els.proRiskText.innerHTML = `<strong>主力風險指數：${risk >= 70 ? "高" : risk >= 45 ? "中" : "低"}</strong><span>${Math.round(risk)}%</span>`;

  const closeValues = rows.map((row) => Number(row.close)).filter(Number.isFinite);
  const predCtx = els.proPredictionChart.getContext("2d");
  predCtx.clearRect(0, 0, els.proPredictionChart.width, els.proPredictionChart.height);
  predCtx.fillStyle = "#05080d";
  predCtx.fillRect(0, 0, els.proPredictionChart.width, els.proPredictionChart.height);
  drawLine(predCtx, els.proPredictionChart.width, els.proPredictionChart.height, closeValues, rows.map((row) => chartLabel(row.date)), "#ffd84d", true, true);

  drawProCostDistribution(els.proCostDistribution, rows);
  const costValues = weightedCostValues(rows);
  const latestCost = costValues.at(-1) || Number(selected.price || 0);
  els.proCostText.innerHTML = `<strong>主力平均成本 ${fmt(latestCost)}</strong><span>現價偏離 ${pct(latestCost ? (Number(selected.price) - latestCost) / latestCost * 100 : 0)}</span>`;

  const institutional = [
    ["外資動能", clamp(50 + change * 7, 0, 100), change >= 0 ? "偏買" : "偏賣"],
    ["投信動能", clamp(50 + momentum - 50, 0, 100), momentum >= 50 ? "偏買" : "偏賣"],
    ["自營商動能", clamp(50 + avgChange * 10, 0, 100), avgChange >= 0 ? "偏買" : "偏賣"],
  ];
  els.proInstitutional.innerHTML = `<div class="institutionChart">${institutional.map(([label, value]) => `<div><span>${label}</span><i class="${value >= 50 ? "buy" : "sell"}" style="--value:${value}%"></i><strong>${Math.round(value)}</strong></div>`).join("")}</div><div class="institutionTable">${institutional.map(([label, value, tag]) => `<div><span>${label}</span><strong class="${value >= 50 ? "up" : "down"}">${tag}</strong><small>${Math.round(value)} 分</small></div>`).join("")}</div>`;
  renderProBars(els.proOvernightRisk, [
    { label: "主力賣出異常", value: risk, tone: "red" }, { label: "籌碼換手率", value: volumeRatio * 100, tone: "red" },
    { label: "沖銷比例", value: clamp(risk * 0.65 + volumeRatio * 25, 0, 100), tone: "red" }, { label: "開高回落", value: clamp(100 - trend, 0, 100), tone: "yellow" },
  ]);
  const bull = clamp(avg([trend, momentum, breadth]), 0, 100);
  els.proEnergy.innerHTML = `<div class="energyPair"><div><span>多方能量</span><i style="--value:${bull}%"></i><strong>${Math.round(bull)}%</strong></div><div><span>空方能量</span><i class="bear" style="--value:${100 - bull}%"></i><strong>${Math.round(100 - bull)}%</strong></div></div><p>多空比：${fmt(bull / Math.max(1, 100 - bull))} 倍</p>`;
  const healthItems = [["籌碼", mainForce], ["技術", trend], ["資金", flow], ["波動", 100 - risk], ["支撐", confidence]];
  els.proHealth.innerHTML = healthItems.map(([label, value], index) => proDonut(label, value, ["#55d782", "#f0be52", "#638ff3", "#ff6b61", "#55d782"][index])).join("");
  const signalColor = risk > 70 ? "red" : confidence > 60 ? "green" : "yellow";
  els.proSignal.innerHTML = `<div class="signalTower"><i class="red ${signalColor === "red" ? "on" : ""}"></i><i class="yellow ${signalColor === "yellow" ? "on" : ""}"></i><i class="green ${signalColor === "green" ? "on" : ""}"></i></div><strong>${signalColor === "red" ? "風險升高" : signalColor === "green" ? "動能轉強" : "等待確認"}</strong>`;
  const sentiment = Math.round(clamp(avg([trend, flow, breadth, 100 - risk]), 0, 100));
  els.proSentiment.innerHTML = `<div class="semiArc" style="--value:${sentiment}"><strong>${sentiment > 70 ? "貪婪" : sentiment < 35 ? "恐懼" : "中性"}</strong><span>${sentiment}/100</span></div><p>散戶情緒 ${Math.round(breadth)}%｜主力情緒 ${Math.round(mainForce)}%</p>`;
  renderProBars(els.proConfidence, [
    { label: "AI 信心", value: confidence, tone: "blue" }, { label: "資料完整", value: clamp(rows.length / 60 * 100, 20, 100), tone: "cyan" },
    { label: "訊號穩定", value: 100 - risk, tone: "green" }, { label: "策略適用", value: avg([confidence, 100 - risk]), tone: "yellow" },
  ]);

  const sectorMap = new Map();
  valid.forEach((quote) => {
    const sector = primarySector(quote.symbol);
    const item = sectorMap.get(sector) || { name: sector, change: 0, volume: 0, count: 0 };
    item.change += Number(quote.changePercent || 0);
    item.volume += Number(quote.volume || 0);
    item.count += 1;
    sectorMap.set(sector, item);
  });
  const sectors = [...sectorMap.values()].map((item) => ({ ...item, score: item.change / item.count })).sort((a, b) => b.score - a.score);
  const strongest = sectors[0];
  els.proChipSummary.innerHTML = `<dl><div><dt>量價結構</dt><dd class="${change >= 0 ? "up" : "down"}">${change >= 0 ? "偏多" : "偏空"}</dd></div><div><dt>強勢板塊</dt><dd>${strongest?.name || "-"}</dd></div><div><dt>成本偏離</dt><dd>${pct(latestCost ? (Number(selected.price) - latestCost) / latestCost * 100 : 0)}</dd></div><div><dt>估值觀測</dt><dd>PE ${ratioFmt(selected.peRatio)}</dd></div></dl>`;
  els.proBuyingPower.innerHTML = proDonut("大戶買盤", mainForce, "#ef625b") + proDonut("散戶買盤", breadth, "#e6b84a") + proDonut("散戶賣壓", 100 - breadth, "#52cb7a");
  els.proStrength.innerHTML = proDonut("多方強度", bull, "#ef625b") + proDonut("空方強度", 100 - bull, "#52cb7a") + proDonut("量能強度", volumeRatio * 100, "#638ff3");
  els.proConclusion.innerHTML = `<div class="proVerdict"><span>主力語意</span><strong>${mainForce >= 65 ? "積極承接" : mainForce <= 38 ? "調節減碼" : "中性觀察"}</strong></div><div class="proVerdictTags"><span>${risk >= 65 ? "高波動" : "風險可控"}</span><span>${trend >= 55 ? "趨勢偏多" : "趨勢整理"}</span><span>${confidence >= 60 ? "信心較高" : "等待確認"}</span></div><p>${selected.symbol} ${selected.name || ""}目前趨勢 ${Math.round(trend)} 分、主力動能 ${Math.round(mainForce)} 分、風險 ${Math.round(risk)} 分；${strongest ? `${strongest.name}為相對強勢板塊。` : "板塊資料累積中。"}</p><small>本頁依即時報價與歷史快照進行規則式推估，不構成投資建議；法人數值並非交易所正式買賣超。</small>`;
}

function setProDashboard(open) {
  els.appMain.classList.toggle("proMode", open);
  els.proDashboardPanel.classList.toggle("hidden", !open);
  els.proDashboardToggle.textContent = open ? "返回原儀表板" : "綜合儀表板";
  els.proDashboardToggle.classList.toggle("primary", open);
  if (open) {
    renderProDashboard();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function exportDashboardCsv() {
  const headers = ["代號", "名稱", "市場", "成交價", "昨收", "本益比", "殖利率", "漲跌", "漲跌幅", "成交量", "時間"];
  const rows = state.quotes.map((quote) => [quote.symbol, quote.name, quote.market, quote.price, quote.previousClose, quote.peRatio, quote.dividendYield, quote.change, quote.changePercent, quote.volume, quote.tradeTime]);
  const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  link.download = `台股綜合儀表板-${localDateKey(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderDashboard() {
  const valid = state.quotes.filter((quote) => quote.status === "ok");
  const selected = state.quotes.find((quote) => quote.symbol === selectedSymbol()) || valid[0] || {};
  const selectedChart = chartRowsForSymbol(selected.symbol, selected);
  const selectedRows = selectedChart.rows;
  const changes = valid.map((quote) => Number(quote.changePercent || 0));
  const avgChange = avg(changes);
  const selectedChange = Number(selected.changePercent || 0);
  const maxVolume = Math.max(1, ...valid.map((quote) => Number(quote.volume || 0)));
  const selectedVolumeRatio = Number(selected.volume || 0) / maxVolume;
  const risk = clamp(Math.abs(selectedChange) * 12 + selectedVolumeRatio * 35, 0, 100);
  const trend = clamp(50 + selectedChange * 8, 0, 100);
  const volume = clamp(selectedVolumeRatio * 100, 0, 100);
  const main = clamp(50 + selectedChange * 7 + (selectedVolumeRatio - 0.4) * 30, 0, 100);
  const flow = clamp(50 + avgChange * 8, 0, 100);
  const focus = clamp((valid.filter((quote) => Number(quote.changePercent || 0) > 0).length / Math.max(1, valid.length)) * 100, 0, 100);
  const alerts = valid.filter((quote) => Math.abs(Number(quote.changePercent || 0)) >= 3);
  renderMetrics(alerts);
  drawHistoryChart();
  renderSingleStockChart();
  renderSupportResistance(selected, selectedRows);
  renderMovingAverages(selected, selectedRows);
  renderVolumeMultiple(selected, selectedRows);
  renderValuation(valid, selected);
  renderMarketOverview(valid, avgChange, focus, risk);
  renderSectorTide(valid);
  els.boardDate.textContent = new Date().toLocaleDateString("zh-TW");
  els.boardTime.textContent = new Date().toLocaleTimeString("zh-TW", { hour12: false });
  renderBars(els.intentBars, [
    { label: "主力洗盤", value: 100 - main },
    { label: "主力吸籌", value: main },
    { label: "主力出貨", value: risk },
    { label: "突破風險", value: trend },
    { label: "假突破", value: risk * 0.78 },
  ]);
  els.intentConclusion.textContent = main > 65 ? "主力訊號偏積極，請同步觀察量能與支撐。" : "訊號仍偏混合，未見量能確認前不宜追高。";
  renderBars(els.riskBars, [
    { label: "籌碼集中", value: main },
    { label: "量能熱度", value: volume },
    { label: "波動程度", value: risk },
    { label: "開高風險", value: clamp(Math.abs(Number(selected.change || 0)) / Math.max(1, Number(selected.price || 1)) * 900, 0, 100) },
  ]);
  els.riskScore.textContent = Math.round(risk);
  drawRadar([trend, volume, main, flow, risk, focus]);
  els.radarSummary.textContent = `雷達等級：${trend > 70 ? "S" : trend > 55 ? "A" : "B"} / 風險值 ${Math.round(risk)}/100`;
  const price = Number(selected.price || 0);
  els.scenarioList.innerHTML = [
    ["突破上漲", 40, price * 1.03, price * 0.985],
    ["震盪整理", 35, price * 1.015, price * 0.975],
    ["轉弱下跌", 25, price * 0.985, price * 0.955],
  ].map((item) => `<div class="scenario"><strong>${item[0]}<span>${item[1]}%</span></strong>關鍵價 ${fmt(price)} / 目標價 ${fmt(item[2])} / 停損價 ${fmt(item[3])}</div>`).join("");
  const bull = clamp(50 + avgChange * 10 + (focus - 50) * 0.45, 0, 100);
  renderBars(els.energyBars, [{ label: "多方能量", value: bull, tag: `${Math.round(bull)}%` }, { label: "空方能量", value: 100 - bull, tag: `${Math.round(100 - bull)}%` }]);
  els.energyText.textContent = `趨勢 ${Math.round(trend)} / 量能 ${Math.round(volume)} / 流向 ${Math.round(flow)}`;
  const closeValues = selectedRows.map((row) => row.close);
  const costValues = weightedCostValues(selectedRows);
  const costCtx = els.costChart.getContext("2d");
  costCtx.clearRect(0, 0, els.costChart.width, els.costChart.height);
  drawLine(costCtx, els.costChart.width, els.costChart.height, costValues, selectedRows.map((row) => chartLabel(row.date)), "#ff3333", true);
  const costPrefix = selectedChart.source === "shifted" ? "往前一週" : selectedChart.source === "recent" ? "最近可用" : "今日估算";
  els.costText.textContent = costValues.length ? `${costPrefix}成交量加權成本區 ${fmt(Math.min(...costValues))} - ${fmt(Math.max(...costValues))}；目前價 ${fmt(selected.price)}。` : "尚無足夠資料。";
  els.volumeProfile.innerHTML = [...valid].sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0)).slice(0, 10).map((quote) => {
    const width = clamp((Number(quote.volume || 0) / maxVolume) * 100, 4, 100);
    return `<div class="profileRow"><span>${quote.symbol}</span><div class="profileBar" style="width:${width}%"></div><strong>${intFmt(quote.volume)}</strong></div>`;
  }).join("");
  const gauges = [["趨勢", trend], ["籌碼", main], ["量能", volume], ["波動", 100 - risk], ["控盤", flow], ["總評", avg([trend, main, volume, 100 - risk, flow])]];
  els.healthGauges.innerHTML = gauges.map(([label, value]) => `<div class="gauge"><div><strong>${Math.round(value)}</strong><span>${label}</span></div></div>`).join("");
  els.trafficLights.innerHTML = `
    <div class="trafficItem"><span class="light red"></span><div><strong>紅燈</strong><small>主力出貨 / 高波動</small></div></div>
    <div class="trafficItem"><span class="light yellow"></span><div><strong>黃燈</strong><small>區間整理 / 等待確認</small></div></div>
    <div class="trafficItem"><span class="light green"></span><div><strong>綠燈</strong><small>低風險趨勢延續</small></div></div>
    <div class="trafficItem"><span class="light ${risk > 70 ? "red" : risk > 45 ? "yellow" : "green"}"></span><div><strong>目前</strong><small>${risk > 70 ? "高" : risk > 45 ? "中" : "低"}風險訊號</small></div></div>
  `;
  const predCtx = els.predictionChart.getContext("2d");
  predCtx.clearRect(0, 0, els.predictionChart.width, els.predictionChart.height);
  drawLine(predCtx, els.predictionChart.width, els.predictionChart.height, closeValues, selectedRows.map((row) => chartLabel(row.date)), "#ffd84d", true, true);
  const sentiment = Math.round(clamp(avg([trend, flow, focus, 100 - risk]), 0, 100));
  els.sentimentNeedle.style.transform = `rotate(${(sentiment / 100) * 180 - 90}deg)`;
  els.sentimentLabel.textContent = sentiment > 70 ? "貪婪" : sentiment < 35 ? "恐懼" : "中性";
  els.sentimentScore.textContent = `${sentiment}/100`;
  els.finalAdvice.innerHTML = `
    <p><strong>${risk > 70 ? "高檔震盪風險增高" : risk > 45 ? "中性風險，等待確認" : "風險可控，觀察延續"}</strong></p>
    <p>選定標的：${selected.symbol || "-"} ${selected.name || ""} / 漲跌幅 ${pct(selected.changePercent)} / 量能熱度 ${Math.round(volume)}。</p>
    <p>本儀表板為規則式分析，不構成投資建議。</p>
  `;
  renderProDashboard();
}

async function loadSettings() {
  const payload = await api("/api/settings");
  state.symbols = payload.symbols || [];
  renderSettings();
}

async function loadHistory() {
  state.history = await api("/api/history?historyVersion=3");
}

async function refresh(save = false) {
  const payload = await api(save ? "/api/refresh" : "/api/quotes", { method: save ? "POST" : "GET" });
  await loadHistory();
  renderQuotes(payload);
}

async function boot() {
  const session = await api("/api/session");
  if (!session.authenticated) {
    showLogin();
    return;
  }
  showApp(session.user);
  await loadSettings();
  await loadHistory();
  await refresh(false);
  state.refreshTimer = window.setInterval(() => refresh(false).catch((error) => setStatus(error.message, true)), 60000);
}

async function loadUsers() {
  const payload = await api("/api/users");
  els.usersList.innerHTML = payload.users.map((user) => `
    <div class="userRow">
      <div><strong>${user.username}</strong><small>${user.displayName || "-"}</small></div>
      <div><small>權限</small><strong>${user.role === "admin" ? "管理員" : "一般使用者"}</strong></div>
      <div><small>狀態</small><strong class="${user.active ? "up" : "warn"}">${user.active ? "啟用" : "停用"}</strong></div>
      <div class="userActions">
        <button data-action="toggle" data-user="${user.username}" data-active="${user.active}">${user.active ? "停用" : "啟用"}</button>
        <button data-action="role" data-user="${user.username}" data-role="${user.role}">${user.role === "admin" ? "改為使用者" : "升為管理員"}</button>
        <button data-action="password" data-user="${user.username}">改密碼</button>
        <button data-action="delete" data-user="${user.username}">刪除</button>
      </div>
    </div>
  `).join("");
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = await api("/api/login", { method: "POST", body: JSON.stringify({ username: els.loginUsername.value, password: els.loginPassword.value }) });
    showApp(payload.user);
    await loadSettings();
    await loadHistory();
    await refresh(false);
  } catch (error) {
    els.loginMessage.textContent = error.message;
  }
});

els.logoutBtn.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST" }).catch(() => {});
  showLogin("已登出。");
});

els.refreshBtn.addEventListener("click", async () => {
  els.refreshBtn.disabled = true;
  try { await refresh(true); } catch (error) { setStatus(error.message, true); }
  finally { els.refreshBtn.disabled = false; }
});

els.proDashboardToggle.addEventListener("click", () => setProDashboard(!els.appMain.classList.contains("proMode")));
els.settingsToggle.addEventListener("click", () => {
  setProDashboard(false);
  els.settingsPanel.classList.toggle("hidden");
});
els.usersToggle.addEventListener("click", async () => {
  setProDashboard(false);
  if (!state.user || state.user.role !== "admin") {
    els.usersPanel.classList.add("hidden");
    return;
  }
  els.usersPanel.classList.toggle("hidden");
  if (!els.usersPanel.classList.contains("hidden")) await loadUsers();
});
els.chartSymbol.addEventListener("change", renderDashboard);
els.chartRange.addEventListener("change", renderDashboard);
els.proSymbol.addEventListener("change", () => {
  if ([...els.chartSymbol.options].some((option) => option.value === els.proSymbol.value)) els.chartSymbol.value = els.proSymbol.value;
  if ([...els.singleStockSymbol.options].some((option) => option.value === els.proSymbol.value)) els.singleStockSymbol.value = els.proSymbol.value;
  renderDashboard();
});
els.proExportCsv.addEventListener("click", exportDashboardCsv);
els.proPrint.addEventListener("click", () => window.print());
els.singleStockSymbol.addEventListener("change", renderSingleStockChart);
els.singleStockRange.addEventListener("change", renderSingleStockChart);
els.generateRecommendationBtn.addEventListener("click", generateRecommendations);

els.saveSettingsBtn.addEventListener("click", async () => {
  try {
    const symbols = els.symbolsInput.value.split(/[\s,]+/).filter(Boolean);
    const payload = await api("/api/settings", { method: "POST", body: JSON.stringify({ symbols }) });
    state.symbols = payload.symbols;
    renderSettings();
    els.settingsMessage.textContent = "股票清單已儲存。";
    await refresh(true);
  } catch (error) {
    els.settingsMessage.textContent = error.message;
  }
});

els.userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = await api("/api/users", { method: "POST", body: JSON.stringify({
      username: els.newUsername.value,
      displayName: els.newDisplayName.value,
      password: els.newPassword.value,
      role: els.newRole.value,
    }) });
    els.usersMessage.textContent = "帳號已新增。";
    els.newUsername.value = "";
    els.newDisplayName.value = "";
    els.newPassword.value = "";
    await loadUsers(payload.users);
  } catch (error) {
    els.usersMessage.textContent = error.message;
  }
});

els.usersList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const username = button.dataset.user;
  try {
    if (button.dataset.action === "delete") {
      if (!confirm(`確定要刪除 ${username} 嗎？`)) return;
      await api("/api/users/delete", { method: "POST", body: JSON.stringify({ username }) });
    } else if (button.dataset.action === "password") {
      const password = prompt("請輸入新密碼（至少 6 碼）");
      if (!password) return;
      await api("/api/users/update", { method: "POST", body: JSON.stringify({ username, password }) });
    } else if (button.dataset.action === "toggle") {
      await api("/api/users/update", { method: "POST", body: JSON.stringify({ username, active: button.dataset.active !== "true" }) });
    } else if (button.dataset.action === "role") {
      await api("/api/users/update", { method: "POST", body: JSON.stringify({ username, role: button.dataset.role === "admin" ? "user" : "admin" }) });
    }
    await loadUsers();
  } catch (error) {
    els.usersMessage.textContent = error.message;
  }
});

boot().catch((error) => showLogin(error.message));
