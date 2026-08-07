import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const appear = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(0.5rem)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const articleBackToTopStyles = stylex.create({
  root: {
    position: 'fixed',
    right: 'calc(1rem + env(safe-area-inset-right, 0px))',
    bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
    zIndex: 40,
    animationName: appear,
    animationDuration: {
      default: '180ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    animationTimingFunction: 'ease-out',
  },
  button: {
    display: 'inline-flex',
    width: '48px',
    height: '48px',
    cursor: 'pointer',
    touchAction: 'manipulation',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors.border,
      ':hover': colors.primaryStrong,
    },
    borderRadius: '50%',
    backgroundColor: {
      default: colors.surface,
      ':hover': colors.primaryTransparent10,
    },
    padding: 0,
    color: {
      default: colors.textPrimary,
      ':hover': colors.primaryStrong,
    },
    fontSize: '1.375rem',
    outline: {
      default: 'none',
      ':focus-visible': `3px solid ${colors.primaryTransparent20}`,
    },
    outlineOffset: '2px',
    transitionDuration: {
      default: '180ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionProperty: 'border-color, background-color, color',
  },
});
