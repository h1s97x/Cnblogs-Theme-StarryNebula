/**
 * BaseComponent - 组件基类
 * 
 * 所有组件都应该继承此基类，实现统一的生命周期管理
 */

export interface ComponentConfig {
  [key: string]: any
}

export interface ComponentLifecycle {
  onInit?(): void
  onRender?(): void
  onDestroy?(): void
  onUpdate?(config: ComponentConfig): void
}

/**
 * 组件基类
 * 
 * 提供统一的组件生命周期和接口
 */
export abstract class BaseComponent implements ComponentLifecycle {
  protected name: string
  protected config: ComponentConfig
  protected element: HTMLElement | null = null
  protected isInitialized: boolean = false
  protected isDestroyed: boolean = false

  constructor(name: string, config: ComponentConfig = {}) {
    this.name = name
    this.config = config
  }

  /**
   * 初始化组件
   * 
   * 调用此方法后，组件会执行初始化逻辑
   */
  public init(): void {
    if (this.isInitialized) {
      console.warn(`[${this.name}] Component already initialized`)
      return
    }

    if (this.isDestroyed) {
      console.warn(`[${this.name}] Cannot initialize destroyed component`)
      return
    }

    try {
      this.onInit?.()
      this.isInitialized = true
      console.log(`[${this.name}] Component initialized`)
    } catch (error) {
      console.error(`[${this.name}] Error during initialization:`, error)
      throw error
    }
  }

  /**
   * 渲染组件
   * 
   * 调用此方法后，组件会执行渲染逻辑
   */
  public render(): void {
    if (!this.isInitialized) {
      console.warn(`[${this.name}] Component not initialized, call init() first`)
      return
    }

    if (this.isDestroyed) {
      console.warn(`[${this.name}] Cannot render destroyed component`)
      return
    }

    try {
      this.onRender?.()
      console.log(`[${this.name}] Component rendered`)
    } catch (error) {
      console.error(`[${this.name}] Error during rendering:`, error)
      throw error
    }
  }

  /**
   * 更新组件配置
   * 
   * @param config - 新的配置对象
   */
  public update(config: ComponentConfig): void {
    if (!this.isInitialized) {
      console.warn(`[${this.name}] Component not initialized, call init() first`)
      return
    }

    if (this.isDestroyed) {
      console.warn(`[${this.name}] Cannot update destroyed component`)
      return
    }

    try {
      this.config = { ...this.config, ...config }
      this.onUpdate?.(config)
      console.log(`[${this.name}] Component updated`)
    } catch (error) {
      console.error(`[${this.name}] Error during update:`, error)
      throw error
    }
  }

  /**
   * 销毁组件
   * 
   * 调用此方法后，组件会执行清理逻辑
   */
  public destroy(): void {
    if (this.isDestroyed) {
      console.warn(`[${this.name}] Component already destroyed`)
      return
    }

    try {
      this.onDestroy?.()
      this.isDestroyed = true
      this.isInitialized = false
      this.element = null
      console.log(`[${this.name}] Component destroyed`)
    } catch (error) {
      console.error(`[${this.name}] Error during destruction:`, error)
      throw error
    }
  }

  /**
   * 获取组件名称
   */
  public getName(): string {
    return this.name
  }

  /**
   * 获取组件配置
   */
  public getConfig(): ComponentConfig {
    return { ...this.config }
  }

  /**
   * 获取组件元素
   */
  public getElement(): HTMLElement | null {
    return this.element
  }

  /**
   * 检查组件是否已初始化
   */
  public isInit(): boolean {
    return this.isInitialized
  }

  /**
   * 检查组件是否已销毁
   */
  public isDestroy(): boolean {
    return this.isDestroyed
  }

  /**
   * 设置组件元素
   * 
   * @param element - DOM 元素
   */
  protected setElement(element: HTMLElement): void {
    this.element = element
  }

  /**
   * 获取配置值
   * 
   * @param path - 配置路径，支持点号分隔
   * @param defaultValue - 默认值
   */
  protected getConfigValue(path: string, defaultValue?: any): any {
    const keys = path.split('.')
    let value: any = this.config

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return defaultValue
      }
    }

    return value
  }

  /**
   * 设置配置值
   * 
   * @param path - 配置路径，支持点号分隔
   * @param value - 新值
   */
  protected setConfigValue(path: string, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()

    if (!lastKey) return

    let target: any = this.config
    for (const key of keys) {
      if (!(key in target)) {
        target[key] = {}
      }
      target = target[key]
    }

    target[lastKey] = value
  }
}
