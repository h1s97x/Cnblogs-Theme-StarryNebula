/**
 * Initializer - 应用初始化器
 * 
 * 功能：
 * - 协调所有模块的初始化
 * - 管理组件生命周期
 * - 处理页面特定配置
 */

import { Config, loadConfig } from '../utils/config'
import { PageManager, PageType } from '../pages/PageManager'
import { ThemeManager } from '../themes/ThemeManager'
import { ComponentRegistry } from '../components/ComponentRegistry'
import { Starfield } from '../scripts/starfield'
import { Cursor } from '../scripts/cursor'
import { Banner } from '../components/Banner'
import { Sidebar } from '../components/Sidebar'
import { executeHook } from '../hooks/lifecycle'

export interface InitializerConfig {
  autoInit?: boolean
  autoRender?: boolean
  debug?: boolean
}

/**
 * 应用初始化器
 */
export class Initializer {
  private config: Config
  private pageManager: PageManager
  private themeManager: ThemeManager
  private componentRegistry: ComponentRegistry
  private initialized: boolean = false
  private debug: boolean = false

  constructor(initConfig: InitializerConfig = {}) {
    this.debug = initConfig.debug || false
    this.config = loadConfig()
    this.pageManager = new PageManager(PageManager.detectPageType())
    this.themeManager = new ThemeManager()
    this.componentRegistry = new ComponentRegistry()

    if (initConfig.autoInit) {
      this.init()
    }
  }

  /**
   * 初始化应用
   */
  public init(): void {
    if (this.initialized) {
      console.warn('[Initializer] Already initialized')
      return
    }

    try {
      this.log('Initializing application...')

      // 执行加载前钩子
      executeHook('beforeLoad')

      // 初始化主题
      this.initTheme()

      // 初始化页面
      this.initPage()

      // 初始化组件
      this.initComponents()

      // 执行渲染前钩子
      executeHook('beforeRender')

      // 渲染所有组件
      this.componentRegistry.renderAll()

      // 执行渲染后钩子
      executeHook('afterRender')

      // 执行加载后钩子
      executeHook('afterLoad')

      this.initialized = true
      this.log('Application initialized successfully')
    } catch (error) {
      console.error('[Initializer] Initialization failed:', error)
      throw error
    }
  }

  /**
   * 初始化主题
   */
  private initTheme(): void {
    this.log('Initializing theme...')

    const themeConfig = (window as any).cnblogsConfig?.theme || {}
    this.themeManager = new ThemeManager(themeConfig.id || 'light', themeConfig.mode || 'auto')
    window.themeManager = this.themeManager

    this.log(`Theme initialized: ${this.themeManager.getThemeId()}`)
  }

  /**
   * 初始化页面
   */
  private initPage(): void {
    this.log('Initializing page...')

    const pageType = this.pageManager.getPageType()
    this.log(`Page type detected: ${pageType}`)
  }

  /**
   * 初始化组件
   */
  private initComponents(): void {
    this.log('Initializing components...')

    const pageType = this.pageManager.getPageType()
    const pageConfig = this.getPageConfig(pageType)

    // 初始化星空背景
    if (this.config.animate.starfield.enabled) {
      const canvas = document.getElementById('starfield') as HTMLCanvasElement
      if (canvas) {
        const starfield = new Starfield(canvas, {
          starCount: this.config.animate.starfield.starCount,
          speed: this.config.animate.starfield.speed,
          colors: this.config.animate.starfield.colors,
        })
        this.componentRegistry.register('starfield', starfield)
        this.log('Starfield component registered')
      }
    }

    // 初始化光标
    if (this.config.animate.cursor.enabled) {
      const cursor = new Cursor({
        size: this.config.animate.cursor.size,
        sizeF: this.config.animate.cursor.sizeF,
        color: this.config.animate.cursor.color,
        colorF: this.config.animate.cursor.colorF,
      })
      this.componentRegistry.register('cursor', cursor)
      this.log('Cursor component registered')
    }

    // 初始化 Banner
    if (pageConfig.banner?.enabled) {
      const banner = new Banner({
        title: pageConfig.banner.title || 'Welcome',
        subtitle: pageConfig.banner.subtitle || '',
        height: pageConfig.banner.height || 300,
      })
      this.componentRegistry.register('banner', banner)
      this.log('Banner component registered')
    }

    // 初始化 Sidebar
    if (pageConfig.sidebar?.enabled) {
      const sidebar = new Sidebar({
        position: pageConfig.sidebar.position || 'right',
        width: pageConfig.sidebar.width || 300,
      })
      this.componentRegistry.register('sidebar', sidebar)
      this.log('Sidebar component registered')
    }

    // 初始化所有组件
    this.componentRegistry.initAll()
    this.log(`${this.componentRegistry.size()} components initialized`)
  }

  /**
   * 获取页面配置
   */
  private getPageConfig(pageType: PageType): any {
    // 这里可以从 pages.json5 加载配置
    // 目前返回默认配置
    const defaultPageConfigs: Record<PageType, any> = {
      home: {
        banner: { enabled: true, title: 'Welcome', height: 300 },
        sidebar: { enabled: true, position: 'right', width: 300 },
      },
      article: {
        banner: { enabled: false },
        sidebar: { enabled: true, position: 'right', width: 280 },
      },
      category: {
        banner: { enabled: true, title: 'Category', height: 200 },
        sidebar: { enabled: true },
      },
      tag: {
        banner: { enabled: true, title: 'Tags', height: 200 },
        sidebar: { enabled: true },
      },
      archive: {
        banner: { enabled: true, title: 'Archive', height: 200 },
        sidebar: { enabled: true },
      },
      search: {
        banner: { enabled: true, title: 'Search Results', height: 200 },
        sidebar: { enabled: true },
      },
      user: {
        banner: { enabled: true, title: 'User Profile', height: 250 },
        sidebar: { enabled: true },
      },
      unknown: {
        banner: { enabled: false },
        sidebar: { enabled: true },
      },
    }

    return defaultPageConfigs[pageType] || {}
  }

  /**
   * 销毁应用
   */
  public destroy(): void {
    this.log('Destroying application...')
    this.componentRegistry.destroyAll()
    this.themeManager.destroy()
    this.initialized = false
    this.log('Application destroyed')
  }

  /**
   * 获取组件注册表
   */
  public getComponentRegistry(): ComponentRegistry {
    return this.componentRegistry
  }

  /**
   * 获取主题管理器
   */
  public getThemeManager(): ThemeManager {
    return this.themeManager
  }

  /**
   * 获取页面管理器
   */
  public getPageManager(): PageManager {
    return this.pageManager
  }

  /**
   * 获取配置
   */
  public getConfig(): Config {
    return this.config
  }

  /**
   * 检查是否已初始化
   */
  public isInitialized(): boolean {
    return this.initialized
  }

  /**
   * 打印日志
   */
  private log(message: string): void {
    if (this.debug) {
      console.log(`[Initializer] ${message}`)
    }
  }
}

// 全局初始化器实例
export let globalInitializer: Initializer | null = null

/**
 * 创建全局初始化器
 */
export function createInitializer(config?: InitializerConfig): Initializer {
  globalInitializer = new Initializer(config)
  return globalInitializer
}

/**
 * 获取全局初始化器
 */
export function getInitializer(): Initializer | null {
  return globalInitializer
}
