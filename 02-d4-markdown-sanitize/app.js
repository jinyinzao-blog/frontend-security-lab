const input = document.querySelector('#input');
const unsafeOut = document.querySelector('#output-unsafe');
const safeOut = document.querySelector('#output-safe');

// ⚠️ 漏洞模式：把 Markdown 解析成 HTML 后直接塞进 DOM
document.querySelector('#render-unsafe').onclick = () => {
    const rawHTML = marked.parse(input.value);
    unsafeOut.innerHTML = rawHTML; 
};

// ✅ 防御模式：解析 -> 清洗 -> 插入
document.querySelector('#render-safe').onclick = () => {
    const rawHTML = marked.parse(input.value);
    const safeHTML = DOMPurify.sanitize(rawHTML);
    safeOut.innerHTML = safeHTML;
};