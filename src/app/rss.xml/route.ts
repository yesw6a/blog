import { absoluteUrl, siteConfig } from '@/config/site';
import { getRssArticleSummaries } from '@/features/article/article.repository';

export const dynamic = 'force-static';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });

export async function GET() {
  const articles = await getRssArticleSummaries();
  const items = articles
    .slice(0, 50)
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${absoluteUrl(`/articles/${article.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/articles/${article.slug}`)}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      ${article.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
