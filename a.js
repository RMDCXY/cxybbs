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

//logo变化逻辑
(function(){
    const LOGO_ID = 'topbar-logo';
    const LINKS_SELECTOR = '.topbar-links';
    const GAP = 6; // px 容差

    function ensureContactsRight(links){
        try{ links.style.display = links.style.display || 'flex'; links.style.justifyContent = 'flex-end'; }catch(e){}
    }

    function contactsOffscreen(links){
        if(!links) return false;
        const children = Array.from(links.children).filter(el => el.id !== 'client_dl');
        if(children.length === 0) return false;
        try{ const linksRect = links.getBoundingClientRect(); if(linksRect.right <= window.innerWidth - GAP) return false; }catch(e){}
        return children.some(c => c.getBoundingClientRect().right > window.innerWidth - GAP);
    }

    function computeAvailableForLogo(){
        const topbar = document.querySelector('.topbar');
        const links = document.querySelector(LINKS_SELECTOR);
        if(!topbar || !links) return 0;
        try{
            const tbRect = topbar.getBoundingClientRect();
            const linksRect = links.getBoundingClientRect();
            return Math.max(0, Math.floor(linksRect.left - GAP - tbRect.left));
        }catch(e){ return 0; }
    }

    function applyLogoFade(){
        const logo = document.getElementById(LOGO_ID);
        const links = document.querySelector(LINKS_SELECTOR);
        // allow recovery even if logo is missing
        if(!links) return;
        ensureContactsRight(links);
        if(logo && !logo.style.transition) logo.style.transition = 'opacity 0.28s ease';
        if(contactsOffscreen(links)){
            if(logo){
                const curW = Math.round(logo.getBoundingClientRect().width || 0) || (parseInt(logo.getAttribute('width'))||185);
                logo.style.opacity = '0';
                const onEnd = (e)=>{
                    if(e && e.propertyName && e.propertyName!=='opacity') return;
                    logo.removeEventListener('transitionend', onEnd);
                    try{
                        if(!window._logoBackup){
                            window._logoBackup = { outerHTML: logo.outerHTML, parentSelector: '.topbar', width: curW };
                        }
                        logo.remove();
                    }catch(e){}
                };
                logo.addEventListener('transitionend', onEnd);
                setTimeout(()=>{ if(document.getElementById(LOGO_ID)) { try{ if(!window._logoBackup) window._logoBackup = { outerHTML: logo.outerHTML, parentSelector: '.topbar', width: curW }; logo.remove(); }catch(e){} } }, 350);
            }
        } else {
            if(!document.getElementById(LOGO_ID) && window._logoBackup){
                try{
                    const avail = computeAvailableForLogo();
                    const need = window._logoBackup.width || 185;
                    if(avail < need) return;
                    const parent = document.querySelector(window._logoBackup.parentSelector) || document.body;
                    const linksEl = parent.querySelector(LINKS_SELECTOR);
                    const temp = document.createElement('div'); temp.innerHTML = window._logoBackup.outerHTML.trim();
                    const newLogo = temp.firstChild;
                    if(linksEl) parent.insertBefore(newLogo, linksEl);
                    else parent.appendChild(newLogo);
                    newLogo.style.opacity = '0';
                    if(!newLogo.style.transition) newLogo.style.transition = 'opacity 0.28s ease';
                    requestAnimationFrame(()=> newLogo.style.opacity = '1');
                    window._logoBackup = null;
                }catch(e){}
            } else if(document.getElementById(LOGO_ID)){
                const cur = document.getElementById(LOGO_ID);
                cur.style.opacity = '1';
            }
        }
    }

    const schedule = () => { clearTimeout(window._logoFadeT2); window._logoFadeT2 = setTimeout(applyLogoFade, 70); };
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('DOMContentLoaded', schedule);
    try{ const ro = new ResizeObserver(schedule); const tb = document.querySelector('.topbar'); const tl = document.querySelector(LINKS_SELECTOR); if(tb) ro.observe(tb); if(tl) ro.observe(tl);}catch(e){}
    schedule();
})();

//废弃的返回按钮方案，未来计划重新启用
/*
function ret(){
  if(history.length>1) history.back();
  else{ window.close(); setTimeout(()=>{window.closed||(window.location.href="../")},50); }
}
 */
