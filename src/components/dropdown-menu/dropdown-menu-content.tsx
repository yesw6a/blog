'use client';

import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDropdownMenu } from './index';
import { DropdownMenuContentProps } from './types';

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  className,
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

  const getPositionClasses = () => {
    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };

    const sideClasses = {
      top: `bottom-full mb-${sideOffset}`,
      bottom: `top-full mt-${sideOffset}`,
      left: `right-full mr-${sideOffset}`,
      right: `left-full ml-${sideOffset}`,
    };

    return `${alignClasses[align]} ${sideClasses[side]}`;
  };

  const contentClasses = classNames(
    'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-lg',
    'animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
    getPositionClasses(),
    className,
  );

  return (
    <div
      ref={contentRef as React.RefObject<HTMLDivElement>}
      className={contentClasses}
      data-side={side}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );
};

export default DropdownMenuContent;
