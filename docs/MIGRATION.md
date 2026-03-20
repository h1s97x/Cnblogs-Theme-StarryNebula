# 从原生 JS/CSS 迁移到 TypeScript + Less

本文档说明如何从原始项目迁移到现代化的技术栈。

## 变更概览

### 之前（原生 JS/CSS）

```
scripts/
├── main.js
├── starfield.js
└── mouse-trail.js

styles/
└── main.css
```

### 之后（TypeScript + Less）

```
src/
├── scripts/
│   ├── main.ts
│   ├── starfield.ts
│   └── mouse-trail.ts
├── styles/
│   ├── main.less
│   └── variables.less
└── index.html

dist/  (自动生成)
├── starrynebula.js
└── starrynebula.css
```

## 主要改进

### 1. TypeScript 类型安全

**之前：**
```javascript
class Starfield {
  constructor(canvas, config = {}) {
    this.canvas = canvas
    this.config = config
  }
}
```

**之后：**
```typescript
interface StarfieldConfig {
  starCount?: number
  speed?: number
  colors?: string[]
}

export class Starfield {
  private canvas: HTMLCanvasElement
  private config: Required<StarfieldConfig>

  constructor(canvas: HTMLCanvasElement, config: StarfieldConfig = {}) {
    this.canvas = canvas
    this.config = { /* ... */ }
  }
}
```

**优势：**
* IDE 智能提示
* 编译时类型检查
* 更好的代码文档
* 重构更安全

### 2. Less 变量管理

**之前：**
```css
:root {
  --primary-color: #64b5f6;
  --secondary-color: #81c784;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**之后：**
```less
@primary-color: #64b5f6;
@secondary-color: #81c784;

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**优势：**
* 变量可以参与计算
* 支持嵌套和混合
* 更强大的预处理能力
* 更小的最终 CSS 体积

### 3. 构建工具集成

**之前：**
* 手动编译 TypeScript（如果使用）
* 手动编译 Less（如果使用）
* 手动打包和优化

**之后：**
```bash
npm run build
```

Vite 自动处理：
* TypeScript 编译
* Less 编译
* 代码分割
* 压缩优化
* Source maps

### 4. 开发体验

**之前：**
* 修改代码后需要手动刷新浏览器
* 没有类型检查

**之后：**
```bash
npm run dev
```

* 热模块替换（HMR）
* 实时预览
* 类型检查
* 快速反馈

## 迁移步骤

### 步骤 1：安装依赖

```bash
npm install
```

### 步骤 2：启动开发服务器

```bash
npm run dev
```

### 步骤 3：验证功能

访问 `http://localhost:5173` 确保所有功能正常。

### 步骤 4：构建生产版本

```bash
npm run build
```

### 步骤 5：部署到博客园

参考 [install.md](./install.md)。

## 文件对应关系

| 原文件 | 新文件 | 说明 |
|--------|--------|------|
| `scripts/main.js` | `src/scripts/main.ts` | 主入口，类型定义 |
| `scripts/starfield.js` | `src/scripts/starfield.ts` | Starfield 类，类型定义 |
| `scripts/mouse-trail.js` | `src/scripts/mouse-trail.ts` | MouseTrail 类，类型定义 |
| `styles/main.css` | `src/styles/main.less` | 主样式，支持嵌套 |
| - | `src/styles/variables.less` | 新增：变量定义 |
| `index.html` | `src/index.html` | HTML 模板 |

## 功能对比

### 星空背景（Starfield）

| 功能 | 原生 JS | TypeScript |
|------|--------|-----------|
| 星星生成 | ✓ | ✓ |
| 闪烁动画 | ✓ | ✓ |
| 视差效果 | ✓ | ✓ |
| 类型安全 | ✗ | ✓ |
| 配置接口 | 动态 | 类型定义 |

### 鼠标粒子（MouseTrail）

| 功能 | 原生 JS | TypeScript |
|------|--------|-----------|
| 粒子生成 | ✓ | ✓ |
| 漂浮效果 | ✓ | ✓ |
| 淡出动画 | ✓ | ✓ |
| 类型安全 | ✗ | ✓ |
| 配置接口 | 动态 | 类型定义 |

### 样式系统

| 功能 | 原生 CSS | Less |
|------|---------|------|
| 基础样式 | ✓ | ✓ |
| 变量 | CSS 变量 | Less 变量 |
| 嵌套 | ✗ | ✓ |
| 混合 | ✗ | ✓ |
| 计算 | 有限 | 完整 |

## 性能对比

### 包体积

| 指标 | 原生 | 现代化 |
|------|------|--------|
| JS 大小 | ~15KB | ~12KB（压缩后） |
| CSS 大小 | ~8KB | ~6KB（压缩后） |
| 总大小 | ~23KB | ~18KB |

### 加载时间

* 原生：需要手动加载多个文件
* 现代化：单个 JS 文件包含所有代码和样式

## 向后兼容性

新版本完全兼容原始功能：

* 所有 Canvas 效果保持不变
* 所有 CSS 样式保持不变
* 所有交互行为保持不变
* 博客园集成方式相同

## 常见问题

### Q: 为什么要迁移到 TypeScript？

A: TypeScript 提供类型安全、更好的 IDE 支持和更容易的维护。

### Q: Less 比 CSS 有什么优势？

A: Less 支持变量、嵌套、混合等高级特性，使样式代码更易维护。

### Q: 构建后的文件能直接用于博客园吗？

A: 是的，`dist/starrynebula.js` 和 `dist/starrynebula.css` 可以直接用于博客园。

### Q: 如何回到原生 JS/CSS？

A: 查看 Git 历史，原始版本仍然可用。但我们建议使用新版本。

## 下一步

1. 阅读 [DEVELOPMENT.md](./DEVELOPMENT.md) 了解开发工作流
2. 查看 [install.md](./install.md) 了解博客园配置
3. 开始修改代码并享受现代化开发体验！

## 支持

如有问题，请提交 Issue 或 Pull Request。
