import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const monospaceFontFamily = 'ui-monospace, SFMono-Regular, Consolas, monospace';

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-0.5rem) scale(0.985)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const motionDuration = {
  default: '180ms',
  '@media (prefers-reduced-motion: reduce)': '0ms',
} as const;

export const externalLinkDialogStyles = stylex.create({
  dialog: {
    width: {
      default: 'min(40rem, calc(100% - 2rem))',
      '@media (max-width: 640px)': 'calc(100% - 1rem)',
    },
    maxWidth: 'none',
    maxHeight: 'none',
    margin: {
      default: 'clamp(2rem, 12vh, 6rem) auto auto',
      '@media (max-width: 640px)': '0.5rem auto',
    },
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: {
      default: '0.875rem',
      '@media (max-width: 640px)': '0.75rem',
    },
    backgroundColor: colors.surface,
    padding: 0,
    color: colors.textPrimary,
    boxShadow: '0 24px 80px rgb(0 0 0 / 28%)',
    animationName: enter,
    animationDuration: motionDuration,
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  body: {
    maxHeight: 'calc(100dvh - 2rem)',
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    padding: {
      default: '1.5rem',
      '@media (max-width: 640px)': '1.125rem',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  mark: {
    display: 'inline-flex',
    width: '2.25rem',
    height: '2.25rem',
    flex: '0 0 auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    backgroundColor: colors.primaryTransparent10,
    color: colors.primaryStrong,
    fontSize: '1.1rem',
  },
  heading: {
    minWidth: 0,
  },
  title: {
    margin: 0,
    color: colors.textPrimary,
    fontFamily,
    fontSize: '1.125rem',
    fontWeight: 650,
    lineHeight: 1.4,
  },
  lead: {
    margin: '0.5rem 0 0',
    color: colors.textSecondary,
    fontFamily,
    fontSize: '0.9375rem',
    lineHeight: 1.65,
  },
  addressRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: '0.25rem 0.5rem',
    margin: '0.9rem 0 0',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '0.5rem',
    backgroundColor: colors.surfaceStrong,
    padding: '0.6rem 0.75rem',
  },
  addressLabel: {
    flex: '0 0 auto',
    color: colors.textMuted,
    fontFamily,
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  address: {
    minWidth: 0,
    color: colors.textPrimary,
    fontFamily: monospaceFontFamily,
    fontSize: '0.8125rem',
    lineHeight: 1.5,
    wordBreak: 'break-all',
  },
  disclaimer: {
    margin: '0.75rem 0 0',
    color: colors.textMuted,
    fontFamily,
    fontSize: '0.8125rem',
    lineHeight: 1.6,
  },
  details: {
    marginTop: '0.75rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingTop: '0.65rem',
  },
  summary: {
    cursor: 'pointer',
    color: colors.primaryStrong,
    fontFamily,
    fontSize: '0.8125rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  detailList: {
    margin: '0.5rem 0 0',
    paddingInlineStart: '1.1rem',
    color: colors.textSecondary,
    fontFamily,
    fontSize: '0.8125rem',
    lineHeight: 1.7,
  },
  actions: {
    display: 'flex',
    flexDirection: {
      default: 'row',
      '@media (max-width: 640px)': 'column',
    },
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1.25rem',
  },
  button: {
    display: 'inline-flex',
    minHeight: '44px',
    flex: {
      default: '0 0 auto',
      '@media (max-width: 640px)': '1 1 auto',
    },
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    padding: '0.55rem 1rem',
    fontFamily,
    fontSize: '0.9375rem',
    fontWeight: 600,
    lineHeight: 1.3,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '2px',
    transitionDuration: motionDuration,
    transitionProperty: 'background-color, border-color, color',
  },
  cancelButton: {
    borderColor: colors.border,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.surfaceStrong,
    },
    color: colors.textPrimary,
  },
  confirmButton: {
    borderColor: colors.primaryAction,
    backgroundColor: {
      default: colors.primaryAction,
      ':hover': colors.primaryActionHover,
    },
    color: colors.onPrimary,
  },
});
