# 使用示例

## 基础使用

### 1. 初始化应用

```typescript
import { createInitializer } from 'src/core'

// 创建初始化器
const initializer = createInitializer({
  autoInit: true,
  debug: true
})

// 获取各个管理器
const themeManager = initializer.getThemeManager()
const componentRegistry = initializer.getComponentRegistry()
const pageManager = initializer.getPageManager()
```

### 2. 主题管理

```typescript
// 切换主题
themeManager.setTheme('ocean')

// 设置主题模式
themeManager.setMode('dark')

// 监听主题变更
themeManager.onThemeChange((event) => {
  console.log('主题已变更:', event.newTheme.id)
})

// 获取所有可用主题
const themes = themeManager.getAvailableThemes()
```

### 3. 组件管理

```typescript
// 获取组件
const starfield = componentRegistry.get('starfield')

// 初始化组件
starfield.init()

// 渲染组件
starfield.render()

// 更新组件配置
starfield.update({ starCount: 300 })

// 销毁组件
starfield.destroy()
```

### 4. 事件系统

```typescript
import { globalEventBus } from 'src/core'

// 订阅事件
globalEventBus.on('theme:changed', (data) => {
  console.log('主题已变更:', data)
})

// 一次性订阅
globalEventBus.once('app:ready', () => {
  console.log('应用已就绪')
})

// 发布事件
globalEventBus.emitSync('custom:event', { message: 'Hello' })

// 取消订阅
globalEventBus.off('theme:changed', handler)
```

### 5. 状态管理

```typescript
import { createStore } from 'src/core'

// 创建状态管理器
const store = createStore({
  user: {
    name: 'John',
    theme: 'light'
  },
  settings: {
    notifications: true
  }
}, undefined, {
  persist: true,
  persistKey: 'app-store'
})

// 获取状态
const userName = store.get('user.name')

// 设置状态
store.set('user.theme', 'dark')

// 监听状态变更
store.watch('user.theme', (value) => {
  console.log('主题已变更:', value)
})

// 批量更新
store.update({
  'user.name': 'Jane',
  'settings.notifications': false
})
```

### 6. 插件系统

```typescript
import { PluginSystem } from 'src/core'

// 创建插件系统
const pluginSystem = new PluginSystem(initializer, globalEventBus)

// 定义插件
const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(initializer, eventBus) {
    console.log('插件已安装')
    eventBus.on('app:ready', () => {
      console.log('应用已就绪')
    })
  },
  uninstall() {
    console.log('插件已卸载')
  }
}

// 注册插件
await pluginSystem.register(myPlugin)

// 获取插件
const plugin = pluginSystem.get('my-plugin')

// 注销插件
await pluginSystem.unregister('my-plugin')
```

## 高级用法

### 1. 创建自定义组件

```typescript
import { BaseComponent } from 'src/components'

class MyComponent extends BaseComponent {
  constructor(config = {}) {
    super('MyComponent', config)
  }

  onInit() {
    console.log('组件初始化')
  }

  onRender() {
    console.log('组件渲染')
  }

  onUpdate(config) {
    console.log('组件更新:', config)
  }

  onDestroy() {
    console.log('组件销毁')
  }
}

// 使用自定义组件
const component = new MyComponent({ color: 'red' })
componentRegistry.register('my-component', component)
component.init()
component.render()
```

### 2. 页面特定配置

```typescript
import { PageManager } from 'src/pages'

// 检测页面类型
const pageType = PageManager.detectPageType()

// 创建页面管理器
const pageManager = new PageManager(pageType)

// 根据页面类型加载不同配置
if (pageManager.isHome()) {
  // 首页特定逻辑
  loadHomeConfig()
} else if (pageManager.isArticle()) {
  // 文章页特定逻辑
  loadArticleConfig()
}

// 获取查询参数
const keyword = pageManager.getQueryParam('q')
```

### 3. 事件优先级

```typescript
// 高优先级事件处理器
globalEventBus.on('app:ready', handler1, 10)

// 低优先级事件处理器
globalEventBus.on('app:ready', handler2, 5)

// handler1 会先执行，然后是 handler2
globalEventBus.emitSync('app:ready')
```

### 4. 异步事件处理

```typescript
// 异步事件处理
globalEventBus.on('data:load', async (data) => {
  const result = await fetchData(data)
  console.log('数据加载完成:', result)
})

// 发布异步事件
await globalEventBus.emit('data:load', { id: 1 })
```

### 5. 状态持久化

```typescript
// 启用状态持久化
const store = createStore(
  { user: { name: 'John' } },
  globalEventBus,
  {
    persist: true,
    persistKey: 'my-app-store'
  }
)

// 状态会自动保存到 localStorage
store.set('user.name', 'Jane')

// 页面刷新后，状态会自动恢复
// 下次加载时，user.name 仍然是 'Jane'
```

## 完整示例

```typescript
import { 
  createInitializer, 
  globalEventBus, 
  createStore,
  PluginSystem 
} from 'src/core'
import { Banner } from 'src/components'

// 1. 初始化应用
const initializer = createInitializer({ autoInit: true })

// 2. 创建状态管理
const store = createStore({
  theme: 'light',
  user: { name: 'John' }
}, globalEventBus, { persist: true })

// 3. 创建插件系统
const pluginSystem = new PluginSystem(initializer, globalEventBus)

// 4. 定义插件
const analyticsPlugin = {
  name: 'analytics',
  version: '1.0.0',
  install(initializer, eventBus) {
    // 监听所有事件
    eventBus.on('store:changed', (data) => {
      console.log('状态变更:', data)
    })
  }
}

// 5. 注册插件
await pluginSystem.register(analyticsPlugin)

// 6. 创建自定义组件
const banner = new Banner({
  title: 'Welcome',
  subtitle: 'My Blog'
})

// 7. 注册组件
const registry = initializer.getComponentRegistry()
registry.register('banner', banner)

// 8. 初始化和渲染
registry.initAll()
registry.renderAll()

// 9. 监听主题变更
const themeManager = initializer.getThemeManager()
themeManager.onThemeChange((event) => {
  store.set('theme', event.newTheme.id)
})

// 10. 页面卸载时清理
window.addEventListener('beforeunload', () => {
  registry.destroyAll()
  themeManager.destroy()
})
```

## 最佳实践

1. **使用 Initializer**：让 Initializer 管理应用的初始化流程
2. **使用 EventBus**：通过事件系统实现组件间通信
3. **使用 Store**：集中管理应用状态
4. **使用 PluginSystem**：通过插件扩展应用功能
5. **及时清理**：在组件销毁时清理所有资源
6. **错误处理**：为所有异步操作添加错误处理
7. **调试模式**：在开发时启用 debug 模式

