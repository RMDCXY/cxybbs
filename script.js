

const footerQuotes = [
    "枪炮是不长眼的，坦克是没有后视镜的",
    "114514",
    "最近换新手机了，比之前的流畅多了，那旧的要怎么处理呢？",
    "What the dog doing?",
    "never↗gonna↘give↗you↗up→",
    "脑子.exe (未响应)       - ×",
    "Internal server error (Error code 500)",
    "你指尖跃动的电光，是我此生不灭的信仰！",
    "kksk",
    "Ctrl+C V是人类进步的阶梯",
    "你正在成功",
    "代码能跑就别动它，这是对史山代码最基本的尊严",
    "€$DN",
    "点击输入文字",
    "活了一万年才知道的生活小妙招",
    "□ 确认您是真人      Cloudflare☁",
    "饿↑啊↓",
    "灌伤害，骗骗花，拉开距离再开大",
    "垃圾桶里有垃圾，扣10分",
    "有朋自远方来，好东西就要来了！",
    "跨平台我就选Chromium！",
    "面对DDOS攻击，礼貌站长：你吗",
    "这么精彩的视频，不得配个绝版周边助助兴？",
    "Performance & Security by Cloudflare",
    "科赋锐挡泥板正在装载。",
    "Github是全球最大的同性交友网站",
    "哔哩哔哩 (゜-゜)つロ 干杯~",
    "¿",
    "你现在正在地球",
    "So nvidia,f**k you",
    "你知道吗，每当你呼吸了60秒就减少了1分钟寿命",
    "其实底部的网站运行时间是从域名注册时间开始算的...",
    "用dick三天赚50万",
    "少习习真的牛逼吗？",
    "我要→验↑牌↘",
    "中国人能飞",
    "构建更美好的互联网",
    "help build a better internet",
    "跨平台我就选Electron！",
    "？",
    "不知道写啥了，就写这句吧",
    "原神？启动！",
    "AMD YES!",
    "Github·Build from here!",
    "开水一百度，直角90度，所以直角没烧开",
    "Namesilo牛逼",
    "服务器繁忙，请稍后再试。",
    "哥们，你这瓜多少钱一斤",
    "啪的一下，很快啊",
    "比比拉布",
    "咕咕嘎嘎！",
    "好想变成猫娘喵",
    "让我们把所有元素综合起来！",
    "",
    "🤚😭✋Cloudflare的恩情还不完",
    "你™劈我瓜是吧！",
    "不豪，bugjump发力了",
    "不豪，ojng发力了",
    "珍爱生命 远离音游",
    "井inclade《iosteam》",
    "啊哈哈哈哈哈，鸡汤来咯",
    "阿米诺斯",
    "棍母",
    "我用最直接，最直白，最不绕弯子，一针见血地告诉你:这里是cxybbs",
    "我去不早说",
    "你是典型的安卓人",
    "~$: node -c script.js",
    "⚠你已达到每月聊天消息配额。升级到Github Copilot Pro(30天免费试用版)，或等待你的限额续订。",
    "SSH牛逼！",
    "震撼首发",
    "Hello,world!",
    "鸽游牛逼",
    "依旧Vibe coding",
    "Google牛逼",
    "admin@cxybbs_server:~$ sudo rm -rf /* --no-preserve-root",
    "萨日朗",
    "你知道吗，你正在看这行文字",
    "遇oj不决先引头文件",
    "遇oj不决先定义变量",
    "Dream,还我十万美刀！",
    "i no money i no money no kill me no kill me",
    "您线蓝了",
    "您线白了",
    "I FAQ!",
    "听君一席话，如听一席话",
    "吾去，汝不早曰",
    "(象鸣)我开水果摊的，能卖给你生瓜蛋子",
    "《你为啥commit到我的main分支啊》",
    "Creeper?",
    "我的IP是127.0.0.1，尽管打我",
    "我的IP是192.168.1.67尽管打我",
    "外卖杀人啦",
    "我觉得意大利面就应该拌42号混凝土",
    "你是故意找茬是不是，你要不要吧",
    "Six seven 🤚↑✋↓",
    "6767",
    "666这个入是桂",
    "因操作不当导致发动机熄火，扣100分",
    "他奶奶滴，给我玩阴的是吧！",
    "我乃米克，九岁万码，四岁划伤，五岁蟒蛇"
];


// 打字机效果
(function () {
    const el = document.getElementById('footer-quote');
    if (!el || !Array.isArray(footerQuotes) || footerQuotes.length === 0) return;

    // 创建一个用于显示文本与光标的内部span
    // 允许自动换行（保留空格同时可换行），防止移动端被长文字撑开宽度
    el.style.whiteSpace = 'pre-wrap';
    // 使整个 quote 占一行并居中
    el.style.display = 'block';
    el.style.width = '100%';
    el.style.textAlign = 'center';

    const wrapperSpan = document.createElement('span');
    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.textContent = '|';
    cursorSpan.style.display = 'inline-block';
    cursorSpan.style.width = '0.6ch';
    cursorSpan.style.marginLeft = '6px';
    cursorSpan.style.opacity = '1';
    // 光标颜色使用深蓝，和文本渐变终色一致
    cursorSpan.style.color = '#0b63d6';
    // 创建一个内联容器，将文本与光标保持在同一 inline-flow 中，避免换行后光标错位
    // wrapper 作为块级容器负责居中每一行
    wrapperSpan.style.display = 'block';
    wrapperSpan.style.width = '100%';
    wrapperSpan.style.whiteSpace = 'normal';
    wrapperSpan.style.textAlign = 'center';

    // 给文本 span 应用渐变文字效果（浅蓝 -> 深蓝）并允许换行
    // 使用 inline-block + text-align:center 来保证每一行都居中
    textSpan.style.display = 'inline-block';
    textSpan.style.maxWidth = '90%';
    textSpan.style.whiteSpace = 'pre-wrap';
    textSpan.style.overflowWrap = 'anywhere';
    textSpan.style.wordBreak = 'break-word';
    textSpan.style.textAlign = 'center';


    // 把光标放到文本内部末尾，这样换行时光标会紧跟文本末尾
    cursorSpan.style.display = 'inline-block';
    cursorSpan.style.verticalAlign = 'baseline';
    cursorSpan.style.marginLeft = '0.3ch';

    // 使用 contentSpan 来承载有分段样式的可变内容（文本与表情分离）
    const contentSpan = document.createElement('span');
    contentSpan.style.whiteSpace = 'pre-wrap';
    // contentSpan 为可变内容容器，cursorSpan 保持独立，以免被替换
    textSpan.appendChild(contentSpan);
    textSpan.appendChild(cursorSpan);
    wrapperSpan.appendChild(textSpan);
    el.appendChild(wrapperSpan);

    const TYPING_INTERVAL = 80; // 每个字符逐字显示速度
    const ERASING_INTERVAL = 40; // 每个字符删除速度
    const PAUSE_AFTER_COMPLETE = 5000; // 显示完整句子后等待时间（ms）
    const CURSOR_BLINK_INTERVAL = 500; // 光标闪烁间隔

    let blinkTimer = null;

    function pickRandom() {
        return footerQuotes[Math.floor(Math.random() * footerQuotes.length)];
    }

    function startCursorBlink() {
        // 使用 CSS 动画类控制渐显渐隐闪烁，避免 JS 定时器频繁操作样式
        if (blinkTimer) return;
        blinkTimer = true;
        cursorSpan.classList.add('footer-cursor-blink');
    }

    function stopCursorBlink() {
        if (!blinkTimer) return;
        blinkTimer = null;
        cursorSpan.classList.remove('footer-cursor-blink');
        cursorSpan.style.opacity = '1';
    }

    // 定义要排除渐变的字符列表（直接按字符列出，不使用正则）
    // 列表中的字符会被包裹为 .no-gradient，其他字符将正常使用渐变
    const EXCLUDE_GRADIENT_CHARS = new Set(['🤚', '😭', '✋', '⚠', '☁', '👍']);

    function escapeHTML(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderTextWithExclusions(text) {
        if (!text) return '';
        let result = '';
        let buffer = '';
        for (const ch of text) {
            if (EXCLUDE_GRADIENT_CHARS.has(ch)) {
                if (buffer) {
                    result += `<span class="gradient-text">${escapeHTML(buffer)}</span>`;
                    buffer = '';
                }
                result += `<span class="no-gradient">${escapeHTML(ch)}</span>`;
            } else {
                buffer += ch;
            }
        }
        if (buffer) {
            result += `<span class="gradient-text">${escapeHTML(buffer)}</span>`;
        }
        return result;
    }

    // 每次只更新 contentSpan.innerHTML（保留 cursorSpan）
    async function typeText(fullText) {
        let s = '';
        for (const ch of fullText) {
            s += ch;
            contentSpan.innerHTML = renderTextWithExclusions(s);
            await new Promise(r => setTimeout(r, TYPING_INTERVAL));
        }
    }

    async function eraseText() {
        let s = contentSpan.textContent || '';
        const arr = Array.from(s);
        for (let i = arr.length; i >= 0; i--) {
            const sub = arr.slice(0, i).join('');
            contentSpan.innerHTML = renderTextWithExclusions(sub);
            await new Promise(r => setTimeout(r, ERASING_INTERVAL));
        }
    }

    // 主循环：选句 -> 逐字显示 -> 停留并闪烁 -> 逐字删除 -> 重复
    async function loop() {
        while (true) {
            const sentence = pickRandom();
            stopCursorBlink();
            // 在打字时保证光标常亮
            cursorSpan.style.opacity = '1';
            await typeText(sentence);
            // 开始停留并闪烁光标
            startCursorBlink();
            await new Promise(r => setTimeout(r, PAUSE_AFTER_COMPLETE));
            // 停止闪烁并保持可见，准备删除
            stopCursorBlink();
            await eraseText();
            // 小短暂停顿再继续下一句
            await new Promise(r => setTimeout(r, 300));
        }
    }

    // 启动循环
    loop().catch(() => { });
})();

(function () {
    // 定义本站上线时间(其实是域名的注册时间qwq)
    const siteStart = new Date('2024-11-10T12:11:58');

    // 计算两个日期的差值，按 年/月/日/时/分/秒 返回
    function diffYMDHMS(start, end) {
        let y = end.getFullYear() - start.getFullYear();
        let m = end.getMonth() - start.getMonth();
        let d = end.getDate() - start.getDate();
        let hh = end.getHours() - start.getHours();
        let mm = end.getMinutes() - start.getMinutes();
        let ss = end.getSeconds() - start.getSeconds();

        if (ss < 0) { ss += 60; mm--; }
        if (mm < 0) { mm += 60; hh--; }
        if (hh < 0) { hh += 24; d--; }

        if (d < 0) {
            // 获取 end 日期前一个月的天数用于补偿
            const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
            d += prevMonthDays;
            m--;
        }
        if (m < 0) { m += 12; y--; }

        return { y, m, d, hh, mm, ss };
    }

    function updateUptime() {
        const el = document.getElementById('site-uptime');
        if (!el) return;
        const now = new Date();
        const diff = diffYMDHMS(siteStart, now);
        el.textContent = `本站已运行${diff.y}年${diff.m}月${diff.d}日${diff.hh}时${diff.mm}分${diff.ss}秒`;
    }

    updateUptime();
    setInterval(updateUptime, 1000);
})();

async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert("✔ 复制成功！")
    } catch (err) {
        alert("❌复制失败！请检查您是否有授予本网站剪贴板权限，或者检查控制台。\n如果您无论如何尝试都无法复制，只能手抄了qwq 以下为复制的内容：\n" + text);
        console.error("他奶奶滴，给我玩阴滴是吧！", err)
    }
}

function shouqi() {
    const urls = [
        '/policy',
        '/deal',
        '/about',
        'https://cxybbs.top/cdn/newvideo2.mp4',
        'https://cxybbs.top/cdn/newvideo.mp4',
        'about:blank',
        '/404',
        'https://cloudflare-cn.com',
        'https://b23.tv/oLPmSiD',
        'https://b23.tv/FmnKlMa',
        'https://github.com',
        'https://gitforwindows.org',
        'https://microsoft.com',
        'https://dash.cloudflare.com',
        'https://bilibili.com',
        'https://google.com',
        'https://git-scm.cn',
        'https://guthib.com']
    window.open(urls[Math.floor(Math.random() * urls.length)]);
}
