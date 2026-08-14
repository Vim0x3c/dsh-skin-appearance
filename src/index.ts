/**
 * Appearance customization plugin, node half: registers the durable
 * `appearance` settings namespace so the browser half can read and write it
 * through the Host settings wire.
 *
 * The browser half ships the settings surface through exports["./client"],
 * discovered from the package.json dsh.client declaration.
 */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import z from '@deepseek-ai/schemastery'
import {
  APPEARANCE_FIELDS, APPEARANCE_SETTINGS_NAMESPACE, DEFAULT_BLUR, DEFAULT_OPACITY,
  DEFAULT_SKIN_ID, MAX_BLUR, MAX_OPACITY, MIN_BLUR, MIN_OPACITY,
  type AppearanceSettings, type WallpaperPalette,
} from './appearance-settings.ts'

const HexColorSchema = z.string().pattern(/^#[0-9a-f]{6}$/i)

/** Persisted palette produced by the browser image pipeline. */
export const WallpaperPaletteSchema: z<WallpaperPalette> = z.object({
  colorScheme: z.union(['light', 'dark'] as const),
  accent: HexColorSchema,
  secondary: HexColorSchema,
  surface: HexColorSchema,
  text: HexColorSchema,
})

/** Durable appearance schema; also the wire envelope the browser scope validates against. */
export const AppearanceSettingsSchema: z<AppearanceSettings> = z.object({
  [APPEARANCE_FIELDS.skin]: z.string().default(DEFAULT_SKIN_ID),
  [APPEARANCE_FIELDS.wallpaper]: z.string().default(''),
  [APPEARANCE_FIELDS.palette]: z.union([WallpaperPaletteSchema, z.const(null)]).default(null),
  [APPEARANCE_FIELDS.opacity]: z.number().min(MIN_OPACITY).max(MAX_OPACITY).default(DEFAULT_OPACITY),
  [APPEARANCE_FIELDS.blur]: z.number().min(MIN_BLUR).max(MAX_BLUR).default(DEFAULT_BLUR),
})

/**
 * Register the durable appearance section when the optional settings service is
 * composed; without one the namespace is simply never exposed.
 * @param ctx - Host context that may acquire the settings service.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(APPEARANCE_SETTINGS_NAMESPACE), AppearanceSettingsSchema)
  })
}
