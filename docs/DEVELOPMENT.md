# 开发指南

## 项目设置

### 环境要求

* Node.js 18+
* npm 9+

### 初始化

```bash
npm install
```

## 开发工作流

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看实时预览。

### 编辑源文件

#### TypeScript 文件 (`src/scripts/`)

* `main.ts` - 主入口，初始化所有模块
* `starfield.ts` - Starfield 类，管理星空背景
* `mouse-trail.ts` - MouseTrail 类，管理鼠标粒子效果

所有文件都有完整的类型定义，享受 IDE 的智能提示。

#### Less 文件 (`src/styles/`)

* `variables.less` - 全局变量（颜色、间距、动画等）
* `main.less` - 主样式文件，导入变量并编写样式

修改变量后，所有使用该变量的地方都会自动更新。

### 构建生产版本

```bash
npm run build
```

输出文件：
* `dist/starrynebula.js` - 编译后的 JavaScript（包含 CSS）
* `dist/starrynebula.css` - 编译后的 CSS

## 常见任务

### 修改颜色主题

编辑 `src/styles/variables.less`：

```less
@primary-color: #64b5f6;      // 主色
@secondary-color: #81c784;    // 辅助色
@accent-color: #ffd4e5;       // 强调色
```

### 调整动画速度

编辑 `src/scripts/starfield.ts`：

```typescript
this.config = {
  starCount: 200,
  speed: 0.5,  // 调整这个值
  colors: [...]
}
```

### 修改粒子效果

编辑 `src/scripts/mouse-trail.ts`：

```typescript
this.config = {
  particleCount: 8,      // 粒子数量
  particleSize: 4,       // 粒子大小
  particleColor: '#64b5f6',
  duration: 800          // 持续时间（毫秒）
}
```

## 类型定义

所有主要类都有完整的接口定义：

```typescript
// Starfield 配置
interface StarfieldConfig {
  starCount?: number
  speed?: number
  colors?: string[]
}

// MouseTrail 配置
interface MouseTrailConfig {
  particleCount?: number
  particleSize?: number
  particleColor?: string
  duration?: number
}
```

## 调试

### 浏览器开发者工具

1. 打开 DevTools (F12)
2. 查看 Console 标签页
3. 检查 Network 标签页中的资源加载

### TypeScript 类型检查

```bash
# 检查类型错误（不生成输出）
npx tsc --noEmit
```

## 部署到博客园

### 1. 构建项目

```bash
npm run build
```

### 2. 上传到 GitHub

```bash
git add .
git commit -m "build: update theme"
git push origin main
```

### 3. 在博客园配置

参考 [install.md](./install.md) 中的博客园配置步骤。

## 性能优化建议

### Canvas 优化

* 使用 `requestAnimationFrame` 而不是 `setInterval`
* 避免频繁的 Canvas 状态改变
* 使用离屏 Canvas 进行复杂计算

### CSS 优化

* 使用 CSS 变量便于主题切换
* 避免过度使用 `backdrop-filter`（性能开销大）
* 使用 `will-change` 提示浏览器优化

### JavaScript 优化

* 使用类型定义避免运行时错误
* 及时清理事件监听器
* 使用节流/防抖处理频繁事件

## 故障排除

### 样式不生效

1. 检查 Less 文件是否有语法错误
2. 确保 `main.less` 导入了 `variables.less`
3. 清除浏览器缓存

### 动画卡顿

1. 检查 Canvas 分辨率是否过高
2. 减少粒子数量
3. 检查浏览器是否有其他高负载任务

### TypeScript 错误

1. 运行 `npm install` 确保依赖完整
2. 检查类型定义是否正确
3. 使用 IDE 的快速修复功能

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

MIT
