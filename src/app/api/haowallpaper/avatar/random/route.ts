import * as cheerio from 'cheerio';
import qs from 'query-string';

export const runtime = 'edge';

const responseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

const badGateway = (message: string) =>
  new Response(message, {
    status: 502,
    headers: {
      ...responseHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });

export async function GET() {
  try {
    const page = Math.floor(Math.random() * 665) + 1;
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

    const randomAvatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
    const imageResponse = await fetch(randomAvatar, { cache: 'no-store' });
    const contentType = imageResponse.headers.get('content-type');

    if (!imageResponse.ok || !imageResponse.body || !contentType?.toLowerCase().startsWith('image/')) {
      return badGateway('头像图片请求失败');
    }

    return new Response(imageResponse.body, {
      headers: {
        ...responseHeaders,
        'Content-Type': contentType,
      },
    });
  } catch {
    return badGateway('头像加载失败');
  }
}
