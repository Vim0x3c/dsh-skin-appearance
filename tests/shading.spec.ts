import { describe, expect, it } from 'vitest'
import {
  buildQq2008Shading, buildWallpaperPaletteShading, buildWallpaperShading, SURFACE_ALPHAS, toRgba,
} from '../src/client/shading.ts'

describe('wallpaper shading', () => {
  it('converts supported hex and rgb colors to bounded rgba values', () => {
    expect(toRgba('#abc', 0.25)).toBe('rgba(170, 187, 204, 0.25)')
    expect(toRgba('rgb(10, 20, 30)', 2)).toBe('rgb(10, 20, 30)')
    expect(toRgba('#102030', -1)).toBe('rgba(16, 32, 48, 0)')
  })

  it('builds complete light/dark surface overrides without backdrop filters', () => {
    const result = buildWallpaperShading({
      base: { light: '#f0f0f0', dark: '#101010' },
    }, 0.6)
    expect(Object.keys(result)).toEqual([
      '--dsw-alias-bg-base',
      '--dsw-alias-bg-layer-1',
      '--dsw-alias-bg-layer-2',
      '--dsw-alias-bg-layer-3',
      '--dsw-alias-bg-overlay',
      '--dsw-specific-sidebar-fill',
    ])
    expect(result['--dsw-alias-bg-base']?.light).toContain('linear-gradient')
    expect(result['--dsw-specific-sidebar-fill']?.light).toBe('rgba(240, 240, 240, 0.652)')
    expect(JSON.stringify(result)).not.toContain('backdrop-filter')
  })

  it('reveals the wallpaper through the workspace sidebar at full opacity', () => {
    const visible = buildWallpaperShading({
      base: { light: '#f0f0f0', dark: '#101010' },
    }, 1)
    const hidden = buildWallpaperShading({
      base: { light: '#f0f0f0', dark: '#101010' },
    }, 0)
    expect(visible['--dsw-specific-sidebar-fill']?.light)
      .toBe(`rgba(240, 240, 240, ${SURFACE_ALPHAS.sidebar})`)
    expect(hidden['--dsw-specific-sidebar-fill']?.light).toBe('#f0f0f0')
  })

  it('projects an extracted image palette onto readable app tokens', () => {
    const result = buildWallpaperPaletteShading({
      colorScheme: 'dark',
      accent: '#dc1e28',
      secondary: '#285adc',
      surface: '#2a1013',
      text: '#f4e3e5',
      modes: {
        light: {
          accent: '#c51a23', secondary: '#285adc', surface: '#fff3f4', text: '#351928',
        },
        dark: {
          accent: '#dc1e28', secondary: '#4e78e5', surface: '#2a1013', text: '#f4e3e5',
        },
      },
    }, 0.5)
    expect(result['--dsw-alias-brand-primary']).toEqual({ light: '#c51a23', dark: '#dc1e28' })
    expect(result['--dsw-alias-label-primary']).toEqual({ light: '#351928', dark: '#f4e3e5' })
    expect(result['--dsw-alias-interactive-bg-hover']?.dark).toBe('rgba(78, 120, 229, 0.18)')
  })

  it('builds a dedicated glossy blue QQ2008 surface without backdrop blur', () => {
    const result = buildQq2008Shading(1)
    expect(result['--dsw-alias-bg-base']?.light).toContain('linear-gradient')
    expect(result['--dsw-specific-sidebar-fill']?.light).toContain('rgba(207, 235, 251, 0.5)')
    expect(result['--dsw-specific-sidebar-fill']?.dark).toContain('rgba(8, 36, 62, 0.68)')
    expect(result['--dsw-specific-sidebar-fill']?.dark)
      .not.toBe(result['--dsw-specific-sidebar-fill']?.light)
    expect(JSON.stringify(result)).not.toContain('backdrop-filter')
  })
})
