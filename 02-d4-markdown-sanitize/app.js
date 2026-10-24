const input = document.querySelector('#input');
const unsafeOut = document.querySelector('#output-unsafe');
const safeOut = document.querySelector('#output-safe');

// ⚠️ 漏洞模式：直接把输入塞进 innerHTML
document.querySelector('#render-unsafe').onclick = () => {
    // 1. 直接拿到原始输入
    const rawHTML = input.value;
    // 2. 危险！直接塞进 DOM，浏览器会执行里面的恶意代码
    unsafeOut.innerHTML = rawHTML;
};

// ✅ 防御模式：用 DOMPurify 洗一遍再塞进去
document.querySelector('#render-safe').onclick = () => {
    // 1. 拿到原始输入
    const rawHTML = input.value;
    // 2. 请出 DOMPurify，把危险的标签和属性（如 onerror）全部洗掉
    const safeHTML = DOMPurify.sanitize(rawHTML);
    // 3. 安全地塞进 DOM
    safeOut.innerHTML = safeHTML;
};