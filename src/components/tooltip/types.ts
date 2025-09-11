import { ReactNode } from 'react';

export type TooltipProps = {
  children: ReactNode;
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type TooltipTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
};

export type TooltipContentProps = {
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
  arrowClassName?: string;
  hideArrow?: boolean;
};

export type TooltipContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};
