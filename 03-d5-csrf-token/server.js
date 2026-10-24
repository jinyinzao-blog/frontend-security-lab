const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

// 假装这是我们银行的数据库
let balance = 1000;
const tokens = new Set(); // 存放合法的 Token

app.use(express.json());
app.use(express.static(__dirname)); // 让后端能访问当前文件夹的 html 文件

// 1. 获取当前余额
app.get('/api/balance', (req, res) => {
    res.json({ balance });
});

// 2. 获取一个合法的 Token（正常用户打开转账页面时，银行发的）
app.get('/api/token', (req, res) => {
    const token = crypto.randomBytes(16).toString('hex');
    tokens.add(token);
    res.json({ token });
});

// 3. 漏洞接口：GET 请求直接转账（极其不安全！）
// 黑客只要诱骗你点个链接，或者放个 <img src="..."> 就能把钱转走
app.get('/api/unsafe-transfer', (req, res) => {
    balance -= 100;
    res.json({ message: '转账成功（漏洞模式）', balance });
});

// 4. 安全接口：POST 请求 + 校验 Token
app.post('/api/safe-transfer', (req, res) => {
    const { token } = req.body;
    
    // 检查 Token 是否存在且合法
    if (!token || !tokens.has(token)) {
        return res.status(403).json({ message: '拒绝！CSRF 攻击被拦截，Token 非法或缺失' });
    }
    
    // 校验成功后，销毁旧 Token（防止重复使用）
    tokens.delete(token);
    
    balance -= 100;
    res.json({ message: '转账成功（安全模式）', balance });
});

app.listen(PORT, () => {
    console.log(`🏦 模拟银行已上线: http://localhost:${PORT}`);
});