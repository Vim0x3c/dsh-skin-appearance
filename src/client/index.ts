/**
 * Appearance customization plugin, browser half: registers image-backed
 * themes, renders the settings section, and projects the selected wallpaper
 * across the entire application frame.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
import { AppearanceSection, type AppearanceSectionInjected } from './AppearanceSection.tsx'
import { createAppearanceSectionStore } from './appearance-store.ts'
import { WallpaperApplier } from './wallpaper-layer.ts'
import { SurfaceStyleApplier, type SurfaceStyleMode } from './surface-style.ts'
import {
  buildQq2008Shading, buildWallpaperPaletteShading, buildWallpaperShading,
} from './shading.ts'
import { en, zh, type AppearanceKey } from './locales.ts'
import { resolveSkinPreset, SKIN_PRESETS, type SkinPreset } from './skin-presets.ts'
import {
  APPEARANCE_FIELDS, APPEARANCE_SETTINGS_NAMESPACE, DEFAULT_BLUR, DEFAULT_OPACITY,
  DEFAULT_SKIN_ID, WALLPAPER_SKIN_ID, type AppearanceSettings, type WallpaperPalette,
} from '../appearance-settings.ts'

export type { AppearanceSectionComponentProps, AppearanceSectionInjected } from './AppearanceSection.tsx'
export type { AppearanceSectionState } from './appearance-store.ts'
export type { AppearanceKey } from './locales.ts'

/** Namespace owning this feature's settings-section copy. */
const SETTINGS_NS = 'settings.dshSkinAppearance'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Appearance settings section's copy. */
    'settings.dshSkinAppearance': AppearanceKey
  }
}

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope', 'theme']

/**
 * Client plugin body.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  const scope = ctx.settingsScope.bind<AppearanceSettings>({ namespace: APPEARANCE_SETTINGS_NAMESPACE })
  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'dsh-skin-appearance: dictionaries')

  for (const preset of SKIN_PRESETS) {
    ctx.effect(
      () => ctx.theme.register({
        id: preset.id,
        colorScheme: preset.colorScheme,
        tokens: preset.tokens,
      }),
      `dsh-skin-appearance: theme ${preset.id}`,
    )
  }

  const applier = new WallpaperApplier()
  const surface = new SurfaceStyleApplier()
  let overrideDispose: (() => void) | undefined
  const clearOverride = (): void => {
    overrideDispose?.()
    overrideDispose = undefined
  }

  const applySkinPreference = (settings: AppearanceSettings): void => {
    const preset = resolveSkinPreset(settings.skin)
    const desired = settings.skin === WALLPAPER_SKIN_ID && settings.palette !== null
      ? settings.palette.colorScheme
      : preset?.id ?? 'system'
    if (ctx.theme.getTheme().preference !== desired) ctx.theme.setTheme(desired)
  }

  const shade = (settings: AppearanceSettings, opacity = settings.opacity): void => {
    clearOverride()
    if (wallpaperFor(settings) === '') return
    if (settings.skin === WALLPAPER_SKIN_ID && settings.palette !== null) {
      overrideDispose = ctx.theme.overrideTokens(
        'dsh-skin-appearance',
        buildWallpaperPaletteShading(settings.palette, opacity),
      )
      return
    }
    const preset = resolveSkinPreset(settings.skin)
    if (preset?.variant === 'qq2008') {
      overrideDispose = ctx.theme.overrideTokens('dsh-skin-appearance', buildQq2008Shading(opacity))
      return
    }
    const snapshot = ctx.theme.getTheme()
    const base = preset === undefined ? resolvedBase(snapshot) : presetBase(preset)
    overrideDispose = ctx.theme.overrideTokens(
      'dsh-skin-appearance',
      buildWallpaperShading({ base }, opacity),
    )
  }

  const applyWallpaper = (settings: AppearanceSettings): void => {
    const wallpaper = wallpaperFor(settings)
    if (wallpaper === '') {
      applier.setImage('')
      surface.setMode('none')
      clearOverride()
      return
    }
    applier.setOpacity(settings.opacity)
    applier.setBlur(settings.blur)
    applier.setImage(wallpaper)
    shade(settings)
    surface.setMode(surfaceMode(settings, ctx.theme.getTheme()))
  }

  const adopt = (): void => {
    const settings = scope.getSnapshot().value
    if (settings === undefined) return
    applySkinPreference(settings)
    applyWallpaper(settings)
  }
  ctx.effect(
    () => scope.subscribe(adopt),
    'dsh-skin-appearance: appearance scope adoption',
  )

  const themeIdentity = (snapshot: ThemeSnapshot): string =>
    `${snapshot.preference}\0${snapshot.active.id}\0${snapshot.active.colorScheme}`
  let lastThemeIdentity = themeIdentity(ctx.theme.getTheme())
  ctx.on('theme/change', (snapshot) => {
    const nextIdentity = themeIdentity(snapshot)
    if (nextIdentity === lastThemeIdentity) return
    lastThemeIdentity = nextIdentity
    const settings = scope.getSnapshot().value
    if (settings !== undefined) {
      shade(settings)
      surface.setMode(surfaceMode(settings, snapshot))
    }
  })
  ctx.effect(() => () => {
    applier.dispose()
    surface.dispose()
    clearOverride()
  }, 'dsh-skin-appearance: wallpaper cleanup')
  adopt()

  const store = createAppearanceSectionStore()
  let bound: BoundActions<typeof store> | undefined
  const syncStore = (): void => { bound?.sync(scope.getSnapshot()) }
  ctx.effect(() => scope.subscribe(syncStore), 'dsh-skin-appearance: section store mirror')

  const injected = (actions: BoundActions<typeof store>): AppearanceSectionInjected => {
    bound = actions
    syncStore()

    const previewOpacity = (value: number): void => {
      const current = scope.getSnapshot().value
      if (current === undefined || wallpaperFor(current) === '') return
      applier.setOpacity(value)
      shade(current, value)
    }
    const previewBlur = (value: number): void => {
      const current = scope.getSnapshot().value
      if (current !== undefined && wallpaperFor(current) !== '') applier.setBlur(value)
    }

    return {
      previewOpacity,
      previewBlur,
      setSkin: (id) => {
        const current = scope.getSnapshot().value
        if (current === undefined) return
        const next = { ...current, skin: id }
        applySkinPreference(next)
        applyWallpaper(next)
        void scope.set(APPEARANCE_FIELDS.skin, id)
      },
      setWallpaper: (dataUrl, palette) => {
        const current = scope.getSnapshot().value
        if (current === undefined) return
        void scope.set(APPEARANCE_FIELDS.wallpaper, dataUrl)
        if (dataUrl === '') {
          void scope.set(APPEARANCE_FIELDS.palette, null)
          if (current.skin === WALLPAPER_SKIN_ID) {
            const next = { ...current, skin: DEFAULT_SKIN_ID, wallpaper: '', palette: null }
            applySkinPreference(next)
            applyWallpaper(next)
            void scope.set(APPEARANCE_FIELDS.skin, DEFAULT_SKIN_ID)
          }
          return
        }
        const next = customWallpaperSettings(current, dataUrl, palette ?? null)
        applySkinPreference(next)
        applyWallpaper(next)
        void scope.set(APPEARANCE_FIELDS.palette, palette ?? null)
        void scope.set(APPEARANCE_FIELDS.skin, WALLPAPER_SKIN_ID)
      },
      setOpacity: (value) => {
        previewOpacity(value)
        void scope.set(APPEARANCE_FIELDS.opacity, value)
      },
      setBlur: (value) => {
        previewBlur(value)
        void scope.set(APPEARANCE_FIELDS.blur, value)
      },
      reset: () => {
        const current = scope.getSnapshot().value
        const next: AppearanceSettings = {
          skin: DEFAULT_SKIN_ID,
          wallpaper: '',
          palette: null,
          opacity: DEFAULT_OPACITY,
          blur: DEFAULT_BLUR,
        }
        if (current !== undefined) applySkinPreference(next)
        applier.setImage('')
        surface.setMode('none')
        clearOverride()
        void scope.set(APPEARANCE_FIELDS.skin, DEFAULT_SKIN_ID)
        void scope.set(APPEARANCE_FIELDS.wallpaper, '')
        void scope.set(APPEARANCE_FIELDS.palette, null)
        void scope.set(APPEARANCE_FIELDS.opacity, DEFAULT_OPACITY)
        void scope.set(APPEARANCE_FIELDS.blur, DEFAULT_BLUR)
      },
    }
  }

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-skin-appearance',
    order: 25,
    label: () => ctx.locale.bind(SETTINGS_NS)('nav'),
    locale: SETTINGS_NS,
    store,
    inject: injected,
  }, AppearanceSection))
}

/** Resolve the active image without persisting bundled assets in settings. */
function wallpaperFor(settings: AppearanceSettings): string {
  if (settings.skin === WALLPAPER_SKIN_ID) return settings.wallpaper
  return resolveSkinPreset(settings.skin)?.wallpaper ?? ''
}

function customWallpaperSettings(
  current: AppearanceSettings,
  wallpaper: string,
  palette: WallpaperPalette | null,
): AppearanceSettings {
  return { ...current, skin: WALLPAPER_SKIN_ID, wallpaper, palette }
}

function presetBase(preset: SkinPreset): { light: string; dark: string } {
  const base = preset.tokens['--dsw-alias-bg-base'] ?? (preset.colorScheme === 'dark' ? '#15171a' : '#f5f6f8')
  return { light: base, dark: base }
}

function resolvedBase(snapshot: ThemeSnapshot): { light: string; dark: string } {
  const get = (mode: 'light' | 'dark'): string => {
    const active = snapshot.active.colorScheme === mode ? snapshot.active : undefined
    const candidate = active ?? snapshot.themes.find(theme => theme.colorScheme === mode)
    return candidate?.tokens['--dsw-alias-bg-base'] ?? (mode === 'dark' ? '#15171a' : '#f5f6f8')
  }
  return { light: get('light'), dark: get('dark') }
}

function surfaceMode(settings: AppearanceSettings, snapshot: ThemeSnapshot): SurfaceStyleMode {
  const preset = resolveSkinPreset(settings.skin)
  if (preset !== undefined) return preset.surface
  const colorScheme = settings.skin === WALLPAPER_SKIN_ID && settings.palette !== null
    ? settings.palette.colorScheme
    : snapshot.active.colorScheme
  return colorScheme === 'dark' ? 'glass-dark' : 'glass-light'
}
