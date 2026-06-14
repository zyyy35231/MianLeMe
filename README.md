# 面了么 —— AI 校招面试教练

> **每一次模拟，都离 Offer 更近**

[![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)](https://github.com/zyyy35231/MianLeMe/releases)
[![GitHub Pages](https://img.shields.io/badge/demo-online-brightgreen)](https://zyyy35231.github.io/MianLeMe/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

「面了么」是一款面向校招场景的 AI 面试模拟工具。上传简历，AI 分析弱点，然后进行沉浸式模拟面试，最后获得多维度评分报告。

---

## 功能

| 模块 | 说明 |
|------|------|
| 🏠 **首页** | 项目介绍 + 核心卖点，所见即所得 |
| 📄 **简历分析** | 支持粘贴文本 / 上传 PDF / 上传 Word，AI 多维度评分 + 雷达图 |
| 🎙️ **模拟面试** | 5大岗位 × 3级难度，正式面试面板，动态追问，倒计时，语音播报 |
| 📊 **面试报告** | 综合得分动画 + 雷达图 + 逐题点评 + 截图分享 + 完整文本导出 |

## 截图

> 打开[在线地址](https://zyyy35231.github.io/MianLeMe/)即可体验，以下为功能预览：

| 首页 | 简历分析 | 模拟面试 | 面试报告 |
|------|---------|---------|---------|
| Hero + 卖点卡片 | 文件上传 + 雷达图 | 正式面试面板 + 倒计时 | 得分 + 逐题回顾 |

## 快速开始

### 在线使用（推荐）

直接访问：**[https://zyyy35231.github.io/MianLeMe/](https://zyyy35231.github.io/MianLeMe/)**

### 本地运行

```bash
git clone https://github.com/zyyy35231/MianLeMe.git
cd MianLeMe
# 用浏览器打开 index.html 即可
```

无需安装依赖，无需构建工具。

## API Key 设置

1. 页面左下角点击「设置 API Key」
2. 输入 DeepSeek API Key（从 [platform.deepseek.com](https://platform.deepseek.com/) 获取）
3. 点击「测试连接」验证

> 不设置 API Key 也能使用，系统会自动切换为内置模拟面试题，体验不受影响。

## 数据隐私

- API Key 存储在**你的浏览器 localStorage** 中，不上传至任何服务器
- 面试记录和报告同样保存在本地浏览器
- 不同用户/设备之间数据完全隔离

## 技术栈

| 用途 | 技术 |
|------|------|
| 样式 | Tailwind CSS (CDN) |
| 图表 | Chart.js |
| 图标 | Lucide Icons |
| PDF 解析 | PDF.js |
| Word 解析 | Mammoth.js |
| 截图导出 | html2canvas |
| 语音播放 | Web Speech API (TTS) |
| AI 对话 | DeepSeek API |

## 项目结构

```
MianLeMe/
├── index.html              # 主框架
├── css/style.css            # 自定义样式
├── js/
│   ├── config.js            # 配置 + 模拟数据
│   ├── storage.js           # localStorage 封装
│   ├── ui.js                # Toast / Modal / 导航
│   ├── api.js               # API 调用 + 降级逻辑
│   ├── app.js               # 主应用入口
│   ├── home.js              # 首页
│   ├── resume.js            # 简历分析
│   ├── interview.js         # 模拟面试（核心）
│   └── report.js            # 面试报告
└── README.md
```

纯静态文件，无构建步骤，浏览器直接打开即用。

## License

MIT © 2026
