import { ReactNode } from 'react';

export type DropdownMenuProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type DropdownMenuTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
};

export type DropdownMenuContentProps = {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
};

export type DropdownMenuItemProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export type DropdownMenuSeparatorProps = {
  className?: string;
};

export type DropdownMenuContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
};
