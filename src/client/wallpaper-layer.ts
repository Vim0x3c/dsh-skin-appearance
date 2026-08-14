/**
 * Wallpaper applier: owns one image layer inside the application `#root`.
 *
 * Layer stack (bottom to top):
 * 1. This applier's base stacking layer — the wallpaper image with opacity
 *    and an optional `filter: blur()` (blurring only the image, never the UI).
 * 2. AppFrame's `--dsw-alias-bg-base` recipe — readability gradients over a
 *    translucent base color, so the image shows through while text stays
 *    readable.
 * 3. The raised surfaces (panels, sidebar) — translucent; the separate surface
 *    applier gives only the compact composer card a bounded backdrop filter.
 *
 * Slider drags write only this layer's opacity/filter styles. No
 * `backdrop-filter` is not used on this full-frame layer: it would continuously
 * sample the moving conversation underneath during streaming and scrolling.
 */
import { DEFAULT_OPACITY } from '../appearance-settings.ts'

export class WallpaperApplier {
  private el: HTMLDivElement | null = null
  private host: HTMLElement | null = null
  private hostPosition = ''
  private hostIsolation = ''
  private setHostPosition = false
  private setHostIsolation = false
  private raf = 0
  private pendingBlur = 0
  private pendingOpacity = DEFAULT_OPACITY

  /** Ensure the image layer is mounted (idempotent). */
  private ensure(): HTMLDivElement | null {
    if (this.el !== null && this.host?.contains(this.el) === true) return this.el
    const host = document.getElementById('root') ?? document.body
    this.host = host
    this.hostPosition = host.style.position
    this.hostIsolation = host.style.isolation
    this.setHostPosition = getComputedStyle(host).position === 'static'
    this.setHostIsolation = host.style.isolation !== 'isolate'
    if (this.setHostPosition) host.style.position = 'relative'
    if (this.setHostIsolation) host.style.isolation = 'isolate'
    this.el = document.createElement('div')
    this.el.dataset.dshSkinWallpaper = ''
    this.el.style.cssText = 'position:fixed;inset:-60px;z-index:0;pointer-events:none;'
      + 'background-size:cover;background-position:center center;background-repeat:no-repeat;'
    host.prepend(this.el)
    return this.el
  }

  /** Set the wallpaper image data URL (empty removes the layer). */
  setImage(image: string): void {
    if (image === '') {
      this.teardown()
      return
    }
    const el = this.ensure()
    if (el === null) return
    el.style.backgroundImage = `url("${image}")`
    el.style.opacity = String(this.pendingOpacity)
    el.style.filter = this.pendingBlur > 0 ? `blur(${this.pendingBlur}px)` : 'none'
  }

  /** Set image opacity (0..1) as a direct compositor style write. */
  setOpacity(opacity: number): void {
    this.pendingOpacity = clampUnit(opacity)
    if (this.el !== null) this.el.style.opacity = String(this.pendingOpacity)
  }

  /** Schedule a blur write, coalesced to one per animation frame. */
  setBlur(blur: number): void {
    this.pendingBlur = clampBlur(blur)
    if (this.raf !== 0) return
    this.raf = requestAnimationFrame(() => {
      this.raf = 0
      if (this.el !== null) {
        const latest = this.pendingBlur
        this.el.style.filter = latest > 0 ? `blur(${latest}px)` : 'none'
      }
    })
  }

  /** Remove the image layer. */
  private teardown(): void {
    if (this.raf !== 0) cancelAnimationFrame(this.raf)
    this.raf = 0
    this.el?.remove()
    this.el = null
    if (this.host !== null) {
      if (this.setHostPosition && this.host.style.position === 'relative') {
        this.host.style.position = this.hostPosition
      }
      if (this.setHostIsolation && this.host.style.isolation === 'isolate') {
        this.host.style.isolation = this.hostIsolation
      }
    }
    this.host = null
    this.setHostPosition = false
    this.setHostIsolation = false
  }

  /** Remove the image layer. */
  dispose(): void {
    this.teardown()
  }
}

/** Keep persisted or optimistic slider values inside the renderer's range. */
function clampUnit(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : DEFAULT_OPACITY
}

/** Keep blur in sync with the settings schema even during optimistic writes. */
function clampBlur(value: number): number {
  return Number.isFinite(value) ? Math.min(60, Math.max(0, value)) : 0
}
