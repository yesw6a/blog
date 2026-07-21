'use client';

import { memo } from 'react';

import type { IconName } from '@/components/icon';

import Link, { useLinkStatus } from 'next/link';
import Icon from '@/components/icon';
import Tooltip, { TooltipContent, TooltipTrigger } from '@/components/tooltip';
import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

interface NavigationItemProps {
  label: string;
  icon: IconName;
  path: string;
  isActive: boolean;
}

function NavigationPendingStatus() {
  const { pending } = useLinkStatus();

  return pending ? (
    <span role="status" {...stylex.props(styles.pendingLabel)}>
      页面加载中
    </span>
  ) : null;
}

const NavigationItem = memo(
  ({ label, icon, path, isActive }: NavigationItemProps) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={path}
            prefetch={path === '/articles' ? true : undefined}
            {...stylex.props(styles.item, isActive && styles.itemActive)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
          >
            <Icon name={icon} />
            <NavigationPendingStatus />
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
  pendingLabel: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
});

export default NavigationItem;
