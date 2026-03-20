/**
 * Tools - 通用工具函数库
 * 
 * 提供常用的工具函数
 */

/**
 * 防抖函数
 * @param func - 要执行的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 * @param func - 要执行的函数
 * @param limit - 限制时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 延迟执行
 * @param ms - 延迟时间（毫秒）
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 检查元素是否在视口内
 * @param element - DOM元素
 * @returns 是否在视口内
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 获取元素相对于视口的位置
 * @param element - DOM元素
 * @returns 位置信息
 */
export function getElementPosition(element: HTMLElement): {
  top: number
  left: number
  bottom: number
  right: number
  width: number
  height: number
} {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
  }
}

/**
 * 平滑滚动到元素
 * @param element - 目标元素
 * @param options - 滚动选项
 */
export function smoothScrollTo(
  element: HTMLElement,
  options?: ScrollIntoViewOptions
): void {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    ...options,
  })
}

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * 获取URL查询参数
 * @param name - 参数名
 * @returns 参数值
 */
export function getQueryParam(name: string): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

/**
 * 获取所有URL查询参数
 * @returns 参数对象
 */
export function getAllQueryParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}

/**
 * 检查浏览器是否支持某个特性
 * @param feature - 特性名称
 * @returns 是否支持
 */
export function isFeatureSupported(feature: string): boolean {
  const features: Record<string, boolean> = {
    localStorage: typeof Storage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    indexedDB: typeof indexedDB !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    webWorker: typeof Worker !== 'undefined',
    webGL: !!document.createElement('canvas').getContext('webgl'),
    webGL2: !!document.createElement('canvas').getContext('webgl2'),
  }

  return features[feature] ?? false
}

/**
 * 获取浏览器信息
 * @returns 浏览器信息
 */
export function getBrowserInfo(): {
  name: string
  version: string
  engine: string
  os: string
} {
  const ua = navigator.userAgent
  let browserName = 'Unknown'
  let browserVersion = 'Unknown'
  let engine = 'Unknown'
  let os = 'Unknown'

  // 检测浏览器
  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox'
    browserVersion = ua.split('Firefox/')[1]
    engine = 'Gecko'
  } else if (ua.indexOf('Chrome') > -1) {
    browserName = 'Chrome'
    browserVersion = ua.split('Chrome/')[1].split(' ')[0]
    engine = 'Blink'
  } else if (ua.indexOf('Safari') > -1) {
    browserName = 'Safari'
    browserVersion = ua.split('Version/')[1].split(' ')[0]
    engine = 'WebKit'
  } else if (ua.indexOf('Edge') > -1) {
    browserName = 'Edge'
    browserVersion = ua.split('Edge/')[1]
    engine = 'Blink'
  }

  // 检测操作系统
  if (ua.indexOf('Windows') > -1) {
    os = 'Windows'
  } else if (ua.indexOf('Mac') > -1) {
    os = 'macOS'
  } else if (ua.indexOf('Linux') > -1) {
    os = 'Linux'
  } else if (ua.indexOf('Android') > -1) {
    os = 'Android'
  } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
    os = 'iOS'
  }

  return {
    name: browserName,
    version: browserVersion,
    engine,
    os,
  }
}

/**
 * 检查是否为移动设备
 * @returns 是否为移动设备
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * 检查是否为暗色模式
 * @returns 是否为暗色模式
 */
export function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 监听暗色模式变化
 * @param callback - 回调函数
 * @returns 取消监听函数
 */
export function onDarkModeChange(callback: (isDark: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = (e: MediaQueryListEvent) => callback(e.matches)

  mediaQuery.addEventListener('change', listener)

  return () => {
    mediaQuery.removeEventListener('change', listener)
  }
}

/**
 * 生成随机颜色
 * @returns 随机颜色（十六进制）
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * 生成随机数
 * @param min - 最小值
 * @param max - 最大值
 * @returns 随机数
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化后的大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 格式化时间
 * @param date - 日期对象
 * @param format - 格式字符串
 * @returns 格式化后的时间
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
