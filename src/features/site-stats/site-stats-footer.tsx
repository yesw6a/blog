'use client';

import { useEffect, useState } from 'react';

import type { SiteStats } from './site-stats.types';

import * as stylex from '@stylexjs/stylex';

const numberFormatter = new Intl.NumberFormat('zh-CN');

const isSiteStats = (value: unknown): value is SiteStats => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const visitors = 'visitors' in value ? value.visitors : null;
  const pageViews = 'pageViews' in value ? value.pageViews : null;

  return (
    typeof visitors === 'number' &&
    Number.isSafeInteger(visitors) &&
    visitors >= 0 &&
    typeof pageViews === 'number' &&
    Number.isSafeInteger(pageViews) &&
    pageViews >= 0
  );
};

export default function SiteStatsFooter() {
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const controller = new AbortController();

    void fetch('/api/site-stats', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const data: unknown = await response.json();
        return isSiteStats(data) ? data : null;
      })
      .then((data) => {
        if (data) {
          setSiteStats(data);
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return (
    <div aria-live="polite" {...stylex.props(styles.root)}>
      {siteStats ? (
        <>
          <span>独立访客 {numberFormatter.format(siteStats.visitors)} 位</span>
          <span aria-hidden>|</span>
          <span>累计访问 {numberFormatter.format(siteStats.pageViews)} 次</span>
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
