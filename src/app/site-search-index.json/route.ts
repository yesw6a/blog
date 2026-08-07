import { getSiteSearchIndex } from '@/features/search/search.repository';

export const dynamic = 'force-static';

export async function GET() {
  const body = await getSiteSearchIndex();

  return Response.json(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
