# API 参考

## 核心系统

### Initializer

应用初始化器，协调所有模块的初始化。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `init()` | 初始化应用 | `void` |
| `destroy()` | 销毁应用 | `void` |
| `getComponentRegistry()` | 获取组件注册表 | `ComponentRegistry` |
| `getThemeManager()` | 获取主题管理器 | `ThemeManager` |
| `getPageManager()` | 获取页面管理器 | `PageManager` |
| `getConfig()` | 获取配置 | `Config` |
| `isInitialized()` | 检查是否已初始化 | `boolean` |

#### 使用示例

```typescript
import { createInitializer } from 'src/core'

const initializer = createInitializer({ autoInit: true })
const registry = initializer.getComponentRegistry()
```

---

### EventBus

事件总线，用于组件间通信。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `on(event, handler, priority)` | 订阅事件 | `() => void` |
| `once(event, handler, priority)` | 一次性订阅 | `() => void` |
| `off(event, handler)` | 取消订阅 | `void` |
| `offAll(event?)` | 取消所有订阅 | `void` |
| `emit(event, data)` | 异步发布事件 | `Promise<void>` |
| `emitSync(event, data)` | 同步发布事件 | `void` |
| `has(event)` | 检查是否有监听器 | `boolean` |
| `listenerCount(event)` | 获取监听器数量 | `number` |
| `eventNames()` | 获取所有事件名称 | `string[]` |

#### 使用示例

```typescript
import { globalEventBus } from 'src/core'

// 订阅事件
globalEventBus.on('theme:changed', (data) => {
  console.log('主题已变更')
})

// 发布事件
globalEventBus.emitSync('theme:changed', { theme: 'dark' })
```

---

### Store

状态管理器，集中管理应用状态。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `get(path, defaultValue)` | 获取状态值 | `any` |
| `set(path, value)` | 设置状态值 | `void` |
| `update(updates)` | 批量更新状态 | `void` |
| `getState()` | 获取完整状态 | `StoreState` |
| `setState(state)` | 设置完整状态 | `void` |
| `reset(initialState)` | 重置状态 | `void` |
| `watch(path, callback)` | 监听状态变更 | `() => void` |
| `clearStorage()` | 清除本地存储 | `void` |

#### 使用示例

```typescript
import { createStore } from 'src/core'

const store = createStore({ user: { name: 'John' } })

// 获取状态
const name = store.get('user.name')

// 设置状态
store.set('user.name', 'Jane')

// 监听变更
store.watch('user.name', (value) => {
  console.log('名字已变更:', value)
})
```

---

### PluginSystem

插件系统，用于扩展应用功能。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `register(plugin)` | 注册插件 | `Promise<void>` |
| `unregister(name)` | 注销插件 | `Promise<void>` |
| `get(name)` | 获取插件 | `Plugin \| undefined` |
| `getAll()` | 获取所有插件 | `Plugin[]` |
| `has(name)` | 检查插件是否存在 | `boolean` |
| `size()` | 获取插件数量 | `number` |
| `getNames()` | 获取所有插件名称 | `string[]` |

#### 使用示例

```typescript
import { PluginSystem } from 'src/core'

const pluginSystem = new PluginSystem(initializer, eventBus)

const plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(initializer, eventBus) {
    console.log('插件已安装')
  }
}

await pluginSystem.register(plugin)
```

---

## 组件系统

### BaseComponent

所有组件的基类。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `init()` | 初始化组件 | `void` |
| `render()` | 渲染组件 | `void` |
| `update(config)` | 更新配置 | `void` |
| `destroy()` | 销毁组件 | `void` |
| `getConfig()` | 获取配置 | `ComponentConfig` |
| `getConfigValue(path, default)` | 获取配置值 | `any` |
| `setConfigValue(path, value)` | 设置配置值 | `void` |
| `isInit()` | 检查是否初始化 | `boolean` |
| `isDestroy()` | 检查是否销毁 | `boolean` |

---

### ComponentRegistry

组件注册表，管理所有组件。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `register(name, component)` | 注册组件 | `void` |
| `unregister(name)` | 注销组件 | `void` |
| `get(name)` | 获取组件 | `BaseComponent \| undefined` |
| `getAll()` | 获取所有组件 | `BaseComponent[]` |
| `has(name)` | 检查组件是否存在 | `boolean` |
| `size()` | 获取组件数量 | `number` |
| `initAll()` | 初始化所有组件 | `void` |
| `renderAll()` | 渲染所有组件 | `void` |
| `updateAll(config)` | 更新所有组件 | `void` |
| `destroyAll()` | 销毁所有组件 | `void` |

---

### Banner

横幅组件。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `setTitle(title)` | 设置标题 | `void` |
| `getTitle()` | 获取标题 | `string` |
| `setSubtitle(subtitle)` | 设置副标题 | `void` |
| `getSubtitle()` | 获取副标题 | `string` |
| `setBackgroundImage(url)` | 设置背景图片 | `void` |
| `getBackgroundImage()` | 获取背景图片 | `string` |

---

### Sidebar

侧边栏组件。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `addWidget(widget)` | 添加小组件 | `void` |
| `removeWidget(id)` | 移除小组件 | `void` |
| `getWidget(id)` | 获取小组件 | `SidebarWidget \| undefined` |
| `getAllWidgets()` | 获取所有小组件 | `SidebarWidget[]` |
| `updateWidget(id, widget)` | 更新小组件 | `void` |
| `clearWidgets()` | 清空所有小组件 | `void` |

---

## 主题系统

### ThemeManager

主题管理器。

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

---

## 页面系统

### PageManager

页面管理器。

#### 方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `detectPageType()` | 检测页面类型 | `PageType` |
| `getPageType()` | 获取页面类型 | `PageType` |
| `getPageConfig()` | 获取页面配置 | `PageConfig` |
| `setPageConfig(config)` | 设置页面配置 | `void` |
| `getConfigValue(path, default)` | 获取配置值 | `any` |
| `isPageEnabled(name)` | 检查页面是否启用 | `boolean` |
| `isHome()` | 检查是否为首页 | `boolean` |
| `isArticle()` | 检查是否为文章页 | `boolean` |
| `getPageTitle()` | 获取页面标题 | `string` |
| `getPageUrl()` | 获取页面 URL | `string` |
| `getQueryParam(key)` | 获取查询参数 | `string \| null` |

---

## 工具函数

### 防抖和节流

```typescript
import { debounce, throttle } from 'src/utils/tools'

// 防抖
const debouncedSearch = debounce((query) => {
  search(query)
}, 300)

// 节流
const throttledScroll = throttle(() => {
  handleScroll()
}, 100)
```

### DOM 工具

```typescript
import { 
  isInViewport, 
  getScrollPosition, 
  scrollToTop 
} from 'src/utils/tools'

// 检查元素是否在视口内
if (isInViewport(element)) {
  console.log('元素在视口内')
}

// 获取滚动位置
const { x, y } = getScrollPosition()

// 滚动到顶部
scrollToTop()
```

### 浏览器检测

```typescript
import { 
  isMobile, 
  isChrome, 
  isFirefox,
  isDarkMode 
} from 'src/utils/tools'

if (isMobile()) {
  console.log('移动设备')
}

if (isDarkMode()) {
  console.log('暗色模式')
}
```

---

## 类型定义

### Theme

```typescript
interface Theme {
  id: string
  name: string
  description: string
  colors: ThemeColors
  fonts: ThemeFonts
  animation: ThemeAnimation
  cursor: ThemeCursor
  starfield: ThemeStarfield
}
```

### Config

```typescript
interface Config {
  info: {
    name: string
    startDate: string
    avatar: string
  }
  animate: {
    starfield: StarfieldConfig
    cursor: CursorConfig
  }
  theme: {
    mode: 'light' | 'dark' | 'auto'
    colors: {
      primary: string
      secondary: string
    }
  }
  pages: {
    [key: string]: {
      enabled: boolean
      [key: string]: any
    }
  }
}
```

### Plugin

```typescript
interface Plugin {
  name: string
  version: string
  install(initializer: Initializer, eventBus: EventBus): void | Promise<void>
  uninstall?(): void | Promise<void>
}
```

---

## 全局对象

### window.initializer

全局初始化器实例。

```typescript
const initializer = window.initializer
```

### window.themeManager

全局主题管理器实例。

```typescript
const themeManager = window.themeManager
```

### window.cnblogsConfig

用户配置对象。

```typescript
window.cnblogsConfig = {
  theme: {
    id: 'ocean',
    mode: 'auto'
  }
}
```

