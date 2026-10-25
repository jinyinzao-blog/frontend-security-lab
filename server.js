const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); // 需要用到这个库解析 Cookie

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // 解析 Cookie
app.use(express.static(__dirname));

// ================= 真实 D5 CSRF 数据 =================
const sessions = {}; // 模拟 Session
const tokens = new Set();

// 获取 Session 的辅助函数
function getSession(req) {
    const sid = req.cookies.sid;
    return sid ? sessions[sid] : null;
}

// 1. 登录接口（获取 Cookie）
app.post('/api/d5/login', (req, res) => {
    const sid = crypto.randomBytes(8).toString('hex');
    sessions[sid] = { balance: 1000 };
    // 设置 Cookie，SameSite=Lax 防止部分跨站，但在本地演示中如果跨端口依然会触发
    res.cookie('sid', sid, { httpOnly: true, sameSite: 'Lax' });
    res.json({ ok: true, message: '登录成功' });
});

// 2. 获取余额
app.get('/api/d5/balance', (req, res) => {
    const s = getSession(req);
    if (!s) return res.status(401).json({ message: '未登录' });
    res.json({ balance: s.balance });
});

// 3. ⚠️ 漏洞接口：GET 请求转账（黑客利用 <img> 标签就能触发）
app.get('/api/d5/unsafe-transfer', (req, res) => {
    const s = getSession(req);
    if (!s) return res.status(401).json({ message: '未登录' });
    s.balance -= 100;
    res.json({ ok: true, message: '被黑客转账 100 元！', balance: s.balance });
});

// 4. ✅ 安全接口：需要获取 Token 且用 POST 请求
app.get('/api/d5/csrf-token', (req, res) => {
    if (!getSession(req)) return res.status(401).json({ message: '未登录' });
    const t = crypto.randomBytes(16).toString('hex');
    tokens.add(t);
    res.json({ token: t });
});

app.post('/api/d5/safe-transfer', (req, res) => {
    const s = getSession(req);
    if (!s) return res.status(401).json({ message: '未登录' });
    
    const { token } = req.body;
    if (!token || !tokens.has(token)) {
        return res.status(403).json({ ok: false, message: 'CSRF 攻击被拦截！Token 非法' });
    }
    tokens.delete(token);
    s.balance -= 100;
    res.json({ ok: true, message: '安全转账 100 元', balance: s.balance });
});

// ================= D6 存储型 XSS 数据与接口 =================
let comments = [{ id: 1, text: "欢迎来到我的留言板！" }];
app.get('/api/d6/comments', (req, res) => res.json(comments));
app.post('/api/d6/comments', (req, res) => {
    const safeText = req.body.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    comments.push({ id: Date.now(), text: safeText });
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 安全靶场总控台: http://localhost:${PORT}`);
});