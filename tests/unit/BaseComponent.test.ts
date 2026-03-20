/**
 * BaseComponent 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { BaseComponent } from '../../src/components/BaseComponent'

class TestComponent extends BaseComponent {
  public initCalled = false
  public renderCalled = false
  public destroyCalled = false

  constructor(config = {}) {
    super('TestComponent', config)
  }

  onInit() {
    this.initCalled = true
  }

  onRender() {
    this.renderCalled = true
  }

  onDestroy() {
    this.destroyCalled = true
  }
}

describe('BaseComponent', () => {
  let component: TestComponent

  beforeEach(() => {
    component = new TestComponent({ color: 'red', size: 10 })
  })

  describe('init', () => {
    it('should call onInit', () => {
      component.init()
      expect(component.initCalled).toBe(true)
    })

    it('should set isInitialized to true', () => {
      component.init()
      expect(component.isInit()).toBe(true)
    })

    it('should not init twice', () => {
      component.init()
      component.initCalled = false
      component.init()
      expect(component.initCalled).toBe(false)
    })
  })

  describe('render', () => {
    it('should require init first', () => {
      expect(() => component.render()).not.toThrow()
    })

    it('should call onRender', () => {
      component.init()
      component.render()
      expect(component.renderCalled).toBe(true)
    })
  })

  describe('update', () => {
    it('should update config', () => {
      component.init()
      component.update({ color: 'blue' })
      expect(component.getConfigValue('color')).toBe('blue')
    })
  })

  describe('destroy', () => {
    it('should call onDestroy', () => {
      component.init()
      component.destroy()
      expect(component.destroyCalled).toBe(true)
    })

    it('should set isDestroyed to true', () => {
      component.init()
      component.destroy()
      expect(component.isDestroy()).toBe(true)
    })
  })

  describe('getConfig', () => {
    it('should return config copy', () => {
      const config = component.getConfig()
      expect(config.color).toBe('red')
      expect(config.size).toBe(10)
    })
  })

  describe('getConfigValue', () => {
    it('should get config value by path', () => {
      expect(component.getConfigValue('color')).toBe('red')
    })

    it('should return default value if not found', () => {
      expect(component.getConfigValue('missing', 'default')).toBe('default')
    })
  })

  describe('setConfigValue', () => {
    it('should set config value by path', () => {
      component.setConfigValue('color', 'green')
      expect(component.getConfigValue('color')).toBe('green')
    })
  })

  describe('getName', () => {
    it('should return component name', () => {
      expect(component.getName()).toBe('TestComponent')
    })
  })
})
