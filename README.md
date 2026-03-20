# StarryNebula - 博客园星空主题

一个现代化的博客园主题，采用 TypeScript + Less 技术栈，提供星空背景、玻璃态设计和交互粒子效果。

## 特性

* ✨ 动态星空背景（Canvas）
* 🎨 玻璃态设计（Glassmorphism）
* ✦ 鼠标轨迹粒子效果
* 🌙 深色/浅色主题切换
* 📱 完全响应式设计
* ⚡ 高性能动画
* 🔧 TypeScript 类型安全
* 🎯 Less 变量管理

## 快速开始

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/h1s97x/Cnblogs-Theme-StarryNebula.git
cd Cnblogs-Theme-StarryNebula

# 安装依赖
npm install

# 启动开发服务器（热更新）
npm run dev

# 构建生产版本
npm run build
```

### 博客园配置

详见 [install.md](./docs/INSTALL.md)

## 项目结构

```
src/
├── scripts/
│   ├── main.ts          # 主入口（TypeScript）
│   ├── starfield.ts     # 星空背景类
│   └── mouse-trail.ts   # 鼠标粒子类
├── styles/
│   ├── main.less        # 主样式（Less）
│   └── variables.less   # 变量定义
└── index.html           # HTML 模板

dist/                    # 构建输出（自动生成）
├── starrynebula.js      # 编译后的 JavaScript
└── starrynebula.css     # 编译后的 CSS
```

## 技术栈

* **TypeScript** - 类型安全的 JavaScript
* **Less** - CSS 预处理器，支持变量、混合、嵌套
* **Vite** - 极速构建工具，开发体验优秀

## 开发指南

### 修改样式

编辑 `src/styles/` 中的 Less 文件：
* `variables.less` - 定义颜色、间距、动画等全局变量
* `main.less` - 导入变量并编写样式

### 修改脚本

编辑 `src/scripts/` 中的 TypeScript 文件：
* `main.ts` - 初始化各个模块
* `starfield.ts` - Starfield 类实现
* `mouse-trail.ts` - MouseTrail 类实现

### 构建流程

```bash
npm run build
```

Vite 会自动：
1. 编译 TypeScript 为 JavaScript
2. 编译 Less 为 CSS
3. 生成 `dist/starrynebula.js` 和 `dist/starrynebula.css`

## 浏览器支持

* Chrome/Edge 90+
* Firefox 88+
* Safari 14+

## 许可证

MIT
