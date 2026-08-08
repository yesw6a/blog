import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const motionDuration = {
  default: '180ms',
  '@media (prefers-reduced-motion: reduce)': '0ms',
} as const;

export const textLinkStyles = stylex.create({
  animated: {
    backgroundImage: 'linear-gradient(currentColor, currentColor)',
    backgroundPosition: '0 calc(100% - 0.08em)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: {
      default: '0 1px',
      ':hover': '100% 1px',
      ':focus-visible': '100% 1px',
    },
    textDecorationLine: 'none',
    transitionDuration: motionDuration,
    transitionProperty: 'background-size, color',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  hitArea: {
    backgroundImage: 'linear-gradient(currentColor, currentColor)',
    backgroundPosition: '0 calc(50% + 0.5em)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: {
      default: '0 1px',
      ':hover': '100% 1px',
      ':focus-visible': '100% 1px',
    },
    textDecorationLine: 'none',
    transitionDuration: motionDuration,
    transitionProperty: 'background-size, color',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  prose: {
    backgroundImage: `linear-gradient(currentColor, currentColor), linear-gradient(${colors.primaryTransparent20}, ${colors.primaryTransparent20})`,
    backgroundPosition: '0 calc(100% - 0.08em), 0 calc(100% - 0.08em)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: {
      default: '0 1px, 100% 1px',
      ':hover': '100% 1px, 100% 1px',
      ':focus-visible': '100% 1px, 100% 1px',
    },
    textDecorationLine: 'none',
    transitionDuration: motionDuration,
    transitionProperty: 'background-size, color',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
});
