/**
 * Sidebar - 侧边栏组件
 * 
 * 功能：
 * - 显示用户信息
 * - 显示分类和标签
 * - 显示最新文章
 * - 支持自定义小组件
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface SidebarWidget {
  id: string
  title: string
  content: string | HTMLElement
  type?: 'text' | 'html' | 'custom'
}

export interface SidebarConfig extends ComponentConfig {
  widgets?: SidebarWidget[]
  position?: 'left' | 'right'
  width?: number
  collapsible?: boolean
}

export class Sidebar extends BaseComponent {
  private sidebarElement: HTMLElement | null = null
  private widgets: Map<string, SidebarWidget> = new Map()

  constructor(config: SidebarConfig = {}) {
    super('Sidebar', {
      widgets: [],
      position: 'right',
      width: 300,
      collapsible: false,
      ...config,
    })

    const widgets = this.getConfigValue('widgets', [])
    widgets.forEach((widget: SidebarWidget) => {
      this.widgets.set(widget.id, widget)
    })
  }

  onInit(): void {
    this.createSidebarElement()
  }

  onRender(): void {
    this.renderWidgets()
    this.applyStyles()
  }

  onUpdate(config: SidebarConfig): void {
    this.config = { ...this.config, ...config }
    if (config.widgets) {
      this.widgets.clear()
      config.widgets.forEach((widget: SidebarWidget) => {
        this.widgets.set(widget.id, widget)
      })
    }
    this.renderWidgets()
    this.applyStyles()
  }

  onDestroy(): void {
    if (this.sidebarElement) {
      this.sidebarElement.remove()
    }
    this.sidebarElement = null
    this.widgets.clear()
  }

  private createSidebarElement(): void {
    this.sidebarElement = document.createElement('aside')
    this.sidebarElement.className = 'sidebar-component'

    const sidebar = document.getElementById('sidebar')
    if (sidebar) {
      sidebar.appendChild(this.sidebarElement)
    } else {
      document.body.appendChild(this.sidebarElement)
    }

    this.setElement(this.sidebarElement)
  }

  private renderWidgets(): void {
    if (!this.sidebarElement) return

    this.sidebarElement.innerHTML = ''

    this.widgets.forEach((widget) => {
      const widgetElement = this.createWidgetElement(widget)
      this.sidebarElement!.appendChild(widgetElement)
    })
  }

  private createWidgetElement(widget: SidebarWidget): HTMLElement {
    const container = document.createElement('div')
    container.className = 'sidebar-widget'
    container.id = `widget-${widget.id}`

    const title = document.createElement('h3')
    title.className = 'widget-title'
    title.textContent = widget.title
    container.appendChild(title)

    const content = document.createElement('div')
    content.className = 'widget-content'

    if (widget.type === 'html' || widget.content instanceof HTMLElement) {
      if (widget.content instanceof HTMLElement) {
        content.appendChild(widget.content)
      } else {
        content.innerHTML = widget.content as string
      }
    } else {
      content.textContent = widget.content as string
    }

    container.appendChild(content)
    return container
  }

  private applyStyles(): void {
    if (!this.sidebarElement) return

    const width = this.getConfigValue('width', 300)
    const position = this.getConfigValue('position', 'right')

    this.sidebarElement.style.width = `${width}px`
    this.sidebarElement.style.display = 'flex'
    this.sidebarElement.style.flexDirection = 'column'
    this.sidebarElement.style.gap = '20px'
  }

  /**
   * 添加小组件
   */
  public addWidget(widget: SidebarWidget): void {
    this.widgets.set(widget.id, widget)
    if (this.isInit()) {
      this.renderWidgets()
    }
  }

  /**
   * 移除小组件
   */
  public removeWidget(id: string): void {
    this.widgets.delete(id)
    if (this.isInit()) {
      this.renderWidgets()
    }
  }

  /**
   * 获取小组件
   */
  public getWidget(id: string): SidebarWidget | undefined {
    return this.widgets.get(id)
  }

  /**
   * 获取所有小组件
   */
  public getAllWidgets(): SidebarWidget[] {
    return Array.from(this.widgets.values())
  }

  /**
   * 更新小组件
   */
  public updateWidget(id: string, widget: Partial<SidebarWidget>): void {
    const existing = this.widgets.get(id)
    if (existing) {
      this.widgets.set(id, { ...existing, ...widget })
      if (this.isInit()) {
        this.renderWidgets()
      }
    }
  }

  /**
   * 清空所有小组件
   */
  public clearWidgets(): void {
    this.widgets.clear()
    if (this.isInit()) {
      this.renderWidgets()
    }
  }
}
