'use client';

import { NavigationItem } from '@/components';
import { useScroll } from 'ahooks';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './app-layout.module.scss';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  // 更新useScroll监听正确的滚动容器
  const pageScroll = useScroll(mounted && scrollContainerRef.current ? scrollContainerRef.current : () => null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [slidePosition, setSlidePosition] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [bottomIndicatorPosition, setBottomIndicatorPosition] = useState(0);
  const [bottomIndicatorWidth, setBottomIndicatorWidth] = useState(0);
  const [showMenuTop, setShowMenuTop] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // 使用防抖和阈值来稳定显示/隐藏逻辑
  useEffect(() => {
    if (!pageScroll) return;

    const currentScrollTop = pageScroll.top;
    const scrollThreshold = 10; // 滚动阈值，避免小幅滚动时频繁切换

    // 如果滚动距离小于阈值，不做任何处理
    if (Math.abs(currentScrollTop - lastScrollTop) < scrollThreshold) {
      return;
    }

    // 在顶部时总是显示
    if (currentScrollTop <= scrollThreshold) {
      setShowMenuTop(true);
    } else {
      // 向上滚动时显示，向下滚动时隐藏
      const isScrollingUp = currentScrollTop < lastScrollTop;
      setShowMenuTop(isScrollingUp);
    }

    setLastScrollTop(currentScrollTop);
  }, [pageScroll, lastScrollTop]);

  const ROUTES = [
    { label: '首页', key: 'home', icon: 'icon-[hugeicons--home-01]', path: '/' },
    { label: '博客组件', key: 'storybook', icon: 'icon-[hugeicons--3rd-bracket-square]', path: '/storybook' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 根据路径变化更新当前页面索引
    const currentIndex = ROUTES.findIndex((route) => route.path === pathname);
    const newIndex = currentIndex >= 0 ? currentIndex : 0;
    setActiveIndex(newIndex);
  }, [pathname]);

  useEffect(() => {
    // 计算滑动指示器的位置和宽度
    const updateSlidePosition = () => {
      const button = document.querySelector(`[data-nav-index="${activeIndex}"]`) as HTMLElement;

      if (button) {
        // 由于按钮被Tooltip包裹，需要查找真正的导航容器
        // 首先尝试使用精确的CSS选择器
        let container = button.closest('div.relative.flex.flex-1.items-center') as HTMLElement;

        if (!container) {
          // 如果没有找到，尝试查找包含多个按钮的父容器
          let currentElement = button.parentElement;
          let attempts = 0;
          const maxAttempts = 5; // 防止无限循环

          while (currentElement && attempts < maxAttempts) {
            // 检查是否包含多个 data-nav-index 元素
            const navButtons = currentElement.querySelectorAll('[data-nav-index]');
            if (navButtons.length > 1) {
              container = currentElement;
              break;
            }
            currentElement = currentElement.parentElement;
            attempts++;
          }
        }

        if (container) {
          const buttonRect = button.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // 计算背景滑动指示器位置
          const leftPosition = buttonRect.left - containerRect.left;

          // 确保位置值是有效的
          if (buttonRect.width > 0) {
            setSlidePosition(leftPosition);
            setSlideWidth(buttonRect.width);

            // 计算底部指示器位置
            const buttonCenter = leftPosition + buttonRect.width / 2;
            const indicatorWidth = 24;
            setBottomIndicatorPosition(buttonCenter - indicatorWidth / 2);
            setBottomIndicatorWidth(indicatorWidth);
          }
        }
      }
    };

    // 确保组件已挂载且activeIndex有效
    if (mounted && activeIndex >= 0) {
      // 多重重试机制，确保DOM元素存在
      let retryCount = 0;
      const maxRetries = 5;

      const tryUpdate = () => {
        const button = document.querySelector(`[data-nav-index="${activeIndex}"]`);
        if (button) {
          updateSlidePosition();
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryUpdate, 50 * retryCount); // 递增延迟
        }
      };

      // 立即尝试一次
      requestAnimationFrame(tryUpdate);

      // 监听窗口大小变化
      window.addEventListener('resize', updateSlidePosition);
      return () => {
        window.removeEventListener('resize', updateSlidePosition);
      };
    }
  }, [activeIndex, mounted]);

  if (!mounted) {
    // SSR 时渲染的内容，避免水合不一致
    return <div className="flex h-screen w-screen items-center justify-center">主题加载中...</div>;
  }

  const goPage = (path: string, index: number) => {
    // 清理所有可能的tooltip状态
    const tooltips = document.querySelectorAll('[role="tooltip"]');
    tooltips.forEach((tooltip) => {
      if (tooltip.parentElement) {
        tooltip.parentElement.removeChild(tooltip);
      }
    });

    // 先更新activeIndex以触发动画
    setActiveIndex(index);
    // 然后进行路由跳转
    router.push(path);
  };

  const checkCurrentPath = (path: string) => {
    return path === pathname;
  };

  return (
    <div ref={scrollContainerRef} className="relative h-screen w-screen overflow-y-auto bg-primary">
      <div className="layout mx-auto h-full w-1/2">
        {/* 顶部导航栏 */}
        <div
          data-visible={showMenuTop}
          className={classNames([
            styles['menu-top'],
            'fixed top-5 z-50 flex h-14 w-[calc(50%-10px)] items-center rounded-full bg-white px-8 shadow transition-transform dark:border-[1px] dark:border-solid dark:border-white/10 dark:bg-gray-800',
          ])}
        >
          {/* 左侧导航 */}
          <div className="relative flex flex-1 items-center gap-6">
            {/* 滑动背景指示器 */}
            <div
              className="absolute top-1/2 h-12 -translate-y-1/2 rounded-full bg-theme_primary/10 transition-all duration-500 ease-out"
              style={{
                left: `${slidePosition}px`,
                width: `${slideWidth}px`,
                opacity: slideWidth > 0 ? 1 : 0,
              }}
            />
            {/* 统一的滑动底部指示器 */}
            <div
              className="absolute -bottom-[5px] h-px rounded-full bg-gradient-to-r from-theme_primary/0 via-theme_primary to-theme_primary/0 transition-all duration-500 ease-out"
              style={{
                left: `${bottomIndicatorPosition}px`,
                width: `${bottomIndicatorWidth}px`,
                opacity: bottomIndicatorWidth > 0 ? 1 : 0,
              }}
            />
            {ROUTES.map(({ label, key, icon, path }, index) => (
              <NavigationItem
                key={key}
                label={label}
                icon={icon}
                path={path}
                index={index}
                isActive={checkCurrentPath(path)}
                onClick={goPage}
              />
            ))}
          </div>
          {/* 右侧主题切换 */}
          <div className="flex cursor-pointer items-center text-2xl hover:text-theme_primary">
            {theme === 'light' ? (
              <span className="icon-[hugeicons--moon-02]" onClick={() => setTheme('dark')} />
            ) : (
              <span className="icon-[hugeicons--sun-01]" onClick={() => setTheme('light')} />
            )}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="min-h-full flex-1 overflow-hidden pt-[120]">
          <div className="h-full transform-gpu overflow-auto transition-all duration-500 ease-out">
            <div
              className="transform-gpu transition-all duration-500 ease-out"
              style={{
                transform: `translateX(${activeIndex * -2}px)`,
                opacity: 1,
              }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* 底部导航栏 */}
        <div className="py-10 text-center text-gray-500">兮兮 © {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}
