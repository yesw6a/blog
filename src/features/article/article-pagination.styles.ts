import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const reducedMotionDuration = {
  default: '180ms',
  '@media (prefers-reduced-motion: reduce)': '0ms',
} as const;

export const articlePaginationStyles = stylex.create({
  pagination: {
    display: 'flex',
    marginTop: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingTop: '2rem',
    gap: {
      default: '0.5rem',
      '@media (max-width: 640px)': '0.75rem',
    },
  },
  pages: {
    display: {
      default: 'flex',
      '@media (max-width: 640px)': 'none',
    },
    alignItems: 'center',
    gap: '0.375rem',
  },
  link: {
    display: 'inline-flex',
    width: '44px',
    minHeight: '44px',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors.border,
      ':hover': colors.primaryStrong,
    },
    borderRadius: '0.625rem',
    backgroundColor: {
      default: colors.surface,
      ':hover': colors.primaryTransparent10,
    },
    color: colors.textSecondary,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecorationLine: 'none',
    transitionDuration: reducedMotionDuration,
    transitionProperty: 'border-color, background-color, color',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '2px',
  },
  linkActive: {
    borderColor: colors.primaryStrong,
    backgroundColor: colors.primaryTransparent10,
    color: colors.primaryStrong,
  },
  direction: {
    display: 'inline-flex',
    minWidth: {
      default: '5.25rem',
      '@media (max-width: 400px)': '4.5rem',
    },
    minHeight: '44px',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors.border,
      ':hover': colors.primaryStrong,
    },
    borderRadius: '9999px',
    paddingInline: '0.875rem',
    color: colors.textPrimary,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecorationLine: 'none',
    transitionDuration: reducedMotionDuration,
    transitionProperty: 'border-color, color',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '2px',
  },
  disabled: {
    borderColor: colors.border,
    color: colors.textMuted,
    opacity: 0.55,
  },
  ellipsis: {
    display: 'inline-flex',
    width: '32px',
    minHeight: '44px',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textMuted,
  },
  mobileStatus: {
    display: {
      default: 'none',
      '@media (max-width: 640px)': 'inline-flex',
    },
    minHeight: '44px',
    alignItems: 'center',
    color: colors.textSecondary,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
  },
});
