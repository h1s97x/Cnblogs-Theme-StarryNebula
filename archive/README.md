# 归档文件

本目录包含项目的旧版本文件（原生 JavaScript 和 CSS）。

## 文件说明

### scripts/
- `main.js` - 原始主控制脚本
- `starfield.js` - 原始星空背景类
- `mouse-trail.js` - 原始鼠标轨迹类

### styles/
- `main.css` - 原始样式文件

## 迁移说明

这些文件已被迁移到现代化的技术栈：

- **JavaScript** → **TypeScript** (`src/scripts/`)
- **CSS** → **Less** (`src/styles/`)

新版本提供了：
- 类型安全（TypeScript）
- 更强大的样式管理（Less）
- 更好的开发体验（Vite）
- 更小的包体积

## 使用旧版本

如果需要使用旧版本，可以从 Git 历史中恢复。

## 参考

- 查看 [docs/MIGRATION.md](../docs/MIGRATION.md) 了解迁移详情
- 查看 [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) 了解新版本开发指南
