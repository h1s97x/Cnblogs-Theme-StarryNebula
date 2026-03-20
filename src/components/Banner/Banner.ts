/**
 * Banner - 横幅组件
 * 
 * 功能：
 * - 显示网站标题和副标题
 * - 支持背景图片
 * - 支持自定义样式
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface BannerConfig extends ComponentConfig {
  title?: string
  subtitle?: string
  backgroundImage?: string
  height?: number
  showAnimation?: boolean
}

export class Banner extends BaseComponent {
  private bannerElement: HTMLElement | null = null
  private titleElement: HTMLElement | null = null
  private subtitleElement: HTMLElement | null = null

  constructor(config: BannerConfig = {}) {
    super('Banner', {
      title: 'Welcome to My Blog',
      subtitle: 'A beautiful blog theme',
      backgroundImage: '',
      height: 300,
      showAnimation: true,
      ...config,
    })
  }

  onInit(): void {
    this.createBannerElement()
  }

  onRender(): void {
    this.updateContent()
    this.applyStyles()
  }

  onUpdate(config: BannerConfig): void {
    this.config = { ...this.config, ...config }
    this.updateContent()
    this.applyStyles()
  }

  onDestroy(): void {
    if (this.bannerElement) {
      this.bannerElement.remove()
    }
    this.bannerElement = null
    this.titleElement = null
    this.subtitleElement = null
  }

  private createBannerElement(): void {
    this.bannerElement = document.createElement('div')
    this.bannerElement.className = 'banner-component'

    this.titleElement = document.createElement('h1')
    this.titleElement.className = 'banner-title'

    this.subtitleElement = document.createElement('p')
    this.subtitleElement.className = 'banner-subtitle'

    this.bannerElement.appendChild(this.titleElement)
    this.bannerElement.appendChild(this.subtitleElement)

    // 插入到页面顶部
    const header = document.getElementById('header')
    if (header) {
      header.appendChild(this.bannerElement)
    } else {
      document.body.insertBefore(this.bannerElement, document.body.firstChild)
    }

    this.setElement(this.bannerElement)
  }

  private updateContent(): void {
    if (!this.titleElement || !this.subtitleElement) return

    const title = this.getConfigValue('title', 'Welcome')
    const subtitle = this.getConfigValue('subtitle', '')

    this.titleElement.textContent = title
    this.subtitleElement.textContent = subtitle
  }

  private applyStyles(): void {
    if (!this.bannerElement) return

    const height = this.getConfigValue('height', 300)
    const bgImage = this.getConfigValue('backgroundImage', '')
    const showAnimation = this.getConfigValue('showAnimation', true)

    this.bannerElement.style.height = `${height}px`
    this.bannerElement.style.display = 'flex'
    this.bannerElement.style.flexDirection = 'column'
    this.bannerElement.style.justifyContent = 'center'
    this.bannerElement.style.alignItems = 'center'
    this.bannerElement.style.textAlign = 'center'
    this.bannerElement.style.position = 'relative'
    this.bannerElement.style.overflow = 'hidden'

    if (bgImage) {
      this.bannerElement.style.backgroundImage = `url(${bgImage})`
      this.bannerElement.style.backgroundSize = 'cover'
      this.bannerElement.style.backgroundPosition = 'center'
    }

    if (showAnimation) {
      this.bannerElement.style.animation = 'slideDown 0.8s ease-out'
    }
  }

  /**
   * 设置标题
   */
  public setTitle(title: string): void {
    this.setConfigValue('title', title)
    if (this.titleElement) {
      this.titleElement.textContent = title
    }
  }

  /**
   * 获取标题
   */
  public getTitle(): string {
    return this.getConfigValue('title', '')
  }

  /**
   * 设置副标题
   */
  public setSubtitle(subtitle: string): void {
    this.setConfigValue('subtitle', subtitle)
    if (this.subtitleElement) {
      this.subtitleElement.textContent = subtitle
    }
  }

  /**
   * 获取副标题
   */
  public getSubtitle(): string {
    return this.getConfigValue('subtitle', '')
  }

  /**
   * 设置背景图片
   */
  public setBackgroundImage(url: string): void {
    this.setConfigValue('backgroundImage', url)
    if (this.bannerElement) {
      this.bannerElement.style.backgroundImage = `url(${url})`
    }
  }

  /**
   * 获取背景图片
   */
  public getBackgroundImage(): string {
    return this.getConfigValue('backgroundImage', '')
  }
}
