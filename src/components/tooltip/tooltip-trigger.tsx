'use client';

import { cloneElement, FC, isValidElement } from 'react';
import { useTooltip } from './index';
import { TooltipTriggerProps } from './types';

const TooltipTrigger: FC<TooltipTriggerProps> = ({ children, asChild }) => {
  const { setOpen, delayDuration, triggerRef } = useTooltip();
  let timeoutId: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    setOpen(false);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    setOpen(false);
  };

  const triggerProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  if (asChild && isValidElement(children)) {
    const childProps = (children.props || {}) as Record<string, unknown>;
    return cloneElement(children, {
      ...childProps,
      ...triggerProps,
    });
  }

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-theme_primary focus-visible:ring-offset-2"
      {...triggerProps}
      ref={triggerRef as any}
    >
      {children}
    </button>
  );
};

export default TooltipTrigger;
