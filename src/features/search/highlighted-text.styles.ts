import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

export const highlightedTextStyles = stylex.create({
  mark: {
    borderRadius: '0.18em',
    backgroundColor: colors.searchHighlightSurface,
    paddingInline: '0.08em',
    color: colors.searchHighlightText,
    fontWeight: 700,
  },
});
