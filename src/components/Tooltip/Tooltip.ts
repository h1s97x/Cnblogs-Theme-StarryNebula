/**
 * Tooltip - 工具提示组件
 * 
 * 功能：
 * - 工具提示显示
 * - 多个位置支持
 * - 延迟显示
 * - 主题定制
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipConfig extends ComponentConfig {
  selector?: string
  content?: string
  position?: TooltipPosition
  delay?: number
  theme?: 'dark' | 'light'
  maxWidth?: string
}

export class Tooltip extends BaseComponent {
  private tooltipElement: HTMLElement | null = null
  private targetElement: HTMLElement | null = null
  private showTimeout: NodeJS.Timeout | null = null
  private hideTimeout: NodeJS.Timeout | null = null

  constructor(config: TooltipConfig = {}) {
    super('Tooltip', {
      selector: '[data-tooltip]',
      content: '',
      position: 'top',
      delay: 200,
      theme: 'dark',
      maxWidth: '200px',
      ...config,
    })
  }

  onInit(): void {
    this.attachTooltips()
  }

  onRender(): void {
    this.applyStyles()
  }

  onUpdate(config: TooltipConfig): void {
    this.config = { ...this.config, ...config }
    this.attachTooltips()
  }

  onDestroy(): void {
    if (this.tooltipElement) {
      this.tooltipElement.remove()
    }
    this.tooltipElement = null
    this.targetElement = null
    this.clearTimeouts()
  }

  /**
   * 附加工具提示到元素
   */
  private attachTooltips(): void {
    const selector = this.getConfigValue('selector', '[data-tooltip]')
    const elements = document.querySelectorAll(selector)

    elements.forEach((el) => {
      const element = el as HTMLElement
      const content = element.getAttribute('data-tooltip') || element.title

      element.addEventListener('mouseenter', () => this.show(element, content))
      element.addEventListener('mouseleave', () => this.hide())
      element.addEventListener('focus', () => this.show(element, content))
      element.addEventListener('blur', () => this.hide())
    })
  }

  /**
   * 创建工具提示元素
   */
  private createTooltipElement(content: string): HTMLElement {
    const tooltip = document.createElement('div')
    tooltip.className = 'tooltip-component'
    tooltip.textContent = content
    document.body.appendChild(tooltip)
    return tooltip
  }

  /**
   * 显示工具提示
   */
  public show(element: HTMLElement, content: string): void {
    this.clearTimeouts()

    const delay = this.getConfigValue('delay', 200)

    this.showTimeout = setTimeout(() => {
      this.targetElement = element
      this.tooltipElement = this.createTooltipElement(content)
      this.positionTooltip()
      this.applyStyles()

      const event = new CustomEvent('tooltip:show', { detail: { content } })
      window.dispatchEvent(event)
    }, delay)
  }

  /**
   * 隐藏工具提示
   */
  public hide(): void {
    this.clearTimeouts()

    if (this.tooltipElement) {
      this.tooltipElement.style.opacity = '0'
      this.hideTimeout = setTimeout(() => {
        if (this.tooltipElement) {
          this.tooltipElement.remove()
          this.tooltipElement = null
        }
      }, 200)
    }

    const event = new CustomEvent('tooltip:hide')
    window.dispatchEvent(event)
  }

  /**
   * 定位工具提示
   */
  private positionTooltip(): void {
    if (!this.tooltipElement || !this.targetElement) return

    const position = this.getConfigValue('position', 'top') as TooltipPosition
    const rect = this.targetElement.getBoundingClientRect()
    const tooltipRect = this.tooltipElement.getBoundingClientRect()

    let top = 0
    let left = 0
    const gap = 8

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - gap
        left = rect.left + rect.width / 2 - tooltipRect.width / 2
        break
      case 'bottom':
        top = rect.bottom + gap
        left = rect.left + rect.width / 2 - tooltipRect.width / 2
        break
      case 'left':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2
        left = rect.left - tooltipRect.width - gap
        break
      case 'right':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2
        left = rect.right + gap
        break
    }

    // 防止超出视口
    if (left < 0) left = 10
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 10
    }
    if (top < 0) top = 10
    if (top + tooltipRect.height > window.innerHeight) {
      top = window.innerHeight - tooltipRect.height - 10
    }

    this.tooltipElement.style.top = `${top + window.scrollY}px`
    this.tooltipElement.style.left = `${left + window.scrollX}px`
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.tooltipElement) return

    const theme = this.getConfigValue('theme', 'dark')
    const maxWidth = this.getConfigValue('maxWidth', '200px')

    this.tooltipElement.style.position = 'fixed'
    this.tooltipElement.style.padding = '8px 12px'
    this.tooltipElement.style.borderRadius = '4px'
    this.tooltipElement.style.fontSize = '12px'
    this.tooltipElement.style.whiteSpace = 'nowrap'
    this.tooltipElement.style.maxWidth = maxWidth
    this.tooltipElement.style.zIndex = '9999'
    this.tooltipElement.style.pointerEvents = 'none'
    this.tooltipElement.style.opacity = '1'
    this.tooltipElement.style.transition = 'opacity 0.2s ease'

    if (theme === 'dark') {
      this.tooltipElement.style.backgroundColor = '#333'
      this.tooltipElement.style.color = '#fff'
    } else {
      this.tooltipElement.style.backgroundColor = '#fff'
      this.tooltipElement.style.color = '#333'
      this.tooltipElement.style.border = '1px solid #ddd'
    }
  }

  /**
   * 清除超时
   */
  private clearTimeouts(): void {
    if (this.showTimeout) clearTimeout(this.showTimeout)
    if (this.hideTimeout) clearTimeout(this.hideTimeout)
  }

  /**
   * 获取当前位置
   */
  public getPosition(): TooltipPosition {
    return this.getConfigValue('position', 'top')
  }

  /**
   * 设置位置
   */
  public setPosition(position: TooltipPosition): void {
    this.config.position = position
    if (this.tooltipElement && this.targetElement) {
      this.positionTooltip()
    }
  }
}
