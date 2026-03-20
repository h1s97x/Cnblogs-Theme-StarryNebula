/**
 * Main - 主控制脚本
 * 
 * 功能：
 * - 初始化应用
 * - 协调所有模块
 * 
 * 这是项目的入口文件
 */
import '../styles/main.less'
import '../styles/cursor.less'
import { createInitializer } from '../core/Initializer'

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const initializer = createInitializer({ debug: false, autoInit: true })
    window.initializer = initializer
  })
} else {
  const initializer = createInitializer({ debug: false, autoInit: true })
  window.initializer = initializer
}

// 扩展全局 Window 接口
declare global {
  interface Window {
    initializer?: any
    themeManager?: any
  }
}
