export const runtime = 'edge';

import { imgByWsrv } from '@/utils';
import * as cheerio from 'cheerio';
import qs from 'query-string';

export async function GET(request: Request) {
  const { query } = qs.parseUrl(request.url);
  const page = Math.ceil(Math.random() * 665);
  const fetchUrl = qs.stringifyUrl({
    url: `https://haowallpaper.com/headImgView`,
    query: { page, sortType: 4, isSel: false, rows: 12, typeId: '553dff627434cc5683a776216c6045d2' },
  });
  const html = await fetch(fetchUrl).then((res) => res.text());
  // 加载 html
  const $ = cheerio.load(html);
  // 选中所有 class 为 img-box 的 div
  const divs = $('div.img-box');
  const urls: string[] = [];
  divs.each((index: number, element: any) => {
    const style = $(element).attr('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
    if (match && match[1]) {
      urls.push(match[1]);
    }
  });
  const randomAvatar = urls[Math.floor(Math.random() * urls.length)];
  const response = await fetch(imgByWsrv(randomAvatar, query));
  const contentType = response.headers.get('content-type');
  const imageBuffer = await response.arrayBuffer();
  return new Response(Buffer.from(imageBuffer), { headers: { 'Content-Type': contentType || 'image/jpeg' } });
}
