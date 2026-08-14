/** Plugin-owned global surface styling for wallpaper-backed appearances. */

/** Built-in themes whose sidebar and composer surfaces have dedicated recipes. */
export type PresetSurfaceStyleMode =
  | 'deepseek-chan'
  | 'qq2008'
  | 'cloud-lab'
  | 'ink-algorithm'
  | 'abyss-starport'
  | 'deepsea-whale'
  | 'intelligence-orbit-ink'
  | 'intelligence-orbit-dawn'

/** Visual surface mode projected onto the application root. */
export type SurfaceStyleMode =
  | 'none'
  | 'glass-light'
  | 'glass-dark'
  | PresetSurfaceStyleMode

const SURFACE_ATTRIBUTE = 'dshSkinSurface'

const SURFACE_CSS = `
html[data-dsh-skin-surface='glass-light'] [data-composer-card] {
  background: rgba(255, 255, 255, 0.58) !important;
  border-color: rgba(255, 255, 255, 0.72) !important;
  -webkit-backdrop-filter: blur(22px) saturate(145%);
  backdrop-filter: blur(22px) saturate(145%);
  box-shadow: 0 16px 40px rgba(32, 55, 86, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.68) !important;
}

html[data-dsh-skin-surface='glass-dark'] [data-composer-card] {
  background: rgba(10, 18, 31, 0.58) !important;
  border-color: rgba(137, 185, 235, 0.22) !important;
  -webkit-backdrop-filter: blur(22px) saturate(145%);
  backdrop-filter: blur(22px) saturate(145%);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
}

@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  html[data-dsh-skin-surface='glass-light'] [data-composer-card] {
    background: rgba(255, 255, 255, 0.86) !important;
  }

  html[data-dsh-skin-surface='glass-dark'] [data-composer-card] {
    background: rgba(10, 18, 31, 0.86) !important;
  }
}

html[data-dsh-skin-surface='glass-light'] {
  --dsh-skin-sidebar-background: rgba(247, 250, 255, 0.56);
  --dsh-skin-surface-background: rgba(255, 255, 255, 0.3);
  --dsh-skin-new-session-background: rgba(255, 255, 255, 0.34);
  --dsh-skin-new-session-hover: rgba(255, 255, 255, 0.58);
  --dsh-skin-section-background: rgba(255, 255, 255, 0.28);
  --dsh-skin-surface-border: rgba(255, 255, 255, 0.72);
  --dsh-skin-surface-shadow: 0 16px 40px rgba(32, 55, 86, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.68);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(255, 255, 255, 0.4);
  --dsh-skin-surface-radius: 16px;
  --dsh-skin-surface-filter: blur(22px) saturate(145%);
}

html[data-dsh-skin-surface='glass-dark'] {
  --dsh-skin-sidebar-background: rgba(7, 15, 28, 0.58);
  --dsh-skin-surface-background: rgba(10, 18, 31, 0.3);
  --dsh-skin-new-session-background: rgba(29, 42, 62, 0.3);
  --dsh-skin-new-session-hover: rgba(43, 66, 99, 0.5);
  --dsh-skin-section-background: rgba(18, 32, 51, 0.36);
  --dsh-skin-surface-border: rgba(137, 185, 235, 0.22);
  --dsh-skin-surface-shadow: 0 18px 44px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(137, 185, 235, 0.12);
  --dsh-skin-surface-radius: 16px;
  --dsh-skin-surface-filter: blur(22px) saturate(145%);
}

html[data-dsh-skin-surface='deepseek-chan'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(4, 12, 28, 0.78), rgba(8, 21, 45, 0.56));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(8, 18, 38, 0.3), rgba(18, 39, 75, 0.16));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(83, 151, 255, 0.2), rgba(35, 77, 145, 0.14));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(97, 165, 255, 0.34), rgba(43, 91, 169, 0.26));
  --dsh-skin-section-background: rgba(64, 126, 219, 0.12);
  --dsh-skin-surface-border: rgba(112, 174, 255, 0.38);
  --dsh-skin-surface-shadow: 0 18px 48px rgba(0, 5, 19, 0.46), 0 0 28px rgba(61, 132, 255, 0.1), inset 0 1px rgba(255, 255, 255, 0.09);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(101, 163, 255, 0.22), 10px 0 34px rgba(0, 7, 24, 0.2);
  --dsh-skin-surface-radius: 18px;
  --dsh-skin-surface-filter: blur(24px) saturate(150%);
}

html[data-dsh-skin-surface='cloud-lab'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(244, 252, 255, 0.72), rgba(214, 240, 255, 0.5));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(224, 246, 255, 0.18));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(255, 255, 255, 0.62), rgba(205, 237, 255, 0.36));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(190, 230, 252, 0.58));
  --dsh-skin-section-background: rgba(255, 255, 255, 0.38);
  --dsh-skin-surface-border: rgba(122, 197, 235, 0.44);
  --dsh-skin-surface-shadow: 0 16px 40px rgba(67, 137, 180, 0.16), inset 0 1px rgba(255, 255, 255, 0.9);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(102, 183, 226, 0.24), 8px 0 30px rgba(85, 157, 199, 0.08);
  --dsh-skin-surface-radius: 14px;
  --dsh-skin-surface-filter: blur(20px) saturate(125%);
}

html[data-dsh-skin-surface='ink-algorithm'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(247, 243, 232, 0.86), rgba(229, 226, 216, 0.7));
  --dsh-skin-surface-background: linear-gradient(180deg, rgba(255, 253, 247, 0.48), rgba(235, 231, 220, 0.34));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(255, 254, 249, 0.72), rgba(225, 220, 208, 0.56));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(255, 254, 249, 0.94), rgba(218, 211, 196, 0.78));
  --dsh-skin-section-background: rgba(42, 53, 57, 0.055);
  --dsh-skin-surface-border: rgba(46, 58, 62, 0.28);
  --dsh-skin-surface-shadow: 0 12px 28px rgba(49, 52, 48, 0.14), inset 0 1px rgba(255, 255, 255, 0.82);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(47, 57, 60, 0.2);
  --dsh-skin-surface-radius: 5px;
  --dsh-skin-surface-filter: blur(10px) saturate(105%);
}

html[data-dsh-skin-surface='abyss-starport'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(3, 20, 29, 0.82), rgba(5, 37, 49, 0.6));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(4, 24, 34, 0.32), rgba(8, 51, 62, 0.18));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(23, 116, 128, 0.24), rgba(6, 61, 74, 0.2));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(35, 151, 160, 0.38), rgba(8, 82, 96, 0.34));
  --dsh-skin-section-background: rgba(35, 214, 209, 0.08);
  --dsh-skin-surface-border: rgba(58, 231, 224, 0.34);
  --dsh-skin-surface-shadow: 0 18px 44px rgba(0, 11, 17, 0.5), 0 0 24px rgba(40, 215, 208, 0.08), inset 0 1px rgba(157, 255, 250, 0.08);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(49, 221, 214, 0.23), 10px 0 34px rgba(0, 13, 20, 0.2);
  --dsh-skin-surface-radius: 8px;
  --dsh-skin-surface-filter: blur(20px) saturate(135%);
}

html[data-dsh-skin-surface='deepsea-whale'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(3, 24, 48, 0.76), rgba(8, 45, 79, 0.56));
  --dsh-skin-surface-background: linear-gradient(150deg, rgba(7, 31, 58, 0.3), rgba(17, 65, 105, 0.16));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(59, 148, 211, 0.22), rgba(19, 75, 124, 0.18));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(77, 171, 231, 0.36), rgba(24, 94, 151, 0.32));
  --dsh-skin-section-background: rgba(79, 184, 240, 0.1);
  --dsh-skin-surface-border: rgba(109, 199, 244, 0.34);
  --dsh-skin-surface-shadow: 0 20px 52px rgba(0, 14, 31, 0.46), inset 0 1px rgba(196, 235, 255, 0.1);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(113, 202, 247, 0.2), 10px 0 34px rgba(0, 18, 38, 0.18);
  --dsh-skin-surface-radius: 22px;
  --dsh-skin-surface-filter: blur(24px) saturate(130%);
}

html[data-dsh-skin-surface='intelligence-orbit-ink'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(250, 247, 239, 0.88), rgba(231, 226, 215, 0.72));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(255, 253, 247, 0.48), rgba(236, 229, 216, 0.32));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(255, 253, 245, 0.72), rgba(229, 217, 195, 0.54));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(255, 253, 245, 0.94), rgba(222, 204, 174, 0.78));
  --dsh-skin-section-background: rgba(185, 135, 53, 0.075);
  --dsh-skin-surface-border: rgba(145, 106, 45, 0.34);
  --dsh-skin-surface-shadow: 0 14px 34px rgba(68, 55, 37, 0.16), inset 0 1px rgba(255, 255, 255, 0.88);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(132, 103, 59, 0.22);
  --dsh-skin-surface-radius: 7px;
  --dsh-skin-surface-filter: blur(12px) saturate(108%);
}

html[data-dsh-skin-surface='intelligence-orbit-dawn'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(248, 252, 255, 0.84), rgba(218, 234, 248, 0.64));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(255, 255, 255, 0.38), rgba(221, 237, 251, 0.22));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(208, 228, 246, 0.48));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(196, 221, 244, 0.72));
  --dsh-skin-section-background: rgba(78, 130, 200, 0.07);
  --dsh-skin-surface-border: rgba(99, 142, 194, 0.32);
  --dsh-skin-surface-shadow: 0 16px 38px rgba(67, 95, 128, 0.15), inset 0 1px rgba(255, 255, 255, 0.92);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(92, 139, 193, 0.2);
  --dsh-skin-surface-radius: 13px;
  --dsh-skin-surface-filter: blur(16px) saturate(115%);
}

html[data-dsh-skin-surface] #root > [data-slot='root'] > * {
  position: relative;
  z-index: 1;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root [class*='_sidebarCol'] {
  background: transparent !important;
  border-right: 1px solid var(--dsh-skin-surface-border) !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root [class*='_sidebarCol'] > [data-slot='sidebar'] > * {
  background: var(--dsh-skin-sidebar-background) !important;
  box-shadow: var(--dsh-skin-sidebar-shadow) !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008']) [data-composer-card] {
  background: var(--dsh-skin-surface-background) !important;
  border-color: var(--dsh-skin-surface-border) !important;
  border-radius: var(--dsh-skin-surface-radius) !important;
  -webkit-backdrop-filter: var(--dsh-skin-surface-filter);
  backdrop-filter: var(--dsh-skin-surface-filter);
  box-shadow: var(--dsh-skin-surface-shadow) !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root > [data-slot='root'] > :not([data-sidebar-collapsed]) button[class$='_newSession'] {
  border: 1px solid var(--dsh-skin-surface-border) !important;
  border-radius: 12px !important;
  background: var(--dsh-skin-new-session-background) !important;
  color: var(--dsw-alias-label-primary) !important;
  -webkit-backdrop-filter: var(--dsh-skin-surface-filter);
  backdrop-filter: var(--dsh-skin-surface-filter);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.14), 0 3px 10px rgba(0, 0, 0, 0.06) !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root > [data-slot='root'] > :not([data-sidebar-collapsed]) button[class$='_newSession']:hover {
  background: var(--dsh-skin-new-session-hover) !important;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.2), 0 5px 14px rgba(0, 0, 0, 0.08) !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root [class*='_sidebarCol'] [class*='_sectionHeader'] {
  border: 1px solid var(--dsh-skin-surface-border) !important;
  background: var(--dsh-skin-section-background) !important;
}

html[data-dsh-skin-surface='qq2008'] #root {
  box-sizing: border-box;
  padding: 10px;
  background: #cbe9fb;
  font-family: Tahoma, 'Microsoft YaHei', sans-serif;
}

html[data-dsh-skin-surface='qq2008'] #root > [data-slot='root'] > * {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  overflow: hidden;
  border: 1px solid #0d70bd;
  border-top-width: 31px;
  border-bottom-width: 24px;
  border-radius: 5px;
  background: rgba(237, 248, 255, 0.76) !important;
  box-shadow: 0 0 0 1px #75b9e8, 0 8px 24px rgba(21, 78, 122, 0.24), inset 0 1px #fff;
}

html[data-dsh-skin-surface='qq2008'] #root > [data-slot='root'] > *::before {
  content: 'DeepSeek Harness 2008';
  position: absolute;
  top: -30px;
  right: 0;
  left: 0;
  z-index: 300;
  box-sizing: border-box;
  height: 29px;
  padding-left: 12px;
  border-bottom: 1px solid #075a9c;
  background: linear-gradient(180deg, #4eb5f2 0%, #1685d4 46%, #0870c3 52%, #2493dc 100%);
  color: #fff;
  font-size: 13px;
  line-height: 28px;
  font-weight: 700;
  text-shadow: 0 1px 1px rgba(0, 52, 96, 0.72);
  pointer-events: none;
}

html[data-dsh-skin-surface='qq2008'] #root > [data-slot='root'] > *::after {
  content: 'Ready';
  position: absolute;
  right: 0;
  bottom: -23px;
  left: 0;
  z-index: 300;
  box-sizing: border-box;
  height: 22px;
  padding-right: 10px;
  border-top: 1px solid #0a68ad;
  background: linear-gradient(180deg, #42a9e8, #0876c7);
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  text-shadow: 0 1px 1px rgba(0, 52, 96, 0.72);
  pointer-events: none;
}

html[data-dsh-skin-surface='qq2008'] #root > [data-slot='root'] > * {
  border-top-color: #197fca;
  border-bottom-color: #197fca;
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] {
  background: transparent !important;
  border-right-color: #8ebfdf !important;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] > [data-slot='sidebar'] > * {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(202, 232, 250, 0.88) 32%, rgba(226, 243, 253, 0.9)) !important;
  box-shadow: inset -1px 0 #fff, 2px 0 8px rgba(42, 105, 151, 0.12) !important;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_logoRow'] {
  margin: 0 4px 8px;
  padding: 5px 6px 7px;
  border: 1px solid #8ebfdf;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(201, 232, 250, 0.86)) !important;
  box-shadow: inset 0 1px #fff;
}

html[data-dsh-skin-surface='qq2008']
  #root > [data-slot='root'] > :not([data-sidebar-collapsed]) button[class$='_newSession'],
html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_logoRow'] > button:first-child {
  border: 1px solid #75acd3 !important;
  border-radius: 4px !important;
  background: linear-gradient(180deg, #ffffff 0%, #edf8ff 48%, #c8e8fa 52%, #e9f7ff 100%) !important;
  color: #164a73 !important;
  box-shadow: inset 0 1px #fff, 0 1px 2px rgba(39, 97, 140, 0.2) !important;
}

html[data-dsh-skin-surface='qq2008']
  #root > [data-slot='root'] > :not([data-sidebar-collapsed]) button[class$='_newSession']:hover {
  border-color: #f39a25 !important;
  background: linear-gradient(180deg, #fffdf4 0%, #ffedb7 48%, #ffd46e 52%, #fff0c7 100%) !important;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_sectionHeader'] {
  margin-inline: 2px !important;
  padding-inline: 7px !important;
  border: 1px solid #9bc4df !important;
  border-radius: 3px !important;
  background: linear-gradient(180deg, #f9fdff, #d9effc) !important;
  color: #164a73 !important;
  box-shadow: inset 0 1px #fff;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_searchExpanded'] {
  border-color: #7eaed0 !important;
  border-radius: 3px !important;
  background: #fff !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] {
  border: 1px solid #83b9dc !important;
  border-radius: 5px !important;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(232, 246, 255, 0.9)) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: 0 1px 0 #fff inset, 0 0 0 1px rgba(255, 255, 255, 0.72), 0 2px 8px rgba(43, 107, 153, 0.2) !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] button,
html[data-dsh-skin-surface='qq2008'] [data-composer-card] select,
html[data-dsh-skin-surface='qq2008'] [role='treeitem'] {
  border-radius: 3px !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] button:not(:disabled) {
  border: 1px solid #9bc2dc !important;
  background: linear-gradient(180deg, #fff, #dceffa) !important;
  color: #164a73 !important;
}

html[data-dsh-skin-surface='qq2008'] [data-phase] {
  background: rgba(242, 249, 254, 0.7) !important;
}

html[data-dsh-skin-surface='qq2008'] [data-phase='active'] > [class*='_header'] {
  border-bottom-color: #9bc4df !important;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(218, 239, 251, 0.9)) !important;
}

html[data-dsh-skin-surface='qq2008'] [role='treeitem'][aria-selected='true'] {
  border: 1px solid #a0c7e3;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(199, 229, 248, 0.88)) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

@media (max-width: 720px) {
  html[data-dsh-skin-surface='qq2008'] #root {
    padding: 0;
  }

  html[data-dsh-skin-surface='qq2008'] #root > [data-slot='root'] > * {
    border-right: 0;
    border-left: 0;
    border-radius: 0;
  }
}
`

/** Owns the global style element and the root marker used to scope it. */
export class SurfaceStyleApplier {
  private style: HTMLStyleElement | null = null
  private adopted = false
  private previousMode: string | undefined

  /** Apply one surface mode without replacing the host application's stylesheets. */
  setMode(mode: SurfaceStyleMode): void {
    this.adopt()
    if (mode === 'none') {
      delete document.documentElement.dataset[SURFACE_ATTRIBUTE]
      return
    }
    this.ensureStyle()
    document.documentElement.dataset[SURFACE_ATTRIBUTE] = mode
  }

  private adopt(): void {
    if (this.adopted) return
    this.adopted = true
    this.previousMode = document.documentElement.dataset[SURFACE_ATTRIBUTE]
  }

  private ensureStyle(): void {
    if (this.style?.isConnected === true) return
    const style = document.createElement('style')
    style.dataset.dshSkinSurfaceStyles = ''
    style.textContent = SURFACE_CSS
    document.head.append(style)
    this.style = style
  }

  /** Remove plugin-owned global state and restore any pre-existing marker. */
  dispose(): void {
    this.style?.remove()
    this.style = null
    if (!this.adopted) return
    if (this.previousMode === undefined) delete document.documentElement.dataset[SURFACE_ATTRIBUTE]
    else document.documentElement.dataset[SURFACE_ATTRIBUTE] = this.previousMode
    this.adopted = false
    this.previousMode = undefined
  }
}
