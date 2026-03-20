/**
 * ExamplePlugin - 示例插件
 * 
 * 演示如何创建和使用插件
 */

import { Plugin } from '../core/PluginSystem'
import { Initializer } from '../core/Initializer'
import { EventBus } from '../core/EventBus'

/**
 * 示例插件
 * 
 * 功能：
 * - 监听主题变更事件
 * - 在控制台输出日志
 * - 演示插件生命周期
 */
export const ExamplePlugin: Plugin = {
  name: 'example-plugin',
  version: '1.0.0',

  async install(initializer: Initializer, eventBus: EventBus) {
    console.log('[ExamplePlugin] Installing...')

    // 获取主题管理器
    const themeManager = initializer.getThemeManager()

    // 监听主题变更
    themeManager.onThemeChange((event) => {
      console.log('[ExamplePlugin] Theme changed:', {
        oldTheme: event.oldTheme.id,
        newTheme: event.newTheme.id,
      })
      eventBus.emitSync('example:theme-changed', event)
    })

    // 监听组件初始化完成
    eventBus.on('plugin:registered', (data) => {
      console.log('[ExamplePlugin] Plugin registered:', data)
    })

    console.log('[ExamplePlugin] Installed successfully')
  },

  async uninstall() {
    console.log('[ExamplePlugin] Uninstalling...')
    console.log('[ExamplePlugin] Uninstalled successfully')
  },
}

/**
 * 创建一个自定义插件示例
 */
export const CustomPlugin: Plugin = {
  name: 'custom-plugin',
  version: '1.0.0',

  async install(initializer: Initializer, eventBus: EventBus) {
    console.log('[CustomPlugin] Installing...')

    // 获取组件注册表
    const registry = initializer.getComponentRegistry()

    // 监听所有组件初始化
    eventBus.on('component:initialized', (data) => {
      console.log('[CustomPlugin] Component initialized:', data.name)
    })

    // 添加自定义事件处理
    eventBus.on('custom:event', async (data) => {
      console.log('[CustomPlugin] Custom event received:', data)
    })

    console.log('[CustomPlugin] Installed successfully')
  },

  async uninstall() {
    console.log('[CustomPlugin] Uninstalling...')
  },
}
