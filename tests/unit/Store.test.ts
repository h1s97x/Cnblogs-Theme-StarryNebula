/**
 * Store 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Store } from '../../src/core/Store'
import { EventBus } from '../../src/core/EventBus'

describe('Store', () => {
  let store: Store
  let eventBus: EventBus

  beforeEach(() => {
    eventBus = new EventBus()
    store = new Store(
      {
        user: { name: 'John', age: 30 },
        settings: { theme: 'light' }
      },
      eventBus,
      { persist: false }
    )
  })

  describe('get', () => {
    it('should get state value', () => {
      expect(store.get('user.name')).toBe('John')
    })

    it('should return default value if path not found', () => {
      expect(store.get('user.email', 'default@example.com')).toBe('default@example.com')
    })

    it('should support nested paths', () => {
      expect(store.get('user.age')).toBe(30)
    })
  })

  describe('set', () => {
    it('should set state value', () => {
      store.set('user.name', 'Jane')
      expect(store.get('user.name')).toBe('Jane')
    })

    it('should trigger watchers', () => {
      let newValue: any
      store.watch('user.name', (value) => {
        newValue = value
      })
      store.set('user.name', 'Jane')
      expect(newValue).toBe('Jane')
    })

    it('should emit store:changed event', () => {
      let eventData: any
      eventBus.on('store:changed', (data) => {
        eventData = data
      })
      store.set('user.name', 'Jane')
      expect(eventData.path).toBe('user.name')
      expect(eventData.newValue).toBe('Jane')
    })
  })

  describe('update', () => {
    it('should batch update state', () => {
      store.update({
        'user.name': 'Jane',
        'settings.theme': 'dark'
      })
      expect(store.get('user.name')).toBe('Jane')
      expect(store.get('settings.theme')).toBe('dark')
    })
  })

  describe('getState', () => {
    it('should return complete state', () => {
      const state = store.getState()
      expect(state.user.name).toBe('John')
      expect(state.settings.theme).toBe('light')
    })
  })

  describe('setState', () => {
    it('should replace entire state', () => {
      store.setState({ newKey: 'newValue' })
      expect(store.get('newKey')).toBe('newValue')
      expect(store.get('user.name')).toBeUndefined()
    })
  })

  describe('reset', () => {
    it('should reset to initial state', () => {
      store.set('user.name', 'Jane')
      store.reset({ user: { name: 'John' } })
      expect(store.get('user.name')).toBe('John')
    })
  })

  describe('watch', () => {
    it('should watch state changes', () => {
      let callCount = 0
      store.watch('user.name', () => {
        callCount++
      })
      store.set('user.name', 'Jane')
      store.set('user.name', 'Bob')
      expect(callCount).toBe(2)
    })

    it('should return unwatch function', () => {
      let callCount = 0
      const unwatch = store.watch('user.name', () => {
        callCount++
      })
      store.set('user.name', 'Jane')
      unwatch()
      store.set('user.name', 'Bob')
      expect(callCount).toBe(1)
    })
  })
})
