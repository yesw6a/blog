import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-0.35rem) scale(0.985)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const motionDuration = {
  default: '160ms',
  '@media (prefers-reduced-motion: reduce)': '0ms',
} as const;

export const externalSitesMenuStyles = stylex.create({
  content: {
    zIndex: 60,
    width: 'min(18rem, calc(100vw - 1.5rem))',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '0.75rem',
    backgroundColor: colors.surface,
    padding: '0.5rem',
    color: colors.textPrimary,
    boxShadow: '0 16px 48px -8px rgb(15 15 15 / 16%)',
    outline: 'none',
    animationName: enter,
    animationDuration: motionDuration,
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  title: {
    margin: 0,
    padding: '0.35rem 0.5rem 0.45rem',
    color: colors.textMuted,
    fontFamily,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    minHeight: '44px',
    alignItems: 'center',
    gap: '0.625rem',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    color: 'inherit',
    textDecorationLine: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.surfaceStrong,
    },
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '2px',
    transitionDuration: motionDuration,
    transitionProperty: 'background-color',
  },
  itemIcon: {
    flex: '0 0 auto',
    color: colors.primaryStrong,
    fontSize: '1.25rem',
  },
  itemBody: {
    display: 'flex',
    minWidth: 0,
    flexDirection: 'column',
    gap: '0.05rem',
  },
  itemName: {
    color: colors.textPrimary,
    fontFamily,
    fontSize: '0.9375rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  itemHint: {
    color: colors.textMuted,
    fontFamily,
    fontSize: '0.75rem',
    lineHeight: 1.4,
  },
});
