# 前端安全靶场 (Frontend Security Lab)

一个基于 Node.js + Express 搭建的 Web 安全实战演示项目。包含前端漏洞、跨站伪造及存储型攻击的完整攻防演示。

## 快速启动

在终端运行以下命令：
```bash
npm install
node server.js
```
启动后请访问：[http://localhost:3000](http://localhost:3000)

## 项目截图

### 1. 总控台首页
![总控台首页](./images/home.png)

### 2. 反射型 XSS 演示
![XSS 演示](./images/xss.png)

### 3. CSRF 跨站攻击演示
![CSRF 演示](./images/csrf.png)

### 4. 存储型 XSS 演示
![存储型 XSS 演示](./images/stored-xss.png)

##  实验目录

- **01-d3-innerHTML-vs-textContent**：反射型 XSS 与 Cookie 窃取演示。
- **02-d4-markdown-sanitize**：富文本 Markdown XSS 与 `DOMPurify` 安全清洗。
- **03-d5-csrf-token**：CSRF 跨站请求伪造，模拟真实银行页面与黑客钓鱼页面。
- **04-d6-backend-xss**：全栈存储型 XSS 留言板，演示后端实体转义防御。

## ⚠️ 免责声明
本项目仅供本地学习和安全研究使用，请勿用于任何非法测试。