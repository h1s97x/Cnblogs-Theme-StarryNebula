/**
 * Pagination - 分页组件
 * 
 * 功能：
 * - 文章列表分页
 * - 支持自定义样式
 * - 支持键盘导航
 * - 支持分页事件
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface PaginationConfig extends ComponentConfig {
  currentPage?: number
  totalPages?: number
  pageSize?: number
  totalItems?: number
  showFirst?: boolean
  showLast?: boolean
  showPrevNext?: boolean
  maxButtons?: number
}

export class Pagination extends BaseComponent {
  private paginationElement: HTMLElement | null = null
  private currentPage: number = 1
  private totalPages: number = 1

  constructor(config: PaginationConfig = {}) {
    super('Pagination', {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      totalItems: 0,
      showFirst: true,
      showLast: true,
      showPrevNext: true,
      maxButtons: 7,
      ...config,
    })

    this.currentPage = this.getConfigValue('currentPage', 1)
    this.totalPages = this.getConfigValue('totalPages', 1)
  }

  onInit(): void {
    this.createPaginationElement()
  }

  onRender(): void {
    this.renderPagination()
    this.applyStyles()
  }

  onUpdate(config: PaginationConfig): void {
    this.config = { ...this.config, ...config }
    if (config.currentPage) this.currentPage = config.currentPage
    if (config.totalPages) this.totalPages = config.totalPages
    this.renderPagination()
  }

  onDestroy(): void {
    if (this.paginationElement) {
      this.paginationElement.remove()
    }
    this.paginationElement = null
  }

  /**
   * 创建分页元素
   */
  private createPaginationElement(): void {
    this.paginationElement = document.createElement('nav')
    this.paginationElement.className = 'pagination-component'
    this.paginationElement.setAttribute('aria-label', 'Pagination')

    const mainContent = document.querySelector('main, #main, #mainContent')
    if (mainContent) {
      mainContent.appendChild(this.paginationElement)
    } else {
      document.body.appendChild(this.paginationElement)
    }

    this.setElement(this.paginationElement)
  }

  /**
   * 渲染分页
   */
  private renderPagination(): void {
    if (!this.paginationElement) return

    this.paginationElement.innerHTML = ''

    const ul = document.createElement('ul')
    ul.className = 'pagination-list'

    // 首页按钮
    if (this.getConfigValue('showFirst', true) && this.currentPage > 1) {
      ul.appendChild(this.createButton('首页', 1, 'first'))
    }

    // 上一页按钮
    if (this.getConfigValue('showPrevNext', true) && this.currentPage > 1) {
      ul.appendChild(this.createButton('上一页', this.currentPage - 1, 'prev'))
    }

    // 页码按钮
    const pageButtons = this.getPageButtons()
    pageButtons.forEach((page) => {
      if (page === '...') {
        ul.appendChild(this.createEllipsis())
      } else {
        ul.appendChild(this.createButton(String(page), page as number, page === this.currentPage ? 'active' : ''))
      }
    })

    // 下一页按钮
    if (this.getConfigValue('showPrevNext', true) && this.currentPage < this.totalPages) {
      ul.appendChild(this.createButton('下一页', this.currentPage + 1, 'next'))
    }

    // 末页按钮
    if (this.getConfigValue('showLast', true) && this.currentPage < this.totalPages) {
      ul.appendChild(this.createButton('末页', this.totalPages, 'last'))
    }

    this.paginationElement.appendChild(ul)
  }

  /**
   * 获取页码按钮
   */
  private getPageButtons(): (number | string)[] {
    const maxButtons = this.getConfigValue('maxButtons', 7)
    const buttons: (number | string)[] = []

    if (this.totalPages <= maxButtons) {
      for (let i = 1; i <= this.totalPages; i++) {
        buttons.push(i)
      }
    } else {
      const halfWindow = Math.floor(maxButtons / 2)
      let start = Math.max(1, this.currentPage - halfWindow)
      let end = Math.min(this.totalPages, start + maxButtons - 1)

      if (end - start < maxButtons - 1) {
        start = Math.max(1, end - maxButtons + 1)
      }

      if (start > 1) {
        buttons.push(1)
        if (start > 2) {
          buttons.push('...')
        }
      }

      for (let i = start; i <= end; i++) {
        buttons.push(i)
      }

      if (end < this.totalPages) {
        if (end < this.totalPages - 1) {
          buttons.push('...')
        }
        buttons.push(this.totalPages)
      }
    }

    return buttons
  }

  /**
   * 创建按钮
   */
  private createButton(text: string, page: number, className: string): HTMLElement {
    const li = document.createElement('li')
    li.className = `pagination-item ${className}`

    const a = document.createElement('a')
    a.href = '#'
    a.className = 'pagination-link'
    a.textContent = text

    a.addEventListener('click', (e) => {
      e.preventDefault()
      this.goToPage(page)
    })

    li.appendChild(a)
    return li
  }

  /**
   * 创建省略号
   */
  private createEllipsis(): HTMLElement {
    const li = document.createElement('li')
    li.className = 'pagination-ellipsis'
    li.textContent = '...'
    return li
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.paginationElement) return

    this.paginationElement.style.display = 'flex'
    this.paginationElement.style.justifyContent = 'center'
    this.paginationElement.style.marginTop = '30px'
    this.paginationElement.style.marginBottom = '30px'
  }

  /**
   * 跳转到指定页
   */
  public goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return

    this.currentPage = page
    this.setConfigValue('currentPage', page)
    this.renderPagination()

    // 发出分页事件
    const event = new CustomEvent('pagination:change', {
      detail: { page, totalPages: this.totalPages }
    })
    window.dispatchEvent(event)
  }

  /**
   * 获取当前页
   */
  public getCurrentPage(): number {
    return this.currentPage
  }

  /**
   * 设置总页数
   */
  public setTotalPages(total: number): void {
    this.totalPages = total
    this.setConfigValue('totalPages', total)
    this.renderPagination()
  }

  /**
   * 获取总页数
   */
  public getTotalPages(): number {
    return this.totalPages
  }
}
