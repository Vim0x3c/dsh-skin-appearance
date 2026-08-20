/** Curated image-backed skin presets shared by the applier and settings cards. */
import abyssStarport from '../../assets/themes/abyss-starport.webp?inline'
import cloudLab from '../../assets/themes/cloud-lab.webp?inline'
import deepseaWhale from '../../assets/themes/deepsea-whale.webp?inline'
import deepseekChan from '../../assets/themes/deepseek-chan.webp?inline'
import inkAlgorithm from '../../assets/themes/ink-algorithm.webp?inline'
import intelligenceOrbitDawn from '../../assets/themes/intelligence-orbit-dawn.webp?inline'
import intelligenceOrbitInk from '../../assets/themes/intelligence-orbit-ink.webp?inline'
import qq2008Crystal from '../../assets/themes/qq2008-crystal.webp?inline'
import type { PresetSurfaceStyleMode } from './surface-style.ts'

/** Stable display key for one built-in skin. */
export type SkinPresetKey =
  | 'deepseekChan'
  | 'qq2008Crystal'
  | 'cloudLab'
  | 'inkAlgorithm'
  | 'abyssStarport'
  | 'deepseaWhale'
  | 'intelligenceOrbitInk'
  | 'intelligenceOrbitDawn'

/** Special token recipe selected by a preset. */
export type SkinPresetVariant = 'qq2008'

/** One plugin-owned image theme plus its settings-card metadata. */
export interface SkinPreset {
  /** Namespaced skin id persisted in the appearance section. */
  id: string
  /** Locale suffix used by `skin.<key>`. */
  key: SkinPresetKey
  /** Palette semantics applied by ThemeRuntime. */
  colorScheme: 'light' | 'dark'
  /** Inlined WebP used for both the live wallpaper and card preview. */
  wallpaper: string
  /** Card preview focal point. */
  previewPosition: string
  /** Optional dedicated surface recipe. */
  variant?: SkinPresetVariant
  /** Sidebar and composer recipe paired with this wallpaper. */
  surface: PresetSurfaceStyleMode
  /** Alias-token overrides for both palette modes. */
  tokens: Record<'light' | 'dark', Record<string, string>>
}

/** Theme ids are namespaced because ThemeRuntime has one global id registry. */
const ID_PREFIX = 'dsh-skin-appearance-'

/** Presets in settings-card order. */
export const SKIN_PRESETS: readonly SkinPreset[] = [
  {
    id: `${ID_PREFIX}deepseek-chan`,
    key: 'deepseekChan',
    colorScheme: 'dark',
    wallpaper: deepseekChan,
    previewPosition: '72% 48%',
    surface: 'deepseek-chan',
    tokens: {
      light: lightTokens('#eef5ff', '#f9fbff', '#e2ecfa', '#2f74d0', '#182a44', '#607897'),
      dark: darkTokens('#0b1425', '#121e34', '#192844', '#4d9fff', '#e9f3ff', '#a9c2df'),
    },
  },
  {
    id: `${ID_PREFIX}qq2008-crystal`,
    key: 'qq2008Crystal',
    colorScheme: 'light',
    wallpaper: qq2008Crystal,
    previewPosition: '50% 50%',
    variant: 'qq2008',
    surface: 'qq2008',
    tokens: {
      light: lightTokens('#edf8ff', '#f8fdff', '#dff3ff', '#2f85c7', '#164a73', '#527a98', {
        '--dsw-alias-border-l1': '#b5d7ec',
        '--dsw-alias-border-l2': '#82b7df',
        '--dsw-alias-interactive-bg-hover': 'rgba(255, 157, 33, 0.16)',
        '--dsw-specific-sidebar-fill': '#d9efff',
      }),
      dark: darkTokens('#07172b', '#0d2945', '#133955', '#5db8f3', '#eef9ff', '#a4cbe2', {
        '--dsw-alias-border-l1': '#244c70',
        '--dsw-alias-border-l2': '#3a709d',
        '--dsw-alias-interactive-bg-hover': 'rgba(93, 184, 243, 0.16)',
        '--dsw-specific-sidebar-fill': '#0b2944',
      }),
    },
  },
  {
    id: `${ID_PREFIX}cloud-lab`,
    key: 'cloudLab',
    colorScheme: 'light',
    wallpaper: cloudLab,
    previewPosition: '72% 46%',
    surface: 'cloud-lab',
    tokens: {
      light: lightTokens('#f3f7ff', '#fbfdff', '#e8f2fb', '#5e7ce2', '#1f3152', '#60728e'),
      dark: darkTokens('#0a1b2a', '#112b3f', '#18384e', '#7eb8ff', '#eef8ff', '#abc4d8'),
    },
  },
  {
    id: `${ID_PREFIX}ink-algorithm`,
    key: 'inkAlgorithm',
    colorScheme: 'light',
    wallpaper: inkAlgorithm,
    previewPosition: '78% 50%',
    surface: 'ink-algorithm',
    tokens: {
      light: lightTokens('#f2f0ea', '#fbfaf6', '#e7e4dc', '#b13a34', '#1c292f', '#617077'),
      dark: darkTokens('#171817', '#222321', '#2c2c29', '#df7770', '#f5f0e8', '#b9b1a6'),
    },
  },
  {
    id: `${ID_PREFIX}abyss-starport`,
    key: 'abyssStarport',
    colorScheme: 'dark',
    wallpaper: abyssStarport,
    previewPosition: '77% 50%',
    surface: 'abyss-starport',
    tokens: {
      light: lightTokens('#edfafd', '#f8fdff', '#daf1f3', '#168b91', '#173a41', '#567a80'),
      dark: darkTokens('#071b24', '#0c2732', '#123542', '#28d7d0', '#e7fbff', '#9bc9d2'),
    },
  },
  {
    id: `${ID_PREFIX}deepsea-whale`,
    key: 'deepseaWhale',
    colorScheme: 'dark',
    wallpaper: deepseaWhale,
    previewPosition: '58% 48%',
    surface: 'deepsea-whale',
    tokens: {
      light: lightTokens('#edf7ff', '#f8fcff', '#dceefa', '#2f87bd', '#153d5d', '#597c98'),
      dark: darkTokens('#082039', '#0d2c4c', '#12385e', '#55bdf2', '#eff8ff', '#accce2'),
    },
  },
  {
    id: `${ID_PREFIX}intelligence-orbit-ink`,
    key: 'intelligenceOrbitInk',
    colorScheme: 'light',
    wallpaper: intelligenceOrbitInk,
    previewPosition: '64% 46%',
    surface: 'intelligence-orbit-ink',
    tokens: {
      light: lightTokens('#f4f1eb', '#fcfaf6', '#e9e5dd', '#b98735', '#2d3138', '#686b70'),
      dark: darkTokens('#1b1b1d', '#29282a', '#343235', '#d6a85b', '#f5f1e9', '#bbb3a8'),
    },
  },
  {
    id: `${ID_PREFIX}intelligence-orbit-dawn`,
    key: 'intelligenceOrbitDawn',
    colorScheme: 'light',
    wallpaper: intelligenceOrbitDawn,
    previewPosition: '62% 46%',
    surface: 'intelligence-orbit-dawn',
    tokens: {
      light: lightTokens('#f4f7fb', '#fcfdff', '#e8f0f8', '#4e82c8', '#24364b', '#60758c'),
      dark: darkTokens('#101d2d', '#192b40', '#223951', '#79aef0', '#f2f7ff', '#b0c3db'),
    },
  },
] as const

/** Resolve current namespaced ids and short development ids. */
export function resolveSkinPreset(value: string): SkinPreset | undefined {
  return SKIN_PRESETS.find(preset => preset.id === value || preset.key === value)
}

function darkTokens(
  base: string,
  layer1: string,
  layer2: string,
  accent: string,
  text: string,
  secondaryText: string,
  extra: Record<string, string> = {},
): Record<string, string> {
  return {
    '--dsw-alias-bg-base': base,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer2,
    '--dsw-alias-bg-overlay': layer2,
    '--dsw-alias-brand-primary': accent,
    '--dsw-alias-label-primary': text,
    '--dsw-alias-label-secondary': secondaryText,
    ...extra,
  }
}

function lightTokens(
  base: string,
  layer1: string,
  layer2: string,
  accent: string,
  text: string,
  secondaryText: string,
  extra: Record<string, string> = {},
): Record<string, string> {
  return {
    '--dsw-alias-bg-base': base,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer2,
    '--dsw-alias-bg-overlay': layer1,
    '--dsw-alias-brand-primary': accent,
    '--dsw-alias-label-primary': text,
    '--dsw-alias-label-secondary': secondaryText,
    ...extra,
  }
}
