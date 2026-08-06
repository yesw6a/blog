import { AvatarUnavailableError, getAvatarCacheControl, getDailyAvatar } from '@/features/avatar/avatar.server';

export const dynamic = 'force-dynamic';

const errorHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'text/plain; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(request: Request) {
  try {
    const now = new Date();
    const { dayKey, object } = await getDailyAvatar(now);
    const headers = new Headers();

    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', getAvatarCacheControl(now));
    headers.set('Content-Length', String(object.size));
    headers.set('ETag', object.httpEtag);
    headers.set('Last-Modified', object.uploaded.toUTCString());
    headers.set('X-Avatar-Day', dayKey);
    headers.set('X-Content-Type-Options', 'nosniff');

    if (request.headers.get('if-none-match') === object.httpEtag) {
      return new Response(null, { status: 304, headers });
    }

    return new Response(object.body, { headers });
  } catch (error) {
    if (!(error instanceof AvatarUnavailableError)) {
      console.error('读取每日头像失败', error);
    }

    return new Response('头像暂时不可用', {
      status: 503,
      headers: errorHeaders,
    });
  }
}
