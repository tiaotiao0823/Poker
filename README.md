# 線上多人德州撲克遊戲

這是一個使用 React、Node.js 和 WebSocket 技術開發的線上多人德州撲克遊戲。

## 功能特點

- 用戶註冊和登入系統
- 創建和加入遊戲房間
- 即時多人遊戲對戰
- 大盲小盲系統
- 使用 Cloudflare D1 進行數據存儲

## 技術棧

- 前端：React + TypeScript
- 後端：Node.js + Express
- 數據庫：Cloudflare D1
- 即時通訊：WebSocket
- 認證：JWT

## 安裝步驟

1. 克隆專案
```bash
git clone [repository-url]
cd texas-holdem-poker
```

2. 安裝後端依賴
```bash
npm install
```

3. 安裝前端依賴
```bash
cd client
npm install
```

4. 設置環境變數
創建 `.env` 文件並添加以下配置：
```
JWT_SECRET=your_jwt_secret
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

5. 啟動開發服務器
```bash
# 啟動後端服務器
npm run dev

# 啟動前端開發服務器
npm run client
```

## 遊戲規則

- 每局遊戲需要 2-9 名玩家
- 使用標準德州撲克規則
- 大盲小盲位置會自動輪換
- 玩家可以選擇跟注、加注、棄牌等操作

## 貢獻指南

歡迎提交 Pull Request 或開 Issue 來改進這個專案。

## 授權

MIT License