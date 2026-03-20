/**
 * Store - 状态管理系统
 * 
 * 功能：
 * - 集中管理应用状态
 * - 状态变更通知
 * - 状态持久化
 */

import { EventBus } from './EventBus'

export interface StoreState {
  [key: string]: any
}

export interface StoreOptions {
  debug?: boolean
  persist?: boolean
  persistKey?: string
}

/**
 * 状态管理器
 */
export class Store {
  private state: StoreState = {}
  private eventBus: EventBus
  private options: Required<StoreOptions>
  private watchers: Map<string, Set<(value: any) => void>> = new Map()

  constructor(initialState: StoreState = {}, eventBus?: EventBus, options: StoreOptions = {}) {
    this.state = { ...initialState }
    this.eventBus = eventBus || new EventBus()
    this.options = {
      debug: options.debug || false,
      persist: options.persist || false,
      persistKey: options.persistKey || 'app-store',
    }

    if (this.options.persist) {
      this.loadFromStorage()
    }
  }

  /**
   * 获取状态值
   * 
   * @param path - 状态路径，支持点号分隔
   * @param defaultValue - 默认值
   */
  public get(path: string, defaultValue?: any): any {
    const keys = path.split('.')
    let value: any = this.state

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
   * 设置状态值
   * 
   * @param path - 状态路径，支持点号分隔
   * @param value - 新值
   */
  public set(path: string, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()

    if (!lastKey) return

    let target: any = this.state
    for (const key of keys) {
      if (!(key in target)) {
        target[key] = {}
      }
      target = target[key]
    }

    const oldValue = target[lastKey]
    target[lastKey] = value

    this.log(`State updated: ${path}`)

    // 触发观察者
    this.notifyWatchers(path, value)

    // 发布事件
    this.eventBus.emitSync('store:changed', {
      path,
      oldValue,
      newValue: value,
    })

    // 持久化
    if (this.options.persist) {
      this.saveToStorage()
    }
  }

  /**
   * 批量更新状态
   * 
   * @param updates - 更新对象
   */
  public update(updates: StoreState): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.set(key, value)
    })
  }

  /**
   * 获取完整状态
   */
  public getState(): StoreState {
    return { ...this.state }
  }

  /**
   * 设置完整状态
   * 
   * @param state - 新状态
   */
  public setState(state: StoreState): void {
    this.state = { ...state }
    this.log('State replaced')

    this.eventBus.emitSync('store:replaced', { state })

    if (this.options.persist) {
      this.saveToStorage()
    }
  }

  /**
   * 重置状态
   * 
   * @param initialState - 初始状态
   */
  public reset(initialState: StoreState = {}): void {
    this.state = { ...initialState }
    this.log('State reset')

    this.eventBus.emitSync('store:reset', { state: this.state })

    if (this.options.persist) {
      this.saveToStorage()
    }
  }

  /**
   * 监听状态变更
   * 
   * @param path - 状态路径
   * @param callback - 回调函数
   */
  public watch(path: string, callback: (value: any) => void): () => void {
    if (!this.watchers.has(path)) {
      this.watchers.set(path, new Set())
    }

    this.watchers.get(path)!.add(callback)

    this.log(`Watcher registered: ${path}`)

    // 返回取消监听函数
    return () => {
      this.watchers.get(path)?.delete(callback)
    }
  }

  /**
   * 触发观察者
   */
  private notifyWatchers(path: string, value: any): void {
    const watchers = this.watchers.get(path)
    if (watchers) {
      watchers.forEach((callback) => {
        try {
          callback(value)
        } catch (error) {
          console.error(`[Store] Error in watcher for "${path}":`, error)
        }
      })
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.options.persistKey, JSON.stringify(this.state))
      this.log('State saved to storage')
    } catch (error) {
      console.warn('[Store] Failed to save state to storage:', error)
    }
  }

  /**
   * 从本地存储加载
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.options.persistKey)
      if (stored) {
        this.state = JSON.parse(stored)
        this.log('State loaded from storage')
      }
    } catch (error) {
      console.warn('[Store] Failed to load state from storage:', error)
    }
  }

  /**
   * 清除本地存储
   */
  public clearStorage(): void {
    try {
      localStorage.removeItem(this.options.persistKey)
      this.log('Storage cleared')
    } catch (error) {
      console.warn('[Store] Failed to clear storage:', error)
    }
  }

  /**
   * 打印状态信息
   */
  public printInfo(): void {
    console.log('[Store] Current State:')
    console.log(this.state)
  }

  /**
   * 打印日志
   */
  private log(message: string): void {
    if (this.options.debug) {
      console.log(`[Store] ${message}`)
    }
  }
}

// 全局状态管理器实例
export let globalStore: Store | null = null

/**
 * 创建全局状态管理器
 */
export function createStore(initialState?: StoreState, eventBus?: EventBus, options?: StoreOptions): Store {
  globalStore = new Store(initialState, eventBus, options)
  return globalStore
}

/**
 * 获取全局状态管理器
 */
export function getStore(): Store | null {
  return globalStore
}
