'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { IconName } from '@/components/icon';

import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Icon from '@/components/icon';
import NavigationItem from '@/components/navigation-item';
import Tooltip, { TooltipContent, TooltipTrigger } from '@/components/tooltip';
import BusuanziStatsFooter from '@/features/busuanzi/busuanzi-stats-footer';
import { textLinkStyles } from '@/styles/text-link.styles';
import { colors, darkTheme, layout } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

type AppLayoutProps = {
  children: React.ReactNode;
};

const SiteSearchDialog = dynamic(() => import('@/features/search/site-search-dialog'), { ssr: false });

const ROUTES: ReadonlyArray<{ label: string; key: string; icon: IconName; path: string }> = [
  { label: '首页', key: 'home', icon: 'home', path: '/' },
  { label: '文章', key: 'articles', icon: 'article', path: '/articles' },
  { label: '工具箱', key: 'tools', icon: 'toolbox', path: '/tools' },
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
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchReturnFocusRef = useRef<HTMLElement | null>(null);
  const activeRouteIndex = Math.max(
    0,
    ROUTES.findIndex(({ path }) => isCurrentPath(pathname, path)),
  );

  const openSearch = useCallback(() => {
    searchReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    window.requestAnimationFrame(() => searchReturnFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLocaleLowerCase('en-US') !== 'k') return;
      event.preventDefault();
      if (searchOpen) closeSearch();
      else openSearch();
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [closeSearch, openSearch, searchOpen]);

  const isDark = resolvedTheme === 'dark';
  const rootStyleProps = stylex.props(styles.root, isDark && darkTheme);

  return (
    <div id={APP_THEME_ROOT_ID} {...rootStyleProps}>
      <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerInner)}>
          <div {...stylex.props(styles.navigation)}>
            <div
              aria-hidden
              {...stylex.props(styles.activeIndicator)}
              style={{ transform: `translate3d(calc(${activeRouteIndex} * ${layout.navigationItemStep}), -50%, 0)` }}
            />
            {ROUTES.map(({ label, key, icon, path }) => (
              <NavigationItem
                key={key}
                label={label}
                icon={icon}
                path={path}
                isActive={isCurrentPath(pathname, path)}
              />
            ))}
          </div>

          <div {...stylex.props(styles.headerActions)}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button type="button" aria-label="搜索全站" onClick={openSearch} {...stylex.props(styles.headerAction)}>
                  <Icon name="search" />
                </button>
              </TooltipTrigger>
              <TooltipContent hideArrow>搜索全站 · Ctrl/⌘ K</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <a
                  href="/rss.xml"
                  type="application/rss+xml"
                  aria-label="通过 RSS 订阅文章"
                  {...stylex.props(styles.headerAction)}
                >
                  <Icon name="rss" style={styles.rssActionIcon} />
                </a>
              </TooltipTrigger>
              <TooltipContent hideArrow>RSS 订阅</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <a
                  href="https://travel.moe/go.html?travel=on"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="开启异次元之旅（在新窗口打开）"
                  {...stylex.props(styles.headerAction)}
                >
                  <Icon name="travel" />
                </a>
              </TooltipTrigger>
              <TooltipContent hideArrow>异次元之旅 · 自动跃迁</TooltipContent>
            </Tooltip>

            <button
              type="button"
              {...stylex.props(styles.headerAction)}
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
        </div>
      </header>

      {searchOpen ? <SiteSearchDialog onClose={closeSearch} /> : null}

      <main {...stylex.props(styles.main)}>{children}</main>
      <footer {...stylex.props(styles.footer)}>
        <BusuanziStatsFooter />
        <div {...stylex.props(styles.footerMeta)}>
          <span>兮兮 © {new Date().getFullYear()}</span>
          <a
            href="https://icp.gov.moe/?keyword=20268082"
            target="_blank"
            rel="noopener noreferrer"
            {...stylex.props(styles.footerLink, textLinkStyles.hitArea)}
          >
            萌ICP备20268082号
          </a>
        </div>
      </footer>
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
    [layout.navigationItemStep]: {
      default: '3.5rem',
      '@media (max-width: 640px)': '3.125rem',
      '@media (max-width: 360px)': '2.75rem',
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
    paddingInline: {
      default: '1rem',
      '@media (max-width: 640px)': '0.5rem',
      '@media (max-width: 360px)': '0.25rem',
    },
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
      '@media (max-width: 360px)': '0.125rem',
    },
    boxShadow: '0 8px 30px rgb(0 0 0 / 10%)',
  },
  navigation: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    gap: {
      default: '0.5rem',
      '@media (max-width: 640px)': '0.125rem',
      '@media (max-width: 360px)': 0,
    },
  },
  headerActions: {
    display: 'flex',
    flex: '0 0 auto',
    alignItems: 'center',
    gap: {
      default: '0.125rem',
      '@media (max-width: 640px)': 0,
    },
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: {
      default: '3rem',
      '@media (max-width: 360px)': '2.75rem',
    },
    height: {
      default: '3rem',
      '@media (max-width: 360px)': '2.75rem',
    },
    borderRadius: '9999px',
    backgroundColor: colors.primaryTransparent10,
    transform: 'translate3d(0, -50%, 0)',
    transitionDuration: motionDuration,
    transitionProperty: 'transform',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  headerAction: {
    display: 'inline-flex',
    minWidth: '44px',
    minHeight: '44px',
    flex: '0 0 auto',
    cursor: 'pointer',
    touchAction: 'manipulation',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    color: {
      default: 'inherit',
      ':hover': colors.primaryStrong,
    },
    fontSize: '1.4rem',
    textDecorationLine: 'none',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '2px',
    padding: 0,
    transitionDuration: motionDuration,
    transitionProperty: 'color',
    transitionTimingFunction: 'ease',
  },
  rssActionIcon: {
    fontSize: '1.125rem',
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
    display: 'flex',
    width: 'min(70rem, calc(100% - 2rem))',
    marginInline: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    paddingBlock: '3rem',
    color: colors.textMuted,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
  footerMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem 1rem',
  },
  footerLink: {
    display: 'inline-flex',
    minHeight: '44px',
    alignItems: 'center',
    color: {
      default: colors.textMuted,
      ':hover': colors.primaryStrong,
    },
    textDecorationLine: 'none',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primaryStrong}`,
    },
    outlineOffset: '3px',
    transitionDuration: motionDuration,
    transitionProperty: 'color',
    transitionTimingFunction: 'ease',
  },
});
