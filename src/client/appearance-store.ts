/**
 * Appearance section store: a mirror of the settings scope snapshot. The
 * plugin's apply-world change listener is the only writer; the section
 * component reads via props.useStore.
 */
import {
  defineStore, type EngineStoreHandle, type SettingsScopeSnapshot,
} from '@deepseek-ai/dsh-client-runtime/client'
import type { AppearanceSettings } from '../appearance-settings.ts'

/** Store state mirrored from the settings scope. */
export interface AppearanceSectionState {
  /** Persisted section; undefined until the first accepted value. */
  settings: AppearanceSettings | undefined
  /** Current settings transport state. */
  status: SettingsScopeSnapshot<AppearanceSettings>['status']
  /** Whether the Host accepts appearance writes. */
  writable: boolean
  /** Namespace revision, undefined until the first Host view. */
  revision: number | undefined
}

/** Declared action shape giving the exported factory a stable return type. */
type AppearanceSectionActions = {
  sync: (draft: AppearanceSectionState, snapshot: SettingsScopeSnapshot<AppearanceSettings>) => void
}

/**
 * Declares the Appearance section state and write surface.
 * @returns the store handle.
 */
export function createAppearanceSectionStore(): EngineStoreHandle<AppearanceSectionState, AppearanceSectionActions> {
  return defineStore({
    init: (): AppearanceSectionState => ({
      settings: undefined,
      status: 'loading',
      writable: false,
      revision: undefined,
    }),
    actions: {
      sync: (draft, snapshot: SettingsScopeSnapshot<AppearanceSettings>) => {
        draft.settings = snapshot.value
        draft.status = snapshot.status
        draft.writable = snapshot.writable
        draft.revision = snapshot.revision
      },
    },
  })
}
