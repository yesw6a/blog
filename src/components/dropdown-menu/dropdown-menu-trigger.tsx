'use client';

import React from 'react';

import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { useDropdownMenu } from './index';
import { DropdownMenuTriggerProps } from './types';

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, asChild = false }) => {
  const { open, setOpen, triggerRef } = useDropdownMenu();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!open);
    }
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      ...childProps,
      ref: (node: HTMLElement | null) => {
        if (triggerRef.current !== node) {
          (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        // 保持原有的 ref 如果存在
        if (typeof childProps.ref === 'function') {
          childProps.ref(node);
        } else if (childProps.ref) {
          childProps.ref.current = node;
        }
      },
      onClick: (event: React.MouseEvent) => {
        handleClick();
        childProps.onClick?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        handleKeyDown(event);
        childProps.onKeyDown?.(event);
      },
      'aria-expanded': open,
      'aria-haspopup': 'menu',
    });
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={open}
      aria-haspopup="menu"
      {...stylex.props(styles.trigger)}
    >
      {children}
    </button>
  );
};

const styles = stylex.create({
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: {
      default: '#ffffff',
      ':hover': '#f9fafb',
    },
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 500,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 5%)',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primary}`,
    },
    outlineOffset: {
      default: null,
      ':focus-visible': '2px',
    },
  },
});

export default DropdownMenuTrigger;
