# 主题系统文档

## 概述

StarryNebula v2.2.0 引入了完整的主题系统，支持多个预设主题和自定义主题。用户可以轻松切换主题，主题配置会自动保存到本地存储。

---

## 预设主题

### 1. Light（亮色主题）

**特点：**
- 清爽明亮的设计
- 适合白天使用
- 高对比度，易于阅读

**颜色方案：**
- 主色：`#64b5f6`（蓝色）
- 次色：`#ffd4e5`（粉色）
- 强调色：`#ff6b9d`（深粉色）
- 背景：`#ffffff`（白色）
- 文字：`#333333`（深灰色）

### 2. Dark（暗色主题）

**特点：**
- 舒适的深色设计
- 适合夜间使用
- 减少眼睛疲劳

**颜色方案：**
- 主色：`#64b5f6`（蓝色）
- 次色：`#ffd4e5`（粉色）
- 强调色：`#ff6b9d`（深粉色）
- 背景：`#1a1a1a`（深灰色）
- 文字：`#e0e0e0`（浅灰色）

### 3. Ocean（海洋主题）

**特点：**
- 清爽的海洋风格
- 冷色调设计
- 宁静舒适

**颜色方案：**
- 主色：`#0ea5e9`（天蓝色）
- 次色：`#06b6d4`（青色）
- 强调色：`#0891b2`（深青色）
- 背景：`#0f172a`（深蓝色）
- 文字：`#e0f2fe`（浅蓝色）

### 4. Forest（森林主题）

**特点：**
- 自然的森林风格
- 绿色调设计
- 清新舒适

**颜色方案：**
- 主色：`#10b981`（绿色）
- 次色：`#34d399`（浅绿色）
- 强调色：`#6ee7b7`（薄荷绿）
- 背景：`#064e3b`（深绿色）
- 文字：`#d1fae5`（浅绿色）

### 5. Purple（紫色主题）

**特点：**
- 神秘的紫色风格
- 紫色调设计
- 优雅高级

**颜色方案：**
- 主色：`#a855f7`（紫色）
- 次色：`#d946ef`（洋红色）
- 强调色：`#ec4899`（粉红色）
- 背景：`#2d1b4e`（深紫色）
- 文字：`#f3e8ff`（浅紫色）

---

## 使用方法

### 基础使用

#### 1. 通过 UI 切换主题

在页面上点击主题切换按钮（通常位于右下角），即可在亮色和暗色主题之间切换。

#### 2. 通过 JavaScript API 切换主题

```javascript
// 获取主题管理器
const themeManager = window.themeManager

// 切换到特定主题
themeManager.setTheme('ocean')

// 切换主题模式
themeManager.setMode('dark')

// 获取当前主题
const currentTheme = themeManager.getTheme()
console.log(currentTheme.id) // 'ocean'

// 获取所有可用主题
const themes = themeManager.getAvailableThemes()
console.log(themes.map(t => t.name))
```

### 初始化配置

在页面加载前，通过 `window.cnblogsConfig` 配置初始主题：

```html
<script>
  window.cnblogsConfig = {
    theme: {
      id: 'ocean',      // 初始主题 ID
      mode: 'auto'      // 主题模式：'light', 'dark', 'auto'
    }
  }
</script>
```

### 主题模式说明

- **light**：始终使用亮色主题
- **dark**：始终使用暗色主题
- **auto**：根据系统设置自动选择（推荐）

---

## 高级用法

### 监听主题变更

```javascript
const themeManager = window.themeManager

// 监听主题变更事件
const unsubscribe = themeManager.onThemeChange((event) => {
  console.log('主题已变更')
  console.log('旧主题:', event.oldTheme.id)
  console.log('新主题:', event.newTheme.id)
  console.log('变更时间:', new Date(event.timestamp))
})

// 取消监听
unsubscribe()
```

### 获取主题信息

```javascript
const themeManager = window.themeManager

// 获取当前主题 ID
const themeId = themeManager.getThemeId()

// 获取当前主题对象
const theme = themeManager.getTheme()
console.log(theme.colors.primary)
console.log(theme.fonts.family)

// 获取当前模式
const mode = themeManager.getMode()

// 获取有效的主题模式（考虑 auto 模式）
const effectiveMode = themeManager.getEffectiveMode()
```

### 使用 CSS 变量

主题系统会自动设置 CSS 变量，可以在样式中直接使用：

```css
.my-element {
  color: var(--theme-primary);
  background-color: var(--theme-background);
  font-family: var(--theme-font-family);
  transition: color var(--theme-animation-duration) var(--theme-animation-easing);
}
```

**可用的 CSS 变量：**

```css
/* 颜色 */
--theme-primary
--theme-secondary
--theme-accent
--theme-background
--theme-text
--theme-border

/* 字体 */
--theme-font-family
--theme-font-size
--theme-font-weight
--theme-line-height

/* 动画 */
--theme-animation-duration
--theme-animation-easing
```

---

## 自定义主题

### 创建自定义主题

```typescript
import { Theme } from 'src/themes/types'

const customTheme: Theme = {
  id: 'custom',
  name: 'My Custom Theme',
  description: 'My awesome custom theme',
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00',
    accent: '#0000ff',
    background: '#ffffff',
    text: '#000000',
    border: '#cccccc',
  },
  fonts: {
    family: 'Georgia, serif',
    size: 16,
    weight: 500,
    lineHeight: 1.8,
  },
  animation: {
    duration: 400,
    easing: 'ease-in-out',
    enabled: true,
  },
  cursor: {
    enabled: true,
    size: 14,
    sizeF: 6,
    color: '#ff0000',
    colorF: '#00ff00',
  },
  starfield: {
    enabled: true,
    starCount: 300,
    speed: 0.7,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
  },
}
```

### 注册自定义主题

```typescript
import { ThemeManager } from 'src/themes/ThemeManager'
import { presets } from 'src/themes/presets'

// 添加自定义主题到预设
presets['custom'] = customTheme

// 使用自定义主题
const themeManager = window.themeManager
themeManager.setTheme('custom')
```

---

## 主题持久化

主题配置会自动保存到浏览器的 `localStorage`：

- **主题 ID**：保存在 `starry-nebula-theme` 键
- **主题模式**：保存在 `starry-nebula-theme-mode` 键

用户下次访问时，会自动加载上次选择的主题。

### 清除主题配置

```javascript
localStorage.removeItem('starry-nebula-theme')
localStorage.removeItem('starry-nebula-theme-mode')
```

---

## 系统主题检测

当主题模式设置为 `auto` 时，系统会自动检测用户的系统主题偏好：

```javascript
// 检测系统是否使用暗色主题
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
console.log(prefersDark ? '系统使用暗色主题' : '系统使用亮色主题')
```

当系统主题改变时，应用会自动更新。

---

## 常见问题

### Q: 如何在页面加载时设置特定主题？

A: 在页面 `<head>` 中添加以下代码：

```html
<script>
  window.cnblogsConfig = {
    theme: {
      id: 'ocean',
      mode: 'auto'
    }
  }
</script>
```

### Q: 如何禁用主题切换功能？

A: 隐藏主题切换按钮：

```javascript
const toggle = document.getElementById('themeToggle')
if (toggle) {
  toggle.style.display = 'none'
}
```

### Q: 主题变更是否会影响性能？

A: 不会。主题变更只是更新 CSS 变量和 DOM 类名，性能影响极小。

### Q: 如何在自定义组件中使用主题颜色？

A: 使用 CSS 变量：

```css
.my-component {
  color: var(--theme-primary);
  background: var(--theme-background);
}
```

或通过 JavaScript：

```javascript
const theme = window.themeManager.getTheme()
element.style.color = theme.colors.primary
```

### Q: 主题配置是否支持响应式设计？

A: 是的。主题系统完全支持响应式设计，所有 CSS 变量都可以在媒体查询中使用。

---

## 最佳实践

1. **使用 CSS 变量**：优先使用 CSS 变量而不是硬编码颜色值
2. **监听主题变更**：如果需要在主题变更时执行特定操作，使用 `onThemeChange` 方法
3. **提供主题选择**：在 UI 中提供主题选择器，让用户自由选择
4. **测试所有主题**：确保应用在所有主题下都能正常工作
5. **考虑无障碍性**：确保主题颜色对比度满足 WCAG 标准

---

## API 参考

### ThemeManager 类

#### 构造函数

```typescript
constructor(initialTheme: string = 'light', initialMode: ThemeMode = 'auto')
```

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `setTheme(themeId)` | 设置主题 | `void` |
| `setMode(mode)` | 设置主题模式 | `void` |
| `toggleTheme()` | 切换主题 | `void` |
| `getTheme()` | 获取当前主题 | `Theme` |
| `getThemeId()` | 获取当前主题 ID | `string` |
| `getMode()` | 获取当前模式 | `ThemeMode` |
| `getEffectiveMode()` | 获取有效的主题模式 | `'light' \| 'dark'` |
| `onThemeChange(callback)` | 监听主题变更 | `() => void` |
| `getAvailableThemes()` | 获取所有可用主题 | `Theme[]` |
| `destroy()` | 销毁主题管理器 | `void` |

---

## 更新日志

### v2.2.0

- ✅ 实现完整的主题系统
- ✅ 添加 5 个预设主题
- ✅ 支持主题持久化
- ✅ 支持系统主题检测
- ✅ 提供完整的 API 和文档

