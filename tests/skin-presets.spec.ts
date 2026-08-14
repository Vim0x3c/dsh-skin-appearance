import { describe, expect, it } from 'vitest'
import { resolveSkinPreset, SKIN_PRESETS } from '../src/client/skin-presets.ts'

describe('skin presets', () => {
  it('uses globally namespaced ids and includes light and dark choices', () => {
    expect(SKIN_PRESETS.every(preset => preset.id.startsWith('dsh-skin-appearance-'))).toBe(true)
    expect(new Set(SKIN_PRESETS.map(preset => preset.colorScheme))).toEqual(new Set(['light', 'dark']))
    expect(SKIN_PRESETS.every(preset => preset.wallpaper.startsWith('data:image/webp;base64,'))).toBe(true)
    expect(new Set(SKIN_PRESETS.map(preset => preset.surface)).size).toBe(SKIN_PRESETS.length)
  })

  it('keeps the QQ2008 preset on its dedicated glossy surface recipe', () => {
    expect(SKIN_PRESETS.find(preset => preset.key === 'qq2008Crystal')?.variant).toBe('qq2008')
    expect(SKIN_PRESETS.find(preset => preset.key === 'qq2008Crystal')?.surface).toBe('qq2008')
  })

  it('resolves current and legacy persisted ids', () => {
    const preset = SKIN_PRESETS[0]!
    expect(resolveSkinPreset(preset.id)).toBe(preset)
    expect(resolveSkinPreset(preset.key)).toBe(preset)
    expect(resolveSkinPreset('unknown')).toBeUndefined()
  })
})
