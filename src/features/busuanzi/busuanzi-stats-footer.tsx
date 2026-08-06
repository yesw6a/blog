'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';

const BSZ_API_URL = 'https://bsz.dusays.com:9001/api';
const IDENTITY_STORAGE_KEY = 'bsz-id';
const LAST_VIEW_STORAGE_KEY = 'bsz:last-view:v1';

const numberFormatter = new Intl.NumberFormat('zh-CN');

let pageLoadId: string | null = null;
let lastViewMarker: string | null = null;

type BusuanziStats = {
  visitors: number;
  pageViews: number;
};

const isCount = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
};

const parseBusuanziStats = (value: unknown): BusuanziStats | null => {
  if (typeof value !== 'object' || value === null || !('success' in value) || value.success !== true) {
    return null;
  }

  const data = 'data' in value ? value.data : null;

  if (typeof data !== 'object' || data === null) {
    return null;
  }

  const visitors = 'site_uv' in data ? data.site_uv : null;
  const pageViews = 'site_pv' in data ? data.site_pv : null;

  return isCount(visitors) && isCount(pageViews) ? { visitors, pageViews } : null;
};

const getRandomUuid = () => {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : null;
};

const hasTrackedView = (pathname: string) => {
  pageLoadId ??= getRandomUuid();

  if (!pageLoadId) {
    return false;
  }

  const marker = `${pageLoadId}:${pathname}`;

  try {
    if (window.sessionStorage.getItem(LAST_VIEW_STORAGE_KEY) === marker) {
      return true;
    }

    window.sessionStorage.setItem(LAST_VIEW_STORAGE_KEY, marker);
  } catch {
    if (lastViewMarker === marker) {
      return true;
    }
  }

  lastViewMarker = marker;
  return false;
};

const getStoredIdentity = () => {
  try {
    return window.localStorage.getItem(IDENTITY_STORAGE_KEY);
  } catch {
    return null;
  }
};

const storeIdentity = (identity: string) => {
  try {
    window.localStorage.setItem(IDENTITY_STORAGE_KEY, identity);
  } catch {
    // 浏览器禁止本地存储时，bsz 仍可按当前网络与 User-Agent 生成匿名身份。
  }
};

export default function BusuanziStatsFooter() {
  const pathname = usePathname();
  const [stats, setStats] = useState<BusuanziStats | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || hasTrackedView(pathname)) {
      return;
    }

    let active = true;
    const headers = new Headers({
      Accept: 'application/json',
      'x-bsz-referer': new URL(pathname, window.location.origin).href,
    });
    const identity = getStoredIdentity();

    if (identity) {
      headers.set('Authorization', `Bearer ${identity}`);
    }

    void fetch(BSZ_API_URL, {
      method: 'POST',
      headers,
      keepalive: true,
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const nextIdentity = response.headers.get('Set-Bsz-Identity');

        if (nextIdentity) {
          storeIdentity(nextIdentity);
        }

        const data: unknown = await response.json();
        return parseBusuanziStats(data);
      })
      .then((nextStats) => {
        if (active && nextStats) {
          setStats(nextStats);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <div aria-live="polite" {...stylex.props(styles.root)}>
      {stats ? (
        <>
          <span>独立访客 {numberFormatter.format(stats.visitors)} 位</span>
          <span aria-hidden>|</span>
          <span>累计访问 {numberFormatter.format(stats.pageViews)} 次</span>
        </>
      ) : null}
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    minHeight: '1.3125rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem 0.5rem',
    fontVariantNumeric: 'tabular-nums',
  },
});
