import { describe, expect, it } from 'vitest'
import { extractPalette } from '../src/client/image-intake.ts'

function pixels(...colors: Array<[number, number, number, number]>): Uint8ClampedArray {
  return new Uint8ClampedArray(colors.flat())
}

describe('wallpaper palette extraction', () => {
  it('chooses dominant and hue-separated colors and a dark readable pair', () => {
    const palette = extractPalette(pixels(
      [220, 30, 40, 255], [220, 30, 40, 255],
      [40, 90, 220, 255],
    ))
    expect(palette.colorScheme).toBe('dark')
    expect(palette.accent).toBe('#dc1e28')
    expect(palette.secondary).toBe('#285adc')
    expect(palette.surface).toMatch(/^#[0-9a-f]{6}$/)
    expect(palette.text).toMatch(/^#[0-9a-f]{6}$/)
    expect(palette.modes?.light.surface).not.toBe(palette.modes?.dark.surface)
    expect(palette.modes?.light.text).not.toBe(palette.modes?.dark.text)
  })

  it('falls back to the product accent for a bright neutral image', () => {
    const palette = extractPalette(pixels(
      [240, 240, 240, 255], [232, 236, 240, 255],
    ))
    expect(palette.colorScheme).toBe('light')
    expect(palette.accent).toBe('#24c9d7')
    expect(palette.modes?.dark.surface).toMatch(/^#[0-9a-f]{6}$/)
  })
})
