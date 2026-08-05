import type { SiteStatsViewRequest } from '@/features/site-stats/site-stats.types';

import { NextRequest, NextResponse } from 'next/server';
import { hashSiteStatsValue, recordSiteView } from '@/features/site-stats/site-stats.server';

const MAX_REQUEST_BODY_LENGTH = 1024;
const MAX_PATH_LENGTH = 512;
const DEDUPE_COOKIE_NAME = 'site_stats_view';
const DEDUPE_SECONDS = 15;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BOT_PATTERN = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pagespeed|preview/i;

const noContent = () => new NextResponse(null, { status: 204 });

const errorResponse = (error: string, status: number) =>
  NextResponse.json(
    { error },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );

const isSameOrigin = (request: NextRequest) => {
  const origin = request.headers.get('origin');

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
};

const normalizePath = (value: unknown) => {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_PATH_LENGTH ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[?#\\\u0000-\u001f]/.test(value)
  ) {
    return null;
  }

  try {
    return new URL(value, 'https://site.invalid').pathname;
  } catch {
    return null;
  }
};

const parseRequest = async (request: NextRequest): Promise<SiteStatsViewRequest | null> => {
  const contentLength = Number(request.headers.get('content-length') || 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_LENGTH) {
    return null;
  }

  const body = await request.text();

  if (body.length > MAX_REQUEST_BODY_LENGTH) {
    return null;
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return null;
  }

  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const visitorId = 'visitorId' in payload ? payload.visitorId : null;
  const path = normalizePath('path' in payload ? payload.path : null);

  if (typeof visitorId !== 'string' || !UUID_PATTERN.test(visitorId) || !path) {
    return null;
  }

  return { visitorId, path };
};

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return errorResponse('请求来源无效', 403);
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return errorResponse('请求类型无效', 415);
  }

  if (BOT_PATTERN.test(request.headers.get('user-agent') || '')) {
    return noContent();
  }

  const payload = await parseRequest(request);

  if (!payload) {
    return errorResponse('请求内容无效', 400);
  }

  const dedupeValue = (await hashSiteStatsValue(`${payload.visitorId}:${payload.path}`)).slice(0, 32);

  if (request.cookies.get(DEDUPE_COOKIE_NAME)?.value === dedupeValue) {
    return noContent();
  }

  try {
    await recordSiteView(payload.visitorId);
  } catch (error) {
    console.error(
      JSON.stringify({
        message: 'site stats write failed',
        error: error instanceof Error ? error.message : String(error),
      }),
    );

    return errorResponse('站点统计暂不可用', 503);
  }

  const response = noContent();
  response.cookies.set({
    name: DEDUPE_COOKIE_NAME,
    value: dedupeValue,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DEDUPE_SECONDS,
  });

  return response;
}
