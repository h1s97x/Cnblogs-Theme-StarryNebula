/**
 * PluginSystem - 插件系统
 * 
 * 功能：
 * - 加载和管理插件
 * - 插件生命周期
 * - 插件间通信
 */

import { Initializer } from './Initializer'
import { EventBus } from './EventBus'

export interface Plugin {
  name: string
  version: string
  install(initializer: Initializer, eventBus: EventBus): void | Promise<void>
  uninstall?(): void | Promise<void>
}

/**
 * 插件系统
 */
export class PluginSystem {
  private plugins: Map<string, Plugin> = new Map()
  private initializer: Initializer
  private eventBus: EventBus
  private debug: boolean = false

  constructor(initializer: Initializer, eventBus: EventBus, debug: boolean = false) {
    this.initializer = initializer
    this.eventBus = eventBus
    this.debug = debug
  }

  /**
   * 注册插件
   * 
   * @param plugin - 插件对象
   */
  public async register(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`[PluginSystem] Plugin "${plugin.name}" already registered`)
    }

    try {
      this.log(`Registering plugin: ${plugin.name}@${plugin.version}`)
      await plugin.install(this.initializer, this.eventBus)
      this.plugins.set(plugin.name, plugin)
      this.log(`Plugin registered successfully: ${plugin.name}`)
      this.eventBus.emitSync('plugin:registered', { name: plugin.name, version: plugin.version })
    } catch (error) {
      console.error(`[PluginSystem] Failed to register plugin "${plugin.name}":`, error)
      throw error
    }
  }

  /**
   * 注销插件
   * 
   * @param name - 插件名称
   */
  public async unregister(name: string): Promise<void> {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      console.warn(`[PluginSystem] Plugin "${name}" not found`)
      return
    }

    try {
      this.log(`Unregistering plugin: ${name}`)
      if (plugin.uninstall) {
        await plugin.uninstall()
      }
      this.plugins.delete(name)
      this.log(`Plugin unregistered: ${name}`)
      this.eventBus.emitSync('plugin:unregistered', { name })
    } catch (error) {
      console.error(`[PluginSystem] Failed to unregister plugin "${name}":`, error)
      throw error
    }
  }

  /**
   * 获取插件
   * 
   * @param name - 插件名称
   */
  public get(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  /**
   * 获取所有插件
   */
  public getAll(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * 检查插件是否存在
   * 
   * @param name - 插件名称
   */
  public has(name: string): boolean {
    return this.plugins.has(name)
  }

  /**
   * 获取插件数量
   */
  public size(): number {
    return this.plugins.size
  }

  /**
   * 获取所有插件名称
   */
  public getNames(): string[] {
    return Array.from(this.plugins.keys())
  }

  /**
   * 打印插件信息
   */
  public printInfo(): void {
    console.log('[PluginSystem] Registered Plugins:')
    this.plugins.forEach((plugin) => {
      console.log(`  - ${plugin.name}@${plugin.version}`)
    })
  }

  /**
   * 打印日志
   */
  private log(message: string): void {
    if (this.debug) {
      console.log(`[PluginSystem] ${message}`)
    }
  }
}
