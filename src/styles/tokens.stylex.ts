import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  primary: '#ff7f50',
  primaryTransparent: 'color-mix(in srgb, #ff7f50, transparent 100%)',
  primaryTransparent10: 'color-mix(in srgb, #ff7f50, transparent 90%)',
  canvas: '#f3f4f6',
  avatarPlaceholder: '#f1f2f6',
  navigationSurface: '#ffffff',
  navigationBorder: 'transparent',
  gameHover: '#e5e7eb',
});

export const darkTheme = stylex.createTheme(colors, {
  canvas: '#111827',
  avatarPlaceholder: '#2f3542',
  navigationSurface: '#1f2937',
  navigationBorder: 'rgb(255 255 255 / 10%)',
  gameHover: 'rgb(255 255 255 / 10%)',
});
