/**
 * Theme Presets - 预设主题
 * 
 * 包含多个预设主题配置
 */

import { Theme } from './types'

/** 亮色主题 */
export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  description: 'Clean and bright light theme',
  colors: {
    primary: '#64b5f6',
    secondary: '#ffd4e5',
    accent: '#ff6b9d',
    background: '#ffffff',
    text: '#333333',
    border: '#e0e0e0',
  },
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: 14,
    weight: 400,
    lineHeight: 1.6,
  },
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enabled: true,
  },
  cursor: {
    enabled: true,
    size: 12,
    sizeF: 4,
    color: '#64b5f6',
    colorF: '#ffffff',
  },
  starfield: {
    enabled: true,
    starCount: 200,
    speed: 0.5,
    colors: ['#ffffff', '#e0e6ff', '#ffd4e5'],
  },
}

/** 暗色主题 */
export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  description: 'Elegant and comfortable dark theme',
  colors: {
    primary: '#64b5f6',
    secondary: '#ffd4e5',
    accent: '#ff6b9d',
    background: '#1a1a1a',
    text: '#e0e0e0',
    border: '#333333',
  },
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: 14,
    weight: 400,
    lineHeight: 1.6,
  },
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enabled: true,
  },
  cursor: {
    enabled: true,
    size: 12,
    sizeF: 4,
    color: '#64b5f6',
    colorF: '#ffffff',
  },
  starfield: {
    enabled: true,
    starCount: 200,
    speed: 0.5,
    colors: ['#ffffff', '#e0e6ff', '#ffd4e5'],
  },
}

/** 海洋主题 */
export const oceanTheme: Theme = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Cool ocean-inspired theme',
  colors: {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#0891b2',
    background: '#0f172a',
    text: '#e0f2fe',
    border: '#164e63',
  },
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: 14,
    weight: 400,
    lineHeight: 1.6,
  },
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enabled: true,
  },
  cursor: {
    enabled: true,
    size: 12,
    sizeF: 4,
    color: '#0ea5e9',
    colorF: '#06b6d4',
  },
  starfield: {
    enabled: true,
    starCount: 250,
    speed: 0.6,
    colors: ['#0ea5e9', '#06b6d4', '#0891b2'],
  },
}

/** 森林主题 */
export const forestTheme: Theme = {
  id: 'forest',
  name: 'Forest',
  description: 'Natural forest-inspired theme',
  colors: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#6ee7b7',
    background: '#064e3b',
    text: '#d1fae5',
    border: '#047857',
  },
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: 14,
    weight: 400,
    lineHeight: 1.6,
  },
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enabled: true,
  },
  cursor: {
    enabled: true,
    size: 12,
    sizeF: 4,
    color: '#10b981',
    colorF: '#34d399',
  },
  starfield: {
    enabled: true,
    starCount: 180,
    speed: 0.4,
    colors: ['#10b981', '#34d399', '#6ee7b7'],
  },
}

/** 紫色主题 */
export const purpleTheme: Theme = {
  id: 'purple',
  name: 'Purple',
  description: 'Mystical purple-inspired theme',
  colors: {
    primary: '#a855f7',
    secondary: '#d946ef',
    accent: '#ec4899',
    background: '#2d1b4e',
    text: '#f3e8ff',
    border: '#6b21a8',
  },
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: 14,
    weight: 400,
    lineHeight: 1.6,
  },
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enabled: true,
  },
  cursor: {
    enabled: true,
    size: 12,
    sizeF: 4,
    color: '#a855f7',
    colorF: '#d946ef',
  },
  starfield: {
    enabled: true,
    starCount: 220,
    speed: 0.55,
    colors: ['#a855f7', '#d946ef', '#ec4899'],
  },
}

/** 所有预设主题 */
export const presets: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  purple: purpleTheme,
}

/** 获取预设主题 */
export function getPreset(id: string): Theme | undefined {
  return presets[id]
}

/** 获取所有预设主题 ID */
export function getPresetIds(): string[] {
  return Object.keys(presets)
}

/** 获取所有预设主题 */
export function getAllPresets(): Theme[] {
  return Object.values(presets)
}
