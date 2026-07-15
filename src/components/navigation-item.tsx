'use client';

import { memo } from 'react';

import type { IconName } from '@/components';

import Link from 'next/link';
import { Icon, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

interface NavigationItemProps {
  label: string;
  icon: IconName;
  path: string;
  index: number;
  isActive: boolean;
}

const NavigationItem = memo(
  ({ label, icon, path, index, isActive }: NavigationItemProps) => {
    return (
      <Tooltip key={`nav-${index}-${isActive ? 'active' : 'inactive'}`}>
        <TooltipTrigger asChild>
          <Link
            href={path}
            data-nav-index={index}
            {...stylex.props(styles.item, isActive && styles.itemActive)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
          >
            <Icon name={icon} />
          </Link>
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
    textDecorationLine: 'none',
    transitionProperty: 'color',
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
  },
});

export default NavigationItem;
