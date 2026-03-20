import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Share, SharePlatform } from '../../src/components/Share'

describe('Share Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.className = 'share'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should initialize with default config', () => {
    const share = new Share()
    expect(share.getName()).toBe('Share')
  })

  it('should get supported platforms', () => {
    const share = new Share()
    share.init()
    const platforms = share.getSupportedPlatforms()
    expect(platforms).toContain('twitter')
    expect(platforms).toContain('facebook')
    expect(platforms).toContain('linkedin')
    expect(platforms).toContain('email')
  })

  it('should set custom share URL', () => {
    const share = new Share()
    share.init()

    const customUrl = 'https://example.com/article'
    share.setShareUrl(customUrl)
    expect(share.getShareUrl()).toBe(customUrl)
  })

  it('should get share URL', () => {
    const customUrl = 'https://example.com/article'
    const share = new Share({ url: customUrl })
    share.init()
    expect(share.getShareUrl()).toBe(customUrl)
  })

  it('should add custom platform', () => {
    const share = new Share()
    share.init()

    const customPlatform: SharePlatform = {
      name: 'Custom',
      icon: 'C',
      url: 'https://custom.com/share?url={url}',
      color: '#FF0000',
    }

    share.addPlatform('custom', customPlatform)
    const platforms = share.getSupportedPlatforms()
    expect(platforms).toContain('custom')
  })

  it('should initialize with custom platforms list', () => {
    const share = new Share({
      platforms: ['twitter', 'facebook'],
    })
    share.init()
    expect(share.getSupportedPlatforms()).toContain('twitter')
    expect(share.getSupportedPlatforms()).toContain('facebook')
  })

  it('should initialize with title and description', () => {
    const share = new Share({
      title: 'My Article',
      description: 'This is a great article',
      url: 'https://example.com/article',
    })
    share.init()
    expect(share.getShareUrl()).toBe('https://example.com/article')
  })

  it('should handle copy to clipboard', () => {
    const share = new Share()
    share.init()

    const url = 'https://example.com/article'
    share.setShareUrl(url)

    expect(share.getShareUrl()).toBe(url)
  })

  it('should render share component', () => {
    const share = new Share()
    share.init()
    share.render()

    const shareElement = document.querySelector('.share-component')
    expect(shareElement).toBeTruthy()
  })

  it('should render share buttons', () => {
    const share = new Share({
      platforms: ['twitter', 'facebook'],
    })
    share.init()
    share.render()

    const buttons = document.querySelectorAll('.share-button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should render copy link section', () => {
    const share = new Share({ showCopy: true })
    share.init()
    share.render()

    const copySection = document.querySelector('.share-copy')
    expect(copySection).toBeTruthy()
  })

  it('should not render copy link section when disabled', () => {
    const share = new Share({ showCopy: false })
    share.init()
    share.render()

    const copySection = document.querySelector('.share-copy')
    expect(copySection).toBeFalsy()
  })

  it('should update config', () => {
    const share = new Share({
      url: 'https://example.com/old',
    })
    share.init()

    share.update({
      url: 'https://example.com/new',
    })

    expect(share.getShareUrl()).toBe('https://example.com/new')
  })

  it('should destroy component', () => {
    const share = new Share()
    share.init()
    share.render()

    const shareElement = document.querySelector('.share-component')
    expect(shareElement).toBeTruthy()

    share.destroy()
    const destroyedElement = document.querySelector('.share-component')
    expect(destroyedElement).toBeFalsy()
  })

  it('should include whatsapp and telegram platforms', () => {
    const share = new Share()
    share.init()
    const platforms = share.getSupportedPlatforms()
    expect(platforms).toContain('whatsapp')
    expect(platforms).toContain('telegram')
  })

  it('should handle multiple custom platforms', () => {
    const share = new Share()
    share.init()

    const platform1: SharePlatform = {
      name: 'Platform1',
      icon: 'P1',
      url: 'https://p1.com/share?url={url}',
    }

    const platform2: SharePlatform = {
      name: 'Platform2',
      icon: 'P2',
      url: 'https://p2.com/share?url={url}',
    }

    share.addPlatform('p1', platform1)
    share.addPlatform('p2', platform2)

    const platforms = share.getSupportedPlatforms()
    expect(platforms).toContain('p1')
    expect(platforms).toContain('p2')
  })

  it('should initialize with QR code disabled by default', () => {
    const share = new Share()
    share.init()
    share.render()

    const qrSection = document.querySelector('.share-qr')
    expect(qrSection).toBeFalsy()
  })

  it('should render QR code when enabled', () => {
    const share = new Share({ showQR: true })
    share.init()
    share.render()

    const qrSection = document.querySelector('.share-qr')
    expect(qrSection).toBeTruthy()
  })
})
