/**
 * EventBus 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { EventBus } from '../../src/core/EventBus'

describe('EventBus', () => {
  let eventBus: EventBus

  beforeEach(() => {
    eventBus = new EventBus()
  })

  describe('on', () => {
    it('should register event listener', () => {
      const handler = () => {}
      eventBus.on('test', handler)
      expect(eventBus.has('test')).toBe(true)
    })

    it('should return unsubscribe function', () => {
      const handler = () => {}
      const unsubscribe = eventBus.on('test', handler)
      expect(typeof unsubscribe).toBe('function')
      unsubscribe()
      expect(eventBus.has('test')).toBe(false)
    })

    it('should support priority', () => {
      const results: number[] = []
      eventBus.on('test', () => results.push(1), 1)
      eventBus.on('test', () => results.push(2), 2)
      eventBus.on('test', () => results.push(3), 3)
      eventBus.emitSync('test')
      expect(results).toEqual([3, 2, 1])
    })
  })

  describe('once', () => {
    it('should only trigger once', () => {
      let count = 0
      eventBus.once('test', () => {
        count++
      })
      eventBus.emitSync('test')
      eventBus.emitSync('test')
      expect(count).toBe(1)
    })
  })

  describe('off', () => {
    it('should remove event listener', () => {
      const handler = () => {}
      eventBus.on('test', handler)
      expect(eventBus.has('test')).toBe(true)
      eventBus.off('test', handler)
      expect(eventBus.has('test')).toBe(false)
    })
  })

  describe('emitSync', () => {
    it('should call all listeners', () => {
      const results: string[] = []
      eventBus.on('test', () => results.push('a'))
      eventBus.on('test', () => results.push('b'))
      eventBus.emitSync('test')
      expect(results).toEqual(['a', 'b'])
    })

    it('should pass data to listeners', () => {
      let receivedData: any
      eventBus.on('test', (data) => {
        receivedData = data
      })
      eventBus.emitSync('test', { message: 'hello' })
      expect(receivedData).toEqual({ message: 'hello' })
    })
  })

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      eventBus.on('test', () => {})
      eventBus.on('test', () => {})
      expect(eventBus.listenerCount('test')).toBe(2)
    })
  })

  describe('eventNames', () => {
    it('should return all event names', () => {
      eventBus.on('event1', () => {})
      eventBus.on('event2', () => {})
      const names = eventBus.eventNames()
      expect(names).toContain('event1')
      expect(names).toContain('event2')
    })
  })
})
