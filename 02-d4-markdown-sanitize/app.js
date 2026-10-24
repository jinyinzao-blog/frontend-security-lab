const input = document.querySelector('#input');
const unsafeOut = document.querySelector('#output-unsafe');
const safeOut = document.querySelector('#output-safe');

// 漏洞模式：直接解析并插入
document.querySelector('#render-unsafe').onclick = () => {
    // 1. 把 Markdown 转成 HTML
    const rawHTML = marked.parse(input.value);
    // 2. 危险！直接塞进 DOM
    unsafeOut.innerHTML = rawHTML;
};

// 防御模式：解析 -> 清洗 -> 插入
document.querySelector('#render-safe').onclick = () => {
    // 1. 把 Markdown 转成 HTML
    const rawHTML = marked.parse(input.value);
    // 2. 使用 DOMPurify 清洗掉危险标签和属性
    const safeHTML = DOMPurify.sanitize(rawHTML);
    // 3. 安全地塞进 DOM
    safeOut.innerHTML = safeHTML;
};