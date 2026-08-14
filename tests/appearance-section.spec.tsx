// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  DEFAULT_BLUR, DEFAULT_OPACITY, DEFAULT_SKIN_ID, WALLPAPER_SKIN_ID,
  type AppearanceSettings,
} from '../src/appearance-settings.ts'
import { AppearanceSection, type AppearanceSectionComponentProps } from '../src/client/AppearanceSection.tsx'
import type { AppearanceSectionState } from '../src/client/appearance-store.ts'
import { SKIN_PRESETS } from '../src/client/skin-presets.ts'

afterEach(cleanup)

function mount(writable = true, overrides: Partial<AppearanceSettings> = {}) {
  const settings: AppearanceSettings = {
    skin: DEFAULT_SKIN_ID,
    wallpaper: '',
    palette: null,
    opacity: DEFAULT_OPACITY,
    blur: DEFAULT_BLUR,
    ...overrides,
  }
  const state: AppearanceSectionState = {
    status: 'ready',
    writable,
    revision: 0,
    settings,
  }
  const setSkin = vi.fn()
  const setWallpaper = vi.fn()
  const setOpacity = vi.fn()
  const setBlur = vi.fn()
  const previewOpacity = vi.fn()
  const previewBlur = vi.fn()
  const useStore = <T,>(selector: (current: AppearanceSectionState) => T): T => selector(state)
  const props = {
    close: vi.fn(),
    useSessions: vi.fn(),
    useWorkspaces: vi.fn(),
    useStore,
    actions: { sync: vi.fn() },
    t: (key: string) => key,
    setSkin,
    setWallpaper,
    setOpacity,
    previewOpacity,
    setBlur,
    previewBlur,
    reset: vi.fn(),
  } as unknown as AppearanceSectionComponentProps
  render(<AppearanceSection {...props} />)
  return { setSkin, setWallpaper, setOpacity, previewOpacity, setBlur, previewBlur }
}

describe('AppearanceSection', () => {
  it('renders preset swatches and sends the namespaced theme id', () => {
    const face = mount()
    fireEvent.click(screen.getByRole('button', { name: /skin\.deepseekChan/ }))
    expect(face.setSkin).toHaveBeenCalledWith(
      SKIN_PRESETS.find(preset => preset.key === 'deepseekChan')?.id,
    )
  })

  it('renders bundled theme artwork in the preset cards', () => {
    mount()
    const button = screen.getByRole('button', { name: /skin\.cloudLab/ })
    const preview = button.querySelector<HTMLElement>('[style*="background-image"]')
    expect(preview?.style.backgroundImage).toContain('data:image/webp;base64,')
  })

  it('disables every command when settings are read-only', () => {
    mount(false)
    expect(screen.getByText('settings.readonly')).toBeDefined()
    for (const button of screen.getAllByRole('button')) {
      expect((button as HTMLButtonElement).disabled).toBe(true)
    }
  })

  it('offers the extracted wallpaper palette as a selectable skin', () => {
    const face = mount(true, {
      skin: WALLPAPER_SKIN_ID,
      wallpaper: 'data:image/jpeg;base64,AAAA',
      palette: {
        colorScheme: 'dark',
        accent: '#dc1e28',
        secondary: '#285adc',
        surface: '#2a1013',
        text: '#f4e3e5',
      },
    })
    const button = screen.getByRole('button', { name: /skin\.wallpaper/ })
    expect(button.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(button)
    expect(face.setSkin).toHaveBeenCalledWith(WALLPAPER_SKIN_ID)
  })

  it('reports a non-image upload instead of silently ignoring it', async () => {
    mount()
    const input = screen.getByLabelText('wallpaper.choose')
    fireEvent.change(input, {
      target: { files: [new File(['text'], 'notes.txt', { type: 'text/plain' })] },
    })
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe('wallpaper.invalid.not-image')
    })
  })

  it('previews both controlled sliders immediately and persists on release', () => {
    const face = mount(true, { skin: SKIN_PRESETS[0]!.id })
    const opacity = screen.getByRole('slider', { name: 'wallpaper.opacity' })
    const blur = screen.getByRole('slider', { name: 'wallpaper.blur' })

    fireEvent.change(opacity, { target: { value: '73' } })
    fireEvent.change(blur, { target: { value: '18' } })

    expect((opacity as HTMLInputElement).value).toBe('73')
    expect((blur as HTMLInputElement).value).toBe('18')
    expect(screen.getByText('73%')).toBeDefined()
    expect(screen.getByText('18px')).toBeDefined()
    expect(face.previewOpacity).toHaveBeenLastCalledWith(0.73)
    expect(face.previewBlur).toHaveBeenLastCalledWith(18)
    expect(face.setOpacity).not.toHaveBeenCalled()
    expect(face.setBlur).not.toHaveBeenCalled()

    fireEvent.pointerUp(opacity)
    fireEvent.pointerUp(blur)
    expect(face.setOpacity).toHaveBeenLastCalledWith(0.73)
    expect(face.setBlur).toHaveBeenLastCalledWith(18)
  })

  it('uses native range input events for continuous drag updates', () => {
    const face = mount(true, { skin: SKIN_PRESETS[0]!.id })
    const opacity = screen.getByRole('slider', { name: 'wallpaper.opacity' }) as HTMLInputElement

    fireEvent.input(opacity, { target: { value: '40' } })
    fireEvent.input(opacity, { target: { value: '41' } })
    fireEvent.input(opacity, { target: { value: '42' } })
    expect(opacity.value).toBe('42')
    expect(face.previewOpacity).toHaveBeenCalledTimes(3)
    expect(face.previewOpacity).toHaveBeenLastCalledWith(0.42)
    expect(face.setOpacity).not.toHaveBeenCalled()

    fireEvent.pointerUp(opacity)
    expect(face.setOpacity).toHaveBeenCalledTimes(1)
    expect(face.setOpacity).toHaveBeenCalledWith(0.42)
  })

  it('keeps the requested full-opacity and zero-blur defaults', () => {
    mount(true, { skin: SKIN_PRESETS[0]!.id })
    expect((screen.getByRole('slider', { name: 'wallpaper.opacity' }) as HTMLInputElement).value)
      .toBe('100')
    expect((screen.getByRole('slider', { name: 'wallpaper.blur' }) as HTMLInputElement).value)
      .toBe('0')
  })
})
