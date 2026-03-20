/**
 * LazyLoader - 懒加载系统
 * 
 * 支持按需加载组件和插件
 */

export interface LazyLoadOptions {
  timeout?: number
  retries?: number
  onProgress?: (loaded: number, total: number) => void
  onError?: (error: Error) => void
}

export interface LoadedModule {
  name: string
  module: any
  loadedAt: number
}

export class LazyLoader {
  private cache: Map<string, LoadedModule> = new Map()
  private loading: Map<string, Promise<any>> = new Map()
  private options: LazyLoadOptions

  constructor(options: LazyLoadOptions = {}) {
    this.options = {
      timeout: 10000,
      retries: 3,
      ...options,
    }
  }

  /**
   * 加载组件
   */
  public async loadComponent(name: string, path: string): Promise<any> {
    // 检查缓存
    if (this.cache.has(name)) {
      return this.cache.get(name)?.module
    }

    // 检查是否正在加载
    if (this.loading.has(name)) {
      return this.loading.get(name)
    }

    // 创建加载 Promise
    const loadPromise = this.performLoad(name, path)
    this.loading.set(name, loadPromise)

    try {
      const module = await loadPromise
      this.cache.set(name, {
        name,
        module,
        loadedAt: Date.now(),
      })
      return module
    } finally {
      this.loading.delete(name)
    }
  }

  /**
   * 加载插件
   */
  public async loadPlugin(name: string, path: string): Promise<any> {
    return this.loadComponent(name, path)
  }

  /**
   * 批量加载
   */
  public async loadMultiple(
    items: Array<{ name: string; path: string }>
  ): Promise<Map<string, any>> {
    const results = new Map<string, any>()
    const total = items.length
    let loaded = 0

    for (const item of items) {
      try {
        const module = await this.loadComponent(item.name, item.path)
        results.set(item.name, module)
        loaded++
        this.options.onProgress?.(loaded, total)
      } catch (error) {
        console.error(`Failed to load ${item.name}:`, error)
      }
    }

    return results
  }

  /**
   * 执行加载
   */
  private async performLoad(name: string, path: string): Promise<any> {
    let lastError: Error | null = null
    const retries = this.options.retries || 3

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await this.loadWithTimeout(path)
      } catch (error) {
        lastError = error as Error
        if (attempt < retries - 1) {
          // 指数退避
          await this.delay(Math.pow(2, attempt) * 100)
        }
      }
    }

    const error = new Error(
      `Failed to load ${name} after ${retries} attempts: ${lastError?.message}`
    )
    this.options.onError?.(error)
    throw error
  }

  /**
   * 带超时的加载
   */
  private loadWithTimeout(path: string): Promise<any> {
    return Promise.race([
      import(path),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Load timeout')),
          this.options.timeout
        )
      ),
    ])
  }

  /**
   * 延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 预加载
   */
  public async preload(items: Array<{ name: string; path: string }>): Promise<void> {
    await this.loadMultiple(items)
  }

  /**
   * 清除缓存
   */
  public clearCache(name?: string): void {
    if (name) {
      this.cache.delete(name)
    } else {
      this.cache.clear()
    }
  }

  /**
   * 获取缓存信息
   */
  public getCacheInfo(): LoadedModule[] {
    return Array.from(this.cache.values())
  }

  /**
   * 获取缓存大小
   */
  public getCacheSize(): number {
    return this.cache.size
  }

  /**
   * 检查是否已加载
   */
  public isLoaded(name: string): boolean {
    return this.cache.has(name)
  }

  /**
   * 获取加载时间
   */
  public getLoadTime(name: string): number | null {
    const item = this.cache.get(name)
    return item ? Date.now() - item.loadedAt : null
  }
}

// 全局懒加载器实例
export const globalLazyLoader = new LazyLoader()
