/**
 * Local-image intake for the wallpaper: read a picked file, decode it, and
 * downscale it onto a canvas as a JPEG data URL so a wallpaper stays well
 * inside the settings-document budget.
 *
 * The caller shows a processing state while browser decode/canvas compression
 * runs, and the wallpaper appears only once the result is ready.
 */
import type { WallpaperPalette } from '../appearance-settings.ts'

/** Target bounds for the compressed wallpaper, in pixels and JPEG quality. */
const MAX_SIDE = 1600
const SAMPLE_SIDE = 48
const QUALITY = 0.75
const MAX_SOURCE_BYTES = 25 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

/** Wallpaper intake failure shown by the settings surface. */
export type ImageIntakeFailure = 'not-image' | 'too-large' | 'decode'

/** Result of validating, decoding, and compressing one local image. */
export type ImageIntakeResult =
  | { ok: true; dataUrl: string; palette: WallpaperPalette }
  | { ok: false; reason: ImageIntakeFailure }

/**
 * Read a picked image file into a compressed data URL.
 * @param file - the image file the user picked.
 * @returns the compressed data URL or a user-presentable failure reason.
 */
export function readImageAsDataUrl(file: File): Promise<ImageIntakeResult> {
  if (file.type !== '' && !ALLOWED_MIME_TYPES.has(file.type)) {
    return Promise.resolve({ ok: false, reason: 'not-image' })
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return Promise.resolve({ ok: false, reason: 'too-large' })
  }
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onerror = () => resolve({ ok: false, reason: 'decode' })
    reader.onload = () => {
      const src = reader.result
      if (typeof src !== 'string') {
        resolve({ ok: false, reason: 'decode' })
        return
      }
      const image = new Image()
      image.onerror = () => resolve({ ok: false, reason: 'decode' })
      image.onload = () => {
        try {
          resolve({ ok: true, ...processImage(image, MAX_SIDE, QUALITY) })
        } catch {
          resolve({ ok: false, reason: 'decode' })
        }
      }
      image.src = src
    }
    try {
      reader.readAsDataURL(file)
    } catch {
      resolve({ ok: false, reason: 'decode' })
    }
  })
}

/**
 * Downscale an image and derive a compact palette from a separate 48 px sample.
 * @param image - the decoded image.
 * @param maxSide - the longer-side bound in pixels.
 * @param quality - JPEG quality (0..1).
 * @returns the compressed JPEG data URL and extracted palette.
 */
export function processImage(
  image: HTMLImageElement,
  maxSide: number,
  quality: number,
): { dataUrl: string; palette: WallpaperPalette } {
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  if (width < 1 || height < 1) throw new Error('image has no pixels')
  const scale = Math.min(1, maxSide / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const context = canvas.getContext('2d')
  if (context === null) throw new Error('canvas 2d context unavailable')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const sampleScale = Math.min(1, SAMPLE_SIDE / width, SAMPLE_SIDE / height)
  const sample = document.createElement('canvas')
  sample.width = Math.max(1, Math.floor(width * sampleScale))
  sample.height = Math.max(1, Math.floor(height * sampleScale))
  const sampleContext = sample.getContext('2d')
  if (sampleContext === null) throw new Error('sample canvas 2d context unavailable')
  sampleContext.drawImage(image, 0, 0, sample.width, sample.height)
  return {
    dataUrl: canvas.toDataURL('image/jpeg', quality),
    palette: extractPalette(sampleContext.getImageData(0, 0, sample.width, sample.height).data),
  }
}

/**
 * Derive a readable four-color palette from RGBA pixels.
 * @param pixels - packed RGBA pixels from a bounded sample canvas.
 * @returns dominant/secondary colors plus readable surface and text colors.
 */
export function extractPalette(pixels: Uint8ClampedArray): WallpaperPalette {
  const buckets = new Map<number, { weight: number; red: number; green: number; blue: number; hue: number }>()
  let luminanceSum = 0
  let count = 0
  for (let index = 0; index + 3 < pixels.length; index += 4) {
    if (pixels[index + 3]! < 128) continue
    const red = pixels[index]!
    const green = pixels[index + 1]!
    const blue = pixels[index + 2]!
    const maximum = Math.max(red, green, blue)
    const minimum = Math.min(red, green, blue)
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    luminanceSum += luminance
    count += 1
    const saturation = maximum === 0 ? 0 : (maximum - minimum) / maximum
    if (saturation < 0.18 || luminance < 24 || luminance > 245) continue
    const delta = maximum - minimum || 1
    const hue = maximum === red
      ? (green - blue) / delta + (green < blue ? 6 : 0)
      : maximum === green ? (blue - red) / delta + 2 : (red - green) / delta + 4
    const bucketId = (Math.round(hue) % 6) * 2 + (saturation > 0.55 ? 1 : 0)
    const bucket = buckets.get(bucketId) ?? {
      weight: 0, red: 0, green: 0, blue: 0, hue: hue * 60,
    }
    const weight = saturation * saturation
    bucket.weight += weight
    bucket.red += red * weight
    bucket.green += green * weight
    bucket.blue += blue * weight
    buckets.set(bucketId, bucket)
  }
  const averageLuminance = count === 0 ? 128 : luminanceSum / count
  const ranked = [...buckets.values()]
    .sort((left, right) => right.weight - left.weight)
    .map(bucket => ({
      rgb: [bucket.red / bucket.weight, bucket.green / bucket.weight, bucket.blue / bucket.weight] as Rgb,
      hue: bucket.hue,
    }))
  const accent: Rgb = ranked[0]?.rgb ?? [36, 201, 215]
  const accentHue = ranked[0]?.hue ?? 0
  const secondary = ranked.find(candidate => hueGap(candidate.hue, accentHue) > 50)?.rgb
    ?? mix(accent, [255, 255, 255], 0.35)
  const light = averageLuminance > 128
  return {
    colorScheme: light ? 'light' : 'dark',
    accent: hex(accent),
    secondary: hex(secondary),
    surface: hex(light ? mix(accent, [252, 252, 255], 0.92) : mix(accent, [12, 12, 18], 0.86)),
    text: hex(light ? mix(accent, [16, 24, 40], 0.82) : mix(accent, [244, 246, 252], 0.85)),
  }
}

type Rgb = [number, number, number]

function mix(left: Rgb, right: Rgb, amount: number): Rgb {
  return left.map((value, index) => value + (right[index]! - value) * amount) as Rgb
}

function hueGap(left: number, right: number): number {
  const distance = Math.abs(left - right) % 360
  return Math.min(distance, 360 - distance)
}

function hex(rgb: Rgb): string {
  return `#${rgb.map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('')}`
}
