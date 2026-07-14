'use client';

import { cloneElement, FC, isValidElement, useEffect, useRef } from 'react';

import type { ReactElement } from 'react';

import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { useTooltip } from './index';
import { TooltipTriggerProps } from './types';

const TooltipTrigger: FC<TooltipTriggerProps> = ({ children, asChild }) => {
  const { setOpen, delayDuration, triggerRef } = useTooltip();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
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
    const childProps = (children.props || {}) as Record<string, any>;
    return cloneElement(
      children as ReactElement<any>,
      {
        ...childProps,
        ...triggerProps,
        ref: (node: HTMLElement | null) => {
          (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof childProps.ref === 'function') childProps.ref(node);
          else if (childProps.ref) childProps.ref.current = node;
        },
      } as any,
    );
  }

  return (
    <button type="button" {...stylex.props(styles.trigger)} {...triggerProps} ref={triggerRef as any}>
      {children}
    </button>
  );
};

const styles = stylex.create({
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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

export default TooltipTrigger;
