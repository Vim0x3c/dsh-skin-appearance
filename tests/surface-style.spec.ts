// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { SurfaceStyleApplier } from '../src/client/surface-style.ts'

afterEach(() => {
  document.head.replaceChildren()
  document.body.replaceChildren()
  delete document.documentElement.dataset.dshSkinSurface
})

describe('SurfaceStyleApplier', () => {
  it('installs a scoped glass recipe for wallpaper themes', () => {
    const applier = new SurfaceStyleApplier()
    applier.setMode('glass-dark')

    expect(document.documentElement.dataset.dshSkinSurface).toBe('glass-dark')
    const style = document.head.querySelector<HTMLStyleElement>('[data-dsh-skin-surface-styles]')
    expect(style?.textContent).toContain("[data-composer-card]")
    expect(style?.textContent).toContain('backdrop-filter: blur(22px)')
    expect(style?.textContent).toContain("button[class$='_newSession']")
    expect(style?.textContent).not.toContain("[class*='_newSession']")
    expect(style?.textContent).toContain('--dsh-skin-sidebar-background')
    expect(style?.textContent).toContain("#root > [data-slot='root'] > *")
    expect(style?.textContent).toContain("[class*='_sidebarCol'] > [data-slot='sidebar'] > *")
    expect(style?.textContent).not.toContain(":first-child button[class$='_newSession']")
    expect(style?.textContent).toContain(
      'linear-gradient(145deg, rgba(8, 18, 38, 0.3), rgba(18, 39, 75, 0.16))',
    )
    const sidebarRule = style?.textContent?.match(
      /\[class\*='_sidebarCol'\] > \[data-slot='sidebar'\] > \* \{([^}]*)\}/,
    )?.[1]
    expect(sidebarRule).toContain('background: var(--dsh-skin-sidebar-background)')
    expect(sidebarRule).not.toContain('backdrop-filter')
  })

  it('switches to the dedicated QQ2008 shell and restores prior state', () => {
    document.documentElement.dataset.dshSkinSurface = 'existing'
    const applier = new SurfaceStyleApplier()
    applier.setMode('qq2008')

    expect(document.documentElement.dataset.dshSkinSurface).toBe('qq2008')
    expect(document.head.textContent).toContain('DeepSeek Harness 2008')
    expect(document.head.textContent).toContain("[class*='_sectionHeader']")

    applier.dispose()
    expect(document.documentElement.dataset.dshSkinSurface).toBe('existing')
    expect(document.head.querySelector('[data-dsh-skin-surface-styles]')).toBeNull()
  })

  it('removes the active marker when returning to the native appearance', () => {
    const applier = new SurfaceStyleApplier()
    applier.setMode('glass-light')
    applier.setMode('none')
    expect(document.documentElement.dataset.dshSkinSurface).toBeUndefined()
  })

  it('projects a distinct surface marker for every image theme recipe', () => {
    const applier = new SurfaceStyleApplier()
    applier.setMode('ink-algorithm')

    expect(document.documentElement.dataset.dshSkinSurface).toBe('ink-algorithm')
    const style = document.head.querySelector<HTMLStyleElement>('[data-dsh-skin-surface-styles]')
    expect(style?.textContent).toContain("[data-dsh-skin-surface='deepseek-chan']")
    expect(style?.textContent).toContain("[data-dsh-skin-surface='deepsea-whale']")
    expect(style?.textContent).toContain("[data-dsh-skin-surface='intelligence-orbit-dawn']")
  })
})
