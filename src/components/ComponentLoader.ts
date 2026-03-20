/**
 * ComponentLoader - 组件加载器
 * 
 * 简化组件的动态导入和管理
 */

import { BaseComponent } from './BaseComponent'
import { LazyLoader } from '../core/LazyLoader'

export interface ComponentLoaderOptions {
  timeout?: number
  retries?: number
  autoCache?: boolean
}

export class ComponentLoader {
  private lazyLoader: LazyLoader
  private componentMap: Map<string, string> = new Map()

  constructor(options: ComponentLoaderOptions = {}) {
    this.lazyLoader = new LazyLoader({
      timeout: options.timeout || 10000,
      retries: options.retries || 3,
    })

    this.registerBuiltInComponents()
  }

  /**
   * 注册内置组件
   */
  private registerBuiltInComponents(): void {
    // 注册所有内置组件的路径
    const components = [
      { name: 'Banner', path: './Banner' },
      { name: 'Sidebar', path: './Sidebar' },
      { name: 'TOC', path: './TOC' },
      { name: 'Search', path: './Search' },
      { name: 'Pagination', path: './Pagination' },
      { name: 'Comment', path: './Comment' },
      { name: 'Share', path: './Share' },
    ]

    components.forEach(({ name, path }) => {
      this.registerComponent(name, path)
    })
  }

  /**
   * 注册组件
   */
  public registerComponent(name: string, path: string): void {
    this.componentMap.set(name, path)
  }

  /**
   * 加载组件
   */
  public async loadComponent(name: string): Promise<typeof BaseComponent | null> {
    const path = this.componentMap.get(name)
    if (!path) {
      console.warn(`Component "${name}" not registered`)
      return null
    }

    try {
      const module = await this.lazyLoader.loadComponent(name, path)
      return module[name] || module.default
    } catch (error) {
      console.error(`Failed to load component "${name}":`, error)
      return null
    }
  }

  /**
   * 加载多个组件
   */
  public async loadComponents(names: string[]): Promise<Map<string, typeof BaseComponent>> {
    const results = new Map<string, typeof BaseComponent>()

    for (const name of names) {
      const component = await this.loadComponent(name)
      if (component) {
        results.set(name, component)
      }
    }

    return results
  }

  /**
   * 预加载组件
   */
  public async preloadComponents(names: string[]): Promise<void> {
    const items = names
      .map((name) => ({
        name,
        path: this.componentMap.get(name),
      }))
      .filter((item) => item.path !== undefined) as Array<{
      name: string
      path: string
    }>

    await this.lazyLoader.preload(items)
  }

  /**
   * 创建组件实例
   */
  public async createComponent(
    name: string,
    config?: any
  ): Promise<BaseComponent | null> {
    const ComponentClass = await this.loadComponent(name)
    if (!ComponentClass) {
      return null
    }

    try {
      return new ComponentClass(config)
    } catch (error) {
      console.error(`Failed to create component "${name}":`, error)
      return null
    }
  }

  /**
   * 批量创建组件
   */
  public async createComponents(
    items: Array<{ name: string; config?: any }>
  ): Promise<Map<string, BaseComponent>> {
    const results = new Map<string, BaseComponent>()

    for (const item of items) {
      const component = await this.createComponent(item.name, item.config)
      if (component) {
        results.set(item.name, component)
      }
    }

    return results
  }

  /**
   * 获取已注册的组件列表
   */
  public getRegisteredComponents(): string[] {
    return Array.from(this.componentMap.keys())
  }

  /**
   * 检查组件是否已加载
   */
  public isComponentLoaded(name: string): boolean {
    return this.lazyLoader.isLoaded(name)
  }

  /**
   * 清除组件缓存
   */
  public clearComponentCache(name?: string): void {
    this.lazyLoader.clearCache(name)
  }

  /**
   * 获取缓存信息
   */
  public getCacheInfo(): any[] {
    return this.lazyLoader.getCacheInfo()
  }

  /**
   * 获取缓存大小
   */
  public getCacheSize(): number {
    return this.lazyLoader.getCacheSize()
  }
}

// 全局组件加载器实例
export const globalComponentLoader = new ComponentLoader()
