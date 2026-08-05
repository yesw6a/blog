'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

const VISITOR_STORAGE_KEY = 'site-stats:visitor:v1';
const LAST_VIEW_STORAGE_KEY = 'site-stats:last-view:v1';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let pageLoadId: string | null = null;
let lastViewMarker: string | null = null;

const getRandomUuid = () => {
  if (typeof crypto.randomUUID !== 'function') {
    return null;
  }

  return crypto.randomUUID();
};

const getPageLoadId = () => {
  if (pageLoadId) {
    return pageLoadId;
  }

  pageLoadId = getRandomUuid();
  return pageLoadId;
};

const getVisitorId = () => {
  try {
    const storedVisitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY);

    if (storedVisitorId && UUID_PATTERN.test(storedVisitorId)) {
      return storedVisitorId;
    }

    const visitorId = getRandomUuid();

    if (!visitorId) {
      return null;
    }

    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
    return visitorId;
  } catch {
    return null;
  }
};

const hasTrackedView = (pathname: string) => {
  const currentPageLoadId = getPageLoadId();

  if (!currentPageLoadId) {
    return true;
  }

  const marker = `${currentPageLoadId}:${pathname}`;

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

export default function SiteStatsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || hasTrackedView(pathname)) {
      return;
    }

    const visitorId = getVisitorId();

    if (!visitorId) {
      return;
    }

    void fetch('/api/site-stats/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visitorId, path: pathname }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
