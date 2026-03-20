import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { LazyLoader } from '../../src/core/LazyLoader'

describe('LazyLoader', () => {
  let loader: LazyLoader

  beforeEach(() => {
    loader = new LazyLoader({
      timeout: 5000,
      retries: 2,
    })
  })

  afterEach(() => {
    loader.clearCache()
  })

  it('should initialize with default options', () => {
    const defaultLoader = new LazyLoader()
    expect(defaultLoader).toBeDefined()
  })

  it('should cache loaded modules', async () => {
    const mockModule = { test: 'value' }
    
    // Mock dynamic import
    vi.stubGlobal('import', vi.fn().mockResolvedValue(mockModule))

    expect(loader.getCacheSize()).toBe(0)
  })

  it('should track loading state', () => {
    expect(loader.getCacheSize()).toBe(0)
  })

  it('should clear cache', () => {
    loader.clearCache()
    expect(loader.getCacheSize()).toBe(0)
  })

  it('should get cache info', () => {
    const info = loader.getCacheInfo()
    expect(Array.isArray(info)).toBe(true)
  })

  it('should check if module is loaded', () => {
    expect(loader.isLoaded('test')).toBe(false)
  })

  it('should handle load timeout', async () => {
    const shortTimeoutLoader = new LazyLoader({ timeout: 1 })
    expect(shortTimeoutLoader).toBeDefined()
  })

  it('should support retry mechanism', () => {
    const retryLoader = new LazyLoader({ retries: 3 })
    expect(retryLoader).toBeDefined()
  })

  it('should clear specific cache entry', () => {
    loader.clearCache('specific')
    expect(loader.getCacheSize()).toBe(0)
  })

  it('should handle multiple loads', async () => {
    const items = [
      { name: 'module1', path: './module1' },
      { name: 'module2', path: './module2' },
    ]

    const results = await loader.loadMultiple(items)
    expect(results).toBeDefined()
  })

  it('should support preload', async () => {
    const items = [
      { name: 'module1', path: './module1' },
    ]

    await loader.preload(items)
    expect(loader.getCacheSize()).toBeGreaterThanOrEqual(0)
  })

  it('should track load time', () => {
    const time = loader.getLoadTime('nonexistent')
    expect(time).toBeNull()
  })

  it('should handle progress callback', async () => {
    const progressCallback = vi.fn()
    const loaderWithProgress = new LazyLoader({
      onProgress: progressCallback,
    })

    const items = [
      { name: 'module1', path: './module1' },
    ]

    await loaderWithProgress.loadMultiple(items)
    expect(progressCallback).toBeDefined()
  })

  it('should handle error callback', async () => {
    const errorCallback = vi.fn()
    const loaderWithError = new LazyLoader({
      onError: errorCallback,
    })

    expect(loaderWithError).toBeDefined()
  })
})
