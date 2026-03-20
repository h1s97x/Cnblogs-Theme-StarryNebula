import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Notification } from '../../src/components/Notification'

describe('Notification Component', () => {
  let notification: Notification

  beforeEach(() => {
    notification = new Notification()
    notification.init()
    notification.render()
  })

  afterEach(() => {
    notification.destroy()
  })

  it('should initialize with default config', () => {
    expect(notification.getName()).toBe('Notification')
  })

  it('should show success notification', () => {
    const id = notification.success('Success', 'Operation completed')
    expect(id).toBeDefined()
    expect(notification.getCount()).toBe(1)
  })

  it('should show error notification', () => {
    const id = notification.error('Error', 'Operation failed')
    expect(id).toBeDefined()
    expect(notification.getCount()).toBe(1)
  })

  it('should show warning notification', () => {
    const id = notification.warning('Warning', 'Please be careful')
    expect(id).toBeDefined()
    expect(notification.getCount()).toBe(1)
  })

  it('should show info notification', () => {
    const id = notification.info('Info', 'Here is some information')
    expect(id).toBeDefined()
    expect(notification.getCount()).toBe(1)
  })

  it('should show multiple notifications', () => {
    notification.success('Success 1', 'Message 1')
    notification.error('Error 1', 'Message 2')
    notification.warning('Warning 1', 'Message 3')

    expect(notification.getCount()).toBe(3)
  })

  it('should close notification', () => {
    const id = notification.success('Success', 'Message')
    expect(notification.getCount()).toBe(1)

    notification.close(id)
    expect(notification.getCount()).toBe(0)
  })

  it('should close all notifications', () => {
    notification.success('Success', 'Message 1')
    notification.error('Error', 'Message 2')
    notification.warning('Warning', 'Message 3')

    expect(notification.getCount()).toBe(3)

    notification.closeAll()
    expect(notification.getCount()).toBe(0)
  })

  it('should get all notifications', () => {
    notification.success('Success', 'Message 1')
    notification.error('Error', 'Message 2')

    const all = notification.getAll()
    expect(all.length).toBe(2)
  })

  it('should respect max count', () => {
    const notif = new Notification({ maxCount: 2 })
    notif.init()
    notif.render()

    notif.success('1', 'Message 1')
    notif.success('2', 'Message 2')
    notif.success('3', 'Message 3')

    expect(notif.getCount()).toBeLessThanOrEqual(2)

    notif.destroy()
  })

  it('should support custom duration', () => {
    const id = notification.show('success', 'Title', 'Message', 5000)
    expect(id).toBeDefined()
  })

  it('should support different positions', () => {
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const
    positions.forEach((pos) => {
      const notif = new Notification({ position: pos })
      notif.init()
      notif.render()
      expect(notif).toBeDefined()
      notif.destroy()
    })
  })

  it('should show notification with custom type', () => {
    const id = notification.show('info', 'Custom', 'Custom message')
    expect(id).toBeDefined()
    expect(notification.getCount()).toBe(1)
  })

  it('should destroy notification', () => {
    notification.success('Success', 'Message')
    expect(notification.getCount()).toBe(1)

    notification.destroy()
    expect(notification.getCount()).toBe(0)
  })

  it('should update config', () => {
    notification.update({ position: 'bottom-left' })
    expect(notification).toBeDefined()
  })

  it('should handle rapid notifications', () => {
    for (let i = 0; i < 5; i++) {
      notification.success(`Title ${i}`, `Message ${i}`)
    }

    expect(notification.getCount()).toBeGreaterThan(0)
  })
})
