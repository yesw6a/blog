import * as cheerio from 'cheerio';
import qs from 'query-string';

export const runtime = 'edge';

const SOURCE_PAGE_COUNT = 665;
const SHANGHAI_TIME_ZONE = 'Asia/Shanghai';
const SHANGHAI_UTC_OFFSET_HOURS = 8;

const errorResponseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

const shanghaiDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SHANGHAI_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const stableHash = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const getShanghaiDay = (date: Date) => {
  const parts = shanghaiDateFormatter.formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');

  return {
    key: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    year,
    month,
    day,
  };
};

const getSuccessResponseHeaders = (now: Date) => {
  const { year, month, day } = getShanghaiDay(now);
  const nextMidnight = Date.UTC(year, month - 1, day + 1, -SHANGHAI_UTC_OFFSET_HOURS);
  const maxAge = Math.max(1, Math.floor((nextMidnight - now.getTime()) / 1000));

  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    'X-Content-Type-Options': 'nosniff',
  };
};

const badGateway = (message: string) =>
  new Response(message, {
    status: 502,
    headers: {
      ...errorResponseHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });

export async function GET() {
  try {
    const now = new Date();
    const dailyKey = getShanghaiDay(now).key;
    const page = (stableHash(`${dailyKey}:page`) % SOURCE_PAGE_COUNT) + 1;
    const fetchUrl = qs.stringifyUrl({
      url: 'https://haowallpaper.com/headImgView',
      query: { page, sortType: 4, isSel: false, rows: 12, typeId: '553dff627434cc5683a776216c6045d2' },
    });
    const pageResponse = await fetch(fetchUrl, { cache: 'no-store' });

    if (!pageResponse.ok) {
      return badGateway('头像来源页面请求失败');
    }

    const html = await pageResponse.text();
    const $ = cheerio.load(html);
    const urls = new Set<string>();

    $('.img-box').each((_index, element) => {
      const src = $(element).attr('src');
      const style = $(element).attr('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
      const imageUrl = src || match?.[1];

      if (imageUrl) {
        try {
          const normalizedUrl = new URL(imageUrl, fetchUrl);
          if (normalizedUrl.protocol === 'http:' || normalizedUrl.protocol === 'https:') {
            urls.add(normalizedUrl.toString());
          }
        } catch {
          // 忽略来源页面中的无效图片地址
        }
      }
    });

    const avatarUrls = Array.from(urls);

    if (avatarUrls.length === 0) {
      return badGateway('头像来源页面没有可用图片');
    }

    const firstCandidateIndex = stableHash(`${dailyKey}:avatar`) % avatarUrls.length;

    for (let offset = 0; offset < avatarUrls.length; offset += 1) {
      const candidateIndex = (firstCandidateIndex + offset) % avatarUrls.length;
      const imageResponse = await fetch(avatarUrls[candidateIndex], { cache: 'no-store' });
      const contentType = imageResponse.headers.get('content-type');

      if (!imageResponse.ok || !imageResponse.body || !contentType?.toLowerCase().startsWith('image/')) {
        continue;
      }

      return new Response(imageResponse.body, {
        headers: {
          ...getSuccessResponseHeaders(now),
          'Content-Type': contentType,
        },
      });
    }

    return badGateway('头像图片请求失败');
  } catch {
    return badGateway('头像加载失败');
  }
}
