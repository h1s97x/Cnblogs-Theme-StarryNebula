/**
 * TOC - 目录组件
 * 
 * 功能：
 * - 自动生成文章目录
 * - 平滑滚动到章节
 * - 高亮当前章节
 * - 支持自定义样式
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface TOCItem {
  id: string
  title: string
  level: number
  children?: TOCItem[]
}

export interface TOCConfig extends ComponentConfig {
  selector?: string
  minLevel?: number
  maxLevel?: number
  smooth?: boolean
  highlight?: boolean
}

export class TOC extends BaseComponent {
  private tocElement: HTMLElement | null = null
  private items: TOCItem[] = []
  private currentActive: string | null = null

  constructor(config: TOCConfig = {}) {
    super('TOC', {
      selector: 'article',
      minLevel: 2,
      maxLevel: 4,
      smooth: true,
      highlight: true,
      ...config,
    })
  }

  onInit(): void {
    this.generateTOC()
    this.setupScrollListener()
  }

  onRender(): void {
    this.renderTOC()
    this.applyStyles()
  }

  onUpdate(config: TOCConfig): void {
    this.config = { ...this.config, ...config }
    this.items = []
    this.generateTOC()
    this.renderTOC()
  }

  onDestroy(): void {
    if (this.tocElement) {
      this.tocElement.remove()
    }
    this.tocElement = null
    this.items = []
  }

  /**
   * 生成目录
   */
  private generateTOC(): void {
    const selector = this.getConfigValue('selector', 'article')
    const minLevel = this.getConfigValue('minLevel', 2)
    const maxLevel = this.getConfigValue('maxLevel', 4)

    const container = document.querySelector(selector)
    if (!container) return

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    this.items = []

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1])
      if (level < minLevel || level > maxLevel) return

      // 为标题添加 ID
      if (!heading.id) {
        heading.id = `heading-${index}`
      }

      const item: TOCItem = {
        id: heading.id,
        title: heading.textContent || '',
        level,
      }

      this.items.push(item)
    })
  }

  /**
   * 渲染目录
   */
  private renderTOC(): void {
    if (this.items.length === 0) return

    this.tocElement = document.createElement('nav')
    this.tocElement.className = 'toc-component'

    const title = document.createElement('h3')
    title.className = 'toc-title'
    title.textContent = '目录'
    this.tocElement.appendChild(title)

    const list = this.createTOCList(this.items)
    this.tocElement.appendChild(list)

    const sidebar = document.getElementById('sidebar')
    if (sidebar) {
      sidebar.appendChild(this.tocElement)
    } else {
      document.body.appendChild(this.tocElement)
    }

    this.setElement(this.tocElement)
  }

  /**
   * 创建目录列表
   */
  private createTOCList(items: TOCItem[]): HTMLElement {
    const ul = document.createElement('ul')
    ul.className = 'toc-list'

    items.forEach((item) => {
      const li = document.createElement('li')
      li.className = `toc-item toc-level-${item.level}`

      const a = document.createElement('a')
      a.href = `#${item.id}`
      a.textContent = item.title
      a.className = 'toc-link'

      // 平滑滚动
      if (this.getConfigValue('smooth', true)) {
        a.addEventListener('click', (e) => {
          e.preventDefault()
          const target = document.getElementById(item.id)
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
          }
        })
      }

      li.appendChild(a)
      ul.appendChild(li)
    })

    return ul
  }

  /**
   * 设置滚动监听
   */
  private setupScrollListener(): void {
    if (!this.getConfigValue('highlight', true)) return

    window.addEventListener('scroll', () => {
      this.updateActiveItem()
    })
  }

  /**
   * 更新活跃项
   */
  private updateActiveItem(): void {
    const selector = this.getConfigValue('selector', 'article')
    const container = document.querySelector(selector)
    if (!container) return

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let activeId: string | null = null

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect()
      if (rect.top <= 100) {
        activeId = heading.id
      }
    })

    if (activeId !== this.currentActive) {
      this.currentActive = activeId

      // 更新高亮
      if (this.tocElement) {
        const links = this.tocElement.querySelectorAll('.toc-link')
        links.forEach((link) => {
          link.classList.remove('active')
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active')
          }
        })
      }
    }
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.tocElement) return

    this.tocElement.style.padding = '20px'
    this.tocElement.style.maxHeight = '600px'
    this.tocElement.style.overflowY = 'auto'
  }

  /**
   * 获取目录项
   */
  public getItems(): TOCItem[] {
    return [...this.items]
  }

  /**
   * 获取当前活跃项
   */
  public getCurrentActive(): string | null {
    return this.currentActive
  }
}
