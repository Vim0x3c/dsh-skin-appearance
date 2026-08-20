// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { SurfaceStyleApplier } from '../src/client/surface-style.ts'

afterEach(() => {
  document.head.replaceChildren()
  document.body.replaceChildren()
  delete document.documentElement.dataset.dshSkinSurface
  delete document.documentElement.dataset.dshSkinScheme
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
    expect(style?.textContent).toContain("[class*='_footerActions'] [data-cordis-badge]")
    expect(style?.textContent).toContain("[class*='_footerActions'] > *")
    expect(style?.textContent).toContain("[class*='_sidebarCol'] [role='tree']")
    expect(style?.textContent).toContain('background: transparent !important')
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
    applier.setMode('qq2008', 'dark')

    expect(document.documentElement.dataset.dshSkinSurface).toBe('qq2008')
    expect(document.documentElement.dataset.dshSkinScheme).toBe('dark')
    expect(document.head.textContent).toContain('DeepSeek 2008')
    expect(document.head.textContent).toContain('data:image/jpeg;base64,')
    expect(document.head.textContent).toContain("[class*='_sectionHeader']")
    expect(document.head.textContent).toContain("[class*='_projectRow']")
    expect(document.head.textContent).toContain('[data-dsh-qq-friend-avatar]')
    expect(document.head.textContent).toContain("[data-composer-card] button:last-child:not(:disabled)")
    expect(document.head.textContent).toContain('[data-input-scroll] textarea')
    expect(document.head.textContent).toContain('[data-input-backdrop]')
    expect(document.head.textContent).toContain('[data-input-mirror]')
    expect(document.head.textContent).toContain('font-kerning: none !important')
    expect(document.head.textContent).toContain('-webkit-text-fill-color: transparent !important')
    expect(document.head.textContent).not.toContain("[data-dsh-skin-surface='qq2008'] [role='dialog']")
    expect(document.head.textContent).toContain("[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']")
    expect(document.head.textContent).toContain("[class*='_sidebarCol'] > [data-slot='sidebar'] > *")
    expect(document.head.textContent).toContain("[class*='_footerActions'] [data-cordis-badge]")
    expect(document.head.textContent).toContain("[data-dsh-skin-scheme='light'][data-dsh-skin-surface='qq2008']")

    applier.dispose()
    expect(document.documentElement.dataset.dshSkinSurface).toBe('existing')
    expect(document.documentElement.dataset.dshSkinScheme).toBeUndefined()
    expect(document.head.querySelector('[data-dsh-skin-surface-styles]')).toBeNull()
  })

  it('assigns stable varied QQ avatars to sessions but not workspace groups', async () => {
    const group = document.createElement('div')
    group.className = 'fixture_groupSection_hash'
    group.innerHTML = `
      <div role="treeitem" class="fixture_projectRow_hash">
        <span class="fixture_title_hash">dsh-plugin</span>
      </div>
      ${Array.from({ length: 10 }, (_, index) => `
        <div role="treeitem" class="fixture_sessionRow_hash">
          <span class="fixture_title_hash">conversation-${index}</span>
        </div>
      `).join('')}
    `
    document.body.append(group)
    const applier = new SurfaceStyleApplier()
    applier.setMode('qq2008')
    await new Promise(resolve => setTimeout(resolve, 0))

    const project = group.querySelector<HTMLElement>("[class*='_projectRow']")
    const sessions = [...group.querySelectorAll<HTMLElement>("[class*='_sessionRow']")]
    expect(project?.dataset.dshQqFriendAvatar).toBeUndefined()
    expect(project?.style.getPropertyValue('--dsh-qq-avatar-image')).toBe('')
    expect(sessions.every(row => row.dataset.dshQqFriendAvatar === '')).toBe(true)
    const firstAssignments = sessions.map(row => row.style.getPropertyValue('--dsh-qq-avatar-image'))
    expect(new Set(firstAssignments).size).toBeGreaterThan(4)

    applier.setMode('glass-light')
    expect(sessions.every(row => row.dataset.dshQqFriendAvatar === undefined)).toBe(true)
    expect(sessions.every(row => row.style.getPropertyValue('--dsh-qq-avatar-image') === '')).toBe(true)
    applier.dispose()
  })

  it('removes the active marker when returning to the native appearance', () => {
    const applier = new SurfaceStyleApplier()
    applier.setMode('glass-light')
    applier.setMode('none')
    expect(document.documentElement.dataset.dshSkinSurface).toBeUndefined()
    expect(document.documentElement.dataset.dshSkinScheme).toBeUndefined()
  })

  it('does not install plugin DOM or styles until a wallpaper-backed mode is selected', () => {
    const applier = new SurfaceStyleApplier()
    expect(document.head.querySelector('[data-dsh-skin-surface-styles]')).toBeNull()
    expect(document.documentElement.dataset.dshSkinSurface).toBeUndefined()
    applier.dispose()
    expect(document.head.querySelector('[data-dsh-skin-surface-styles]')).toBeNull()
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
