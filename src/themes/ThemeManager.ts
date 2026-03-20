/**
 * ThemeManager - 主题管理器
 * 
 * 功能：
 * - 加载和切换主题
 * - 主题持久化
 * - 系统主题检测
 * - 主题变更事件
 */

import { Theme, ThemeMode, ThemeChangeEvent, THEME_STORAGE_KEY, THEME_MODE_STORAGE_KEY } from './types'
import { presets, getPreset } from './presets'

export class ThemeManager {
  private currentTheme: Theme
  private currentMode: ThemeMode
  private listeners: Set<(event: ThemeChangeEvent) => void> = new Set()
  private mediaQueryList: MediaQueryList | null = null

  constructor(initialTheme: string = 'light', initialMode: ThemeMode = 'auto') {
    this.currentMode = this.loadMode() || initialMode
    const savedTheme = this.loadTheme()
    this.currentTheme = savedTheme || getPreset(initialTheme) || presets.light

    this.setupSystemThemeListener()
    this.applyTheme()
  }

  /**
   * 设置主题
   * @param themeId - 主题 ID
   */
  public setTheme(themeId: string): void {
    const newTheme = getPreset(themeId)
    if (!newTheme) {
      console.warn(`[ThemeManager] Theme "${themeId}" not found`)
      return
    }

    const oldTheme = this.currentTheme
    this.currentTheme = newTheme
    this.saveTheme(themeId)
    this.applyTheme()

    this.notifyListeners({
      oldTheme,
      newTheme,
      timestamp: Date.now(),
    })
  }

  /**
   * 设置主题模式
   * @param mode - 主题模式 ('light', 'dark', 'auto')
   */
  public setMode(mode: ThemeMode): void {
    this.currentMode = mode
    this.saveMode(mode)
    this.applyTheme()
  }

  /**
   * 切换主题
   */
  public toggleTheme(): void {
    const nextTheme = this.currentTheme.id === 'light' ? 'dark' : 'light'
    this.setTheme(nextTheme)
  }

  /**
   * 获取当前主题
   */
  public getTheme(): Theme {
    return this.currentTheme
  }

  /**
   * 获取当前主题 ID
   */
  public getThemeId(): string {
    return this.currentTheme.id
  }

  /**
   * 获取当前模式
   */
  public getMode(): ThemeMode {
    return this.currentMode
  }

  /**
   * 获取有效的主题模式（考虑 auto 模式）
   */
  public getEffectiveMode(): 'light' | 'dark' {
    if (this.currentMode === 'auto') {
      return this.getSystemTheme()
    }
    return this.currentMode
  }

  /**
   * 监听主题变更
   * @param callback - 回调函数
   */
  public onThemeChange(callback: (event: ThemeChangeEvent) => void): () => void {
    this.listeners.add(callback)
    // 返回取消监听函数
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 获取所有可用主题
   */
  public getAvailableThemes(): Theme[] {
    return Object.values(presets)
  }

  /**
   * 应用主题到 DOM
   */
  private applyTheme(): void {
    const theme = this.currentTheme
    const root = document.documentElement

    // 设置 CSS 变量
    root.style.setProperty('--theme-primary', theme.colors.primary)
    root.style.setProperty('--theme-secondary', theme.colors.secondary)
    root.style.setProperty('--theme-accent', theme.colors.accent)
    root.style.setProperty('--theme-background', theme.colors.background)
    root.style.setProperty('--theme-text', theme.colors.text)
    root.style.setProperty('--theme-border', theme.colors.border)

    // 设置字体
    root.style.setProperty('--theme-font-family', theme.fonts.family)
    root.style.setProperty('--theme-font-size', `${theme.fonts.size}px`)
    root.style.setProperty('--theme-font-weight', `${theme.fonts.weight}`)
    root.style.setProperty('--theme-line-height', `${theme.fonts.lineHeight}`)

    // 设置动画
    root.style.setProperty('--theme-animation-duration', `${theme.animation.duration}ms`)
    root.style.setProperty('--theme-animation-easing', theme.animation.easing)

    // 设置主题类
    const effectiveMode = this.getEffectiveMode()
    root.classList.remove('theme-light', 'theme-dark')
    root.classList.add(`theme-${effectiveMode}`)

    // 设置数据属性
    root.setAttribute('data-theme', theme.id)
    root.setAttribute('data-theme-mode', this.currentMode)
  }

  /**
   * 设置系统主题监听
   */
  private setupSystemThemeListener(): void {
    if (!window.matchMedia) return

    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaQueryList.addEventListener('change', () => {
      if (this.currentMode === 'auto') {
        this.applyTheme()
        this.notifyListeners({
          oldTheme: this.currentTheme,
          newTheme: this.currentTheme,
          timestamp: Date.now(),
        })
      }
    })
  }

  /**
   * 获取系统主题
   */
  private getSystemTheme(): 'light' | 'dark' {
    if (!window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * 保存主题到本地存储
   */
  private saveTheme(themeId: string): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId)
    } catch (e) {
      console.warn('[ThemeManager] Failed to save theme to localStorage', e)
    }
  }

  /**
   * 加载主题从本地存储
   */
  private loadTheme(): Theme | null {
    try {
      const themeId = localStorage.getItem(THEME_STORAGE_KEY)
      if (themeId) {
        return getPreset(themeId) || null
      }
    } catch (e) {
      console.warn('[ThemeManager] Failed to load theme from localStorage', e)
    }
    return null
  }

  /**
   * 保存模式到本地存储
   */
  private saveMode(mode: ThemeMode): void {
    try {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
    } catch (e) {
      console.warn('[ThemeManager] Failed to save mode to localStorage', e)
    }
  }

  /**
   * 加载模式从本地存储
   */
  private loadMode(): ThemeMode | null {
    try {
      const mode = localStorage.getItem(THEME_MODE_STORAGE_KEY)
      if (mode === 'light' || mode === 'dark' || mode === 'auto') {
        return mode
      }
    } catch (e) {
      console.warn('[ThemeManager] Failed to load mode from localStorage', e)
    }
    return null
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(event: ThemeChangeEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch (e) {
        console.error('[ThemeManager] Error in theme change listener', e)
      }
    })
  }

  /**
   * 销毁主题管理器
   */
  public destroy(): void {
    if (this.mediaQueryList) {
      this.mediaQueryList.removeEventListener('change', () => {})
    }
    this.listeners.clear()
  }
}
