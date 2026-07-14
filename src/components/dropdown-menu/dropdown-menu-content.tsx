'use client';

import React, { useEffect } from 'react';

import type { CSSProperties } from 'react';

import * as stylex from '@stylexjs/stylex';

import { useDropdownMenu } from './index';
import { DropdownMenuContentProps } from './types';

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  style,
}) => {
  const { open, setOpen, triggerRef, contentRef } = useDropdownMenu();

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen, triggerRef, contentRef]);

  if (!open) return null;

  const getPositionStyle = (): CSSProperties => {
    const position: CSSProperties = {};

    if (side === 'top') {
      position.bottom = '100%';
      position.marginBottom = sideOffset;
    } else if (side === 'bottom') {
      position.top = '100%';
      position.marginTop = sideOffset;
    } else if (side === 'left') {
      position.right = '100%';
      position.marginRight = sideOffset;
    } else {
      position.left = '100%';
      position.marginLeft = sideOffset;
    }

    if (side === 'top' || side === 'bottom') {
      if (align === 'start') position.left = 0;
      if (align === 'center') {
        position.left = '50%';
        position.transform = 'translateX(-50%)';
      }
      if (align === 'end') position.right = 0;
    } else {
      if (align === 'start') position.top = 0;
      if (align === 'center') {
        position.top = '50%';
        position.transform = 'translateY(-50%)';
      }
      if (align === 'end') position.bottom = 0;
    }

    return position;
  };

  const styleProps = stylex.props(styles.content, style);

  return (
    <div
      ref={contentRef as React.RefObject<HTMLDivElement>}
      className={styleProps.className}
      style={{ ...styleProps.style, ...getPositionStyle() }}
      data-side={side}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );
};

const appear = stylex.keyframes({
  from: { opacity: 0, scale: 0.95 },
  to: { opacity: 1, scale: 1 },
});

const styles = stylex.create({
  content: {
    position: 'absolute',
    zIndex: 50,
    minWidth: '8rem',
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
    borderRadius: '0.375rem',
    backgroundColor: '#ffffff',
    padding: '0.25rem',
    color: '#111827',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)',
    animationName: appear,
    animationDuration: {
      default: '200ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    animationTimingFunction: 'ease-out',
  },
});

export default DropdownMenuContent;
