'use client';

import React from 'react';
import { useDropdownMenu } from './index';
import { DropdownMenuTriggerProps } from './types';

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  children, 
  asChild = false 
}) => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-theme_primary focus:ring-offset-2"
    >
      {children}
    </button>
  );
};

export default DropdownMenuTrigger;
