/**
 * Main - 主控制脚本
 * 
 * 功能：
 * - 加载配置系统
 * - 初始化主题管理器
 * - 初始化星空背景
 * - 初始化光标效果
 * - 主题切换
 * - 页面加载动画
 * 
 * 这是项目的入口文件，负责协调所有模块的初始化
 */
import '../styles/main.less'
import '../styles/cursor.less'
import { Starfield } from './starfield'
import { Cursor } from './cursor'
import { loadConfig, Config } from '../utils/config'
import { detectPageType } from '../utils/pageDetector'
import { executeHook } from '../hooks/lifecycle'
import { ThemeManager } from '../themes/ThemeManager'

/** 博客园配置接口 */
interface CnblogsConfig {
  info?: {
    name?: string
    startDate?: string
    avatar?: string
  }
  theme?: {
    id?: string
    mode?: 'light' | 'dark' | 'auto'
  }
}

/** 扩展全局Window接口 */
declare global {
  interface Window {
    cnblogsConfig?: CnblogsConfig
    themeManager?: ThemeManager
  }
}

/** 全局配置对象 */
let globalConfig: Config
let themeManager: ThemeManager

/**
 * 初始化所有模块
 * 在DOM加载完成后调用
 */
function init(): void {
  // 执行加载前钩子
  executeHook('beforeLoad')

  // 加载配置
  globalConfig = loadConfig()

  // 初始化主题管理器
  const themeConfig = (window as any).cnblogsConfig?.theme || {}
  themeManager = new ThemeManager(themeConfig.id || 'light', themeConfig.mode || 'auto')
  window.themeManager = themeManager

  // 检测页面类型
  const pageType = detectPageType()
  console.log(`[StarryNebula] Page type: ${pageType}`)

  // 执行渲染前钩子
  executeHook('beforeRender')

  // 初始化各个模块
  if (globalConfig.animate.starfield.enabled) {
    initStarfield()
  }

  if (globalConfig.animate.cursor.enabled) {
    initCursor()
  }

  initThemeToggle()

  // 执行渲染后钩子
  executeHook('afterRender')

  // 执行加载后钩子
  executeHook('afterLoad')
}

/**
 * 初始化星空背景
 * 查找Canvas元素并创建Starfield实例
 */
function initStarfield(): void {
  const canvas = document.getElementById('starfield') as HTMLCanvasElement
  if (canvas) {
    const config = globalConfig.animate.starfield
    new Starfield(canvas, {
      starCount: config.starCount,
      speed: config.speed,
      colors: config.colors
    })
  }
}

/**
 * 初始化光标效果
 * 创建Cursor实例并初始化
 */
function initCursor(): void {
  const config = globalConfig.animate.cursor
  const cursor = new Cursor({
    size: config.size,
    sizeF: config.sizeF,
    color: config.color,
    colorF: config.colorF
  })
  cursor.init()
}

/**
 * 初始化主题切换功能
 * - 从localStorage读取保存的主题
 * - 绑定切换按钮事件
 * - 更新主题图标
 */
function initThemeToggle(): void {
  const toggle = document.getElementById('themeToggle') as HTMLButtonElement
  if (!toggle) return

  // 绑定切换事件
  toggle.addEventListener('click', () => {
    themeManager.toggleTheme()
    updateThemeIcon()
  })

  // 初始化图标
  updateThemeIcon()
}

/**
 * 更新主题图标
 */
function updateThemeIcon(): void {
  const icon = document.querySelector('.theme-icon') as HTMLElement
  if (icon) {
    const mode = themeManager.getEffectiveMode()
    icon.textContent = mode === 'dark' ? '☀️' : '🌙'
  }
}

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
