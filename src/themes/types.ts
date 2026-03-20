/**
 * Theme Types - 主题类型定义
 * 
 * 定义主题系统的所有类型和接口
 */

/** 颜色配置 */
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
  [key: string]: string
}

/** 字体配置 */
export interface ThemeFonts {
  family: string
  size: number
  weight: number
  lineHeight: number
}

/** 动画配置 */
export interface ThemeAnimation {
  duration: number
  easing: string
  enabled: boolean
}

/** 光标配置 */
export interface ThemeCursor {
  enabled: boolean
  size: number
  sizeF: number
  color: string
  colorF: string
}

/** 星空配置 */
export interface ThemeStarfield {
  enabled: boolean
  starCount: number
  speed: number
  colors: string[]
}

/** 完整主题配置 */
export interface Theme {
  id: string
  name: string
  description: string
  colors: ThemeColors
  fonts: ThemeFonts
  animation: ThemeAnimation
  cursor: ThemeCursor
  starfield: ThemeStarfield
  [key: string]: any
}

/** 主题变更事件 */
export interface ThemeChangeEvent {
  oldTheme: Theme
  newTheme: Theme
  timestamp: number
}

/** 主题模式 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/** 主题存储键 */
export const THEME_STORAGE_KEY = 'starry-nebula-theme'
export const THEME_MODE_STORAGE_KEY = 'starry-nebula-theme-mode'
