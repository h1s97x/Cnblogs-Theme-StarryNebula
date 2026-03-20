/**
 * Main - 主控制脚本
 * 
 * 功能：
 * - 初始化星空背景
 * - 初始化鼠标轨迹效果
 * - 主题切换
 * - 页面加载动画
 * 
 * 这是项目的入口文件，负责协调所有模块的初始化
 */
import '../styles/main.less'
import { Starfield } from './starfield'
import { MouseTrail } from './mouse-trail'

/** 博客园配置接口 */
interface CnblogsConfig {
  info?: {
    name?: string
    startDate?: string
    avatar?: string
  }
}

/** 扩展全局Window接口 */
declare global {
  interface Window {
    cnblogsConfig?: CnblogsConfig
  }
}

/**
 * 初始化所有模块
 * 在DOM加载完成后调用
 */
function init(): void {
  initStarfield()
  initMouseTrail()
  initThemeToggle()
}

/**
 * 初始化星空背景
 * 查找Canvas元素并创建Starfield实例
 */
function initStarfield(): void {
  const canvas = document.getElementById('starfield') as HTMLCanvasElement
  if (canvas) {
    new Starfield(canvas, {
      starCount: 200,
      speed: 0.5,
      colors: ['#ffffff', '#e0e6ff', '#ffd4e5']
    })
  }
}

/**
 * 初始化鼠标轨迹效果
 * 创建MouseTrail实例并初始化
 */
function initMouseTrail(): void {
  const trail = new MouseTrail({
    particleCount: 8,
    particleSize: 4,
    particleColor: '#64b5f6',
    duration: 800
  })
  trail.init()
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

  // 从本地存储读取主题设置
  const isDark = localStorage.getItem('theme') === 'dark'
  updateThemeIcon(isDark)
  if (isDark) {
    document.documentElement.classList.add('dark-theme')
  }

  // 绑定切换事件
  toggle.addEventListener('click', () => {
    const isDarkNow = document.documentElement.classList.toggle('dark-theme')
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light')
    updateThemeIcon(isDarkNow)
  })
}

/**
 * 更新主题图标
 * @param isLight - 是否为亮色主题
 */
function updateThemeIcon(isLight: boolean): void {
  const icon = document.querySelector('.theme-icon') as HTMLElement
  if (icon) {
    icon.textContent = isLight ? '☀️' : '🌙'
  }
}

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
