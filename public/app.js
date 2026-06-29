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

function rowsForSymbol(symbol) {
  const rows = (state.history.snapshots || [])
    .map((snapshot) => {
      const quote = (snapshot.quotes || []).find((item) => item.symbol === symbol);
      if (!quote || quote.price === null) return null;
      return { date: snapshot.date, close: Number(quote.price), volume: Number(quote.volume || 0) };
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

function syntheticRowsFromQuote(quote) {
  if (!quote || !Number.isFinite(Number(quote.price))) return [];
  const price = Number(quote.price);
  const previous = Number.isFinite(Number(quote.previousClose)) ? Number(quote.previousClose) : price;
  const date = quote.tradeDate || localDateKey(new Date());
  return [
    { date: "前收", close: previous, volume: 0 },
    { date, close: price, volume: Number(quote.volume || 0) },
  ];
}

function chartRowsForSymbol(symbol, quote) {
  const shifted = shiftedWeekRows(symbol);
  if (shifted.length >= 4) return { rows: shifted, source: "shifted" };
  const recent = rowsForSymbol(symbol).slice(-7);
  if (recent.length >= 4) return { rows: recent, source: "recent" };
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
  if (state.symbols.includes(current)) els.chartSymbol.value = current;
  if (state.symbols.includes(currentSingle)) els.singleStockSymbol.value = currentSingle;
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
    els.chartEmpty.textContent = "往前推一週的區間目前沒有資料，請等待排程累積或手動刷新建立快照。";
    return;
  }
  els.chartEmpty.textContent = source === "shifted" ? "" : source === "recent"
    ? "尚未累積往前一週快照，暫以最近可用資料顯示。"
    : "尚未累積歷史快照，暫以今日報價與前收估算顯示。";
  drawLine(ctx, width, height, rows.map((row) => row.close), rows.map((row) => chartLabel(row.date)), "#52c8ff", true);
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

els.settingsToggle.addEventListener("click", () => els.settingsPanel.classList.toggle("hidden"));
els.usersToggle.addEventListener("click", async () => {
  if (!state.user || state.user.role !== "admin") {
    els.usersPanel.classList.add("hidden");
    return;
  }
  els.usersPanel.classList.toggle("hidden");
  if (!els.usersPanel.classList.contains("hidden")) await loadUsers();
});
els.chartSymbol.addEventListener("change", renderDashboard);
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
