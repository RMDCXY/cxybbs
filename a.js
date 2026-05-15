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

// 修复锚点滚动到卡片顶部
function scrollToSectionCardByHash() {
    if (location.hash) {
        const id = decodeURIComponent(location.hash.substring(1));
        const el = document.getElementById(id);
        if (el && el.classList.contains('section-card')) {
            // 距离顶部滚动，考虑顶部栏高度
            const topbar = document.querySelector('.topbar');
            const offset = topbar ? topbar.offsetHeight : 0;
            const rect = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - offset - 10; // 额外留10px间距
            window.scrollTo({ top: targetY, behavior: 'smooth' });

            // 添加闪烁效果（0.8s且只闪一次）
            el.classList.remove('section-flash'); // 先移除，防止连续触发无效
            void el.offsetWidth;
            el.classList.add('section-flash');
            setTimeout(() => {
                el.classList.remove('section-flash');
            }, 800); // 0.8s
        }
    }
}

window.addEventListener('hashchange', scrollToSectionCardByHash);
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(scrollToSectionCardByHash, 0);
});
// section-card 闪烁效果样式（0.8s且只闪一次，降低强度）
const style = document.createElement('style');
style.textContent = `
.section-flash {
    animation: sectionFlashAnim 0.8s 1;
}
@keyframes sectionFlashAnim {
    0% { box-shadow: 0 0 0 0 #fff, 0 0 0 0 #2196f3; }
    20% { box-shadow: 0 0 8px 2px #2196f3, 0 0 0 0 #fff; }
    50% { box-shadow: 0 0 0 0 #fff, 0 0 8px 2px #2196f3; }
    80% { box-shadow: 0 0 8px 2px #2196f3, 0 0 0 0 #fff; }
    100% { box-shadow: 0 0 0 0 #fff, 0 0 0 0 #2196f3; }
}`;
document.head.appendChild(style);


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

// logo变化逻辑
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
        // 如果整个 links 容器没有超出视口，认为没被挤出
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
        // allow recovery even if logo is missing (logo may have been removed)
        if(!links) return;
        ensureContactsRight(links);
        if(logo && !logo.style.transition) logo.style.transition = 'opacity 0.28s ease';
        if(contactsOffscreen(links)){
            // fade out, then remove from DOM to prevent further layout overflow
            if(logo){
                // capture current width for later restoration requirement
                const curW = Math.round(logo.getBoundingClientRect().width || 0) || (parseInt(logo.getAttribute('width'))||185);
                logo.style.opacity = '0';
                // after transition, remove and keep backup
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
                // fallback
                setTimeout(()=>{ if(document.getElementById(LOGO_ID)) { try{ if(!window._logoBackup) window._logoBackup = { outerHTML: logo.outerHTML, parentSelector: '.topbar', width: curW }; logo.remove(); }catch(e){} } }, 350);
            }
        } else {
            // ensure logo exists and is visible
            if(!document.getElementById(LOGO_ID) && window._logoBackup){
                try{
                    // only restore if there is enough room to show the logo at its original width
                    const avail = computeAvailableForLogo();
                    const need = window._logoBackup.width || 185;
                    if(avail < need) return;
                    const parent = document.querySelector(window._logoBackup.parentSelector) || document.body;
                    // insert before links if possible
                    const linksEl = parent.querySelector(LINKS_SELECTOR);
                    const temp = document.createElement('div'); temp.innerHTML = window._logoBackup.outerHTML.trim();
                    const newLogo = temp.firstChild;
                    if(linksEl) parent.insertBefore(newLogo, linksEl);
                    else parent.appendChild(newLogo);
                    // ensure visible
                    newLogo.style.opacity = '0';
                    if(!newLogo.style.transition) newLogo.style.transition = 'opacity 0.28s ease';
                    requestAnimationFrame(()=> newLogo.style.opacity = '1');
                    // clear backup
                    window._logoBackup = null;
                }catch(e){}
            } else if(document.getElementById(LOGO_ID)){
                const cur = document.getElementById(LOGO_ID);
                cur.style.opacity = '1';
            }
        }
    }

    const schedule = () => { clearTimeout(window._logoFadeT); window._logoFadeT = setTimeout(applyLogoFade, 70); };
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('DOMContentLoaded', schedule);
    try{ const ro = new ResizeObserver(schedule); const tb = document.querySelector('.topbar'); const tl = document.querySelector(LINKS_SELECTOR); if(tb) ro.observe(tb); if(tl) ro.observe(tl);}catch(e){}
    schedule();
})();

// ========== 瀑布流布局：完美修复，无需修改 CSS ==========
(function() {
    'use strict';
    
    let resizeTimer = null;
    
    // 主函数
    function initMasonry() {
        const container = document.querySelector('.sections');
        if (!container) return;
        
        const isMobile = window.innerWidth < 900;
        
        // 移动端：清除所有 JS 添加的样式，恢复原生布局
        if (isMobile) {
            resetStyles(container);
            return;
        }
        
        // 电脑端：执行瀑布流
        applyMasonry(container);
    }
    
    // 重置样式（移动端或窗口变小时）
    function resetStyles(container) {
        const cards = document.querySelectorAll('.section-card');
        cards.forEach(card => {
            card.style.position = '';
            card.style.top = '';
            card.style.left = '';
            card.style.width = '';
            card.style.marginBottom = '';
            card.style.display = '';
            card.style.gridTemplateColumns = '';
        });
        container.style.position = '';
        container.style.height = '';
        // 移除可能动态添加的 padding 包装层
        const wrapper = container.querySelector('.masonry-wrapper');
        if (wrapper) {
            while (wrapper.firstChild) container.appendChild(wrapper.firstChild);
            wrapper.remove();
        }
    }
    
    // 应用瀑布流
    function applyMasonry(container) {
        const cards = Array.from(document.querySelectorAll('.section-card'));
        if (cards.length === 0) return;
        
        // 设置容器为相对定位，并添加内部包裹层处理间距（避免污染原 padding）
        container.style.position = 'relative';
        
        // 获取期望的左右间距（从 CSS 中读取，若没有则默认 40px）
        let paddingLR = 40;
        const containerStyle = getComputedStyle(container);
        let cssPaddingLeft = parseFloat(containerStyle.paddingLeft);
        if (!isNaN(cssPaddingLeft) && cssPaddingLeft > 0) {
            paddingLR = cssPaddingLeft;
        }
        
        // 可用内容宽度 = 容器宽度 - 左右间距
        const containerWidth = container.clientWidth;
        const availableWidth = containerWidth - paddingLR * 2;
        const gap = 32;          // 卡片间隙
        const colWidth = (availableWidth - gap) / 2;
        
        // 如果没有足够空间（比如窗口太小），退化为单列
        if (colWidth < 200) {
            resetStyles(container);
            return;
        }
        
        // 强制每个卡片正确布局
        cards.forEach(card => {
            // 清除可能的内联样式冲突
            card.style.position = 'absolute';
            card.style.width = colWidth + 'px';
            card.style.marginBottom = '0';
            
            // 根据是否有图片设置 grid 列模板
            if (card.classList.contains('no-img')) {
                card.style.display = 'grid';
                card.style.gridTemplateColumns = '1fr';
            } else {
                card.style.display = 'grid';
                card.style.gridTemplateColumns = '110px 1fr';
            }
            card.style.alignItems = 'start';
        });
        
        // 两列高度数组
        let colHeights = [0, 0];
        
        // 逐个放置卡片
        cards.forEach(card => {
            // 选择较短的列
            let colIndex = colHeights[0] <= colHeights[1] ? 0 : 1;
            let leftPos = colIndex === 0 
                ? paddingLR 
                : paddingLR + colWidth + gap;
            
            card.style.top = colHeights[colIndex] + 'px';
            card.style.left = leftPos + 'px';
            
            // 更新该列高度
            colHeights[colIndex] += card.offsetHeight + gap;
        });
        
        // 设置容器总高度
        const maxHeight = Math.max(colHeights[0], colHeights[1]);
        container.style.height = maxHeight + 'px';
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMasonry);
    } else {
        initMasonry();
    }
    
    // 窗口改变时防抖重新布局
    window.addEventListener('resize', function() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initMasonry, 150);
    });
    
    // 图片加载完成后重新布局（防止高度计算偏差）
    const images = document.querySelectorAll('.section-img');
    let loadedCount = 0;
    if (images.length > 0) {
        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === images.length) initMasonry();
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === images.length) initMasonry();
                });
            }
        });
    }
})();