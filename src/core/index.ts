/**
 * Core - 核心模块入口
 * 
 * 导出所有核心系统
 */

export { Initializer, InitializerConfig, createInitializer, getInitializer, globalInitializer } from './Initializer'
export { EventBus, EventHandler, EventListener, globalEventBus } from './EventBus'
export { PluginSystem, Plugin } from './PluginSystem'
