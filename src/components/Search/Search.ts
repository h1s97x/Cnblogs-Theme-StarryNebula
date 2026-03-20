/**
 * Search - 搜索组件
 * 
 * 功能：
 * - 本地搜索功能
 * - 搜索历史
 * - 关键词高亮
 * - 搜索结果显示
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface SearchResult {
  id: string
  title: string
  url: string
  excerpt: string
  score: number
}

export interface SearchConfig extends ComponentConfig {
  placeholder?: string
  maxResults?: number
  minChars?: number
  highlightColor?: string
  saveHistory?: boolean
}

export class Search extends BaseComponent {
  private searchElement: HTMLElement | null = null
  private inputElement: HTMLInputElement | null = null
  private resultsElement: HTMLElement | null = null
  private results: SearchResult[] = []
  private history: string[] = []

  constructor(config: SearchConfig = {}) {
    super('Search', {
      placeholder: '搜索文章...',
      maxResults: 10,
      minChars: 2,
      highlightColor: '#ffeb3b',
      saveHistory: true,
      ...config,
    })

    if (this.getConfigValue('saveHistory', true)) {
      this.loadHistory()
    }
  }

  onInit(): void {
    this.createSearchElement()
    this.setupEventListeners()
  }

  onRender(): void {
    this.applyStyles()
  }

  onUpdate(config: SearchConfig): void {
    this.config = { ...this.config, ...config }
  }

  onDestroy(): void {
    if (this.searchElement) {
      this.searchElement.remove()
    }
    this.searchElement = null
    this.inputElement = null
    this.resultsElement = null
  }

  /**
   * 创建搜索元素
   */
  private createSearchElement(): void {
    this.searchElement = document.createElement('div')
    this.searchElement.className = 'search-component'

    // 搜索输入框
    this.inputElement = document.createElement('input')
    this.inputElement.type = 'text'
    this.inputElement.className = 'search-input'
    this.inputElement.placeholder = this.getConfigValue('placeholder', '搜索文章...')

    // 搜索结果容器
    this.resultsElement = document.createElement('div')
    this.resultsElement.className = 'search-results'
    this.resultsElement.style.display = 'none'

    this.searchElement.appendChild(this.inputElement)
    this.searchElement.appendChild(this.resultsElement)

    const sidebar = document.getElementById('sidebar')
    if (sidebar) {
      sidebar.appendChild(this.searchElement)
    } else {
      document.body.appendChild(this.searchElement)
    }

    this.setElement(this.searchElement)
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    if (!this.inputElement) return

    this.inputElement.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value
      if (query.length >= this.getConfigValue('minChars', 2)) {
        this.search(query)
      } else {
        this.hideResults()
      }
    })

    this.inputElement.addEventListener('focus', () => {
      if (this.history.length > 0) {
        this.showHistory()
      }
    })

    document.addEventListener('click', (e) => {
      if (!this.searchElement?.contains(e.target as Node)) {
        this.hideResults()
      }
    })
  }

  /**
   * 搜索
   */
  private search(query: string): void {
    const articles = document.querySelectorAll('article, .post-item')
    this.results = []

    articles.forEach((article) => {
      const title = article.querySelector('h1, h2, .post-title')?.textContent || ''
      const content = article.textContent || ''
      const url = article.querySelector('a')?.getAttribute('href') || '#'

      // 简单的匹配算法
      const titleMatch = title.toLowerCase().includes(query.toLowerCase())
      const contentMatch = content.toLowerCase().includes(query.toLowerCase())

      if (titleMatch || contentMatch) {
        const score = titleMatch ? 2 : 1
        const excerpt = this.extractExcerpt(content, query)

        this.results.push({
          id: `result-${this.results.length}`,
          title: title.trim(),
          url,
          excerpt,
          score,
        })
      }
    })

    // 按分数排序
    this.results.sort((a, b) => b.score - a.score)

    // 限制结果数量
    const maxResults = this.getConfigValue('maxResults', 10)
    this.results = this.results.slice(0, maxResults)

    this.renderResults()
    this.saveHistory(query)
  }

  /**
   * 提取摘要
   */
  private extractExcerpt(content: string, query: string): string {
    const index = content.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return content.substring(0, 100) + '...'

    const start = Math.max(0, index - 50)
    const end = Math.min(content.length, index + query.length + 50)
    return '...' + content.substring(start, end) + '...'
  }

  /**
   * 渲染结果
   */
  private renderResults(): void {
    if (!this.resultsElement) return

    this.resultsElement.innerHTML = ''

    if (this.results.length === 0) {
      const noResults = document.createElement('div')
      noResults.className = 'search-no-results'
      noResults.textContent = '没有找到相关结果'
      this.resultsElement.appendChild(noResults)
    } else {
      const ul = document.createElement('ul')
      ul.className = 'search-results-list'

      this.results.forEach((result) => {
        const li = document.createElement('li')
        li.className = 'search-result-item'

        const a = document.createElement('a')
        a.href = result.url
        a.className = 'search-result-link'

        const titleDiv = document.createElement('div')
        titleDiv.className = 'search-result-title'
        titleDiv.textContent = result.title

        const excerptDiv = document.createElement('div')
        excerptDiv.className = 'search-result-excerpt'
        excerptDiv.textContent = result.excerpt

        a.appendChild(titleDiv)
        a.appendChild(excerptDiv)
        li.appendChild(a)
        ul.appendChild(li)
      })

      this.resultsElement.appendChild(ul)
    }

    this.resultsElement.style.display = 'block'
  }

  /**
   * 显示历史
   */
  private showHistory(): void {
    if (!this.resultsElement) return

    this.resultsElement.innerHTML = ''

    if (this.history.length > 0) {
      const title = document.createElement('div')
      title.className = 'search-history-title'
      title.textContent = '搜索历史'
      this.resultsElement.appendChild(title)

      const ul = document.createElement('ul')
      ul.className = 'search-history-list'

      this.history.forEach((item) => {
        const li = document.createElement('li')
        li.className = 'search-history-item'
        li.textContent = item
        li.addEventListener('click', () => {
          if (this.inputElement) {
            this.inputElement.value = item
            this.search(item)
          }
        })
        ul.appendChild(li)
      })

      this.resultsElement.appendChild(ul)
    }

    this.resultsElement.style.display = 'block'
  }

  /**
   * 隐藏结果
   */
  private hideResults(): void {
    if (this.resultsElement) {
      this.resultsElement.style.display = 'none'
    }
  }

  /**
   * 保存搜索历史
   */
  private saveHistory(query: string): void {
    if (!this.getConfigValue('saveHistory', true)) return

    // 移除重复项
    this.history = this.history.filter((item) => item !== query)

    // 添加到开头
    this.history.unshift(query)

    // 限制历史数量
    this.history = this.history.slice(0, 10)

    // 保存到 localStorage
    try {
      localStorage.setItem('search-history', JSON.stringify(this.history))
    } catch (e) {
      console.warn('Failed to save search history:', e)
    }
  }

  /**
   * 加载搜索历史
   */
  private loadHistory(): void {
    try {
      const saved = localStorage.getItem('search-history')
      if (saved) {
        this.history = JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to load search history:', e)
    }
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.searchElement) return

    this.searchElement.style.marginBottom = '20px'
  }

  /**
   * 获取搜索结果
   */
  public getResults(): SearchResult[] {
    return [...this.results]
  }

  /**
   * 获取搜索历史
   */
  public getHistory(): string[] {
    return [...this.history]
  }

  /**
   * 清除搜索历史
   */
  public clearHistory(): void {
    this.history = []
    try {
      localStorage.removeItem('search-history')
    } catch (e) {
      console.warn('Failed to clear search history:', e)
    }
  }
}
