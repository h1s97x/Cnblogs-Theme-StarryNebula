/**
 * PageManager - 页面管理器
 * 
 * 功能：
 * - 检测页面类型
 * - 管理页面特定配置
 * - 提供页面相关的工具方法
 */

export type PageType = 'home' | 'article' | 'category' | 'tag' | 'archive' | 'search' | 'user' | 'unknown'

export interface PageConfig {
  [key: string]: any
}

/**
 * 页面管理器
 */
export class PageManager {
  private pageType: PageType
  private pageConfig: PageConfig

  constructor(pageType: PageType = 'unknown', pageConfig: PageConfig = {}) {
    this.pageType = pageType
    this.pageConfig = pageConfig
  }

  /**
   * 检测页面类型
   * 
   * @returns 页面类型
   */
  public static detectPageType(): PageType {
    const url = window.location.pathname
    const hostname = window.location.hostname

    // 首页
    if (url === '/' || url === '' || url === '/index.html') {
      return 'home'
    }

    // 文章页 - 博客园格式: /p/xxxxx
    if (url.includes('/p/')) {
      return 'article'
    }

    // 分类页 - 博客园格式: /category/xxxxx
    if (url.includes('/category/')) {
      return 'category'
    }

    // 标签页 - 博客园格式: /tag/xxxxx
    if (url.includes('/tag/')) {
      return 'tag'
    }

    // 归档页 - 博客园格式: /archive/xxxxx
    if (url.includes('/archive/')) {
      return 'archive'
    }

    // 搜索页 - 博客园格式: /search
    if (url.includes('/search')) {
      return 'search'
    }

    // 用户页 - 博客园格式: /u/xxxxx
    if (url.includes('/u/')) {
      return 'user'
    }

    return 'unknown'
  }

  /**
   * 获取页面类型
   */
  public getPageType(): PageType {
    return this.pageType
  }

  /**
   * 获取页面配置
   */
  public getPageConfig(): PageConfig {
    return { ...this.pageConfig }
  }

  /**
   * 设置页面配置
   * 
   * @param config - 新的配置对象
   */
  public setPageConfig(config: PageConfig): void {
    this.pageConfig = { ...this.pageConfig, ...config }
  }

  /**
   * 获取配置值
   * 
   * @param path - 配置路径，支持点号分隔
   * @param defaultValue - 默认值
   */
  public getConfigValue(path: string, defaultValue?: any): any {
    const keys = path.split('.')
    let value: any = this.pageConfig

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return defaultValue
      }
    }

    return value
  }

  /**
   * 检查页面是否启用
   * 
   * @param name - 页面名称
   */
  public isPageEnabled(name: string): boolean {
    return this.getConfigValue(`${name}.enabled`, false)
  }

  /**
   * 检查是否为首页
   */
  public isHome(): boolean {
    return this.pageType === 'home'
  }

  /**
   * 检查是否为文章页
   */
  public isArticle(): boolean {
    return this.pageType === 'article'
  }

  /**
   * 检查是否为分类页
   */
  public isCategory(): boolean {
    return this.pageType === 'category'
  }

  /**
   * 检查是否为标签页
   */
  public isTag(): boolean {
    return this.pageType === 'tag'
  }

  /**
   * 检查是否为归档页
   */
  public isArchive(): boolean {
    return this.pageType === 'archive'
  }

  /**
   * 检查是否为搜索页
   */
  public isSearch(): boolean {
    return this.pageType === 'search'
  }

  /**
   * 检查是否为用户页
   */
  public isUser(): boolean {
    return this.pageType === 'user'
  }

  /**
   * 获取页面标题
   */
  public getPageTitle(): string {
    const titles: Record<PageType, string> = {
      home: '首页',
      article: '文章',
      category: '分类',
      tag: '标签',
      archive: '归档',
      search: '搜索',
      user: '用户',
      unknown: '未知',
    }
    return titles[this.pageType]
  }

  /**
   * 获取页面描述
   */
  public getPageDescription(): string {
    const descriptions: Record<PageType, string> = {
      home: '博客首页',
      article: '文章详情页',
      category: '分类页面',
      tag: '标签页面',
      archive: '归档页面',
      search: '搜索结果页',
      user: '用户页面',
      unknown: '未知页面',
    }
    return descriptions[this.pageType]
  }

  /**
   * 获取页面 URL
   */
  public getPageUrl(): string {
    return window.location.href
  }

  /**
   * 获取页面路径
   */
  public getPagePath(): string {
    return window.location.pathname
  }

  /**
   * 获取查询参数
   * 
   * @param key - 参数名
   */
  public getQueryParam(key: string): string | null {
    const params = new URLSearchParams(window.location.search)
    return params.get(key)
  }

  /**
   * 获取所有查询参数
   */
  public getAllQueryParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search)
    const result: Record<string, string> = {}

    params.forEach((value, key) => {
      result[key] = value
    })

    return result
  }

  /**
   * 打印页面信息
   */
  public printInfo(): void {
    console.log('[PageManager] Page Information:')
    console.log(`  - Type: ${this.pageType}`)
    console.log(`  - Title: ${this.getPageTitle()}`)
    console.log(`  - Description: ${this.getPageDescription()}`)
    console.log(`  - URL: ${this.getPageUrl()}`)
    console.log(`  - Path: ${this.getPagePath()}`)
    console.log(`  - Config:`, this.pageConfig)
  }
}
