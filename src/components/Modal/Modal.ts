/**
 * Modal - 模态对话框组件
 * 
 * 功能：
 * - 模态对话框显示
 * - 自定义内容
 * - 动画效果
 * - 键盘快捷键支持
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface ModalConfig extends ComponentConfig {
  title?: string
  content?: string
  width?: string
  height?: string
  closable?: boolean
  maskClosable?: boolean
  animated?: boolean
  buttons?: Array<{
    text: string
    type?: 'primary' | 'default' | 'danger'
    onClick?: () => void
  }>
}

export class Modal extends BaseComponent {
  private modalElement: HTMLElement | null = null
  private maskElement: HTMLElement | null = null
  private isOpen: boolean = false
  private closeCallback: (() => void) | null = null

  constructor(config: ModalConfig = {}) {
    super('Modal', {
      title: 'Dialog',
      content: '',
      width: '500px',
      height: 'auto',
      closable: true,
      maskClosable: true,
      animated: true,
      buttons: [],
      ...config,
    })
  }

  onInit(): void {
    this.createModalElement()
    this.setupEventListeners()
  }

  onRender(): void {
    this.renderModal()
    this.applyStyles()
  }

  onUpdate(config: ModalConfig): void {
    this.config = { ...this.config, ...config }
    this.renderModal()
  }

  onDestroy(): void {
    this.close()
    if (this.modalElement) {
      this.modalElement.remove()
    }
    if (this.maskElement) {
      this.maskElement.remove()
    }
    this.modalElement = null
    this.maskElement = null
  }

  /**
   * 创建模态框元素
   */
  private createModalElement(): void {
    // 创建遮罩层
    this.maskElement = document.createElement('div')
    this.maskElement.className = 'modal-mask'
    this.maskElement.style.display = 'none'

    // 创建模态框
    this.modalElement = document.createElement('div')
    this.modalElement.className = 'modal-component'
    this.modalElement.style.display = 'none'

    document.body.appendChild(this.maskElement)
    document.body.appendChild(this.modalElement)

    this.setElement(this.modalElement)
  }

  /**
   * 渲染模态框
   */
  private renderModal(): void {
    if (!this.modalElement) return

    const title = this.getConfigValue('title', 'Dialog')
    const content = this.getConfigValue('content', '')
    const closable = this.getConfigValue('closable', true)
    const buttons = this.getConfigValue('buttons', [])

    this.modalElement.innerHTML = ''

    // 头部
    const header = document.createElement('div')
    header.className = 'modal-header'

    const titleEl = document.createElement('h3')
    titleEl.className = 'modal-title'
    titleEl.textContent = title
    header.appendChild(titleEl)

    if (closable) {
      const closeBtn = document.createElement('button')
      closeBtn.className = 'modal-close'
      closeBtn.textContent = '×'
      closeBtn.addEventListener('click', () => this.close())
      header.appendChild(closeBtn)
    }

    this.modalElement.appendChild(header)

    // 内容
    const body = document.createElement('div')
    body.className = 'modal-body'
    body.innerHTML = content
    this.modalElement.appendChild(body)

    // 底部按钮
    if (buttons.length > 0) {
      const footer = document.createElement('div')
      footer.className = 'modal-footer'

      buttons.forEach((btn) => {
        const button = document.createElement('button')
        button.className = `modal-button modal-button-${btn.type || 'default'}`
        button.textContent = btn.text
        button.addEventListener('click', () => {
          btn.onClick?.()
          this.close()
        })
        footer.appendChild(button)
      })

      this.modalElement.appendChild(footer)
    }
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    if (!this.maskElement) return

    const maskClosable = this.getConfigValue('maskClosable', true)

    if (maskClosable) {
      this.maskElement.addEventListener('click', () => this.close())
    }

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close()
      }
    })
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.modalElement || !this.maskElement) return

    const width = this.getConfigValue('width', '500px')
    const height = this.getConfigValue('height', 'auto')
    const animated = this.getConfigValue('animated', true)

    // 遮罩层样式
    this.maskElement.style.position = 'fixed'
    this.maskElement.style.top = '0'
    this.maskElement.style.left = '0'
    this.maskElement.style.right = '0'
    this.maskElement.style.bottom = '0'
    this.maskElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    this.maskElement.style.zIndex = '999'

    // 模态框样式
    this.modalElement.style.position = 'fixed'
    this.modalElement.style.top = '50%'
    this.modalElement.style.left = '50%'
    this.modalElement.style.transform = 'translate(-50%, -50%)'
    this.modalElement.style.width = width
    this.modalElement.style.height = height
    this.modalElement.style.backgroundColor = 'var(--theme-background)'
    this.modalElement.style.borderRadius = '8px'
    this.modalElement.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
    this.modalElement.style.zIndex = '1000'
    this.modalElement.style.display = 'flex'
    this.modalElement.style.flexDirection = 'column'

    if (animated) {
      this.modalElement.style.animation = 'modalIn 0.3s ease-out'
      this.maskElement.style.animation = 'fadeIn 0.3s ease-out'
    }

    // 头部样式
    const header = this.modalElement.querySelector('.modal-header') as HTMLElement
    if (header) {
      header.style.padding = '20px'
      header.style.borderBottom = '1px solid var(--theme-border)'
      header.style.display = 'flex'
      header.style.justifyContent = 'space-between'
      header.style.alignItems = 'center'
    }

    // 标题样式
    const title = this.modalElement.querySelector('.modal-title') as HTMLElement
    if (title) {
      title.style.margin = '0'
      title.style.fontSize = '18px'
      title.style.fontWeight = 'bold'
    }

    // 关闭按钮样式
    const closeBtn = this.modalElement.querySelector('.modal-close') as HTMLElement
    if (closeBtn) {
      closeBtn.style.background = 'none'
      closeBtn.style.border = 'none'
      closeBtn.style.fontSize = '24px'
      closeBtn.style.cursor = 'pointer'
      closeBtn.style.color = 'var(--theme-text)'
    }

    // 内容样式
    const body = this.modalElement.querySelector('.modal-body') as HTMLElement
    if (body) {
      body.style.padding = '20px'
      body.style.flex = '1'
      body.style.overflowY = 'auto'
    }

    // 底部样式
    const footer = this.modalElement.querySelector('.modal-footer') as HTMLElement
    if (footer) {
      footer.style.padding = '20px'
      footer.style.borderTop = '1px solid var(--theme-border)'
      footer.style.display = 'flex'
      footer.style.justifyContent = 'flex-end'
      footer.style.gap = '10px'
    }

    // 按钮样式
    const buttons = this.modalElement.querySelectorAll('.modal-button')
    buttons.forEach((btn) => {
      const button = btn as HTMLElement
      button.style.padding = '8px 16px'
      button.style.borderRadius = '4px'
      button.style.border = 'none'
      button.style.cursor = 'pointer'
      button.style.fontSize = '14px'

      if (button.classList.contains('modal-button-primary')) {
        button.style.backgroundColor = 'var(--theme-primary)'
        button.style.color = 'white'
      } else if (button.classList.contains('modal-button-danger')) {
        button.style.backgroundColor = '#ff4d4f'
        button.style.color = 'white'
      } else {
        button.style.backgroundColor = 'var(--theme-border)'
        button.style.color = 'var(--theme-text)'
      }
    })
  }

  /**
   * 打开模态框
   */
  public open(): void {
    if (!this.modalElement || !this.maskElement) return

    this.isOpen = true
    this.modalElement.style.display = 'flex'
    this.maskElement.style.display = 'block'

    // 禁用页面滚动
    document.body.style.overflow = 'hidden'

    const event = new CustomEvent('modal:open')
    window.dispatchEvent(event)
  }

  /**
   * 关闭模态框
   */
  public close(): void {
    if (!this.modalElement || !this.maskElement) return

    this.isOpen = false
    this.modalElement.style.display = 'none'
    this.maskElement.style.display = 'none'

    // 恢复页面滚动
    document.body.style.overflow = 'auto'

    this.closeCallback?.()

    const event = new CustomEvent('modal:close')
    window.dispatchEvent(event)
  }

  /**
   * 检查是否打开
   */
  public isOpened(): boolean {
    return this.isOpen
  }

  /**
   * 设置关闭回调
   */
  public onClose(callback: () => void): void {
    this.closeCallback = callback
  }

  /**
   * 设置内容
   */
  public setContent(content: string): void {
    this.config.content = content
    this.renderModal()
  }

  /**
   * 获取内容
   */
  public getContent(): string {
    return this.getConfigValue('content', '')
  }
}
