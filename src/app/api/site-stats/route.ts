import { NextResponse } from 'next/server';
import { getSiteStats } from '@/features/site-stats/site-stats.server';

const successHeaders = {
  'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
  'X-Content-Type-Options': 'nosniff',
};

const errorHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET() {
  try {
    const siteStats = await getSiteStats();
    return NextResponse.json(siteStats, { headers: successHeaders });
  } catch (error) {
    console.error(
      JSON.stringify({
        message: 'site stats read failed',
        error: error instanceof Error ? error.message : String(error),
      }),
    );

    return NextResponse.json({ error: '站点统计暂不可用' }, { status: 503, headers: errorHeaders });
  }
}
