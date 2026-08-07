import type { ReactNode } from 'react';
import type { SearchTextMatch } from './search.types';

import * as stylex from '@stylexjs/stylex';

import { highlightedTextStyles as styles } from './highlighted-text.styles';

type HighlightedTextProps = {
  value: SearchTextMatch;
};

export default function HighlightedText({ value }: HighlightedTextProps) {
  if (value.highlights.length === 0) return value.text;

  const nodes: ReactNode[] = [];
  let cursor = 0;

  value.highlights.forEach(({ start, end }, index) => {
    if (start > cursor) nodes.push(value.text.slice(cursor, start));
    nodes.push(
      <mark key={`${start}-${end}-${index}`} {...stylex.props(styles.mark)}>
        {value.text.slice(start, end)}
      </mark>,
    );
    cursor = end;
  });

  if (cursor < value.text.length) nodes.push(value.text.slice(cursor));
  return nodes;
}
