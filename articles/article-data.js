const ARTICLE_DB = {
  "06": {
    id: "06",
    title: "VendorCo牌存储器专营店广告",
    date: "2026-07-17",
    renderMarkdown: true
  },

  "05": {
    id: "05",
    title: "依旧写真",
    date: "2026-06-27",
    renderMarkdown: false
  },
  
  "04": {
    id: "04",
    title: "一幅写真",
    date: "2026-05-02",
    renderMarkdown: false
  },

  "03": {
    id: "03",
    title: "大容量存储设备拉史说",
    date: "2026-05-02",
    renderMarkdown: false
  },

  "02": {
    id: "02",
    title: "如何0成本将你的Scratch项目制作成网站？",
    date: "2025-01-27",
    renderMarkdown: true
  },

  "01": {
    id: "01",
    title: "将Python项目打包成带安装程序的软件？",
    date: "2024-11-12",
    renderMarkdown: true
  },
};

window.ARTICLE_LIST = Object.values(ARTICLE_DB).sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

window.ARTICLE_DB = ARTICLE_DB;