# 梦迹 DreamTrace

> 一个移动端梦境记录与社区分享 Web App 原型 — 在梦里，遇见另一个自己。

梦迹 DreamTrace 是一款面向移动端的梦境记录、AI 解读与社区分享 Web 应用。以梦幻水彩紫调为视觉主题，模拟 iPhone 390×844 单屏交互，提供梦境记录、日历回顾、AI 解梦、社区分享、个人成长等完整体验。

## 特性概览

- **首页** — 梦境 Hero 区 + 近期梦境图片轮播 + 本月数据统计 + 快速记录入口（语音 / 文字）
- **日历** — 月视图梦境/现实记录回顾，今日实时更新（北京时间），支持新建/编辑/删除记录
- **AI 梦境宇宙** — 梦境符号解读 + 周公解梦 + AI 深度分析
- **社区** — 梦境集市广场，发布/点赞/评论/也梦到过，支持发布/取消发布/编辑/删除
- **我的** — 个人成长数据、头像切换、记录管理
- **统一视觉** — 梦幻水彩插画风格，紫调主题，无文字无边框

## 技术栈

- **前端**：原生 HTML / CSS / JavaScript（ES Modules），无框架
- **构建工具**：Vite 5
- **路由**：自研极简 Hash 路由（`#/home` `#/detail/r_001` `#/post/p_002`）
- **状态管理**：自研轻量 state + subscribe 订阅模型
- **数据存储**：localStorage
- **设计规范**：390×844px iPhone 模拟，单屏无滚动，紫色主题（#7B68EE / #9B8DF8）

## 目录结构

```
trae_app11/
├── index.html                  # 应用入口
├── vite.config.js              # Vite 配置
├── package.json
├── styles/
│   ├── base.css                # 主题变量、基础样式
│   ├── components.css          # 通用组件样式（Toast / Sheet / 按钮）
│   └── pages.css               # 各页面专属样式
├── scripts/
│   ├── app.js                  # 应用入口（导航 / 路由分发 / 全局事件）
│   ├── router.js               # 极简 Hash 路由
│   ├── state.js                # 全局状态 + 订阅（含北京时间日期函数）
│   ├── store.js                # localStorage 持久化封装
│   ├── repository.js           # 数据访问层（records / posts / user）
│   ├── feedback.js             # 通用弹窗 / Toast / 确认框
│   ├── components.js           # 通用 UI 组件（icon 等）
│   ├── seed-data.js            # 模拟数据种子
│   └── pages/
│       ├── home.js             # 首页
│       ├── calendar.js         # 日历
│       ├── ai.js               # AI 梦境宇宙
│       ├── ai-analysis.js      # AI 深度分析详情
│       ├── community.js        # 社区
│       ├── community-detail.js # 社区帖子详情
│       ├── detail.js           # 梦境记录详情
│       ├── record.js           # 记录编辑
│       └── profile.js          # 我的
└── .gitignore
```

## 本地运行

**前置要求**：Node.js 18+

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5180）
npm run dev

# 构建生产版本（输出到 dist/）
npm run build

# 本地预览生产构建
npm run preview
```

## 部署

项目为纯静态 SPA，可部署到任意静态托管平台：

- **Vercel**：导入 GitHub 仓库，Framework Preset 选 Vite，自动构建部署
- **Cloudflare Pages**：构建命令 `npm run build`，输出目录 `dist`
- **Netlify**：构建命令 `npm run build`，发布目录 `dist`


## 浏览器兼容

推荐 Chrome / Safari 最新版本（移动端与桌面端均可访问，桌面端以手机外壳形态居中展示）。

