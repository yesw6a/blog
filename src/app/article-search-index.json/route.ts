import type { ArticleSearchIndexResponse } from '@/features/article/article.types';

import { getArticleSummaries } from '@/features/article/article.repository';

export const dynamic = 'force-static';

export async function GET() {
  const articles = await getArticleSummaries();
  const body: ArticleSearchIndexResponse = { articles };

  return Response.json(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
