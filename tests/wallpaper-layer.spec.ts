// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WallpaperApplier } from '../src/client/wallpaper-layer.ts'

afterEach(() => {
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

describe('WallpaperApplier', () => {
  it('mounts below app content and restores host styles on disposal', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.append(root)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(1)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    const applier = new WallpaperApplier()
    applier.setOpacity(0.7)
    applier.setBlur(12)
    applier.setImage('data:image/jpeg;base64,AAAA')

    const layer = root.querySelector<HTMLElement>('[data-dsh-skin-wallpaper]')
    expect(layer).not.toBeNull()
    expect(layer?.style.position).toBe('fixed')
    expect(layer?.style.zIndex).toBe('0')
    expect(layer?.style.opacity).toBe('0.7')
    expect(layer?.style.filter).toBe('blur(12px)')
    expect(layer?.style.backgroundPosition).toBe('center center')
    expect(root.style.position).toBe('relative')
    expect(root.style.isolation).toBe('isolate')

    applier.dispose()
    expect(root.querySelector('[data-dsh-skin-wallpaper]')).toBeNull()
    expect(root.style.position).toBe('')
    expect(root.style.isolation).toBe('')
  })

  it('removes the layer when the wallpaper becomes empty', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.append(root)
    const applier = new WallpaperApplier()
    applier.setImage('data:image/jpeg;base64,AAAA')
    applier.setImage('')
    expect(root.querySelector('[data-dsh-skin-wallpaper]')).toBeNull()
  })

  it('uses full opacity and no blur by default', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.append(root)
    const applier = new WallpaperApplier()
    applier.setImage('data:image/jpeg;base64,AAAA')
    const layer = root.querySelector<HTMLElement>('[data-dsh-skin-wallpaper]')
    expect(layer?.style.opacity).toBe('1')
    expect(layer?.style.filter).toBe('none')
  })
})
