/**
 * Skin recipe for the wallpaper, modeled on the Codex skin-studio approach:
 * the app root (`--dsw-alias-bg-base`, consumed by AppFrame) carries the
 * wallpaper image anchored right, a left horizontal gradient and a bottom
 * vertical gradient keep the text areas readable, and the raised surfaces
 * become translucent so the image shows through. Full-frame shading avoids
 * `backdrop-filter`; a separate bounded composer rule provides the glass effect.
 *
 * The image is kept out of the token tree so surfaces do not repeat it. The
 * recipe contains only gradients and translucent colors; it is rebuilt when
 * the image opacity or active palette changes.
 */
import type { WallpaperPalette, WallpaperPaletteVariant } from '../appearance-settings.ts'

/** One alias token override layer the wallpaper shading needs: value per palette mode. */
export interface TokenModes {
  /** Value applied while the light base palette is active. */
  light: string
  /** Value applied while the dark base palette is active. */
  dark: string
}

/** Token overrides keyed by token name. */
export type TokenOverrides = Record<string, TokenModes>

/** Surface translucency over the wallpaper, per raised layer. */
export const SURFACE_ALPHAS = {
  layer1: 0.64,
  layer2: 0.76,
  layer3: 0.84,
  sidebar: 0.42,
  overlay: 0.86,
} as const

/** Shading source: the theme runtime's resolved snapshot. */
export interface ThemeShadeSource {
  /** Resolved base color per palette mode (e.g. `--dsw-static-neutral-bluish-950`). */
  base: { light: string; dark: string }
}

/**
 * Build the static token recipe. The wallpaper image lives on the applier's
 * body layer (blurred there); the frame recipe contributes only the
 * readability gradients over a translucent base color, so the image shows
 * through while text stays readable.
 *
 * SAFARI CRASH NOTE: do NOT write `color-mix()` + `var()` + `calc()` nested
 * expressions into CSS custom properties via style.setProperty() — WebKit's
 * parseCustomPropertyValue segfaults on that combination (SIGSEGV, "此网页已
 * 重新载入"). The wash is therefore precomputed in JS and inlined as a plain
 * percentage string; the recipe is rebuilt by the caller whenever the wash
 * changes (see index.ts setOpacity).
 * @param source - the theme's resolved base colors per palette mode.
 * @param wash - wallpaper opacity (0..1), precomputed in JS.
 * @returns token overrides with plain rgba/gradient strings (no color-mix/var).
 */
export function buildWallpaperShading(source: ThemeShadeSource, wash: number): TokenOverrides {
  const normalizedWash = clampUnit(wash)
  const frameBackground = (base: string): string =>
    `linear-gradient(90deg, ${toRgba(base, 1 - normalizedWash)} 0%, transparent 52%),`
    + `linear-gradient(180deg, transparent 0 48%, ${toRgba(base, 1 - normalizedWash)} 100%),`
    + toRgba(base, 0.3)
  const translucent = (base: string, minimumAlpha: number): string => {
    const alpha = Math.round((1 - normalizedWash * (1 - minimumAlpha)) * 1000) / 1000
    return toRgba(base, alpha)
  }
  return {
    '--dsw-alias-bg-base': modes(
      frameBackground(source.base.light),
      frameBackground(source.base.dark),
    ),
    '--dsw-alias-bg-layer-1': modes(
      translucent(source.base.light, SURFACE_ALPHAS.layer1),
      translucent(source.base.dark, SURFACE_ALPHAS.layer1),
    ),
    '--dsw-alias-bg-layer-2': modes(
      translucent(source.base.light, SURFACE_ALPHAS.layer2),
      translucent(source.base.dark, SURFACE_ALPHAS.layer2),
    ),
    '--dsw-alias-bg-layer-3': modes(
      translucent(source.base.light, SURFACE_ALPHAS.layer3),
      translucent(source.base.dark, SURFACE_ALPHAS.layer3),
    ),
    '--dsw-alias-bg-overlay': modes(
      translucent(source.base.light, SURFACE_ALPHAS.overlay),
      translucent(source.base.dark, SURFACE_ALPHAS.overlay),
    ),
    '--dsw-specific-sidebar-fill': modes(
      translucent(source.base.light, SURFACE_ALPHAS.sidebar),
      translucent(source.base.dark, SURFACE_ALPHAS.sidebar),
    ),
  }
}

/**
 * Build wallpaper shading plus the palette extracted from an uploaded image.
 * @param palette - colors and base scheme derived from the image sample.
 * @param wash - wallpaper opacity (0..1).
 * @returns complete readable surface, text, accent, hover, and border overrides.
 */
export function buildWallpaperPaletteShading(
  palette: WallpaperPalette,
  wash: number,
): TokenOverrides {
  const paletteModes = resolvePaletteModes(palette)
  return {
    ...buildWallpaperShading({
      base: { light: paletteModes.light.surface, dark: paletteModes.dark.surface },
    }, wash),
    '--dsw-alias-brand-primary': modes(paletteModes.light.accent, paletteModes.dark.accent),
    '--dsw-alias-label-primary': modes(paletteModes.light.text, paletteModes.dark.text),
    '--dsw-alias-label-secondary': modes(
      toRgba(paletteModes.light.text, 0.72),
      toRgba(paletteModes.dark.text, 0.72),
    ),
    '--dsw-alias-border-l1': modes(
      toRgba(paletteModes.light.secondary, 0.24),
      toRgba(paletteModes.dark.secondary, 0.3),
    ),
    '--dsw-alias-border-l2': modes(
      toRgba(paletteModes.light.accent, 0.34),
      toRgba(paletteModes.dark.accent, 0.42),
    ),
    '--dsw-alias-interactive-bg-hover': modes(
      toRgba(paletteModes.light.secondary, 0.14),
      toRgba(paletteModes.dark.secondary, 0.18),
    ),
  }
}

/** Resolve palettes written before dual-mode extraction into safe opposite-mode colors. */
export function resolvePaletteModes(
  palette: WallpaperPalette,
): { light: WallpaperPaletteVariant; dark: WallpaperPaletteVariant } {
  if (palette.modes !== undefined) return palette.modes
  const original: WallpaperPaletteVariant = {
    accent: palette.accent,
    secondary: palette.secondary,
    surface: palette.surface,
    text: palette.text,
  }
  const light: WallpaperPaletteVariant = palette.colorScheme === 'light' ? original : {
    accent: palette.accent,
    secondary: palette.secondary,
    surface: mixHex(palette.accent, '#fcfcff', 0.92),
    text: mixHex(palette.accent, '#101828', 0.82),
  }
  const dark: WallpaperPaletteVariant = palette.colorScheme === 'dark' ? original : {
    accent: palette.accent,
    secondary: palette.secondary,
    surface: mixHex(palette.accent, '#0c0c12', 0.86),
    text: mixHex(palette.accent, '#f4f6fc', 0.85),
  }
  return { light, dark }
}

/**
 * Build the QQ2008-inspired glossy blue surface recipe.
 * @param wash - wallpaper visibility (0..1).
 * @returns translucent glass gradients layered over the bundled wallpaper.
 */
export function buildQq2008Shading(wash: number): TokenOverrides {
  const normalizedWash = clampUnit(wash)
  const alpha = (minimum: number): number =>
    Math.round((1 - normalizedWash * (1 - minimum)) * 1000) / 1000
  const lightBase = `linear-gradient(180deg, rgba(255, 255, 255, ${alpha(0.58)}) 0%,`
    + ` rgba(185, 229, 252, ${alpha(0.34)}) 28%, rgba(237, 248, 255, ${alpha(0.3)}) 100%)`
  const lightSidebar = `linear-gradient(180deg, rgba(255, 255, 255, ${alpha(0.72)}) 0%,`
    + ` rgba(207, 235, 251, ${alpha(0.5)}) 20%, rgba(185, 222, 245, ${alpha(0.62)}) 100%)`
  const darkBase = `linear-gradient(180deg, rgba(8, 29, 53, ${alpha(0.72)}) 0%,`
    + ` rgba(13, 55, 87, ${alpha(0.48)}) 32%, rgba(5, 23, 43, ${alpha(0.52)}) 100%)`
  const darkSidebar = `linear-gradient(180deg, rgba(13, 49, 78, ${alpha(0.82)}) 0%,`
    + ` rgba(8, 36, 62, ${alpha(0.68)}) 24%, rgba(5, 24, 45, ${alpha(0.78)}) 100%)`
  return {
    ...buildWallpaperShading({ base: { light: '#edf8ff', dark: '#07172b' } }, normalizedWash),
    '--dsw-alias-bg-base': modes(lightBase, darkBase),
    '--dsw-specific-sidebar-fill': modes(lightSidebar, darkSidebar),
  }
}

function mixHex(left: string, right: string, amount: number): string {
  const leftRgb = parseHex(left)
  const rightRgb = parseHex(right)
  if (leftRgb === undefined || rightRgb === undefined) return left
  const mixed = leftRgb.map((value, index) =>
    Math.round(value + (rightRgb[index]! - value) * amount))
  return `#${mixed.map(value => value.toString(16).padStart(2, '0')).join('')}`
}

function parseHex(color: string): [number, number, number] | undefined {
  const hex = color.replace(/^#/, '')
  if (!/^[0-9a-f]{6}$/i.test(hex)) return undefined
  const value = Number.parseInt(hex, 16)
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]
}

/** Pair one token value for both palette modes. */
function modes(light: string, dark: string): TokenModes {
  return { light, dark }
}

/** Clamp a user-controlled opacity to the CSS alpha range. */
function clampUnit(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.5
}

/**
 * Alpha-compose a CSS color to rgba. Passes non-rgb values through when the
 * alpha is 1 (fully opaque) so a solid palette token stays verbatim.
 * @param color - a CSS color (rgb/hex/hsl form or a named value).
 * @param alpha - target alpha (0..1).
 * @returns an `rgba(...)` value, or the input unchanged when alpha is 1.
 */
export function toRgba(color: string, alpha: number): string {
  const normalizedAlpha = clampUnit(alpha)
  if (normalizedAlpha >= 1) return color
  const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/)
  if (match !== null) return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${normalizedAlpha})`
  const hex = color.replace(/^#/, '')
  if (hex.length === 3 || hex.length === 6) {
    const digits = hex.length === 3
      ? hex.split('').map(digit => digit.repeat(2)).join('')
      : hex
    const value = Number.parseInt(digits, 16)
    return `rgba(${(value >> 16) & 0xff}, ${(value >> 8) & 0xff}, ${value & 0xff}, ${normalizedAlpha})`
  }
  return color
}
