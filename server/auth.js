const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 模擬用戶數據庫（之後會替換為 Cloudflare D1）
const users = new Map();

// 註冊新用戶
async function registerUser(username, password) {
  if (users.has(username)) {
    throw new Error('用戶名已存在');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.set(username, {
    username,
    password: hashedPassword,
    chips: 1000, // 初始籌碼
    createdAt: new Date()
  });

  return generateToken(username);
}

// 用戶登入
async function loginUser(username, password) {
  const user = users.get(username);
  if (!user) {
    throw new Error('用戶不存在');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('密碼錯誤');
  }

  return generateToken(username);
}

// 生成 JWT token
function generateToken(username) {
  return jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// 驗證 token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('無效的 token');
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyToken
}; 