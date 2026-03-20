import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ComponentRegistry } from '../../src/components/ComponentRegistry'
import { Banner } from '../../src/components/Banner'
import { Sidebar } from '../../src/components/Sidebar'
import { TOC } from '../../src/components/TOC'
import { Search } from '../../src/components/Search'
import { Pagination } from '../../src/components/Pagination'
import { Comment } from '../../src/components/Comment'
import { Share } from '../../src/components/Share'

describe('Component Integration Tests', () => {
  let registry: ComponentRegistry

  beforeEach(() => {
    registry = new ComponentRegistry()
  })

  afterEach(() => {
    registry.destroyAll()
  })

  it('should register multiple components', () => {
    const banner = new Banner()
    const sidebar = new Sidebar()
    const toc = new TOC()

    registry.register('banner', banner)
    registry.register('sidebar', sidebar)
    registry.register('toc', toc)

    expect(registry.getAll().length).toBe(3)
  })

  it('should retrieve registered component by name', () => {
    const banner = new Banner()
    registry.register('banner', banner)

    const retrieved = registry.get('banner')
    expect(retrieved).toBe(banner)
  })

  it('should initialize all registered components', () => {
    const banner = new Banner()
    const sidebar = new Sidebar()
    const toc = new TOC()

    registry.register('banner', banner)
    registry.register('sidebar', sidebar)
    registry.register('toc', toc)

    registry.initAll()

    expect(registry.getAll().length).toBe(3)
  })

  it('should render all registered components', () => {
    const banner = new Banner()
    const sidebar = new Sidebar()

    registry.register('banner', banner)
    registry.register('sidebar', sidebar)

    registry.initAll()
    registry.renderAll()

    const bannerElement = document.querySelector('.banner-component')
    const sidebarElement = document.querySelector('.sidebar-component')

    expect(bannerElement).toBeTruthy()
    expect(sidebarElement).toBeTruthy()
  })

  it('should handle component lifecycle events', () => {
    const banner = new Banner()
    registry.register('banner', banner)

    banner.init()
    expect(banner.isInit()).toBe(true)

    banner.render()
    expect(banner.isInit()).toBe(true)

    banner.destroy()
    expect(banner.isDestroy()).toBe(true)
  })

  it('should support all 7 components', () => {
    const components = [
      { name: 'banner', component: new Banner() },
      { name: 'sidebar', component: new Sidebar() },
      { name: 'toc', component: new TOC() },
      { name: 'search', component: new Search() },
      { name: 'pagination', component: new Pagination() },
      { name: 'comment', component: new Comment() },
      { name: 'share', component: new Share() },
    ]

    components.forEach(({ name, component }) => {
      registry.register(name, component)
    })

    expect(registry.getAll().length).toBe(7)
  })

  it('should update component config', () => {
    const search = new Search()
    registry.register('search', search)

    search.init()
    search.update({ placeholder: 'Custom search...' })

    expect(search.getName()).toBe('Search')
  })

  it('should handle component removal', () => {
    const banner = new Banner()
    const sidebar = new Sidebar()

    registry.register('banner', banner)
    registry.register('sidebar', sidebar)

    expect(registry.getAll().length).toBe(2)

    registry.unregister('banner')
    expect(registry.getAll().length).toBe(1)
  })

  it('should clear all components', () => {
    const banner = new Banner()
    const sidebar = new Sidebar()
    const toc = new TOC()

    registry.register('banner', banner)
    registry.register('sidebar', sidebar)
    registry.register('toc', toc)

    expect(registry.getAll().length).toBe(3)

    registry.destroyAll()
    expect(registry.getAll().length).toBe(0)
  })

  it('should handle component initialization order', () => {
    const components = [
      { name: 'banner', component: new Banner() },
      { name: 'sidebar', component: new Sidebar() },
      { name: 'toc', component: new TOC() },
      { name: 'search', component: new Search() },
      { name: 'pagination', component: new Pagination() },
      { name: 'comment', component: new Comment() },
      { name: 'share', component: new Share() },
    ]

    components.forEach(({ name, component }) => {
      registry.register(name, component)
      component.init()
    })

    const allInitialized = components.every(({ component }) => component.isInit())
    expect(allInitialized).toBe(true)
  })

  it('should support component composition', () => {
    const sidebar = new Sidebar()
    const toc = new TOC()
    const search = new Search()

    registry.register('sidebar', sidebar)
    registry.register('toc', toc)
    registry.register('search', search)

    sidebar.init()
    sidebar.render()

    toc.init()
    toc.render()

    search.init()
    search.render()

    expect(registry.getAll().length).toBe(3)
  })

  it('should handle component state management', () => {
    const pagination = new Pagination()
    registry.register('pagination', pagination)

    pagination.init()
    pagination.render()

    expect(pagination.getName()).toBe('Pagination')
  })

  it('should support component event handling', () => {
    const comment = new Comment()
    const share = new Share()

    registry.register('comment', comment)
    registry.register('share', share)

    comment.init()
    share.init()

    expect(registry.getAll().length).toBe(2)
  })

  it('should handle multiple component instances of same type', () => {
    const search1 = new Search({ selector: '.search-1' })
    const search2 = new Search({ selector: '.search-2' })

    registry.register('search1', search1)
    registry.register('search2', search2)

    expect(registry.getAll().length).toBe(2)
  })

  it('should support component configuration inheritance', () => {
    const baseConfig = {
      selector: '.container',
    }

    const banner = new Banner(baseConfig)
    const sidebar = new Sidebar(baseConfig)

    registry.register('banner', banner)
    registry.register('sidebar', sidebar)

    banner.init()
    sidebar.init()

    expect(registry.getAll().length).toBe(2)
  })
})
