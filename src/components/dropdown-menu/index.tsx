'use client';

import { createContext, FC, useContext, useRef, useState } from 'react';
import DropdownMenuContent from './dropdown-menu-content';
import DropdownMenuTrigger from './dropdown-menu-trigger';
import { DropdownMenuContext, DropdownMenuProps } from './types';

const DropdownMenuContextProvider = createContext<DropdownMenuContext | null>(null);

export const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContextProvider);
  if (!context) {
    throw new Error('useDropdownMenu must be used within a DropdownMenu');
  }
  return context;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const contextValue: DropdownMenuContext = {
    open,
    setOpen,
    triggerRef,
    contentRef,
  };

  return (
    <DropdownMenuContextProvider.Provider value={contextValue}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContextProvider.Provider>
  );
};

export default DropdownMenu;
export { default as DropdownMenuItem } from './dropdown-menu-item';
export { default as DropdownMenuSeparator } from './dropdown-menu-separator';
export { DropdownMenuContent, DropdownMenuTrigger };
