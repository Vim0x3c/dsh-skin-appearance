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
import { resolveSkinPreset, type SkinPreset } from './skin-presets.ts'
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

  let applier: WallpaperApplier | undefined
  let surface: SurfaceStyleApplier | undefined
  const getApplier = (): WallpaperApplier => {
    applier ??= new WallpaperApplier()
    return applier
  }
  const getSurface = (): SurfaceStyleApplier => {
    surface ??= new SurfaceStyleApplier()
    return surface
  }
  let overrideDispose: (() => void) | undefined
  const clearOverride = (): void => {
    overrideDispose?.()
    overrideDispose = undefined
  }
  const deactivateAppearance = (): void => {
    applier?.dispose()
    applier = undefined
    surface?.dispose()
    surface = undefined
    clearOverride()
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
      overrideDispose = ctx.theme.overrideTokens('dsh-skin-appearance', {
        ...presetTokenOverrides(preset),
        ...buildQq2008Shading(opacity),
      })
      return
    }
    const snapshot = ctx.theme.getTheme()
    const base = preset === undefined ? resolvedBase(snapshot) : presetBase(preset)
    overrideDispose = ctx.theme.overrideTokens(
      'dsh-skin-appearance',
      preset === undefined
        ? buildWallpaperShading({ base }, opacity)
        : {
            ...presetTokenOverrides(preset),
            ...buildWallpaperShading({ base }, opacity),
          },
    )
  }

  const applyWallpaper = (settings: AppearanceSettings): void => {
    const wallpaper = wallpaperFor(settings)
    if (wallpaper === '') {
      deactivateAppearance()
      return
    }
    const wallpaperApplier = getApplier()
    const surfaceApplier = getSurface()
    wallpaperApplier.setOpacity(settings.opacity)
    wallpaperApplier.setBlur(settings.blur)
    wallpaperApplier.setImage(wallpaper)
    shade(settings)
    const snapshot = ctx.theme.getTheme()
    surfaceApplier.setMode(surfaceMode(settings, snapshot), snapshot.active.colorScheme)
  }

  const adopt = (): void => {
    const settings = scope.getSnapshot().value
    if (settings === undefined) return
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
      if (wallpaperFor(settings) === '') {
        deactivateAppearance()
        return
      }
      shade(settings)
      getSurface().setMode(surfaceMode(settings, snapshot), snapshot.active.colorScheme)
    }
  })
  ctx.effect(() => () => {
    deactivateAppearance()
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
      applier?.setOpacity(value)
      shade(current, value)
    }
    const previewBlur = (value: number): void => {
      const current = scope.getSnapshot().value
      if (current !== undefined && wallpaperFor(current) !== '') applier?.setBlur(value)
    }

    return {
      previewOpacity,
      previewBlur,
      setSkin: (id) => {
        const current = scope.getSnapshot().value
        if (current === undefined) return
        const next = { ...current, skin: id }
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
            applyWallpaper(next)
            void scope.set(APPEARANCE_FIELDS.skin, DEFAULT_SKIN_ID)
          }
          return
        }
        const next = customWallpaperSettings(current, dataUrl, palette ?? null)
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
        deactivateAppearance()
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
  return {
    light: preset.tokens.light['--dsw-alias-bg-base'] ?? '#f5f6f8',
    dark: preset.tokens.dark['--dsw-alias-bg-base'] ?? '#15171a',
  }
}

function presetTokenOverrides(
  preset: SkinPreset,
): Record<string, { light: string; dark: string }> {
  const names = new Set([...Object.keys(preset.tokens.light), ...Object.keys(preset.tokens.dark)])
  return Object.fromEntries([...names].map(name => [name, {
    light: preset.tokens.light[name] ?? preset.tokens.dark[name]!,
    dark: preset.tokens.dark[name] ?? preset.tokens.light[name]!,
  }]))
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
  return snapshot.active.colorScheme === 'dark' ? 'glass-dark' : 'glass-light'
}
