'use client';

import { useEffect, useRef, useState } from 'react';

import type { IconName } from '@/components';

import { useScroll } from 'ahooks';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, NavigationItem } from '@/components';
import { colors, darkTheme } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

type AppLayoutProps = {
  children: React.ReactNode;
};

const ROUTES: ReadonlyArray<{ label: string; key: string; icon: IconName; path: string }> = [
  { label: '首页', key: 'home', icon: 'home', path: '/' },
  { label: '博客组件', key: 'storybook', icon: 'components', path: '/storybook' },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationContainerRef = useRef<HTMLDivElement>(null);

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
      const container = navigationContainerRef.current;
      const button = container?.querySelector(`[data-nav-index="${activeIndex}"]`) as HTMLElement | null;

      if (button && container) {
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
    };

    // 确保组件已挂载且activeIndex有效
    if (mounted && activeIndex >= 0) {
      // 多重重试机制，确保DOM元素存在
      let retryCount = 0;
      const maxRetries = 5;

      const tryUpdate = () => {
        const button = navigationContainerRef.current?.querySelector(`[data-nav-index="${activeIndex}"]`);
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
    return <div {...stylex.props(styles.loading)}>主题加载中...</div>;
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

  const isDark = resolvedTheme === 'dark';
  const rootStyleProps = stylex.props(styles.root, isDark && darkTheme);

  return (
    <div ref={scrollContainerRef} {...rootStyleProps}>
      <div {...stylex.props(styles.layout)}>
        {/* 顶部导航栏 */}
        <div
          data-visible={showMenuTop}
          {...stylex.props(styles.menuTop, showMenuTop ? styles.menuVisible : styles.menuHidden)}
        >
          {/* 左侧导航 */}
          <div ref={navigationContainerRef} {...stylex.props(styles.navigation)}>
            {/* 滑动背景指示器 */}
            <div
              {...stylex.props(styles.slideIndicator)}
              style={{
                left: `${slidePosition}px`,
                width: `${slideWidth}px`,
                opacity: slideWidth > 0 ? 1 : 0,
              }}
            />
            {/* 统一的滑动底部指示器 */}
            <div
              {...stylex.props(styles.bottomIndicator)}
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
          <button
            type="button"
            {...stylex.props(styles.themeToggle)}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? '切换到浅色主题' : '切换到深色主题'}
          >
            <Icon name={isDark ? 'sun' : 'moon'} />
          </button>
        </div>

        {/* 主要内容区域 */}
        <div {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.contentViewport)}>
            <div
              {...stylex.props(styles.content)}
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
        <div {...stylex.props(styles.footer)}>兮兮 © {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}

const motionDuration = {
  default: '500ms',
  '@media (prefers-reduced-motion: reduce)': '0ms',
} as const;

const styles = stylex.create({
  loading: {
    display: 'flex',
    width: '100vw',
    height: '100dvh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflowY: 'auto',
    backgroundColor: colors.canvas,
  },
  layout: {
    width: '50%',
    height: '100%',
    marginInline: 'auto',
  },
  menuTop: {
    position: 'fixed',
    top: '1.25rem',
    zIndex: 50,
    display: 'flex',
    width: 'calc(50% - 10px)',
    height: '3.5rem',
    alignItems: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.navigationBorder,
    borderRadius: '9999px',
    backgroundColor: colors.navigationSurface,
    paddingInline: '2rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
    transitionProperty: 'transform',
  },
  menuVisible: {
    transform: 'translateY(0)',
    transitionDuration: {
      default: '100ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
  },
  menuHidden: {
    transform: 'translateY(-7rem)',
    transitionDuration: {
      default: '300ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
  },
  navigation: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    gap: '1.5rem',
  },
  slideIndicator: {
    position: 'absolute',
    top: '50%',
    height: '3rem',
    borderRadius: '9999px',
    backgroundColor: colors.primaryTransparent10,
    transform: 'translateY(-50%)',
    transitionProperty: 'all',
    transitionDuration: motionDuration,
    transitionTimingFunction: 'ease-out',
  },
  bottomIndicator: {
    position: 'absolute',
    bottom: '-5px',
    height: '1px',
    borderRadius: '9999px',
    backgroundImage: `linear-gradient(to right, ${colors.primaryTransparent}, ${colors.primary}, ${colors.primaryTransparent})`,
    transitionProperty: 'all',
    transitionDuration: motionDuration,
    transitionTimingFunction: 'ease-out',
  },
  themeToggle: {
    display: 'flex',
    minWidth: '44px',
    minHeight: '44px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    color: {
      default: 'inherit',
      ':hover': colors.primary,
    },
    fontSize: '1.5rem',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primary}`,
    },
    outlineOffset: {
      default: null,
      ':focus-visible': '2px',
    },
  },
  main: {
    minHeight: '100%',
    flexGrow: 1,
    overflow: 'hidden',
    paddingTop: '120px',
  },
  contentViewport: {
    height: '100%',
    overflow: 'auto',
    transitionProperty: 'all',
    transitionDuration: motionDuration,
    transitionTimingFunction: 'ease-out',
  },
  content: {
    transitionProperty: 'all',
    transitionDuration: motionDuration,
    transitionTimingFunction: 'ease-out',
  },
  footer: {
    paddingBlock: '2.5rem',
    color: '#6b7280',
    textAlign: 'center',
  },
});
