'use client';

import React from 'react';

import * as stylex from '@stylexjs/stylex';

import { useDropdownMenu } from './index';
import { DropdownMenuItemProps } from './types';

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick, disabled = false, style }) => {
  const { setOpen } = useDropdownMenu();

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      {...stylex.props(styles.item, disabled ? styles.disabled : styles.enabled, style)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};

const styles = stylex.create({
  item: {
    position: 'relative',
    display: 'flex',
    cursor: 'default',
    userSelect: 'none',
    alignItems: 'center',
    borderRadius: '0.125rem',
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    fontSize: '0.875rem',
    outline: 'none',
  },
  enabled: {
    color: '#111827',
    backgroundColor: {
      default: 'transparent',
      ':hover': '#f3f4f6',
      ':focus': '#f3f4f6',
    },
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
});

export default DropdownMenuItem;
