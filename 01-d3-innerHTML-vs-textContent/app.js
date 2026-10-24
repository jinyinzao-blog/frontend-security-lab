// 模拟用户登录，给浏览器种下 Cookie
document.cookie = "user_token=secret_123456; path=/";

function testUnsafe() {
    let text = document.getElementById("myInput").value;
    // ⚠️ 漏洞点：innerHTML 会将字符串当做 HTML 解析并执行
    document.getElementById("resultBox").innerHTML = text;
}

function testSafe() {
    let text = document.getElementById("myInput").value;
    // ✅ 防御点：textContent 会将字符串全部当做普通文本处理
    document.getElementById("resultBox").textContent = text;
}