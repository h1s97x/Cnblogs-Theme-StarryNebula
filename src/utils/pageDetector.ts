/**
 * PageDetector - 页面类型检测
 * 
 * 功能：
 * - 识别当前页面类型
 * - 提供页面信息
 * 
 * 使用示例：
 * ```typescript
 * const pageType = detectPageType()
 * console.log(pageType) // 'article' | 'home' | ...
 * ```
 */

/** 页面类型枚举 */
export type PageType = 'home' | 'article' | 'category' | 'tag' | 'archive' | 'unknown'

/**
 * 检测当前页面类型
 * 基于 URL 路径判断
 * @returns 页面类型
 */
export function detectPageType(): PageType {
  const url = window.location.pathname
  const hostname = window.location.hostname

  // 首页
  if (url === '/' || url === '' || url === '/default.aspx') {
    return 'home'
  }

  // 文章页 - /p/文章ID
  if (url.includes('/p/')) {
    return 'article'
  }

  // 分类页 - /category/分类名
  if (url.includes('/category/')) {
    return 'category'
  }

  // 标签页 - /tag/标签名
  if (url.includes('/tag/')) {
    return 'tag'
  }

  // 归档页 - /archive/年/月
  if (url.includes('/archive/')) {
    return 'archive'
  }

  return 'unknown'
}

/**
 * 获取页面信息
 * @returns 页面信息对象
 */
export function getPageInfo(): {
  type: PageType
  title: string
  url: string
  isHome: boolean
  isArticle: boolean
} {
  const type = detectPageType()
  const title = document.title
  const url = window.location.href

  return {
    type,
    title,
    url,
    isHome: type === 'home',
    isArticle: type === 'article',
  }
}

/**
 * 检查是否为特定页面类型
 * @param pageType - 要检查的页面类型
 * @returns 是否匹配
 */
export function isPageType(pageType: PageType): boolean {
  return detectPageType() === pageType
}
