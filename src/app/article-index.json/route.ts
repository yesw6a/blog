import { ARTICLE_PAGE_SIZE } from '@/features/article/article.constants';
import { getArticleSummaries } from '@/features/article/article.repository';

export const dynamic = 'force-static';

export async function GET() {
  const articles = await getArticleSummaries();

  return Response.json(
    { articles, pageSize: ARTICLE_PAGE_SIZE },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=3600',
      },
    },
  );
}
