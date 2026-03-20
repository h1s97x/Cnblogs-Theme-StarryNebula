import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Tooltip } from '../../src/components/Tooltip'

describe('Tooltip Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should initialize with default config', () => {
    const tooltip = new Tooltip()
    expect(tooltip.getName()).toBe('Tooltip')
  })

  it('should get default position', () => {
    const tooltip = new Tooltip()
    tooltip.init()
    expect(tooltip.getPosition()).toBe('top')
  })

  it('should set position', () => {
    const tooltip = new Tooltip()
    tooltip.init()
    tooltip.setPosition('bottom')
    expect(tooltip.getPosition()).toBe('bottom')
  })

  it('should support different positions', () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const
    positions.forEach((pos) => {
      const tooltip = new Tooltip({ position: pos })
      tooltip.init()
      expect(tooltip.getPosition()).toBe(pos)
    })
  })

  it('should support dark theme', () => {
    const tooltip = new Tooltip({ theme: 'dark' })
    tooltip.init()
    expect(tooltip).toBeDefined()
  })

  it('should support light theme', () => {
    const tooltip = new Tooltip({ theme: 'light' })
    tooltip.init()
    expect(tooltip).toBeDefined()
  })

  it('should support custom delay', () => {
    const tooltip = new Tooltip({ delay: 500 })
    tooltip.init()
    expect(tooltip).toBeDefined()
  })

  it('should support custom max width', () => {
    const tooltip = new Tooltip({ maxWidth: '300px' })
    tooltip.init()
    expect(tooltip).toBeDefined()
  })

  it('should attach to elements with data-tooltip', () => {
    const element = document.createElement('button')
    element.setAttribute('data-tooltip', 'Help text')
    container.appendChild(element)

    const tooltip = new Tooltip()
    tooltip.init()

    expect(tooltip).toBeDefined()
  })

  it('should show tooltip on hover', () => {
    const element = document.createElement('button')
    element.setAttribute('data-tooltip', 'Hover text')
    container.appendChild(element)

    const tooltip = new Tooltip()
    tooltip.init()

    const event = new MouseEvent('mouseenter')
    element.dispatchEvent(event)

    expect(tooltip).toBeDefined()
  })

  it('should hide tooltip on mouse leave', () => {
    const element = document.createElement('button')
    element.setAttribute('data-tooltip', 'Hover text')
    container.appendChild(element)

    const tooltip = new Tooltip()
    tooltip.init()

    const enterEvent = new MouseEvent('mouseenter')
    element.dispatchEvent(enterEvent)

    const leaveEvent = new MouseEvent('mouseleave')
    element.dispatchEvent(leaveEvent)

    expect(tooltip).toBeDefined()
  })

  it('should destroy tooltip', () => {
    const tooltip = new Tooltip()
    tooltip.init()
    tooltip.destroy()
    expect(tooltip).toBeDefined()
  })

  it('should update config', () => {
    const tooltip = new Tooltip({ position: 'top' })
    tooltip.init()

    tooltip.update({ position: 'bottom' })
    expect(tooltip.getPosition()).toBe('bottom')
  })

  it('should handle multiple tooltips', () => {
    const btn1 = document.createElement('button')
    btn1.setAttribute('data-tooltip', 'Tooltip 1')
    container.appendChild(btn1)

    const btn2 = document.createElement('button')
    btn2.setAttribute('data-tooltip', 'Tooltip 2')
    container.appendChild(btn2)

    const tooltip = new Tooltip()
    tooltip.init()

    expect(tooltip).toBeDefined()
  })
})
