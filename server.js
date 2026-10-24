const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// 托管根目录下所有的静态文件（这样 D3、D4 也能通过网址访问了）
app.use(express.static(__dirname));

// ================= D5 CSRF 的数据与接口 =================
let balance = 1000;
const tokens = new Set();

app.get('/api/d5/balance', (req, res) => res.json({ balance }));

app.get('/api/d5/token', (req, res) => {
    const token = crypto.randomBytes(16).toString('hex');
    tokens.add(token);
    res.json({ token });
});

app.get('/api/d5/unsafe-transfer', (req, res) => {
    balance -= 100;
    res.json({ message: '转账成功（漏洞模式）', balance });
});

app.post('/api/d5/safe-transfer', (req, res) => {
    const { token } = req.body;
    if (!token || !tokens.has(token)) {
        return res.status(403).json({ message: '拒绝！CSRF 攻击被拦截' });
    }
    tokens.delete(token);
    balance -= 100;
    res.json({ message: '转账成功（安全模式）', balance });
});

// ================= D6 存储型 XSS 的数据与接口 =================
let comments = [{ id: 1, text: "欢迎来到我的留言板，这里绝对安全！" }];

app.get('/api/d6/comments', (req, res) => res.json(comments));

app.post('/api/d6/comments', (req, res) => {
    // 🛡️ 防御转义
    const safeText = req.body.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    comments.push({ id: Date.now(), text: safeText });
    res.json({ success: true });
});

// 启动服务
app.listen(PORT, () => {
    console.log(`🚀 前端安全靶场总控台已上线: http://localhost:${PORT}`);
});