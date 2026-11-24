# Keye Video Team (`keye-video.github.io`)

Keye Video Team 官方学术主页仓库，部署于 GitHub Pages：`https://keye-video.github.io/`。

## 目录结构

```text
keye-video.github.io/
├── index.html          # 团队主页（简介、精选论文、动态、开源项目、成员）
├── assets/
│   ├── logo.svg        # Keye Video 品牌几何标志
│   ├── site.css        # 极简学术期刊风格样式表
│   └── site.js         # 导航、双语切换、目录高亮、代码复制与灯箱脚本
└── .nojekyll           # 禁用 Jekyll 构建，直接发布静态资源
```

## 本地预览

```bash
python3 -m http.server 8000
```

浏览器打开 `http://localhost:8000` 即可查看。

## 更新新论文

在 `index.html` 的 `#papers` 区块添加一篇 `<article class="post-card">` 卡片，并将链接指向对应论文的 GitHub Pages 地址（如 `https://keye-video.github.io/<paper-slug>/`）。
