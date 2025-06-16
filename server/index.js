const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 中間件
app.use(cors());
app.use(express.json());

// 用戶認證中間件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未提供認證令牌' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌無效' });
    }
    req.user = user;
    next();
  });
};

// 遊戲房間管理
const rooms = new Map();

// WebSocket 連接處理
wss.on('connection', (ws) => {
  console.log('新的 WebSocket 連接');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'join_room':
        handleJoinRoom(ws, data);
        break;
      case 'leave_room':
        handleLeaveRoom(ws, data);
        break;
      case 'game_action':
        handleGameAction(ws, data);
        break;
    }
  });

  ws.on('close', () => {
    console.log('WebSocket 連接關閉');
  });
});

// 處理加入房間
function handleJoinRoom(ws, data) {
  const { roomId, userId } = data;
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);
  ws.roomId = roomId;
  ws.userId = userId;
  
  // 通知房間其他玩家
  broadcastToRoom(roomId, {
    type: 'player_joined',
    userId: userId
  });
}

// 處理離開房間
function handleLeaveRoom(ws, data) {
  const { roomId } = data;
  if (rooms.has(roomId)) {
    rooms.get(roomId).delete(ws);
    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
    }
  }
}

// 處理遊戲動作
function handleGameAction(ws, data) {
  const { roomId, action, amount } = data;
  broadcastToRoom(roomId, {
    type: 'game_action',
    userId: ws.userId,
    action,
    amount
  });
}

// 廣播消息到房間
function broadcastToRoom(roomId, message) {
  if (rooms.has(roomId)) {
    rooms.get(roomId).forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

// API 路由
app.post('/api/register', async (req, res) => {
  // TODO: 實現用戶註冊邏輯
});

app.post('/api/login', async (req, res) => {
  // TODO: 實現用戶登入邏輯
});

app.post('/api/rooms', authenticateToken, (req, res) => {
  // TODO: 實現創建房間邏輯
});

app.get('/api/rooms', authenticateToken, (req, res) => {
  // TODO: 實現獲取房間列表邏輯
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`服務器運行在端口 ${PORT}`);
}); 