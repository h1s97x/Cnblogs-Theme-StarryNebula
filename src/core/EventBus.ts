/**
 * EventBus - 事件总线
 * 
 * 功能：
 * - 组件间通信
 * - 事件发布/订阅
 * - 事件优先级
 */

export type EventHandler = (data?: any) => void | Promise<void>

export interface EventListener {
  handler: EventHandler
  priority: number
  once: boolean
}

/**
 * 事件总线
 */
export class EventBus {
  private events: Map<string, EventListener[]> = new Map()
  private debug: boolean = false

  constructor(debug: boolean = false) {
    this.debug = debug
  }

  /**
   * 订阅事件
   * 
   * @param event - 事件名称
   * @param handler - 事件处理函数
   * @param priority - 优先级（数字越大优先级越高）
   */
  public on(event: string, handler: EventHandler, priority: number = 0): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    const listener: EventListener = { handler, priority, once: false }
    const listeners = this.events.get(event)!

    // 按优先级插入
    let inserted = false
    for (let i = 0; i < listeners.length; i++) {
      if (priority > listeners[i].priority) {
        listeners.splice(i, 0, listener)
        inserted = true
        break
      }
    }

    if (!inserted) {
      listeners.push(listener)
    }

    this.log(`Event listener registered: ${event}`)

    // 返回取消订阅函数
    return () => {
      this.off(event, handler)
    }
  }

  /**
   * 订阅一次性事件
   * 
   * @param event - 事件名称
   * @param handler - 事件处理函数
   * @param priority - 优先级
   */
  public once(event: string, handler: EventHandler, priority: number = 0): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    const listener: EventListener = { handler, priority, once: true }
    const listeners = this.events.get(event)!

    // 按优先级插入
    let inserted = false
    for (let i = 0; i < listeners.length; i++) {
      if (priority > listeners[i].priority) {
        listeners.splice(i, 0, listener)
        inserted = true
        break
      }
    }

    if (!inserted) {
      listeners.push(listener)
    }

    this.log(`One-time event listener registered: ${event}`)

    // 返回取消订阅函数
    return () => {
      this.off(event, handler)
    }
  }

  /**
   * 取消订阅事件
   * 
   * @param event - 事件名称
   * @param handler - 事件处理函数
   */
  public off(event: string, handler: EventHandler): void {
    const listeners = this.events.get(event)
    if (!listeners) return

    const index = listeners.findIndex((l) => l.handler === handler)
    if (index !== -1) {
      listeners.splice(index, 1)
      this.log(`Event listener removed: ${event}`)
    }

    if (listeners.length === 0) {
      this.events.delete(event)
    }
  }

  /**
   * 取消订阅所有事件
   * 
   * @param event - 事件名称（可选）
   */
  public offAll(event?: string): void {
    if (event) {
      this.events.delete(event)
      this.log(`All listeners removed for event: ${event}`)
    } else {
      this.events.clear()
      this.log('All event listeners cleared')
    }
  }

  /**
   * 发布事件
   * 
   * @param event - 事件名称
   * @param data - 事件数据
   */
  public async emit(event: string, data?: any): Promise<void> {
    const listeners = this.events.get(event)
    if (!listeners || listeners.length === 0) {
      this.log(`No listeners for event: ${event}`)
      return
    }

    this.log(`Emitting event: ${event}`)

    const onceListeners: EventListener[] = []

    for (const listener of listeners) {
      try {
        await listener.handler(data)
        if (listener.once) {
          onceListeners.push(listener)
        }
      } catch (error) {
        console.error(`[EventBus] Error in event handler for "${event}":`, error)
      }
    }

    // 移除一次性监听器
    onceListeners.forEach((listener) => {
      this.off(event, listener.handler)
    })
  }

  /**
   * 同步发布事件
   * 
   * @param event - 事件名称
   * @param data - 事件数据
   */
  public emitSync(event: string, data?: any): void {
    const listeners = this.events.get(event)
    if (!listeners || listeners.length === 0) {
      this.log(`No listeners for event: ${event}`)
      return
    }

    this.log(`Emitting event (sync): ${event}`)

    const onceListeners: EventListener[] = []

    for (const listener of listeners) {
      try {
        listener.handler(data)
        if (listener.once) {
          onceListeners.push(listener)
        }
      } catch (error) {
        console.error(`[EventBus] Error in event handler for "${event}":`, error)
      }
    }

    // 移除一次性监听器
    onceListeners.forEach((listener) => {
      this.off(event, listener.handler)
    })
  }

  /**
   * 检查是否有监听器
   * 
   * @param event - 事件名称
   */
  public has(event: string): boolean {
    return this.events.has(event) && this.events.get(event)!.length > 0
  }

  /**
   * 获取事件监听器数量
   * 
   * @param event - 事件名称
   */
  public listenerCount(event: string): number {
    return this.events.get(event)?.length || 0
  }

  /**
   * 获取所有事件名称
   */
  public eventNames(): string[] {
    return Array.from(this.events.keys())
  }

  /**
   * 打印事件信息
   */
  public printInfo(): void {
    console.log('[EventBus] Event Information:')
    this.events.forEach((listeners, event) => {
      console.log(`  - ${event}: ${listeners.length} listener(s)`)
    })
  }

  /**
   * 打印日志
   */
  private log(message: string): void {
    if (this.debug) {
      console.log(`[EventBus] ${message}`)
    }
  }
}

// 全局事件总线实例
export const globalEventBus = new EventBus()
