# 台股 AI 監看平台正式版

這是 GitHub + Netlify + Supabase 版本。每位使用者登入後都有自己的 10 檔股票清單，Dashboard 會依個人清單顯示報價、歷史折線圖、規則式 AI 摘要與 12 個分析面板。

## 架構

```text
GitHub
  管理原始碼

Netlify
  部署 public 前端
  執行 Netlify Functions API
  執行每日排程快照

Supabase
  PostgreSQL 資料庫
  保存 users、sessions、user_stocks、quote_snapshots
```

## 功能

- 使用者登入 / 登出
- 管理員新增、停用、刪除帳號
- 每位使用者各自設定 10 檔股票
- 台股即時報價查詢
- 歷史快照保存
- 最近一週折線圖
- 規則式 AI 摘要
- 全方位 AI 股票分析儀表板 12 面板
- Netlify Scheduled Function 每日 09:30 台北時間快照

## Supabase 設定

1. 建立 Supabase project。
2. 到 SQL Editor。
3. 執行：

```text
supabase/schema.sql
```

4. 到 Project Settings → API，取得：

```text
Project URL
service_role key
```

`service_role key` 只能放在 Netlify 環境變數，不可放進前端或提交到 GitHub。

## Netlify 設定

1. 建立 Netlify site。
2. 連接 GitHub repo。
3. Build settings：

```text
Build command: npm run check
Publish directory: public
Functions directory: netlify/functions
```

如果 Netlify 有讀到 `netlify.toml`，通常會自動套用。

4. 在 Site configuration → Environment variables 加上：

```text
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase service_role key
SESSION_SECRET=一段很長的隨機字串
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的正式管理員密碼
```

5. Deploy site。

第一次有人打開 API 時，系統會自動建立初始管理員帳號。

## API

前端仍使用 `/api/*` 路徑，Netlify 會轉到 Functions：

```text
/api/session
/api/login
/api/logout
/api/users
/api/settings
/api/quotes
/api/history
/api/refresh
```

## 本機檢查

```bash
npm install
npm run check
```

若要本機跑 Netlify Functions，可以安裝 Netlify CLI 後使用：

```bash
netlify dev
```

## 重要提醒

- 第一版 AI 摘要是規則式分析，不使用 OpenAI API。
- 免費公開股票資料可能延遲或偶爾失敗。
- 本系統不構成投資建議。
- 不要把 `.env`、Supabase service role key 或正式帳密提交到 GitHub。

## 後續可加強

- Email / LINE / Telegram 警示通知
- OpenAI API 摘要
- 付費行情 API
- 自訂網域與品牌化
