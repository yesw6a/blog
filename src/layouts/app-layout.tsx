'use client';

import { useEffect, useRef, useState } from 'react';

import type { IconName } from '@/components';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Icon, NavigationItem } from '@/components';
import { colors, darkTheme, layout } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

type AppLayoutProps = {
  children: React.ReactNode;
};

const ROUTES: ReadonlyArray<{ label: string; key: string; icon: IconName; path: string }> = [
  { label: '首页', key: 'home', icon: 'home', path: '/' },
  { label: '文章', key: 'articles', icon: 'article', path: '/articles' },
];

const APP_THEME_ROOT_ID = 'app-theme-root';
const darkThemeClassNames = stylex.props(darkTheme).className?.split(/\s+/).filter(Boolean);

if (!darkThemeClassNames?.length) {
  throw new Error('StyleX 深色主题未生成有效类名。');
}

const themeBootstrapScript = `
  (function () {
    try {
      var root = document.getElementById(${JSON.stringify(APP_THEME_ROOT_ID)});
      if (!root) return;
      var isDark = document.documentElement.classList.contains('dark');
      var classNames = ${JSON.stringify(darkThemeClassNames)};
      classNames.forEach(function (className) {
        root.classList.toggle(className, isDark);
      });
    } catch (error) {}
  })();
`;

const isCurrentPath = (pathname: string, path: string) => {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const navigationRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const activeIndex = Math.max(
    0,
    ROUTES.findIndex((route) => isCurrentPath(pathname, route.path)),
  );

  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const container = navigationRef.current;
      const activeItem = container?.querySelector(`[data-nav-index="${activeIndex}"]`) as HTMLElement | null;
      if (!container || !activeItem) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      setIndicator({ left: itemRect.left - containerRect.left, width: itemRect.width });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeIndex]);

  const isDark = resolvedTheme === 'dark';
  const rootStyleProps = stylex.props(styles.root, isDark && darkTheme);

  return (
    <div id={APP_THEME_ROOT_ID} {...rootStyleProps}>
      <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerInner)}>
          <div ref={navigationRef} {...stylex.props(styles.navigation)}>
            <div
              aria-hidden
              {...stylex.props(styles.activeIndicator)}
              style={{
                left: `${indicator.left}px`,
                width: `${indicator.width}px`,
                opacity: indicator.width > 0 ? 1 : 0,
              }}
            />
            {ROUTES.map(({ label, key, icon, path }, index) => (
              <NavigationItem
                key={key}
                label={label}
                icon={icon}
                path={path}
                index={index}
                isActive={isCurrentPath(pathname, path)}
              />
            ))}
          </div>

          <button
            type="button"
            {...stylex.props(styles.themeToggle)}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={mounted ? (isDark ? '切换到浅色主题' : '切换到深色主题') : '切换主题'}
          >
            {mounted ? (
              <Icon name={isDark ? 'sun' : 'moon'} />
            ) : (
              <span aria-hidden {...stylex.props(styles.themeIconPlaceholder)} />
            )}
          </button>
        </div>
      </header>

      <main {...stylex.props(styles.main)}>{children}</main>
      <footer {...stylex.props(styles.footer)}>兮兮 © {new Date().getFullYear()}</footer>
    </div>
  );
}

const motionDuration = {
  default: '220ms',
  '@media (prefers-reduced-motion: reduce)': '0ms',
} as const;

const styles = stylex.create({
  root: {
    minHeight: '100dvh',
    backgroundColor: colors.canvas,
    color: colors.textPrimary,
    [layout.headerSafeArea]: {
      default: '5rem',
      '@media (max-width: 640px)': '4.5rem',
    },
    [layout.headerInnerHeight]: {
      default: '3.5rem',
      '@media (max-width: 640px)': '3.25rem',
    },
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    width: '100%',
    height: layout.headerSafeArea,
    alignItems: 'center',
    backgroundColor: colors.canvas,
    paddingInline: '1rem',
  },
  headerInner: {
    display: 'flex',
    width: 'min(70rem, 100%)',
    minHeight: layout.headerInnerHeight,
    marginInline: 'auto',
    alignItems: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.navigationBorder,
    borderRadius: '9999px',
    backgroundColor: colors.navigationSurface,
    paddingInline: {
      default: '1rem',
      '@media (max-width: 640px)': '0.625rem',
    },
    boxShadow: '0 8px 30px rgb(50 40 30 / 8%)',
  },
  navigation: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    gap: {
      default: '0.5rem',
      '@media (max-width: 640px)': '0.125rem',
    },
  },
  activeIndicator: {
    position: 'absolute',
    top: '50%',
    height: '3rem',
    borderRadius: '9999px',
    backgroundColor: colors.primaryTransparent10,
    transform: 'translateY(-50%)',
    transitionDuration: motionDuration,
    transitionProperty: 'left, width, opacity',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
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
      ':hover': colors.primaryStrong,
    },
    fontSize: '1.4rem',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '2px',
  },
  themeIconPlaceholder: {
    display: 'block',
    width: '1em',
    height: '1em',
  },
  main: {
    width: 'min(70rem, calc(100% - 2rem))',
    minHeight: `calc(100dvh - ${layout.headerSafeArea})`,
    marginInline: 'auto',
    paddingTop: {
      default: '3rem',
      '@media (max-width: 640px)': '2rem',
    },
  },
  footer: {
    width: 'min(70rem, calc(100% - 2rem))',
    marginInline: 'auto',
    paddingBlock: '3rem',
    color: colors.textMuted,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
});
