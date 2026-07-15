const fallbackSiteUrl = 'http://localhost:3000';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: '兮兮的个人站',
  shortName: '兮兮',
  description: '记录前端开发、工程实践与个人思考。',
  author: '兮兮',
  url: (configuredSiteUrl || fallbackSiteUrl).replace(/\/$/, ''),
} as const;

export const absoluteUrl = (pathname = '/') => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteConfig.url}${normalizedPath}`;
};
