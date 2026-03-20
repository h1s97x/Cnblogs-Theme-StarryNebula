/**
 * Config - 配置管理系统
 * 
 * 功能：
 * - 加载默认配置
 * - 合并用户配置
 * - 提供配置访问接口
 * 
 * 使用示例：
 * ```typescript
 * const config = loadConfig()
 * console.log(config.animate.cursor.enabled)
 * ```
 */

/** 光标配置接口 */
interface CursorConfig {
  enabled: boolean
  size: number
  sizeF: number
  color: string
  colorF: string
}

/** 星空配置接口 */
interface StarfieldConfig {
  enabled: boolean
  starCount: number
  speed: number
  colors: string[]
}

/** 动画配置接口 */
interface AnimateConfig {
  starfield: StarfieldConfig
  cursor: CursorConfig
}

/** 主题配置接口 */
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  colors: {
    primary: string
    secondary: string
  }
}

/** 页面配置接口 */
interface PageConfig {
  [key: string]: {
    enabled: boolean
    [key: string]: any
  }
}

/** 完整配置接口 */
export interface Config {
  info: {
    name: string
    startDate: string
    avatar: string
  }
  animate: AnimateConfig
  theme: ThemeConfig
  pages: PageConfig
}

/** 默认配置 */
const defaultConfig: Config = {
  info: {
    name: '',
    startDate: '2021-01-01',
    avatar: '',
  },
  animate: {
    starfield: {
      enabled: true,
      starCount: 200,
      speed: 0.5,
      colors: ['#ffffff', '#e0e6ff', '#ffd4e5'],
    },
    cursor: {
      enabled: true,
      size: 12,
      sizeF: 4,
      color: '#64b5f6',
      colorF: '#ffffff',
    },
  },
  theme: {
    mode: 'auto',
    colors: {
      primary: '#64b5f6',
      secondary: '#ffd4e5',
    },
  },
  pages: {
    home: {
      enabled: true,
      banner: true,
    },
    article: {
      enabled: true,
      toc: true,
    },
  },
}

/**
 * 加载配置
 * 从 window.cnblogsConfig 读取用户配置，与默认配置合并
 * @returns 合并后的配置对象
 */
export function loadConfig(): Config {
  // 从全局 window 对象读取用户配置
  const userConfig = (window as any).cnblogsConfig || {}

  // 深度合并配置
  return deepMerge(defaultConfig, userConfig)
}

/**
 * 深度合并对象
 * @param target - 目标对象
 * @param source - 源对象
 * @returns 合并后的对象
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(result[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }
  }

  return result
}

/**
 * 获取配置值
 * 支持点号路径访问，如 'animate.cursor.enabled'
 * @param config - 配置对象
 * @param path - 配置路径
 * @param defaultValue - 默认值
 * @returns 配置值
 */
export function getConfigValue(
  config: Config,
  path: string,
  defaultValue?: any
): any {
  const keys = path.split('.')
  let value: any = config

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return defaultValue
    }
  }

  return value
}
