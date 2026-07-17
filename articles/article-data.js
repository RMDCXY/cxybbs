const ARTICLE_DB = {
  "06": {
    id: "06",
    title: "VendorCo牌存储器专营店广告",
    date: "2026-07-17",
    renderMarkdown: true,
    markdown: `<img src="res/vendorco广告.png" alt="图片" width="75%">
    <details><summary style="user-select:none;">或查看svg版本(可能显示异常)</summary>
    <img src="res/vendorco广告.svg" alt="svg" width="75%">
    </details>
    `
  },

  "05": {
    id: "05",
    title: "依旧写真",
    date: "2026-06-27",
    renderMarkdown: false,
    markdown: `Made   ／    ＼
with     | ＼／ |   Unity™
                ＼|／`
  },
  
  "04": {
    id: "04",
    title: "一幅写真",
    date: "2026-05-02",
    renderMarkdown: false,
    markdown: `Internal server error(Error code 500)
Visit cloudflare.com for more information.
2026-1-23 12:34:56 UTC
     💻             ☁                    💽
     ✅             ❌                   ✅
    You     Amsterdom  example.com
Browser  Cloudflare          Host
Working      Error           Working
-------------^--------------------
What happened?
There is an internal server error on Cloudflare's network.
What can I do?
Please try again in a few minutes.
----------------------------------
Cloudflare Ray ID: 114514homo917813
Your IP: Click to reveal
Performance & Security by Cloudflare`
  },

  "03": {
    id: "03",
    title: "大容量存储设备拉史说",
    date: "2026-05-02",
    renderMarkdown: false,
    markdown: `🗑🧹😅 💩🤖🤓 Android文件夹是清完就拉的
🪟🤫💩✋ 🤔 System Volume Infomation是偷摸着拉的(还不肯亲自承认)
💩💩🍎😏💩💩 🤢.DS_Store是到处都要拉的
🤚😭✋唯一的救星只有Linux了！`
  },

  "02": {
    id: "02",
    title: "如何0成本将你的Scratch项目制作成网站？",
    date: "2025-01-27",
    renderMarkdown: true,
    markdown: `---

<img src="/res/scrtosite.jpg">

> 本期视频仅发布于哔哩哔哩，点击[此处](https://www.bilibili.com/video/BV1pWfDYiEge/)跳转视频。

> 点击此处前往视频中演示的示例站点。[站点1](https://cxytest123.pages.dev) [站点2（截止2025年1月26日）](https://test.cxydemo.us.kg)

1.打包成形。

打包器使用[TurboWarp Packager](https://packager.turbowarp.org/)

2.注册账户。

点击前往[Cloudflare](https://dash.cloudflare.com)注册账户。

*.拓展 自定义域名

免费us.kg域名注册并托管教程：

[永久免费域名！最新注册教程，无限免费续期，100%成功，可托管CloudFlare，值得抢注！！ | 零度解说](https://www.bilibili.com/video/BV1AjiBYVEoF/)

[2024最新免费域名教程，可托管CF，零失败率，解决所有坑点。](https://www.bilibili.com/video/BV1by411B7Ko/)

> 感谢您对我的支持与观看！`
  },

  "01": {
    id: "01",
    title: "将Python项目打包成带安装程序的软件？",
    date: "2024-11-12",
    renderMarkdown: true,
    markdown: `---

<img src="/res/pytoapp.jpg">

> 视频中提到的资源 网盘链接

> 主：https://www.123684.com/s/7Y04jv-n47ud

> 备：https://www.123865.com/s/7Y04jv-n47ud

0.准备工作：
安装打包工具(pyinstaller)：\`pip install pyinstaller\`

1.打包成形：
普通打包：\`pyinstaller 项目名称.py\`

不显示命令提示符打包：\`pyinstaller 项目名称.py -w\`

2.更改图标：
图片转ico网站：https://www.ico51.cn`
  },
};

window.ARTICLE_LIST = Object.values(ARTICLE_DB).sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

window.ARTICLE_DB = ARTICLE_DB;