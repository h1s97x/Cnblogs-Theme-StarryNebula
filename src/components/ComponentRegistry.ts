/**
 * ComponentRegistry - 组件注册表
 * 
 * 管理所有组件的注册、注销和访问
 */

import { BaseComponent, ComponentConfig } from './BaseComponent'

export interface ComponentInfo {
  name: string
  component: BaseComponent
  createdAt: number
}

/**
 * 组件注册表
 * 
 * 用于管理应用中的所有组件
 */
export class ComponentRegistry {
  private components: Map<string, BaseComponent> = new Map()
  private componentInfo: Map<string, ComponentInfo> = new Map()

  /**
   * 注册组件
   * 
   * @param name - 组件名称（唯一标识）
   * @param component - 组件实例
   * @throws 如果组件名称已存在
   */
  public register(name: string, component: BaseComponent): void {
    if (this.components.has(name)) {
      throw new Error(`[ComponentRegistry] Component "${name}" already registered`)
    }

    if (!component) {
      throw new Error(`[ComponentRegistry] Component instance is required`)
    }

    this.components.set(name, component)
    this.componentInfo.set(name, {
      name,
      component,
      createdAt: Date.now(),
    })

    console.log(`[ComponentRegistry] Component "${name}" registered`)
  }

  /**
   * 注销组件
   * 
   * @param name - 组件名称
   */
  public unregister(name: string): void {
    const component = this.components.get(name)
    if (!component) {
      console.warn(`[ComponentRegistry] Component "${name}" not found`)
      return
    }

    // 销毁组件
    if (!component.isDestroy()) {
      component.destroy()
    }

    this.components.delete(name)
    this.componentInfo.delete(name)

    console.log(`[ComponentRegistry] Component "${name}" unregistered`)
  }

  /**
   * 获取组件
   * 
   * @param name - 组件名称
   * @returns 组件实例或 undefined
   */
  public get(name: string): BaseComponent | undefined {
    return this.components.get(name)
  }

  /**
   * 获取所有组件
   * 
   * @returns 所有组件实例数组
   */
  public getAll(): BaseComponent[] {
    return Array.from(this.components.values())
  }

  /**
   * 获取所有组件名称
   * 
   * @returns 所有组件名称数组
   */
  public getNames(): string[] {
    return Array.from(this.components.keys())
  }

  /**
   * 检查组件是否存在
   * 
   * @param name - 组件名称
   * @returns 是否存在
   */
  public has(name: string): boolean {
    return this.components.has(name)
  }

  /**
   * 获取组件数量
   * 
   * @returns 组件数量
   */
  public size(): number {
    return this.components.size
  }

  /**
   * 初始化所有组件
   */
  public initAll(): void {
    this.components.forEach((component, name) => {
      try {
        if (!component.isInit()) {
          component.init()
        }
      } catch (error) {
        console.error(`[ComponentRegistry] Error initializing component "${name}":`, error)
      }
    })
  }

  /**
   * 渲染所有组件
   */
  public renderAll(): void {
    this.components.forEach((component, name) => {
      try {
        if (component.isInit() && !component.isDestroy()) {
          component.render()
        }
      } catch (error) {
        console.error(`[ComponentRegistry] Error rendering component "${name}":`, error)
      }
    })
  }

  /**
   * 更新所有组件
   * 
   * @param config - 配置对象
   */
  public updateAll(config: ComponentConfig): void {
    this.components.forEach((component, name) => {
      try {
        if (component.isInit() && !component.isDestroy()) {
          component.update(config)
        }
      } catch (error) {
        console.error(`[ComponentRegistry] Error updating component "${name}":`, error)
      }
    })
  }

  /**
   * 销毁所有组件
   */
  public destroyAll(): void {
    this.components.forEach((component, name) => {
      try {
        if (!component.isDestroy()) {
          component.destroy()
        }
      } catch (error) {
        console.error(`[ComponentRegistry] Error destroying component "${name}":`, error)
      }
    })

    this.components.clear()
    this.componentInfo.clear()
  }

  /**
   * 获取组件信息
   * 
   * @param name - 组件名称
   * @returns 组件信息或 undefined
   */
  public getInfo(name: string): ComponentInfo | undefined {
    return this.componentInfo.get(name)
  }

  /**
   * 获取所有组件信息
   * 
   * @returns 所有组件信息数组
   */
  public getAllInfo(): ComponentInfo[] {
    return Array.from(this.componentInfo.values())
  }

  /**
   * 打印组件信息
   */
  public printInfo(): void {
    console.log('[ComponentRegistry] Registered components:')
    this.componentInfo.forEach((info) => {
      const component = info.component
      console.log(`  - ${info.name}`)
      console.log(`    - Initialized: ${component.isInit()}`)
      console.log(`    - Destroyed: ${component.isDestroy()}`)
      console.log(`    - Created at: ${new Date(info.createdAt).toLocaleString()}`)
    })
  }
}

// 全局组件注册表实例
export const globalRegistry = new ComponentRegistry()
