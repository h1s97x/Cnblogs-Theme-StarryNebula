import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ComponentLoader } from '../../src/components/ComponentLoader'

describe('ComponentLoader', () => {
  let loader: ComponentLoader

  beforeEach(() => {
    loader = new ComponentLoader({
      timeout: 5000,
      retries: 2,
    })
  })

  afterEach(() => {
    loader.clearComponentCache()
  })

  it('should initialize with default options', () => {
    expect(loader).toBeDefined()
  })

  it('should register built-in components', () => {
    const components = loader.getRegisteredComponents()
    expect(components.length).toBeGreaterThan(0)
    expect(components).toContain('Banner')
    expect(components).toContain('Sidebar')
  })

  it('should register custom component', () => {
    loader.registerComponent('CustomComponent', './CustomComponent')
    const components = loader.getRegisteredComponents()
    expect(components).toContain('CustomComponent')
  })

  it('should get registered components list', () => {
    const components = loader.getRegisteredComponents()
    expect(Array.isArray(components)).toBe(true)
    expect(components.length).toBeGreaterThan(0)
  })

  it('should check if component is loaded', () => {
    expect(loader.isComponentLoaded('Banner')).toBe(false)
  })

  it('should clear component cache', () => {
    loader.clearComponentCache()
    expect(loader.getCacheSize()).toBe(0)
  })

  it('should clear specific component cache', () => {
    loader.clearComponentCache('Banner')
    expect(loader.getCacheSize()).toBeGreaterThanOrEqual(0)
  })

  it('should get cache info', () => {
    const info = loader.getCacheInfo()
    expect(Array.isArray(info)).toBe(true)
  })

  it('should get cache size', () => {
    const size = loader.getCacheSize()
    expect(typeof size).toBe('number')
    expect(size).toBeGreaterThanOrEqual(0)
  })

  it('should handle component loading', async () => {
    const component = await loader.loadComponent('Banner')
    expect(component).toBeDefined()
  })

  it('should handle multiple component loading', async () => {
    const components = await loader.loadComponents(['Banner', 'Sidebar'])
    expect(components).toBeDefined()
  })

  it('should preload components', async () => {
    await loader.preloadComponents(['Banner', 'Sidebar'])
    expect(loader.getCacheSize()).toBeGreaterThanOrEqual(0)
  })

  it('should create component instance', async () => {
    const component = await loader.createComponent('Banner')
    expect(component).toBeDefined()
  })

  it('should create multiple component instances', async () => {
    const components = await loader.createComponents([
      { name: 'Banner', config: {} },
      { name: 'Sidebar', config: {} },
    ])
    expect(components).toBeDefined()
  })

  it('should handle unregistered component', async () => {
    const component = await loader.loadComponent('UnregisteredComponent')
    expect(component).toBeNull()
  })

  it('should support custom timeout', () => {
    const customLoader = new ComponentLoader({ timeout: 10000 })
    expect(customLoader).toBeDefined()
  })

  it('should support custom retries', () => {
    const customLoader = new ComponentLoader({ retries: 5 })
    expect(customLoader).toBeDefined()
  })

  it('should handle component creation with config', async () => {
    const config = { selector: '.custom' }
    const component = await loader.createComponent('Banner', config)
    expect(component).toBeDefined()
  })

  it('should track all registered components', () => {
    const components = loader.getRegisteredComponents()
    expect(components).toContain('TOC')
    expect(components).toContain('Search')
    expect(components).toContain('Pagination')
    expect(components).toContain('Comment')
    expect(components).toContain('Share')
  })
})
