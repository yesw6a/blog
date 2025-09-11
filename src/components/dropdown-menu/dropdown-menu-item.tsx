'use client';

import classNames from 'classnames';
import React from 'react';
import { useDropdownMenu } from './index';
import { DropdownMenuItemProps } from './types';

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  disabled = false,
  className,
}) => {
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

  const itemClasses = classNames(
    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
    {
      'pointer-events-none opacity-50': disabled,
      'text-gray-900 focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100': !disabled,
    },
    className
  );

  return (
    <div
      className={itemClasses}
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

export default DropdownMenuItem;