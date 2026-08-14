/**
 * Appearance settings section: skin preset cards plus the wallpaper controls
 * (local image picker with a processing state, opacity and blur sliders).
 * Every write goes through the injected scope face; the Host document stays
 * the single fact source.
 */
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import {
  DEFAULT_BLUR, DEFAULT_OPACITY, DEFAULT_SKIN_ID, MAX_BLUR, MAX_OPACITY, MIN_BLUR, MIN_OPACITY,
  WALLPAPER_SKIN_ID,
  type WallpaperPalette,
} from '../appearance-settings.ts'
import { readImageAsDataUrl, type ImageIntakeFailure } from './image-intake.ts'
import type { AppearanceKey } from './locales.ts'
import type { createAppearanceSectionStore } from './appearance-store.ts'
import { resolveSkinPreset, SKIN_PRESETS } from './skin-presets.ts'
import css from './AppearanceSection.module.css'

/** Injected business face: the persisted-section writes. */
export interface AppearanceSectionInjected {
  /** Select a skin id (`default` reverts to the built-in appearance). */
  setSkin: (id: string) => void
  /** Set the wallpaper data URL and its extracted palette (empty removes both). */
  setWallpaper: (dataUrl: string, palette?: WallpaperPalette) => void
  /** Set the wallpaper wash opacity (0..1). */
  setOpacity: (opacity: number) => void
  /** Preview wallpaper opacity without writing the Host settings document. */
  previewOpacity: (opacity: number) => void
  /** Set the wallpaper blur (0..60 px). */
  setBlur: (blur: number) => void
  /** Preview wallpaper blur without writing the Host settings document. */
  previewBlur: (blur: number) => void
  /** Restore the native appearance: default skin, no wallpaper. */
  reset: () => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AppearanceSectionComponentProps =
  PropsRuntime<'settings.section'> & PropsStore<ReturnType<typeof createAppearanceSectionStore>>
  & PropsLocale<'settings.dshSkinAppearance'> & AppearanceSectionInjected

/**
 * Render the Appearance section.
 * @param props - composed slot props.
 * @returns the section element tree.
 */
export function AppearanceSection({ t, useStore, ...face }: AppearanceSectionComponentProps) {
  const state = useStore(snapshot => snapshot)
  const settings = state.settings
  const requestedSkin = settings?.skin ?? DEFAULT_SKIN_ID
  const activePreset = resolveSkinPreset(requestedSkin)
  const activeSkin = requestedSkin === WALLPAPER_SKIN_ID && settings?.palette !== null
    ? WALLPAPER_SKIN_ID
    : activePreset?.id ?? DEFAULT_SKIN_ID
  const wallpaper = settings?.wallpaper ?? ''
  const activeWallpaper = requestedSkin === WALLPAPER_SKIN_ID ? wallpaper : activePreset?.wallpaper ?? ''
  const persistedOpacity = settings?.opacity ?? DEFAULT_OPACITY
  const persistedBlur = settings?.blur ?? DEFAULT_BLUR
  const [opacity, setOpacity] = useState(persistedOpacity)
  const [blur, setBlur] = useState(persistedBlur)
  const opacityValue = useRef(persistedOpacity)
  const blurValue = useRef(persistedBlur)
  const committedOpacity = useRef(persistedOpacity)
  const committedBlur = useRef(persistedBlur)
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [choosing, setChoosing] = useState(false)
  const [intakeFailure, setIntakeFailure] = useState<ImageIntakeFailure | undefined>()
  const disabled = state.status !== 'ready' || !state.writable

  useEffect(() => {
    opacityValue.current = persistedOpacity
    committedOpacity.current = persistedOpacity
    setOpacity(persistedOpacity)
  }, [persistedOpacity])
  useEffect(() => {
    blurValue.current = persistedBlur
    committedBlur.current = persistedBlur
    setBlur(persistedBlur)
  }, [persistedBlur])

  const previewOpacity = (next: number): void => {
    opacityValue.current = next
    setOpacity(next)
    face.previewOpacity(next)
  }
  const previewBlur = (next: number): void => {
    blurValue.current = next
    setBlur(next)
    face.previewBlur(next)
  }
  const commitOpacity = (): void => {
    const next = opacityValue.current
    if (next === committedOpacity.current) return
    committedOpacity.current = next
    face.setOpacity(next)
  }
  const commitBlur = (): void => {
    const next = blurValue.current
    if (next === committedBlur.current) return
    committedBlur.current = next
    face.setBlur(next)
  }

  const onPick = (): void => { fileInput.current?.click() }
  const onFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (file === undefined) return
    setChoosing(true)
    setIntakeFailure(undefined)
    void readImageAsDataUrl(file).then((result) => {
      setChoosing(false)
      if (result.ok) face.setWallpaper(result.dataUrl, result.palette)
      else setIntakeFailure(result.reason)
    })
  }

  return (
    <div className={css.section}>
      {state.status !== 'ready' && (
        <p className={css.notice} aria-live="polite">{t('settings.loading')}</p>
      )}
      {state.status === 'ready' && !state.writable && (
        <p className={css.notice} aria-live="polite">{t('settings.readonly')}</p>
      )}
      <div className={css.group}>
        <div className={css.groupTitle}>{t('skins.title')}</div>
        <p className={css.hint}>{t('skins.hint')}</p>
        <div className={css.cardGrid}>
          <button
            type="button"
            className={activeSkin === DEFAULT_SKIN_ID ? `${css.card} ${css.cardActive}` : css.card}
            aria-pressed={activeSkin === DEFAULT_SKIN_ID}
            disabled={disabled}
            onClick={() => { face.setSkin(DEFAULT_SKIN_ID) }}
          >
            <span className={css.skinPreview} aria-hidden="true">
              <span style={{ background: 'var(--dsw-alias-bg-base)' }} />
              <span style={{ background: 'var(--dsw-alias-brand-primary)' }} />
              <span style={{ background: 'var(--dsw-alias-label-primary)' }} />
            </span>
            <span className={css.cardFooter}>
              <span>{t('skin.default')}</span>
              <span className={css.scheme}>{t('scheme.system')}</span>
            </span>
          </button>
          {wallpaper !== '' && settings?.palette !== null && settings?.palette !== undefined && (
            <button
              type="button"
              className={activeSkin === WALLPAPER_SKIN_ID ? `${css.card} ${css.cardActive}` : css.card}
              style={{
                '--skin-bg': settings.palette.surface,
                '--skin-surface': settings.palette.secondary,
                '--skin-accent': settings.palette.accent,
              } as CSSProperties}
              aria-pressed={activeSkin === WALLPAPER_SKIN_ID}
              disabled={disabled}
              onClick={() => { face.setSkin(WALLPAPER_SKIN_ID) }}
            >
              <span
                className={css.imagePreview}
                style={{ backgroundImage: `url("${wallpaper}")` }}
                aria-hidden="true"
              >
                <span className={css.previewSwatches}>
                  <span style={{ background: 'var(--skin-bg)' }} />
                  <span style={{ background: 'var(--skin-surface)' }} />
                  <span style={{ background: 'var(--skin-accent)' }} />
                </span>
              </span>
              <span className={css.cardFooter}>
                <span>{t('skin.wallpaper')}</span>
                <span className={css.scheme}>{t(`scheme.${settings.palette.colorScheme}`)}</span>
              </span>
            </button>
          )}
          {SKIN_PRESETS.map(preset => {
            const style = {
              '--skin-bg': preset.tokens['--dsw-alias-bg-base'],
              '--skin-surface': preset.tokens['--dsw-alias-bg-layer-2'],
              '--skin-accent': preset.tokens['--dsw-alias-brand-primary'],
            } as CSSProperties
            const previewStyle = {
              backgroundImage: `url("${preset.wallpaper}")`,
              backgroundPosition: preset.previewPosition,
            } as CSSProperties
            return (
            <button
              key={preset.id}
              type="button"
              className={activeSkin === preset.id ? `${css.card} ${css.cardActive}` : css.card}
              style={style}
              aria-pressed={activeSkin === preset.id}
              disabled={disabled}
              onClick={() => { face.setSkin(preset.id) }}
            >
              <span className={css.imagePreview} style={previewStyle} aria-hidden="true">
                <span className={css.previewSwatches}>
                  <span style={{ background: 'var(--skin-bg)' }} />
                  <span style={{ background: 'var(--skin-surface)' }} />
                  <span style={{ background: 'var(--skin-accent)' }} />
                </span>
              </span>
              <span className={css.cardFooter}>
                <span>{t(`skin.${preset.key}` as AppearanceKey)}</span>
                <span className={css.scheme}>
                  {t(`scheme.${preset.colorScheme}` as AppearanceKey)}
                </span>
              </span>
            </button>
            )
          })}
        </div>
      </div>
      <div className={css.group}>
        <div className={css.groupTitle}>{t('wallpaper.title')}</div>
        <p className={css.hint}>{t('wallpaper.hint')}</p>
        <div className={css.actionRow}>
          {wallpaper !== '' && (
            <img className={css.preview} src={wallpaper} alt="" />
          )}
          <button type="button" className={css.button} onClick={onPick} disabled={disabled || choosing}>
            {choosing ? t('wallpaper.choosing') : t('wallpaper.choose')}
          </button>
          {wallpaper !== '' && (
            <button
              type="button"
              className={`${css.button} ${css.buttonDanger}`}
              disabled={disabled}
              onClick={() => { face.setWallpaper('') }}
            >
              {t('wallpaper.remove')}
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className={css.fileInput}
            aria-label={t('wallpaper.choose')}
            disabled={disabled || choosing}
            onChange={onFile}
          />
        </div>
        {intakeFailure !== undefined && (
          <p className={css.error} role="alert">
            {t(`wallpaper.invalid.${intakeFailure}` as AppearanceKey)}
          </p>
        )}
        <label className={css.row}>
          <span>{t('wallpaper.opacity')}</span>
          <input
            type="range"
            aria-label={t('wallpaper.opacity')}
            min={MIN_OPACITY * 100}
            max={MAX_OPACITY * 100}
            step={1}
            value={Math.round(opacity * 100)}
            disabled={disabled || activeWallpaper === ''}
            onChange={(event) => {
              previewOpacity(Number(event.currentTarget.value) / 100)
            }}
            onPointerUp={commitOpacity}
            onPointerCancel={commitOpacity}
            onKeyUp={commitOpacity}
            onBlur={commitOpacity}
          />
          <span className={css.rowValue}>{Math.round(opacity * 100)}%</span>
        </label>
        <label className={css.row}>
          <span>{t('wallpaper.blur')}</span>
          <input
            type="range"
            aria-label={t('wallpaper.blur')}
            min={MIN_BLUR}
            max={MAX_BLUR}
            step={1}
            value={blur}
            disabled={disabled || activeWallpaper === ''}
            onChange={(event) => {
              previewBlur(Number(event.currentTarget.value))
            }}
            onPointerUp={commitBlur}
            onPointerCancel={commitBlur}
            onKeyUp={commitBlur}
            onBlur={commitBlur}
          />
          <span className={css.rowValue}>{blur}px</span>
        </label>
        <div className={css.actionRow}>
          <button type="button" className={css.button} disabled={disabled} onClick={face.reset}>
            {t('wallpaper.reset')}
          </button>
        </div>
      </div>
    </div>
  )
}
