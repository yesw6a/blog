'use client';

import { FC } from 'react';

import * as stylex from '@stylexjs/stylex';

import { TextKeywordProps } from './types';

const styles = stylex.create({
  keyword: (backgroundColor: string) => ({
    backgroundImage: `linear-gradient(to top, ${backgroundColor}, transparent, transparent)`,
  }),
});

const TextKeyword: FC<TextKeywordProps> = ({ children, backgroundColor }) => {
  return <span {...stylex.props(styles.keyword(backgroundColor ?? 'transparent'))}>{children}</span>;
};

export default TextKeyword;
