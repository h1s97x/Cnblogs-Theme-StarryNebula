/**
 * Lifecycle - 生命周期钩子系统
 * 
 * 功能：
 * - 提供页面加载的各个阶段钩子
 * - 支持钩子注册和执行
 * 
 * 使用示例：
 * ```typescript
 * import { onBeforeLoad, onAfterLoad } from '../hooks/lifecycle'
 * 
 * onBeforeLoad(() => {
 *   console.log('页面加载前')
 * })
 * 
 * onAfterLoad(() => {
 *   console.log('页面加载后')
 * })
 * ```
 */

/** 钩子回调类型 */
type HookCallback = () => void | Promise<void>

/** 钩子管理器 */
class HookManager {
  private hooks: Map<string, HookCallback[]> = new Map()

  /**
   * 注册钩子
   * @param name - 钩子名称
   * @param callback - 回调函数
   */
  register(name: string, callback: HookCallback): void {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, [])
    }
    this.hooks.get(name)!.push(callback)
  }

  /**
   * 执行钩子
   * @param name - 钩子名称
   */
  async execute(name: string): Promise<void> {
    const callbacks = this.hooks.get(name) || []
    for (const callback of callbacks) {
      try {
        await callback()
      } catch (error) {
        console.error(`Error in hook ${name}:`, error)
      }
    }
  }

  /**
   * 清除钩子
   * @param name - 钩子名称
   */
  clear(name: string): void {
    this.hooks.delete(name)
  }

  /**
   * 清除所有钩子
   */
  clearAll(): void {
    this.hooks.clear()
  }
}

/** 全局钩子管理器实例 */
const hookManager = new HookManager()

/**
 * 页面加载前钩子
 * @param callback - 回调函数
 */
export function onBeforeLoad(callback: HookCallback): void {
  hookManager.register('beforeLoad', callback)
}

/**
 * 页面加载后钩子
 * @param callback - 回调函数
 */
export function onAfterLoad(callback: HookCallback): void {
  hookManager.register('afterLoad', callback)
}

/**
 * 页面渲染前钩子
 * @param callback - 回调函数
 */
export function onBeforeRender(callback: HookCallback): void {
  hookManager.register('beforeRender', callback)
}

/**
 * 页面渲染后钩子
 * @param callback - 回调函数
 */
export function onAfterRender(callback: HookCallback): void {
  hookManager.register('afterRender', callback)
}

/**
 * 页面卸载前钩子
 * @param callback - 回调函数
 */
export function onBeforeUnload(callback: HookCallback): void {
  hookManager.register('beforeUnload', callback)
}

/**
 * 执行所有钩子
 * @param name - 钩子名称
 */
export async function executeHook(name: string): Promise<void> {
  await hookManager.execute(name)
}

/**
 * 清除钩子
 * @param name - 钩子名称
 */
export function clearHook(name: string): void {
  hookManager.clear(name)
}

/**
 * 清除所有钩子
 */
export function clearAllHooks(): void {
  hookManager.clearAll()
}
