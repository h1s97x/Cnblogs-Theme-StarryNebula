/**
 * Notification - 通知组件
 * 
 * 功能：
 * - 通知显示
 * - 多种类型
 * - 自动关闭
 * - 队列管理
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  closable?: boolean
}

export interface NotificationConfig extends ComponentConfig {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  maxCount?: number
  duration?: number
}

export class Notification extends BaseComponent {
  private container: HTMLElement | null = null
  private notifications: Map<string, NotificationItem> = new Map()
  private queue: NotificationItem[] = []

  constructor(config: NotificationConfig = {}) {
    super('Notification', {
      position: 'top-right',
      maxCount: 5,
      duration: 3000,
      ...config,
    })
  }

  onInit(): void {
    this.createContainer()
  }

  onRender(): void {
    this.applyStyles()
  }

  onUpdate(config: NotificationConfig): void {
    this.config = { ...this.config, ...config }
  }

  onDestroy(): void {
    if (this.container) {
      this.container.remove()
    }
    this.container = null
    this.notifications.clear()
    this.queue = []
  }

  /**
   * 创建容器
   */
  private createContainer(): void {
    this.container = document.createElement('div')
    this.container.className = 'notification-container'
    document.body.appendChild(this.container)
    this.setElement(this.container)
  }

  /**
   * 显示通知
   */
  public show(
    type: NotificationType,
    title: string,
    message: string,
    duration?: number
  ): string {
    const id = `notification-${Date.now()}-${Math.random()}`
    const item: NotificationItem = {
      id,
      type,
      title,
      message,
      duration: duration ?? this.getConfigValue('duration', 3000),
      closable: true,
    }

    this.notifications.set(id, item)
    this.renderNotification(item)

    // 自动关闭
    if (item.duration && item.duration > 0) {
      setTimeout(() => {
        this.close(id)
      }, item.duration)
    }

    return id
  }

  /**
   * 成功通知
   */
  public success(title: string, message: string, duration?: number): string {
    return this.show('success', title, message, duration)
  }

  /**
   * 错误通知
   */
  public error(title: string, message: string, duration?: number): string {
    return this.show('error', title, message, duration)
  }

  /**
   * 警告通知
   */
  public warning(title: string, message: string, duration?: number): string {
    return this.show('warning', title, message, duration)
  }

  /**
   * 信息通知
   */
  public info(title: string, message: string, duration?: number): string {
    return this.show('info', title, message, duration)
  }

  /**
   * 渲染通知
   */
  private renderNotification(item: NotificationItem): void {
    if (!this.container) return

    const maxCount = this.getConfigValue('maxCount', 5)
    if (this.notifications.size > maxCount) {
      const firstKey = this.notifications.keys().next().value
      this.close(firstKey)
    }

    const notificationEl = document.createElement('div')
    notificationEl.className = `notification notification-${item.type}`
    notificationEl.id = item.id

    // 图标
    const icon = document.createElement('span')
    icon.className = 'notification-icon'
    icon.textContent = this.getIcon(item.type)
    notificationEl.appendChild(icon)

    // 内容
    const content = document.createElement('div')
    content.className = 'notification-content'

    const titleEl = document.createElement('div')
    titleEl.className = 'notification-title'
    titleEl.textContent = item.title
    content.appendChild(titleEl)

    const messageEl = document.createElement('div')
    messageEl.className = 'notification-message'
    messageEl.textContent = item.message
    content.appendChild(messageEl)

    notificationEl.appendChild(content)

    // 关闭按钮
    if (item.closable) {
      const closeBtn = document.createElement('button')
      closeBtn.className = 'notification-close'
      closeBtn.textContent = '×'
      closeBtn.addEventListener('click', () => this.close(item.id))
      notificationEl.appendChild(closeBtn)
    }

    this.container.appendChild(notificationEl)
  }

  /**
   * 获取图标
   */
  private getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    }
    return icons[type]
  }

  /**
   * 关闭通知
   */
  public close(id: string): void {
    const element = document.getElementById(id)
    if (element) {
      element.style.animation = 'notificationOut 0.3s ease-out'
      setTimeout(() => {
        element.remove()
      }, 300)
    }
    this.notifications.delete(id)
  }

  /**
   * 关闭所有通知
   */
  public closeAll(): void {
    for (const id of this.notifications.keys()) {
      this.close(id)
    }
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.container) return

    const position = this.getConfigValue('position', 'top-right')

    this.container.style.position = 'fixed'
    this.container.style.zIndex = '9998'
    this.container.style.pointerEvents = 'none'

    const [vertical, horizontal] = position.split('-')

    if (vertical === 'top') {
      this.container.style.top = '20px'
    } else {
      this.container.style.bottom = '20px'
    }

    if (horizontal === 'left') {
      this.container.style.left = '20px'
    } else {
      this.container.style.right = '20px'
    }

    this.container.style.display = 'flex'
    this.container.style.flexDirection = 'column'
    this.container.style.gap = '10px'
    this.container.style.maxWidth = '400px'

    // 通知样式
    const notifications = this.container.querySelectorAll('.notification')
    notifications.forEach((notif) => {
      const el = notif as HTMLElement
      el.style.pointerEvents = 'auto'
      el.style.padding = '16px'
      el.style.borderRadius = '4px'
      el.style.display = 'flex'
      el.style.alignItems = 'flex-start'
      el.style.gap = '12px'
      el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
      el.style.animation = 'notificationIn 0.3s ease-out'

      // 根据类型设置颜色
      if (el.classList.contains('notification-success')) {
        el.style.backgroundColor = '#f6ffed'
        el.style.borderLeft = '4px solid #52c41a'
      } else if (el.classList.contains('notification-error')) {
        el.style.backgroundColor = '#fff1f0'
        el.style.borderLeft = '4px solid #ff4d4f'
      } else if (el.classList.contains('notification-warning')) {
        el.style.backgroundColor = '#fffbe6'
        el.style.borderLeft = '4px solid #faad14'
      } else if (el.classList.contains('notification-info')) {
        el.style.backgroundColor = '#e6f7ff'
        el.style.borderLeft = '4px solid #1890ff'
      }

      // 图标样式
      const icon = el.querySelector('.notification-icon') as HTMLElement
      if (icon) {
        icon.style.fontSize = '18px'
        icon.style.fontWeight = 'bold'
        icon.style.minWidth = '20px'
      }

      // 内容样式
      const content = el.querySelector('.notification-content') as HTMLElement
      if (content) {
        content.style.flex = '1'
      }

      // 标题样式
      const title = el.querySelector('.notification-title') as HTMLElement
      if (title) {
        title.style.fontWeight = 'bold'
        title.style.marginBottom = '4px'
      }

      // 消息样式
      const message = el.querySelector('.notification-message') as HTMLElement
      if (message) {
        message.style.fontSize = '14px'
        message.style.opacity = '0.85'
      }

      // 关闭按钮样式
      const closeBtn = el.querySelector('.notification-close') as HTMLElement
      if (closeBtn) {
        closeBtn.style.background = 'none'
        closeBtn.style.border = 'none'
        closeBtn.style.fontSize = '20px'
        closeBtn.style.cursor = 'pointer'
        closeBtn.style.opacity = '0.5'
        closeBtn.style.transition = 'opacity 0.2s'
        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.opacity = '1'
        })
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.opacity = '0.5'
        })
      }
    })
  }

  /**
   * 获取通知数量
   */
  public getCount(): number {
    return this.notifications.size
  }

  /**
   * 获取所有通知
   */
  public getAll(): NotificationItem[] {
    return Array.from(this.notifications.values())
  }
}
