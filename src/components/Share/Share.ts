/**
 * Share - 分享组件
 * 
 * 功能：
 * - 分享到多个平台
 * - 复制分享链接
 * - 生成二维码
 * - 自定义分享文本
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface SharePlatform {
  name: string
  icon?: string
  url: string
  color?: string
}

export interface ShareConfig extends ComponentConfig {
  selector?: string
  title?: string
  description?: string
  url?: string
  platforms?: string[]
  showQR?: boolean
  showCopy?: boolean
}

export class Share extends BaseComponent {
  private shareElement: HTMLElement | null = null
  private platforms: Map<string, SharePlatform> = new Map()
  private pageUrl: string = ''
  private pageTitle: string = ''

  constructor(config: ShareConfig = {}) {
    super('Share', {
      selector: '.share',
      title: '',
      description: '',
      url: '',
      platforms: ['twitter', 'facebook', 'linkedin', 'email'],
      showQR: false,
      showCopy: true,
      ...config,
    })

    this.initPlatforms()
  }

  onInit(): void {
    this.pageUrl = this.getConfigValue('url', window.location.href)
    this.pageTitle = this.getConfigValue('title', document.title)
    this.createShareElement()
  }

  onRender(): void {
    this.renderShare()
    this.applyStyles()
  }

  onUpdate(config: ShareConfig): void {
    this.config = { ...this.config, ...config }
    if (config.url) this.pageUrl = config.url
    if (config.title) this.pageTitle = config.title
    this.renderShare()
  }

  onDestroy(): void {
    if (this.shareElement) {
      this.shareElement.remove()
    }
    this.shareElement = null
    this.platforms.clear()
  }

  /**
   * 初始化分享平台
   */
  private initPlatforms(): void {
    this.platforms.set('twitter', {
      name: 'Twitter',
      icon: '𝕏',
      url: 'https://twitter.com/intent/tweet?url={url}&text={title}',
      color: '#000000',
    })

    this.platforms.set('facebook', {
      name: 'Facebook',
      icon: 'f',
      url: 'https://www.facebook.com/sharer/sharer.php?u={url}',
      color: '#1877F2',
    })

    this.platforms.set('linkedin', {
      name: 'LinkedIn',
      icon: 'in',
      url: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
      color: '#0A66C2',
    })

    this.platforms.set('email', {
      name: 'Email',
      icon: '✉',
      url: 'mailto:?subject={title}&body={description}%0A{url}',
      color: '#666666',
    })

    this.platforms.set('whatsapp', {
      name: 'WhatsApp',
      icon: 'W',
      url: 'https://wa.me/?text={title}%20{url}',
      color: '#25D366',
    })

    this.platforms.set('telegram', {
      name: 'Telegram',
      icon: '✈',
      url: 'https://t.me/share/url?url={url}&text={title}',
      color: '#0088cc',
    })
  }

  /**
   * 创建分享元素
   */
  private createShareElement(): void {
    this.shareElement = document.createElement('div')
    this.shareElement.className = 'share-component'

    const selector = this.getConfigValue('selector', '.share')
    const container = document.querySelector(selector)
    if (container) {
      container.appendChild(this.shareElement)
    } else {
      const mainContent = document.querySelector('main, #main, #mainContent')
      if (mainContent) {
        mainContent.appendChild(this.shareElement)
      } else {
        document.body.appendChild(this.shareElement)
      }
    }

    this.setElement(this.shareElement)
  }

  /**
   * 渲染分享组件
   */
  private renderShare(): void {
    if (!this.shareElement) return

    this.shareElement.innerHTML = ''

    // 标题
    const title = document.createElement('h3')
    title.className = 'share-title'
    title.textContent = '分享'
    this.shareElement.appendChild(title)

    // 分享按钮容器
    const buttonsContainer = document.createElement('div')
    buttonsContainer.className = 'share-buttons'

    const platformsList = this.getConfigValue('platforms', ['twitter', 'facebook', 'linkedin', 'email'])
    platformsList.forEach((platformName: string) => {
      const platform = this.platforms.get(platformName)
      if (platform) {
        const btn = this.createShareButton(platform)
        buttonsContainer.appendChild(btn)
      }
    })

    this.shareElement.appendChild(buttonsContainer)

    // 复制链接
    if (this.getConfigValue('showCopy', true)) {
      const copyContainer = document.createElement('div')
      copyContainer.className = 'share-copy'

      const copyInput = document.createElement('input')
      copyInput.type = 'text'
      copyInput.className = 'share-copy-input'
      copyInput.value = this.pageUrl
      copyInput.readOnly = true

      const copyBtn = document.createElement('button')
      copyBtn.className = 'share-copy-btn'
      copyBtn.textContent = '复制链接'
      copyBtn.addEventListener('click', () => {
        this.copyToClipboard(this.pageUrl)
        copyBtn.textContent = '已复制'
        setTimeout(() => {
          copyBtn.textContent = '复制链接'
        }, 2000)
      })

      copyContainer.appendChild(copyInput)
      copyContainer.appendChild(copyBtn)
      this.shareElement.appendChild(copyContainer)
    }

    // 二维码
    if (this.getConfigValue('showQR', false)) {
      const qrContainer = document.createElement('div')
      qrContainer.className = 'share-qr'

      const qrTitle = document.createElement('p')
      qrTitle.className = 'share-qr-title'
      qrTitle.textContent = '二维码'
      qrContainer.appendChild(qrTitle)

      const qrCode = document.createElement('div')
      qrCode.className = 'share-qr-code'
      qrCode.textContent = '[QR Code]'
      qrContainer.appendChild(qrCode)

      this.shareElement.appendChild(qrContainer)
    }
  }

  /**
   * 创建分享按钮
   */
  private createShareButton(platform: SharePlatform): HTMLElement {
    const btn = document.createElement('button')
    btn.className = 'share-button'
    btn.title = platform.name
    btn.style.backgroundColor = platform.color || '#666666'

    const icon = document.createElement('span')
    icon.className = 'share-button-icon'
    icon.textContent = platform.icon || platform.name[0]
    btn.appendChild(icon)

    const name = document.createElement('span')
    name.className = 'share-button-name'
    name.textContent = platform.name
    btn.appendChild(name)

    btn.addEventListener('click', () => {
      this.share(platform)
    })

    return btn
  }

  /**
   * 分享到平台
   */
  private share(platform: SharePlatform): void {
    const description = this.getConfigValue('description', '')
    const url = encodeURIComponent(this.pageUrl)
    const title = encodeURIComponent(this.pageTitle)
    const desc = encodeURIComponent(description)

    let shareUrl = platform.url
      .replace('{url}', url)
      .replace('{title}', title)
      .replace('{description}', desc)

    if (platform.name === 'Email') {
      window.location.href = shareUrl
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }

    // 触发分享事件
    const event = new CustomEvent('share:click', {
      detail: { platform: platform.name, url: this.pageUrl }
    })
    window.dispatchEvent(event)
  }

  /**
   * 复制到剪贴板
   */
  private copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {
        this.fallbackCopy(text)
      })
    } else {
      this.fallbackCopy(text)
    }
  }

  /**
   * 备用复制方法
   */
  private fallbackCopy(text: string): void {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.shareElement) return

    this.shareElement.style.marginTop = '40px'
    this.shareElement.style.paddingTop = '20px'
    this.shareElement.style.borderTop = '1px solid var(--theme-border)'
  }

  /**
   * 获取支持的平台列表
   */
  public getSupportedPlatforms(): string[] {
    return Array.from(this.platforms.keys())
  }

  /**
   * 添加自定义平台
   */
  public addPlatform(name: string, platform: SharePlatform): void {
    this.platforms.set(name, platform)
  }

  /**
   * 获取分享URL
   */
  public getShareUrl(): string {
    return this.pageUrl
  }

  /**
   * 设置分享URL
   */
  public setShareUrl(url: string): void {
    this.pageUrl = url
    this.renderShare()
  }
}
