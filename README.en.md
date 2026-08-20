# dsh-skin-appearance

**Language: [中文](README.md) | English**

An appearance plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

It keeps the Harness controls native and adds an Appearance settings page with:

- eight bundled image themes;
- a local wallpaper picker that downsizes images before storing them;
- automatic palette extraction with distinct light and dark appearances for uploaded wallpapers;
- theme-specific styling for the sidebar, new-session button, plugin entry, and composer;
- independent wallpaper opacity and blur controls, defaulting to 100% opacity and 0 px blur;
- Host-backed persistence across web restarts; and
- one-click reset to the native Harness appearance.

## Theme gallery

| DeepSeek-chan · Abyss Echo | QQ2008 · Crystal Blue |
| --- | --- |
| ![DeepSeek-chan theme](assets/screenshots/deepseek-chan.jpg) | ![QQ2008 theme](assets/screenshots/qq2008-crystal.jpg) |
| Cloud Lab | Ink Algorithm |
| ![Cloud Lab theme](assets/screenshots/cloud-lab.jpg) | ![Ink Algorithm theme](assets/screenshots/ink-algorithm.jpg) |
| Abyss Starport | Deep-sea Song |
| ![Abyss Starport theme](assets/screenshots/abyss-starport.jpg) | ![Deep-sea Song theme](assets/screenshots/deepsea-whale.jpg) |
| Intelligence Orbit · Ink | Intelligence Orbit · Dawn |
| ![Intelligence Orbit Ink theme](assets/screenshots/intelligence-orbit-ink.jpg) | ![Intelligence Orbit Dawn theme](assets/screenshots/intelligence-orbit-dawn.jpg) |

## Install

The plugin is a dsh bundle. Install it into the web profile with the Harness CLI:

```sh
dsh plugin --profile web add /path/to/dsh-skin-appearance
dsh web
```

The `dsh.bundle.patch` declaration adds the plugin to the profile layer stack. On the next web boot, its browser bundle is discovered through the `dsh.client` declaration and the new Appearance page appears in Settings.

For a published package, replace the local path with the package name:

```sh
dsh plugin --profile web add dsh-skin-appearance
```

## Design

The Node half registers the `appearance` settings namespace using the Harness settings service. The browser half contributes a `settings.section` slot, applies dual-mode token overrides through `ctx.theme`, and owns a wallpaper layer covering the whole app root. All eight themes provide their own surface styling for the sidebar, session list, new-session action, plugin entry, and composer. QQ2008 adds a dedicated classic-blue window frame, while custom wallpapers use an adaptive light/dark glass recipe.

Uploaded images are decoded and compressed to a JPEG data URL with a 1600 px long-side limit before they enter the settings document. A separate 48 px sample produces the dominant accent, a hue-separated secondary color, and readable surface/text colors for both light and dark modes. All presets and uploaded wallpapers follow the Harness `Light` / `Dark` / `System` preference without changing the selected skin. Switching back to `Default` removes every plugin-owned token and surface override.

The wallpaper layer itself never uses `backdrop-filter`; blur is limited to bounded interface surfaces so streaming and scrolling remain responsive.

## Development

This package follows the standalone client-plugin build shape used by Harness:

```sh
pnpm install
pnpm build
```

To test it against a source checkout of Harness, build Harness first, then install this directory into its web profile:

```sh
cd /path/to/deepseek-harness
pnpm install
pnpm build
dsh plugin --profile web add /path/to/dsh-skin-appearance
dsh web
```

The package deliberately declares Harness services as peer dependencies. This keeps the plugin on the same Cordis, settings, theme, and React instances as the host application instead of bundling duplicate service identities into the browser bundle.

## License

MIT.
