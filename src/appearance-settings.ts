/**
 * Appearance preferences stored in the Host user-settings document, shared by
 * the node and browser halves.
 *
 * The persisted section holds the selected skin, wallpaper controls, and the
 * compact palette extracted from an uploaded image. Preset definitions stay
 * in the browser bundle and are referenced only by id.
 */

/** Settings namespace owned by this plugin. */
export const APPEARANCE_SETTINGS_NAMESPACE = 'appearance'

/** Field names written by the settings page, exposed for scope writes and tests. */
export const APPEARANCE_FIELDS = {
  skin: 'skin',
  wallpaper: 'wallpaper',
  palette: 'palette',
  opacity: 'opacity',
  blur: 'blur',
} as const

/** The default skin id: follow the built-in appearance. */
export const DEFAULT_SKIN_ID = 'default'

/** Skin marker selecting the palette extracted from the current wallpaper. */
export const WALLPAPER_SKIN_ID = 'wallpaper'

/** Panel-opacity clamp bounds for the wallpaper wash. */
export const MIN_OPACITY = 0
export const MAX_OPACITY = 1
export const DEFAULT_OPACITY = 1

/** Blur clamp bounds, in pixels. */
export const MIN_BLUR = 0
export const MAX_BLUR = 60
export const DEFAULT_BLUR = 0

/** Palette derived from an uploaded wallpaper. */
export interface WallpaperPalette {
  /** Base appearance selected from the image's average luminance. */
  colorScheme: 'light' | 'dark'
  /** Dominant saturated color used for primary accents. */
  accent: string
  /** A hue-separated companion color used for hover and border accents. */
  secondary: string
  /** Readable surface color mixed from the dominant color. */
  surface: string
  /** Readable foreground color mixed against the surface. */
  text: string
}

/**
 * One persisted appearance section. `wallpaper` is a data URL (or empty for
 * none); `opacity` and `blur` tune the wallpaper wash.
 */
export interface AppearanceSettings {
  /** Active skin id: `default`, `wallpaper`, or a registered preset id. */
  skin: string
  /** Wallpaper data URL, or empty for none. */
  wallpaper: string
  /** Extracted wallpaper palette, or null when no uploaded palette is available. */
  palette: WallpaperPalette | null
  /** Wallpaper wash opacity (0..1). */
  opacity: number
  /** Wallpaper blur, in pixels (0..60). */
  blur: number
}
