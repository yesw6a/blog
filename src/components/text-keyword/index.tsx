'use client';

import { FC } from 'react';
import { TextKeywordProps } from './types';

const TextKeyword: FC<TextKeywordProps> = ({ children, backgroundColor }) => {
  return (
    <span style={{ background: `linear-gradient(to top, ${backgroundColor}, transparent, transparent)` }}>
      {children}
    </span>
  );
};

export default TextKeyword;
