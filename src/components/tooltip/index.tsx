'use client';

import { createContext, FC, useContext, useRef, useState } from 'react';
import { TooltipContext, TooltipProps } from './types';

const TooltipContextProvider = createContext<TooltipContext | null>(null);

export const useTooltip = () => {
  const context = useContext(TooltipContextProvider);
  if (!context) {
    throw new Error('useTooltip must be used within a Tooltip');
  }
  return context;
};

const Tooltip: FC<TooltipProps> = ({ children, delayDuration = 700, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const contextValue: TooltipContext = {
    open,
    setOpen,
    delayDuration,
    triggerRef,
    contentRef,
  };

  return (
    <TooltipContextProvider.Provider value={contextValue}>
      <div className="relative inline-block">{children}</div>
    </TooltipContextProvider.Provider>
  );
};

export default Tooltip;
export { default as TooltipContent } from './tooltip-content';
export { default as TooltipTrigger } from './tooltip-trigger';
