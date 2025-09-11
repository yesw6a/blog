'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import classNames from 'classnames';
import { memo, useCallback } from 'react';

interface NavigationItemProps {
  label: string;
  icon: string;
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
        <TooltipTrigger>
          <div
            data-nav-index={index}
            className={classNames({
              'relative z-10 flex transform-gpu items-center rounded-full p-3 text-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:text-theme_primary': true,
              'scale-105 text-theme_primary': isActive,
            })}
            onClick={handleClick}
          >
            <span
              className={classNames(
                icon,
                'transition-all duration-200 ease-in-out',
                isActive ? 'scale-110' : 'scale-100',
              )}
            ></span>
          </div>
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

export default NavigationItem;
