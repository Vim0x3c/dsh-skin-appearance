/** Plugin-owned global surface styling for wallpaper-backed appearances. */
import qqLogo from '../../assets/qq2008/qq-logo.jpg?inline'
import qqPenguin from '../../assets/qq2008/qq-penguin.jpg?inline'
import qqAvatarGirl from '../../assets/qq2008/avatar-girl.jpg?inline'
import qqAvatarBoy from '../../assets/qq2008/avatar-boy.jpg?inline'
import qqAvatarAnimal from '../../assets/qq2008/avatar-animal.jpg?inline'
import qqAvatarGirl2 from '../../assets/qq2008/avatar-girl-2.jpg?inline'
import qqAvatarGirl3 from '../../assets/qq2008/avatar-girl-3.jpg?inline'
import qqAvatarGirl4 from '../../assets/qq2008/avatar-girl-4.jpg?inline'
import qqAvatarBoy2 from '../../assets/qq2008/avatar-boy-2.jpg?inline'
import qqAvatarBoy3 from '../../assets/qq2008/avatar-boy-3.jpg?inline'
import qqAvatarBoy4 from '../../assets/qq2008/avatar-boy-4.jpg?inline'
import qqAvatarAnimal2 from '../../assets/qq2008/avatar-animal-2.jpg?inline'
import qqAvatarAnimal3 from '../../assets/qq2008/avatar-animal-3.jpg?inline'
import qqAvatarAnimal4 from '../../assets/qq2008/avatar-animal-4.jpg?inline'

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
const SCHEME_ATTRIBUTE = 'dshSkinScheme'
const QQ_FRIEND_ATTRIBUTE = 'dshQqFriendAvatar'
const QQ_FRIEND_ROW_SELECTOR = [
  "[role='treeitem'][class*='_sessionRow']",
  "[role='treeitem'][class*='_searchResultRow']",
].join(', ')
const QQ_FRIEND_AVATARS = [
  qqAvatarGirl,
  qqAvatarBoy,
  qqAvatarAnimal,
  qqAvatarGirl2,
  qqAvatarBoy2,
  qqAvatarAnimal2,
  qqAvatarGirl3,
  qqAvatarBoy3,
  qqAvatarAnimal3,
  qqAvatarGirl4,
  qqAvatarBoy4,
  qqAvatarAnimal4,
] as const

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

html[data-dsh-skin-scheme='light'][data-dsh-skin-surface='deepseek-chan'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(239, 247, 255, 0.8), rgba(211, 230, 250, 0.6));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(251, 254, 255, 0.56), rgba(216, 234, 252, 0.3));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(195, 220, 250, 0.52));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(173, 207, 246, 0.72));
  --dsh-skin-section-background: rgba(47, 116, 208, 0.09);
  --dsh-skin-surface-border: rgba(62, 126, 207, 0.34);
  --dsh-skin-surface-shadow: 0 16px 40px rgba(34, 80, 136, 0.18), inset 0 1px rgba(255, 255, 255, 0.88);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(62, 126, 207, 0.2);
}

html[data-dsh-skin-scheme='light'][data-dsh-skin-surface='abyss-starport'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(238, 253, 255, 0.82), rgba(205, 239, 240, 0.62));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(250, 255, 255, 0.54), rgba(202, 239, 240, 0.28));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(253, 255, 255, 0.76), rgba(184, 231, 233, 0.54));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(157, 220, 223, 0.76));
  --dsh-skin-section-background: rgba(22, 139, 145, 0.09);
  --dsh-skin-surface-border: rgba(22, 139, 145, 0.34);
  --dsh-skin-surface-shadow: 0 16px 40px rgba(26, 105, 111, 0.17), inset 0 1px rgba(255, 255, 255, 0.9);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(22, 139, 145, 0.2);
}

html[data-dsh-skin-scheme='light'][data-dsh-skin-surface='deepsea-whale'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(239, 249, 255, 0.8), rgba(207, 231, 247, 0.6));
  --dsh-skin-surface-background: linear-gradient(150deg, rgba(252, 255, 255, 0.54), rgba(204, 229, 247, 0.28));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(190, 222, 244, 0.54));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(168, 210, 239, 0.74));
  --dsh-skin-section-background: rgba(47, 135, 189, 0.09);
  --dsh-skin-surface-border: rgba(47, 135, 189, 0.32);
  --dsh-skin-surface-shadow: 0 18px 44px rgba(35, 96, 137, 0.17), inset 0 1px rgba(255, 255, 255, 0.9);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(47, 135, 189, 0.2);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='cloud-lab'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(7, 23, 37, 0.8), rgba(13, 44, 65, 0.62));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(8, 27, 43, 0.38), rgba(21, 59, 82, 0.22));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(52, 102, 139, 0.3), rgba(24, 66, 94, 0.24));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(70, 129, 168, 0.44), rgba(31, 84, 115, 0.38));
  --dsh-skin-section-background: rgba(126, 184, 255, 0.1);
  --dsh-skin-surface-border: rgba(126, 184, 255, 0.3);
  --dsh-skin-surface-shadow: 0 18px 44px rgba(0, 8, 17, 0.46), inset 0 1px rgba(255, 255, 255, 0.08);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(126, 184, 255, 0.16);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='ink-algorithm'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(21, 22, 21, 0.86), rgba(37, 37, 34, 0.72));
  --dsh-skin-surface-background: linear-gradient(180deg, rgba(30, 30, 28, 0.5), rgba(50, 47, 43, 0.3));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(73, 68, 63, 0.48), rgba(47, 44, 41, 0.38));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(105, 82, 77, 0.58), rgba(66, 54, 51, 0.5));
  --dsh-skin-section-background: rgba(223, 119, 112, 0.08);
  --dsh-skin-surface-border: rgba(223, 119, 112, 0.28);
  --dsh-skin-surface-shadow: 0 14px 34px rgba(0, 0, 0, 0.42), inset 0 1px rgba(255, 255, 255, 0.07);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(223, 119, 112, 0.14);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='intelligence-orbit-ink'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(24, 23, 25, 0.88), rgba(43, 40, 42, 0.74));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(31, 30, 32, 0.5), rgba(57, 51, 43, 0.3));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(88, 72, 47, 0.48), rgba(55, 48, 39, 0.4));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(123, 96, 53, 0.6), rgba(78, 63, 43, 0.52));
  --dsh-skin-section-background: rgba(214, 168, 91, 0.09);
  --dsh-skin-surface-border: rgba(214, 168, 91, 0.3);
  --dsh-skin-surface-shadow: 0 16px 38px rgba(0, 0, 0, 0.44), inset 0 1px rgba(255, 255, 255, 0.07);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(214, 168, 91, 0.16);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='intelligence-orbit-dawn'] {
  --dsh-skin-sidebar-background: linear-gradient(180deg, rgba(11, 24, 39, 0.84), rgba(24, 45, 66, 0.66));
  --dsh-skin-surface-background: linear-gradient(145deg, rgba(15, 31, 48, 0.42), rgba(34, 61, 86, 0.24));
  --dsh-skin-new-session-background: linear-gradient(180deg, rgba(58, 90, 123, 0.34), rgba(31, 59, 85, 0.28));
  --dsh-skin-new-session-hover: linear-gradient(180deg, rgba(78, 119, 158, 0.48), rgba(41, 78, 109, 0.42));
  --dsh-skin-section-background: rgba(121, 174, 240, 0.09);
  --dsh-skin-surface-border: rgba(121, 174, 240, 0.28);
  --dsh-skin-surface-shadow: 0 18px 42px rgba(0, 6, 14, 0.44), inset 0 1px rgba(255, 255, 255, 0.08);
  --dsh-skin-sidebar-shadow: inset -1px 0 rgba(121, 174, 240, 0.15);
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

html[data-dsh-skin-surface]
  #root [class*='_sidebarCol'] [role='tree'] {
  background: transparent !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root [class*='_sidebarCol'] [class*='_footerActions'] [data-cordis-badge] {
  border: 1px solid var(--dsh-skin-surface-border) !important;
  background: var(--dsh-skin-section-background) !important;
  color: var(--dsw-alias-label-primary) !important;
  -webkit-backdrop-filter: var(--dsh-skin-surface-filter);
  backdrop-filter: var(--dsh-skin-surface-filter);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.12), var(--dsh-skin-sidebar-shadow) !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root [class*='_sidebarCol'] [class*='_footerActions'] > * {
  box-sizing: border-box;
  border-radius: var(--dsh-skin-surface-radius) !important;
  background: var(--dsh-skin-section-background) !important;
  color: var(--dsw-alias-label-primary) !important;
}

html[data-dsh-skin-surface]:not([data-dsh-skin-surface='qq2008'])
  #root [class*='_sidebarCol'] [class*='_footerActions'] [data-cordis-badge] * {
  color: inherit !important;
}

html[data-dsh-skin-surface='qq2008'] #root {
  box-sizing: border-box;
  padding: 10px;
  background:
    radial-gradient(ellipse 38% 16% at 15% 88%, rgba(255, 255, 255, 0.2), transparent 72%),
    radial-gradient(ellipse 42% 18% at 82% 8%, rgba(255, 255, 255, 0.18), transparent 74%),
    linear-gradient(180deg, #8ecdf3 0%, #5aa7dd 50%, #3f86c2 100%);
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'],
html[data-dsh-skin-surface='qq2008'] #root [data-composer-card],
html[data-dsh-skin-surface='qq2008'] #root [data-phase] {
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
  background: rgba(234, 244, 252, 0.94) !important;
  box-shadow: 0 0 0 1px #75b9e8, 0 8px 24px rgba(21, 78, 122, 0.24), inset 0 1px #fff;
}

html[data-dsh-skin-surface='qq2008'] #root > [data-slot='root'] > *::before {
  content: 'DeepSeek 2008  -  我的工作台';
  position: absolute;
  top: -30px;
  right: 0;
  left: 0;
  z-index: 300;
  box-sizing: border-box;
  height: 29px;
  padding-left: 43px;
  border-bottom: 1px solid #075a9c;
  background-image: url('${qqLogo}'), linear-gradient(180deg, #62c6f5 0%, #198ddd 46%, #0b70c4 52%, #2d9fe7 100%);
  background-position: 9px center, 0 0;
  background-repeat: no-repeat;
  background-size: 26px 26px, auto;
  color: #fff;
  font-size: 13px;
  line-height: 28px;
  font-weight: 700;
  text-shadow: 0 1px 1px rgba(0, 52, 96, 0.72);
  pointer-events: none;
}

html[data-dsh-skin-surface='qq2008'] #root > [data-slot='root'] > *::after {
  content: '在线  ·  安全连接  ·  QQ 2008';
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
  background: linear-gradient(180deg, #d3eafd 0%, #b4d9f5 112px, #dbedfb 112px, #f4fafe 100%) !important;
  box-shadow: inset -1px 0 #fff, 2px 0 8px rgba(42, 105, 151, 0.12) !important;
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] [class*='_logoRow']::before {
  content: '';
  position: absolute;
  top: 9px;
  left: 9px;
  width: 42px;
  height: 42px;
  border: 1px solid #7eaed0;
  border-radius: 4px;
  background: url('${qqLogo}') center / cover no-repeat;
  box-shadow: inset 0 1px #fff, 0 1px 2px rgba(39, 97, 140, 0.2);
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] [class*='_logoRow']::after {
  content: '● 在线';
  position: absolute;
  left: 61px;
  bottom: 8px;
  color: #268b37;
  font-size: 11px;
  font-weight: 700;
  text-shadow: 0 1px #fff;
  pointer-events: none;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_logoRow'] {
  position: relative;
  box-sizing: border-box;
  min-height: 62px;
  margin: 0 4px 8px;
  padding: 8px 8px 24px 61px;
  overflow: hidden;
  border: 1px solid #8ebfdf;
  border-radius: 4px;
  background: linear-gradient(180deg, #eef9ff 0%, #c7e7fa 58%, #b7dcf5 100%) !important;
  box-shadow: inset 0 1px #fff;
}

html[data-dsh-skin-surface='qq2008']
  #root > [data-slot='root'] > :not([data-sidebar-collapsed]) button[class$='_newSession'] {
  min-height: 30px;
  border: 1px solid #75acd3 !important;
  border-radius: 4px !important;
  background: linear-gradient(180deg, #ffffff 0%, #edf8ff 48%, #c8e8fa 52%, #e9f7ff 100%) !important;
  color: #164a73 !important;
  box-shadow: inset 0 1px #fff, 0 1px 2px rgba(39, 97, 140, 0.2) !important;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_logoRow'] > button:first-child {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
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

html[data-dsh-skin-scheme='light'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_footerActions'] [data-cordis-badge] {
  border: 1px solid #8ebfdf !important;
  border-radius: 4px !important;
  background: linear-gradient(180deg, #f7fcff 0%, #dff2fd 48%, #c4e5f8 52%, #e8f6fe 100%) !important;
  color: #164a73 !important;
  box-shadow: inset 0 1px #fff, 0 1px 2px rgba(39, 97, 140, 0.18) !important;
}

html[data-dsh-skin-scheme='light'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_footerActions'] [data-cordis-badge] * {
  color: inherit !important;
}

html[data-dsh-skin-scheme='light'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_footerActions'] > * {
  box-sizing: border-box;
  border-radius: 4px !important;
  background: linear-gradient(180deg, #f7fcff 0%, #dff2fd 48%, #c4e5f8 52%, #e8f6fe 100%) !important;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_searchExpanded'] {
  border-color: #7eaed0 !important;
  border-radius: 3px !important;
  background: #fff !important;
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] [role='tree'] {
  padding-top: 5px;
  background: transparent !important;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [role='treeitem'][class*='_projectRow'] {
  min-height: 34px;
  padding-left: 8px !important;
  border: 0 !important;
  background-image: none !important;
  color: #18364d !important;
  font-weight: 700;
}

html[data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [data-dsh-qq-friend-avatar] {
  position: relative;
  min-height: 46px;
  padding-left: 44px !important;
  border: 1px solid transparent;
  border-bottom-color: #e0edf8;
  background-image: var(--dsh-qq-avatar-image);
  background-position: 7px center;
  background-repeat: no-repeat;
  background-size: 32px 32px;
  color: #18364d !important;
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] [role='treeitem']:hover {
  background-color: #dcedfb !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] {
  border: 1px solid #83b9dc !important;
  border-radius: 5px !important;
  background:
    linear-gradient(180deg, transparent calc(100% - 42px), rgba(234, 244, 252, 0.98) calc(100% - 42px), rgba(216, 234, 250, 0.98) 100%),
    rgba(255, 255, 255, 0.97) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  box-shadow: 0 1px 0 #fff inset, 0 0 0 1px rgba(255, 255, 255, 0.72), 0 2px 8px rgba(43, 107, 153, 0.2) !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card]::before {
  content: '';
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 42px;
  height: 42px;
  opacity: 0.16;
  background: url('${qqPenguin}') center / contain no-repeat;
  pointer-events: none;
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

html[data-dsh-skin-surface='qq2008'] [data-composer-card] button:last-child:not(:disabled) {
  border-color: #2264a0 !important;
  background: linear-gradient(180deg, #8fd0f8, #2b7fc4) !important;
  color: #fff !important;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] textarea {
  background: transparent !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] [data-input-scroll],
html[data-dsh-skin-surface='qq2008'] [data-composer-card] [data-input-scroll] textarea,
html[data-dsh-skin-surface='qq2008'] [data-composer-card] [data-input-backdrop],
html[data-dsh-skin-surface='qq2008'] [data-composer-card] [data-input-mirror] {
  font-family: Tahoma, 'Microsoft YaHei', sans-serif !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  line-height: 24px !important;
  letter-spacing: 0 !important;
  font-kerning: none !important;
  font-variant-ligatures: none !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] [data-input-scroll] textarea {
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  caret-color: #17364f !important;
}

html[data-dsh-skin-surface='qq2008'] [data-composer-card] [data-input-backdrop] {
  color: #17364f !important;
}

html[data-dsh-skin-surface='qq2008'] [data-phase] {
  border-color: #c2daee !important;
  background: rgba(253, 254, 254, 0.94) !important;
}

html[data-dsh-skin-surface='qq2008'] [data-phase='active'] > [class*='_header'] {
  border-bottom-color: #9bc4df !important;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(218, 239, 251, 0.9)) !important;
}

html[data-dsh-skin-surface='qq2008'] [role='treeitem'][aria-selected='true'] {
  border-color: #7fb6dd;
  background-color: #c9e5f8 !important;
  background-blend-mode: multiply;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] ::-webkit-scrollbar-track,
html[data-dsh-skin-surface='qq2008'] #root [data-phase] ::-webkit-scrollbar-track {
  background: #eaf4fc;
}

html[data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] ::-webkit-scrollbar-thumb,
html[data-dsh-skin-surface='qq2008'] #root [data-phase] ::-webkit-scrollbar-thumb {
  border: 1px solid #8bb7d7;
  border-radius: 3px;
  background: linear-gradient(90deg, #d9eefb, #9dcae8);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008'] #root {
  background:
    radial-gradient(ellipse 38% 16% at 15% 88%, rgba(88, 172, 230, 0.12), transparent 72%),
    radial-gradient(ellipse 42% 18% at 82% 8%, rgba(105, 190, 242, 0.1), transparent 74%),
    linear-gradient(180deg, #123f67 0%, #0b3154 52%, #07233e 100%);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root > [data-slot='root'] > * {
  border-color: #2a7db9;
  background: rgba(7, 25, 44, 0.96) !important;
  box-shadow: 0 0 0 1px #255d85, 0 8px 24px rgba(0, 8, 18, 0.5), inset 0 1px rgba(188, 228, 255, 0.16);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root > [data-slot='root'] > *::before {
  border-bottom-color: #174f78;
  background-image: url('${qqLogo}'), linear-gradient(180deg, #2d78aa 0%, #145683 46%, #0a3c65 52%, #185d8d 100%);
  color: #eef9ff;
  text-shadow: 0 1px 1px rgba(0, 12, 25, 0.84);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root > [data-slot='root'] > *::after {
  border-top-color: #164f79;
  background: linear-gradient(180deg, #236d9f, #0b4777);
  color: #eaf7ff;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008'] #root [class*='_sidebarCol'] {
  background: linear-gradient(180deg, #103b60, #092943) !important;
  border-color: #28658f !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] > [data-slot='sidebar'] > * {
  background: linear-gradient(180deg, #163f5f 0%, #0e304d 112px, #0a2943 112px, #071f35 100%) !important;
  box-shadow: inset -1px 0 rgba(117, 184, 226, 0.16), 2px 0 10px rgba(0, 8, 18, 0.3) !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_logoRow'] {
  border-color: #39769e;
  background: linear-gradient(180deg, #1d5278 0%, #123b5d 58%, #0e3150 100%) !important;
  box-shadow: inset 0 1px rgba(213, 239, 255, 0.14);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_logoRow']::before {
  border-color: #4b86ac;
  box-shadow: inset 0 1px rgba(224, 244, 255, 0.16), 0 1px 3px rgba(0, 8, 18, 0.42);
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_logoRow']::after {
  color: #7dde8c;
  text-shadow: 0 1px #062039;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root > [data-slot='root'] > :not([data-sidebar-collapsed]) button[class$='_newSession'],
html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_sectionHeader'] {
  border-color: #3678a6 !important;
  background: linear-gradient(180deg, #174b73 0%, #0d3456 50%, #092944 52%, #123e60 100%) !important;
  color: #e9f7ff !important;
  box-shadow: inset 0 1px rgba(202, 234, 255, 0.14), 0 1px 2px rgba(0, 8, 18, 0.34) !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_footerActions'] [data-cordis-badge] {
  border: 1px solid #3678a6 !important;
  border-radius: 4px !important;
  background: linear-gradient(180deg, #174b73 0%, #0d3456 50%, #092944 52%, #123e60 100%) !important;
  color: #e9f7ff !important;
  box-shadow: inset 0 1px rgba(202, 234, 255, 0.14), 0 1px 2px rgba(0, 8, 18, 0.34) !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_footerActions'] [data-cordis-badge] * {
  color: inherit !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_footerActions'] > * {
  box-sizing: border-box;
  border-radius: 4px !important;
  background: linear-gradient(180deg, #174b73 0%, #0d3456 50%, #092944 52%, #123e60 100%) !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [class*='_searchExpanded'] {
  border-color: #2d668f !important;
  background: #0b263f !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [role='treeitem'][class*='_projectRow'],
html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [data-dsh-qq-friend-avatar] {
  color: #e5f5ff !important;
  border-bottom-color: #173e5b;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] [role='treeitem']:hover,
html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008'] [role='treeitem'][aria-selected='true'] {
  border-color: #397aa8;
  background-color: #174b70 !important;
  background-blend-mode: screen;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008'] [data-composer-card] {
  border-color: #397ca9 !important;
  background:
    linear-gradient(180deg, transparent calc(100% - 42px), rgba(11, 42, 68, 0.98) calc(100% - 42px), rgba(7, 29, 49, 0.98) 100%),
    rgba(7, 25, 44, 0.94) !important;
  box-shadow: 0 1px rgba(195, 229, 252, 0.12) inset, 0 0 0 1px rgba(31, 91, 130, 0.44), 0 3px 10px rgba(0, 6, 14, 0.4) !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  [data-composer-card] [data-input-scroll] textarea {
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  caret-color: #eef9ff !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  [data-composer-card] [data-input-backdrop] {
  color: #eef9ff !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008'] [data-phase] {
  border-color: #285d82 !important;
  background: rgba(8, 30, 49, 0.94) !important;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] ::-webkit-scrollbar-track,
html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [data-phase] ::-webkit-scrollbar-track {
  background: #0b2944;
}

html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [class*='_sidebarCol'] ::-webkit-scrollbar-thumb,
html[data-dsh-skin-scheme='dark'][data-dsh-skin-surface='qq2008']
  #root [data-phase] ::-webkit-scrollbar-thumb {
  border-color: #346d95;
  background: linear-gradient(90deg, #245779, #397da8);
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

/** Deterministic 32-bit hash used to keep one conversation's avatar stable. */
function hashAvatarKey(value: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** Assigns bundled QQ avatars only to conversation rows, never workspace groups. */
class Qq2008AvatarApplier {
  private observer: MutationObserver | null = null
  private scheduled = false

  enable(): void {
    if (this.observer !== null) return
    this.observer = new MutationObserver(() => { this.schedule() })
    this.observer.observe(document.body, { childList: true, characterData: true, subtree: true })
    this.assign()
  }

  disable(): void {
    this.observer?.disconnect()
    this.observer = null
    this.scheduled = false
    for (const row of document.querySelectorAll<HTMLElement>(`[data-${QQ_FRIEND_ATTRIBUTE.replaceAll(/[A-Z]/g, match => `-${match.toLowerCase()}`)}]`)) {
      delete row.dataset[QQ_FRIEND_ATTRIBUTE]
      row.style.removeProperty('--dsh-qq-avatar-image')
    }
  }

  private schedule(): void {
    if (this.scheduled) return
    this.scheduled = true
    queueMicrotask(() => {
      this.scheduled = false
      if (this.observer !== null) this.assign()
    })
  }

  private assign(): void {
    const rows = document.querySelectorAll<HTMLElement>(QQ_FRIEND_ROW_SELECTOR)
    rows.forEach((row) => {
      const group = row.closest<HTMLElement>("[class*='_groupSection']")
      const workspace = group
        ?.querySelector<HTMLElement>("[role='treeitem'][class*='_projectRow'] [class*='_title']")
        ?.textContent?.trim() ?? ''
      const title = row
        .querySelector<HTMLElement>("[class*='_title'], [class*='_searchResultTitle']")
        ?.textContent?.trim() ?? row.getAttribute('aria-label') ?? ''
      const avatarIndex = hashAvatarKey(`${workspace}\0${title}`) % QQ_FRIEND_AVATARS.length
      row.dataset[QQ_FRIEND_ATTRIBUTE] = ''
      row.style.setProperty('--dsh-qq-avatar-image', `url("${QQ_FRIEND_AVATARS[avatarIndex]}")`)
    })
  }
}

/** Owns the global style element and the root marker used to scope it. */
export class SurfaceStyleApplier {
  private style: HTMLStyleElement | null = null
  private qqAvatars = new Qq2008AvatarApplier()
  private adopted = false
  private previousMode: string | undefined
  private previousScheme: string | undefined

  /** Apply one surface mode without replacing the host application's stylesheets. */
  setMode(mode: SurfaceStyleMode, colorScheme: 'light' | 'dark' = 'light'): void {
    this.adopt()
    if (mode === 'none') {
      this.qqAvatars.disable()
      delete document.documentElement.dataset[SURFACE_ATTRIBUTE]
      delete document.documentElement.dataset[SCHEME_ATTRIBUTE]
      return
    }
    this.ensureStyle()
    document.documentElement.dataset[SURFACE_ATTRIBUTE] = mode
    document.documentElement.dataset[SCHEME_ATTRIBUTE] = colorScheme
    if (mode === 'qq2008') this.qqAvatars.enable()
    else this.qqAvatars.disable()
  }

  private adopt(): void {
    if (this.adopted) return
    this.adopted = true
    this.previousMode = document.documentElement.dataset[SURFACE_ATTRIBUTE]
    this.previousScheme = document.documentElement.dataset[SCHEME_ATTRIBUTE]
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
    this.qqAvatars.disable()
    this.style?.remove()
    this.style = null
    if (!this.adopted) return
    if (this.previousMode === undefined) delete document.documentElement.dataset[SURFACE_ATTRIBUTE]
    else document.documentElement.dataset[SURFACE_ATTRIBUTE] = this.previousMode
    if (this.previousScheme === undefined) delete document.documentElement.dataset[SCHEME_ATTRIBUTE]
    else document.documentElement.dataset[SCHEME_ATTRIBUTE] = this.previousScheme
    this.adopted = false
    this.previousMode = undefined
    this.previousScheme = undefined
  }
}
