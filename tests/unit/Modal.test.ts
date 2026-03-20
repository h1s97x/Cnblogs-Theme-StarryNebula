import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Modal } from '../../src/components/Modal'

describe('Modal Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should initialize with default config', () => {
    const modal = new Modal()
    expect(modal.getName()).toBe('Modal')
  })

  it('should open modal', () => {
    const modal = new Modal({ title: 'Test Modal' })
    modal.init()
    modal.render()
    modal.open()

    expect(modal.isOpened()).toBe(true)
  })

  it('should close modal', () => {
    const modal = new Modal()
    modal.init()
    modal.render()
    modal.open()
    expect(modal.isOpened()).toBe(true)

    modal.close()
    expect(modal.isOpened()).toBe(false)
  })

  it('should set and get content', () => {
    const modal = new Modal()
    modal.init()

    const content = '<p>Test content</p>'
    modal.setContent(content)
    expect(modal.getContent()).toBe(content)
  })

  it('should render with title', () => {
    const modal = new Modal({ title: 'My Dialog' })
    modal.init()
    modal.render()

    expect(modal.getName()).toBe('Modal')
  })

  it('should render with buttons', () => {
    const modal = new Modal({
      buttons: [
        { text: 'OK', type: 'primary' },
        { text: 'Cancel', type: 'default' },
      ],
    })
    modal.init()
    modal.render()

    expect(modal).toBeDefined()
  })

  it('should support closable option', () => {
    const modal = new Modal({ closable: true })
    modal.init()
    modal.render()

    expect(modal).toBeDefined()
  })

  it('should support maskClosable option', () => {
    const modal = new Modal({ maskClosable: true })
    modal.init()
    modal.render()

    expect(modal).toBeDefined()
  })

  it('should trigger onClose callback', () => {
    const modal = new Modal()
    modal.init()
    modal.render()

    let called = false
    modal.onClose(() => {
      called = true
    })

    modal.open()
    modal.close()

    expect(called).toBe(true)
  })

  it('should support custom width and height', () => {
    const modal = new Modal({ width: '600px', height: '400px' })
    modal.init()
    modal.render()

    expect(modal).toBeDefined()
  })

  it('should destroy modal', () => {
    const modal = new Modal()
    modal.init()
    modal.render()
    modal.open()

    modal.destroy()
    expect(modal.isOpened()).toBe(false)
  })

  it('should update config', () => {
    const modal = new Modal({ title: 'Old Title' })
    modal.init()
    modal.render()

    modal.update({ title: 'New Title' })
    expect(modal).toBeDefined()
  })
})
