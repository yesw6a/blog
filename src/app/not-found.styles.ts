import { colors, layout } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const motionDuration = {
  default: '180ms',
  '@media (prefers-reduced-motion: reduce)': '0ms',
} as const;

export const notFoundStyles = stylex.create({
  page: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'clamp(10rem, 16vw, 14rem) minmax(0, 32rem)',
      '@media (max-width: 700px)': 'minmax(0, 1fr)',
    },
    minHeight: {
      default: `calc(100dvh - ${layout.headerSafeArea} - 3rem)`,
      '@media (max-width: 640px)': `calc(100dvh - ${layout.headerSafeArea} - 2rem)`,
    },
    alignContent: 'center',
    alignItems: {
      default: 'center',
      '@media (max-width: 700px)': 'start',
    },
    justifyContent: 'center',
    gap: {
      default: 'clamp(3rem, 6vw, 5rem)',
      '@media (max-width: 700px)': '1.5rem',
    },
    paddingBlock: {
      default: 'clamp(2.5rem, 7vh, 4.5rem)',
      '@media (max-width: 700px)': '2.5rem 4rem',
    },
  },
  errorCode: {
    color: colors.primaryTransparent20,
    fontSize: {
      default: 'clamp(8.5rem, 14vw, 11rem)',
      '@media (max-width: 700px)': 'clamp(6rem, 26vw, 8rem)',
    },
    fontWeight: 500,
    letterSpacing: '-0.065em',
    lineHeight: 0.82,
    userSelect: 'none',
  },
  content: {
    width: '100%',
    maxWidth: '32rem',
  },
  title: {
    color: colors.textPrimary,
    fontSize: {
      default: 'clamp(3rem, 5vw, 4rem)',
      '@media (max-width: 700px)': 'clamp(2.5rem, 11vw, 3.25rem)',
    },
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.08,
    textWrap: 'balance',
  },
  description: {
    maxWidth: '30rem',
    marginTop: '1.125rem',
    color: colors.textSecondary,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      default: '1.0625rem',
      '@media (max-width: 640px)': '1rem',
    },
    lineHeight: 1.7,
    textWrap: 'pretty',
  },
  actions: {
    display: 'flex',
    marginTop: '1.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.75rem 1.125rem',
  },
  primaryLink: {
    display: 'inline-flex',
    minHeight: '44px',
    cursor: 'pointer',
    touchAction: 'manipulation',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    backgroundColor: {
      default: colors.primaryAction,
      ':hover': colors.primaryActionHover,
    },
    paddingInline: '1.125rem',
    color: colors.onPrimary,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '0.9375rem',
    fontWeight: 600,
    textDecorationLine: 'none',
    transform: {
      default: 'translateY(0)',
      ':hover': 'translateY(-1px)',
      ':active': 'translateY(0)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    transitionDuration: motionDuration,
    transitionProperty: 'background-color, transform',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    outline: {
      default: 'none',
      ':focus-visible': `3px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '3px',
  },
  secondaryLink: {
    display: 'inline-flex',
    minHeight: '44px',
    cursor: 'pointer',
    touchAction: 'manipulation',
    alignItems: 'center',
    color: {
      default: colors.primaryStrong,
      ':hover': colors.primaryStrongHover,
    },
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '0.9375rem',
    fontWeight: 600,
    textDecorationLine: {
      default: 'none',
      ':hover': 'underline',
    },
    textUnderlineOffset: '0.3em',
    transitionDuration: motionDuration,
    transitionProperty: 'color',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '3px',
  },
});
