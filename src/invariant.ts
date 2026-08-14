/**
 * Package-owned invariant companion for `dsh-skin-appearance`.
 * @module dsh-skin-appearance/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = 'dsh-skin-appearance'

/** Cordis companion plugin name. */
export const name = 'dsh-skin-appearance-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the settings scope validates and publishes the durable
 * appearance section, while the browser half derives its DOM writes purely
 * from the resolved value and retracts exactly its own applied set on dispose.
 * Resolver/presenter agreement is covered directly by this package's
 * resolution and presenter behavior specs.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
