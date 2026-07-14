'use client';

import { memo, useCallback } from 'react';

import type { IconName } from '@/components';

import { Icon, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

interface NavigationItemProps {
  label: string;
  icon: IconName;
  path: string;
  index: number;
  isActive: boolean;
  onClick: (path: string, index: number) => void;
}

const NavigationItem = memo(
  ({ label, icon, path, index, isActive, onClick }: NavigationItemProps) => {
    const handleClick = useCallback(() => {
      onClick(path, index);
    }, [path, index, onClick]);

    return (
      <Tooltip key={`nav-${index}-${isActive ? 'active' : 'inactive'}`}>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-nav-index={index}
            {...stylex.props(styles.item, isActive && styles.itemActive)}
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
          >
            <Icon name={icon} style={[styles.icon, isActive && styles.iconActive]} />
          </button>
        </TooltipTrigger>
        <TooltipContent hideArrow>{label}</TooltipContent>
      </Tooltip>
    );
  },
  (prevProps, nextProps) => {
    // 自定义比较函数，当isActive状态改变时强制重新渲染
    return (
      prevProps.label === nextProps.label &&
      prevProps.icon === nextProps.icon &&
      prevProps.path === nextProps.path &&
      prevProps.index === nextProps.index &&
      prevProps.isActive === nextProps.isActive
    );
  },
);

NavigationItem.displayName = 'NavigationItem';

const styles = stylex.create({
  item: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    minWidth: '48px',
    minHeight: '48px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    padding: '0.75rem',
    color: {
      default: 'inherit',
      ':hover': colors.primary,
    },
    fontSize: '1.5rem',
    transform: {
      default: 'scale(1)',
      ':hover': 'scale(1.05)',
    },
    transitionProperty: 'color, transform',
    transitionDuration: {
      default: '300ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionTimingFunction: 'ease-in-out',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primary}`,
    },
    outlineOffset: {
      default: null,
      ':focus-visible': '2px',
    },
  },
  itemActive: {
    color: colors.primary,
    transform: 'scale(1.05)',
  },
  icon: {
    transform: 'scale(1)',
    transitionProperty: 'transform',
    transitionDuration: {
      default: '200ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionTimingFunction: 'ease-in-out',
  },
  iconActive: {
    transform: 'scale(1.1)',
  },
});

export default NavigationItem;
