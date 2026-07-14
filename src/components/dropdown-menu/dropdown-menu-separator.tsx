import React from 'react';

import * as stylex from '@stylexjs/stylex';

import { DropdownMenuSeparatorProps } from './types';

const styles = stylex.create({
  separator: {
    height: '1px',
    marginBlock: '0.25rem',
    marginInline: '-0.25rem',
    backgroundColor: '#e5e7eb',
  },
});

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ style }) => {
  return <div {...stylex.props(styles.separator, style)} role="separator" />;
};

export default DropdownMenuSeparator;
