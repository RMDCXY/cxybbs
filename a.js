function isEdgeWebView2() {
    return !!window.chrome && !!window.chrome.webview;
}

const isMobile = () => /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const client_btn = document.getElementById('client_dl');
if (isEdgeWebView2() || isMobile()) {
    if (client_btn) {
        client_btn.remove();
    }
} else if (client_btn) {
    client_btn.addEventListener('click', function () {
        window.location.href='download.html';
    });
}

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

async function copy(text){
    try{
        await navigator.clipboard.writeText(text);
        alert("✔ 复制成功！")
    }catch(err){
        alert("❌复制失败！请检查您是否有授予本网站剪贴板权限，或者检查控制台。\n如果您无论如何尝试都无法复制，只能手抄了qwq 以下为复制的内容：\n"+text);
        console.error("他奶奶滴，给我玩阴滴是吧！",err)
    }
}

document.getElementById("mailbtn").addEventListener("click",function(b){
    b.preventDefault();
    if(confirm("ℹ如果您有安装邮件客户端，点击“确定”即可一键跳转至邮件客户端发送邮件。\n如果您没有安装邮件客户端，请点击“取消”复制邮箱地址手动发送邮件。")){
        window.open("mailto:rmdcxypgm@outlook.com");
    }else{
        copy("rmdcxypgm@outlook.com")
    }
})

function qq(){
    var ua = navigator.userAgent;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    var qqNumber = "3766908125";

    if (isMobile) {
        // 手机端：尝试唤起QQ应用
        window.location.href = "mqqapi://card/show_pslcard?src_type=internal&version=1&uin=" + qqNumber + "&card_type=person&source=sharecard";
    } else {
        // PC端：使用协议直接添加
        window.location.href = "tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=" + qqNumber;
    }

    setTimeout(()=>{
        if(confirm("如果你没有跳转到QQ添加好友，请点击确定直接复制up的QQ号手动添加。")){
        copy("3766908125");
    }
    },1000);
    
}

/* topbar logo responsive behavior — real-time shrinker + visible debug logs */
(function(){
    const LOGO_ID = 'topbar-logo';
    const SHORT_SRC = '/img/shortlogo.png';
    const GAP = 8; // px
    const MIN_SHOW = 100; // px — 低于此宽度直接隐藏
    let _orig = { src: null, widthAttr: '', display: '' };

    function saveOrig(logo){
        if(!_orig.src){
            _orig.src = logo.getAttribute('src') || logo.src;
            _orig.widthAttr = logo.getAttribute('width') || '';
            _orig.display = logo.style.display || '';
            if(_orig.widthAttr) logo.style.width = _orig.widthAttr + (isNaN(_orig.widthAttr) ? '' : 'px');
        }
    }
    function contactsOffscreen(links, required = 3){ const children = Array.from(links.children).filter(el => el.id !== 'client_dl'); const contacts = children.slice(0, required); if(contacts.length === 0) return false; return contacts.some(c => c.getBoundingClientRect().right > window.innerWidth - GAP); }
    function computeAllowedWidth(logo, links, required = 3){ const logoLeft = logo.getBoundingClientRect().left; const children = Array.from(links.children).filter(el => el.id !== 'client_dl'); const anchor = children[Math.min(required - 1, Math.max(0, children.length - 1))]; let anchorLeft = anchor ? anchor.getBoundingClientRect().left : links.getBoundingClientRect().left; anchorLeft = Math.min(anchorLeft, window.innerWidth); return Math.max(0, Math.floor(anchorLeft - GAP - logoLeft)); }
    function restoreLogo(logo){ console.debug('topbar-logo: restore'); if(_orig.src && logo.getAttribute('src') !== _orig.src) logo.setAttribute('src', _orig.src); if(_orig.widthAttr) logo.setAttribute('width', _orig.widthAttr); else logo.removeAttribute('width'); logo.style.width = ''; logo.style.opacity = '1'; logo.style.display = _orig.display || ''; logo._shrinking = false; }

    function hideLogo(logo){ console.debug('topbar-logo: hide (shrink -> fade)'); logo.style.display = ''; const finishFade = () => { logo.style.opacity = '0'; const onOpacity = (ev) => { if(ev.propertyName !== 'opacity') return; logo.removeEventListener('transitionend', onOpacity); logo.style.display = 'none'; logo._shrinking = false; }; logo.addEventListener('transitionend', onOpacity); setTimeout(()=>{ logo.style.display = 'none'; logo._shrinking = false; }, 270); }; const curW = Math.round(logo.getBoundingClientRect().width || 0); if(curW > MIN_SHOW){ logo.style.width = MIN_SHOW + 'px'; const onWidth = (e) => { if(e.propertyName !== 'width') return; logo.removeEventListener('transitionend', onWidth); finishFade(); }; logo.addEventListener('transitionend', onWidth); setTimeout(finishFade, 310); } else { finishFade(); } }

    function continuousShrink(logo, links){ if(logo._shrinking) return; logo._shrinking = true; console.debug('topbar-logo: start continuous shrink'); const stepFn = () => { if(!contactsOffscreen(links,3)){ console.debug('topbar-logo: contacts visible — stop shrinking'); logo._shrinking = false; return; } const w = Math.round(logo.getBoundingClientRect().width); if(w <= MIN_SHOW){ hideLogo(logo); return; } const delta = Math.max(4, Math.ceil(w * 0.05)); const newW = Math.max(MIN_SHOW, w - delta); console.debug('topbar-logo: shrink step', { from: w, to: newW }); logo.style.width = newW + 'px'; requestAnimationFrame(() => { if(contactsOffscreen(links,3)) requestAnimationFrame(stepFn); else logo._shrinking = false; }); }; requestAnimationFrame(stepFn); }
    function applyEmergencyShrink(logo, links){ continuousShrink(logo, links); }

    function apply(){ const topbar = document.querySelector('.topbar'); const links = document.querySelector('.topbar-links'); const logo = document.getElementById(LOGO_ID); if(!topbar || !links || !logo) return; saveOrig(logo); const contactsHidden = contactsOffscreen(links, 3); console.debug('topbar-logo: apply check', { contactsHidden, logoWidth: Math.round(logo.getBoundingClientRect().width) }); if(!contactsHidden){ restoreLogo(logo); return; } if(logo.getAttribute('src') !== SHORT_SRC){ console.debug('topbar-logo: switching to short logo'); logo.setAttribute('src', SHORT_SRC); } const allowed = computeAllowedWidth(logo, links, 3); console.debug('topbar-logo: allowed width', allowed); if(allowed < MIN_SHOW){ hideLogo(logo); return; } logo.style.display = ''; const origWidth = parseInt(_orig.widthAttr) || Math.round(logo.getBoundingClientRect().width) || 185; const target = Math.min(allowed, origWidth); logo.style.width = target + 'px'; setTimeout(()=>{ if(contactsOffscreen(links,3)) applyEmergencyShrink(logo, links); }, 50); }

    let _t; function schedule(){ clearTimeout(_t); _t = setTimeout(apply, 60); }
    window.addEventListener('resize', schedule); document.addEventListener('DOMContentLoaded', apply); window.addEventListener('load', apply);
    try{ const ro = new ResizeObserver(schedule); const tb = document.querySelector('.topbar'); const tl = document.querySelector('.topbar-links'); if(tb) ro.observe(tb); if(tl) ro.observe(tl);}catch(e){}
    try{ const tl = document.querySelector('.topbar-links'); if(tl){ tl.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule)); const mo = new MutationObserver(schedule); mo.observe(tl, {childList: true, subtree: true, attributes: true}); }}catch(e){}
    schedule();
})();





