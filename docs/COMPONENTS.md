# 组件系统文档

## 概述

StarryNebula v2.2.0 引入了完整的组件系统，提供了组件基类、注册表和生命周期管理。开发者可以轻松创建和管理自定义组件。

---

## 核心概念

### 组件生命周期

每个组件都遵循以下生命周期：

```
创建 → 初始化 → 渲染 → 更新 → 销毁
```

### 组件状态

- **未初始化**：组件已创建但未调用 `init()`
- **已初始化**：组件已调用 `init()`，可以进行渲染和更新
- **已销毁**：组件已调用 `destroy()`，无法再使用

---

## BaseComponent 基类

### 概述

`BaseComponent` 是所有组件的基类，提供统一的接口和生命周期管理。

### 继承 BaseComponent

```typescript
import { BaseComponent, ComponentConfig, ComponentLifecycle } from 'src/components'

class MyComponent extends BaseComponent {
  constructor(config: ComponentConfig = {}) {
    super('MyComponent', config)
  }

  // 实现生命周期方法
  onInit(): void {
    console.log('Component initialized')
  }

  onRender(): void {
    console.log('Component rendered')
  }

  onUpdate(config: ComponentConfig): void {
    console.log('Component updated with config:', config)
  }

  onDestroy(): void {
    console.log('Component destroyed')
  }
}
```

### 生命周期方法

#### onInit()

在组件初始化时调用，用于设置初始状态和事件监听。

```typescript
onInit(): void {
  // 初始化逻辑
  this.setupEventListeners()
  this.initializeState()
}
```

#### onRender()

在组件渲染时调用，用于更新 DOM。

```typescript
onRender(): void {
  // 渲染逻辑
  this.updateDOM()
  this.applyStyles()
}
```

#### onUpdate(config)

在组件配置更新时调用。

```typescript
onUpdate(config: ComponentConfig): void {
  // 更新逻辑
  this.updateConfig(config)
  this.rerender()
}
```

#### onDestroy()

在组件销毁时调用，用于清理资源。

```typescript
onDestroy(): void {
  // 清理逻辑
  this.removeEventListeners()
  this.clearState()
}
```

### 公共方法

#### init()

初始化组件。

```typescript
const component = new MyComponent()
component.init()
```

#### render()

渲染组件。

```typescript
component.render()
```

#### update(config)

更新组件配置。

```typescript
component.update({ color: 'red', size: 20 })
```

#### destroy()

销毁组件。

```typescript
component.destroy()
```

#### getConfig()

获取组件配置。

```typescript
const config = component.getConfig()
```

#### getConfigValue(path, defaultValue)

获取配置值，支持点号路径。

```typescript
const color = component.getConfigValue('colors.primary', '#000000')
```

#### setConfigValue(path, value)

设置配置值，支持点号路径。

```typescript
component.setConfigValue('colors.primary', '#ff0000')
```

#### isInit()

检查组件是否已初始化。

```typescript
if (component.isInit()) {
  console.log('Component is initialized')
}
```

#### isDestroy()

检查组件是否已销毁。

```typescript
if (component.isDestroy()) {
  console.log('Component is destroyed')
}
```

---

## ComponentRegistry 注册表

### 概述

`ComponentRegistry` 用于管理应用中的所有组件，提供注册、注销、查询等功能。

### 使用注册表

```typescript
import { ComponentRegistry } from 'src/components'

const registry = new ComponentRegistry()

// 注册组件
const component = new MyComponent()
registry.register('myComponent', component)

// 获取组件
const retrieved = registry.get('myComponent')

// 初始化所有组件
registry.initAll()

// 渲染所有组件
registry.renderAll()

// 销毁所有组件
registry.destroyAll()
```

### 公共方法

#### register(name, component)

注册组件。

```typescript
registry.register('starfield', new Starfield())
registry.register('cursor', new Cursor())
```

#### unregister(name)

注销组件。

```typescript
registry.unregister('starfield')
```

#### get(name)

获取组件。

```typescript
const component = registry.get('starfield')
```

#### getAll()

获取所有组件。

```typescript
const components = registry.getAll()
```

#### getNames()

获取所有组件名称。

```typescript
const names = registry.getNames()
console.log(names) // ['starfield', 'cursor', ...]
```

#### has(name)

检查组件是否存在。

```typescript
if (registry.has('starfield')) {
  console.log('Starfield component exists')
}
```

#### size()

获取组件数量。

```typescript
const count = registry.size()
```

#### initAll()

初始化所有组件。

```typescript
registry.initAll()
```

#### renderAll()

渲染所有组件。

```typescript
registry.renderAll()
```

#### updateAll(config)

更新所有组件。

```typescript
registry.updateAll({ theme: 'dark' })
```

#### destroyAll()

销毁所有组件。

```typescript
registry.destroyAll()
```

#### getInfo(name)

获取组件信息。

```typescript
const info = registry.getInfo('starfield')
console.log(info.createdAt)
```

#### getAllInfo()

获取所有组件信息。

```typescript
const infos = registry.getAllInfo()
```

#### printInfo()

打印组件信息。

```typescript
registry.printInfo()
```

---

## PageManager 页面管理器

### 概述

`PageManager` 用于检测页面类型、管理页面配置和提供页面相关的工具方法。

### 使用页面管理器

```typescript
import { PageManager } from 'src/pages'

// 检测页面类型
const pageType = PageManager.detectPageType()

// 创建页面管理器
const pageManager = new PageManager(pageType)

// 获取页面类型
console.log(pageManager.getPageType())

// 获取页面标题
console.log(pageManager.getPageTitle())
```

### 页面类型

支持以下页面类型：

- **home** - 首页
- **article** - 文章页
- **category** - 分类页
- **tag** - 标签页
- **archive** - 归档页
- **search** - 搜索页
- **user** - 用户页
- **unknown** - 未知页面

### 公共方法

#### detectPageType()

检测页面类型。

```typescript
const pageType = PageManager.detectPageType()
```

#### getPageType()

获取页面类型。

```typescript
const type = pageManager.getPageType()
```

#### getPageConfig()

获取页面配置。

```typescript
const config = pageManager.getPageConfig()
```

#### setPageConfig(config)

设置页面配置。

```typescript
pageManager.setPageConfig({ banner: true, sidebar: true })
```

#### getConfigValue(path, defaultValue)

获取配置值。

```typescript
const bannerEnabled = pageManager.getConfigValue('banner', false)
```

#### isPageEnabled(name)

检查页面是否启用。

```typescript
if (pageManager.isPageEnabled('banner')) {
  console.log('Banner is enabled')
}
```

#### 页面类型检查方法

```typescript
pageManager.isHome()      // 检查是否为首页
pageManager.isArticle()   // 检查是否为文章页
pageManager.isCategory()  // 检查是否为分类页
pageManager.isTag()       // 检查是否为标签页
pageManager.isArchive()   // 检查是否为归档页
pageManager.isSearch()    // 检查是否为搜索页
pageManager.isUser()      // 检查是否为用户页
```

#### getPageTitle()

获取页面标题。

```typescript
const title = pageManager.getPageTitle()
```

#### getPageDescription()

获取页面描述。

```typescript
const desc = pageManager.getPageDescription()
```

#### getPageUrl()

获取页面 URL。

```typescript
const url = pageManager.getPageUrl()
```

#### getPagePath()

获取页面路径。

```typescript
const path = pageManager.getPagePath()
```

#### getQueryParam(key)

获取查询参数。

```typescript
const keyword = pageManager.getQueryParam('q')
```

#### getAllQueryParams()

获取所有查询参数。

```typescript
const params = pageManager.getAllQueryParams()
```

#### printInfo()

打印页面信息。

```typescript
pageManager.printInfo()
```

---

## 实际示例

### 创建自定义组件

```typescript
import { BaseComponent, ComponentConfig } from 'src/components'

class BannerComponent extends BaseComponent {
  private bannerElement: HTMLElement | null = null

  constructor(config: ComponentConfig = {}) {
    super('Banner', {
      title: 'Welcome',
      subtitle: 'My Blog',
      backgroundImage: '',
      ...config,
    })
  }

  onInit(): void {
    this.createBannerElement()
    this.setupEventListeners()
  }

  onRender(): void {
    this.updateBannerContent()
    this.applyStyles()
  }

  onUpdate(config: ComponentConfig): void {
    this.config = { ...this.config, ...config }
    this.updateBannerContent()
  }

  onDestroy(): void {
    this.removeEventListeners()
    if (this.bannerElement) {
      this.bannerElement.remove()
    }
  }

  private createBannerElement(): void {
    this.bannerElement = document.createElement('div')
    this.bannerElement.className = 'banner'
    document.body.insertBefore(this.bannerElement, document.body.firstChild)
    this.setElement(this.bannerElement)
  }

  private updateBannerContent(): void {
    if (!this.bannerElement) return

    const title = this.getConfigValue('title', 'Welcome')
    const subtitle = this.getConfigValue('subtitle', '')

    this.bannerElement.innerHTML = `
      <h1>${title}</h1>
      <p>${subtitle}</p>
    `
  }

  private applyStyles(): void {
    if (!this.bannerElement) return

    const bgImage = this.getConfigValue('backgroundImage', '')
    if (bgImage) {
      this.bannerElement.style.backgroundImage = `url(${bgImage})`
    }
  }

  private setupEventListeners(): void {
    // 添加事件监听
  }

  private removeEventListeners(): void {
    // 移除事件监听
  }
}
```

### 使用组件注册表

```typescript
import { ComponentRegistry } from 'src/components'
import { Starfield } from 'src/scripts/starfield'
import { Cursor } from 'src/scripts/cursor'
import { BannerComponent } from './components/BannerComponent'

const registry = new ComponentRegistry()

// 注册组件
registry.register('starfield', new Starfield(canvas, config))
registry.register('cursor', new Cursor(config))
registry.register('banner', new BannerComponent(config))

// 初始化所有组件
registry.initAll()

// 渲染所有组件
registry.renderAll()

// 监听主题变更，更新所有组件
window.themeManager.onThemeChange(() => {
  registry.updateAll({ theme: window.themeManager.getTheme() })
})

// 页面卸载时销毁所有组件
window.addEventListener('beforeunload', () => {
  registry.destroyAll()
})
```

### 使用页面管理器

```typescript
import { PageManager } from 'src/pages'

// 检测页面类型
const pageType = PageManager.detectPageType()
const pageManager = new PageManager(pageType)

// 根据页面类型加载不同的配置
if (pageManager.isHome()) {
  // 首页特定逻辑
  loadHomeConfig()
} else if (pageManager.isArticle()) {
  // 文章页特定逻辑
  loadArticleConfig()
}

// 获取查询参数
const keyword = pageManager.getQueryParam('q')
if (keyword) {
  performSearch(keyword)
}

// 打印页面信息
pageManager.printInfo()
```

---

## 最佳实践

1. **继承 BaseComponent**：所有组件都应该继承 BaseComponent
2. **实现生命周期方法**：根据需要实现 onInit、onRender、onUpdate、onDestroy
3. **使用注册表**：通过 ComponentRegistry 管理所有组件
4. **错误处理**：在生命周期方法中添加适当的错误处理
5. **资源清理**：在 onDestroy 中清理所有资源
6. **配置管理**：使用 getConfigValue 和 setConfigValue 管理配置
7. **页面检测**：使用 PageManager 检测页面类型并加载相应配置

---

## 常见问题

### Q: 如何创建一个简单的组件？

A: 继承 BaseComponent 并实现必要的生命周期方法：

```typescript
class SimpleComponent extends BaseComponent {
  onInit(): void {
    console.log('Initialized')
  }

  onRender(): void {
    console.log('Rendered')
  }

  onDestroy(): void {
    console.log('Destroyed')
  }
}
```

### Q: 如何在组件之间通信？

A: 通过注册表获取其他组件并调用其方法：

```typescript
const otherComponent = registry.get('otherComponent')
if (otherComponent) {
  otherComponent.update({ data: 'new value' })
}
```

### Q: 如何处理组件错误？

A: BaseComponent 会自动捕获生命周期方法中的错误并打印到控制台。

### Q: 如何在不同页面加载不同的组件？

A: 使用 PageManager 检测页面类型，然后有条件地注册组件：

```typescript
const pageManager = new PageManager(PageManager.detectPageType())

if (pageManager.isHome()) {
  registry.register('banner', new BannerComponent())
}
```

---

## API 参考

### BaseComponent

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

### ComponentRegistry

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

### PageManager

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

