import type { SiteStats } from './site-stats.types';

import { getCloudflareContext } from '@opennextjs/cloudflare';

type SiteStatsRow = {
  value: number | null;
};

export class SiteStatsUnavailableError extends Error {
  constructor() {
    super('站点统计数据库不可用');
    this.name = 'SiteStatsUnavailableError';
  }
}

const getDatabase = async () => {
  try {
    const { env } = await getCloudflareContext({ async: true });

    if (!env.DB) {
      throw new SiteStatsUnavailableError();
    }

    return env.DB;
  } catch (error) {
    if (error instanceof SiteStatsUnavailableError) {
      throw error;
    }

    throw new SiteStatsUnavailableError();
  }
};

const normalizeCount = (value: unknown) => {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    return 0;
  }

  return value;
};

export const hashSiteStatsValue = async (value: string) => {
  const input = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', input);

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const getSiteStats = async (): Promise<SiteStats> => {
  const database = await getDatabase();
  const [visitorsResult, pageViewsResult] = await database.batch<SiteStatsRow>([
    database.prepare('SELECT COUNT(*) AS value FROM site_visitors'),
    database.prepare('SELECT COALESCE(SUM(page_views), 0) AS value FROM site_daily_stats'),
  ]);

  return {
    visitors: normalizeCount(visitorsResult.results[0]?.value),
    pageViews: normalizeCount(pageViewsResult.results[0]?.value),
  };
};

export const recordSiteView = async (visitorId: string) => {
  const database = await getDatabase();
  const now = new Date();
  const firstSeenAt = now.toISOString();
  const date = firstSeenAt.slice(0, 10);
  const visitorHash = await hashSiteStatsValue(visitorId);

  await database.batch([
    database
      .prepare('INSERT OR IGNORE INTO site_visitors (visitor_hash, first_seen_at) VALUES (?, ?)')
      .bind(visitorHash, firstSeenAt),
    database
      .prepare(
        'INSERT INTO site_daily_stats (date, page_views) VALUES (?, 1) ON CONFLICT(date) DO UPDATE SET page_views = page_views + 1',
      )
      .bind(date),
  ]);
};
