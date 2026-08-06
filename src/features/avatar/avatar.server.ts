import 'server-only';

import * as cheerio from 'cheerio';
import qs from 'query-string';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const SOURCE_PAGE_COUNT = 665;
const SOURCE_PAGE_SIZE = 12;
const MAX_IMAGE_CANDIDATES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const PAGE_REQUEST_TIMEOUT_MS = 8_000;
const IMAGE_REQUEST_TIMEOUT_MS = 6_000;
const RETENTION_DAYS = 30;
const DAILY_OBJECT_PREFIX = 'daily/';
const DAILY_OBJECT_PATTERN = /^daily\/(\d{4}-\d{2}-\d{2})(?:\.|$)/;
const SHANGHAI_TIME_ZONE = 'Asia/Shanghai';
const SHANGHAI_UTC_OFFSET_HOURS = 8;

const contentTypeExtensions = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
]);

const shanghaiDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SHANGHAI_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

type DownloadedAvatar = {
  bytes: ArrayBuffer;
  contentType: string;
  extension: string;
  sourceUrl: string;
};

export type DailyAvatar = {
  dayKey: string;
  object: R2ObjectBody;
};

export class AvatarUnavailableError extends Error {
  constructor(message = '当前没有可用头像') {
    super(message);
    this.name = 'AvatarUnavailableError';
  }
}

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

export const getAvatarCacheControl = (now: Date) => {
  const { year, month, day } = getShanghaiDay(now);
  const nextMidnight = Date.UTC(year, month - 1, day + 1, -SHANGHAI_UTC_OFFSET_HOURS);
  const maxAge = Math.max(1, Math.floor((nextMidnight - now.getTime()) / 1000));

  return `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=86400`;
};

const fetchWithTimeout = async (url: string, timeoutMs: number, headers: HeadersInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: 'no-store',
      headers,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

const getBindings = async () => {
  try {
    const { env } = await getCloudflareContext({ async: true });

    if (!env.AVATAR_BUCKET) {
      throw new AvatarUnavailableError('头像存储尚未配置');
    }

    return env.AVATAR_BUCKET;
  } catch (error) {
    if (error instanceof AvatarUnavailableError) throw error;
    throw new AvatarUnavailableError('头像存储暂时不可用');
  }
};

const downloadDailyAvatar = async (dayKey: string): Promise<DownloadedAvatar> => {
  const page = (stableHash(`${dayKey}:page`) % SOURCE_PAGE_COUNT) + 1;
  const sourcePageUrl = qs.stringifyUrl({
    url: 'https://haowallpaper.com/headImgView',
    query: {
      page,
      sortType: 4,
      isSel: false,
      rows: SOURCE_PAGE_SIZE,
      typeId: '553dff627434cc5683a776216c6045d2',
    },
  });
  const pageResponse = await fetchWithTimeout(sourcePageUrl, PAGE_REQUEST_TIMEOUT_MS, {
    Accept: 'text/html,application/xhtml+xml',
  });

  if (!pageResponse.ok) {
    throw new AvatarUnavailableError(`头像来源页面请求失败：${pageResponse.status}`);
  }

  const $ = cheerio.load(await pageResponse.text());
  const urls = new Set<string>();

  $('.img-box').each((_index, element) => {
    const src = $(element).attr('src');
    const style = $(element).attr('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
    const imageUrl = src || match?.[1];

    if (!imageUrl) return;

    try {
      const normalizedUrl = new URL(imageUrl, sourcePageUrl);
      if (normalizedUrl.protocol === 'http:' || normalizedUrl.protocol === 'https:') {
        urls.add(normalizedUrl.toString());
      }
    } catch {
      // 忽略来源页面中的无效图片地址。
    }
  });

  const avatarUrls = Array.from(urls);
  if (avatarUrls.length === 0) {
    throw new AvatarUnavailableError('头像来源页面没有可用图片');
  }

  const firstCandidateIndex = stableHash(`${dayKey}:avatar`) % avatarUrls.length;
  const candidateCount = Math.min(avatarUrls.length, MAX_IMAGE_CANDIDATES);

  for (let offset = 0; offset < candidateCount; offset += 1) {
    const candidateIndex = (firstCandidateIndex + offset) % avatarUrls.length;
    const sourceUrl = avatarUrls[candidateIndex];

    try {
      const imageResponse = await fetchWithTimeout(sourceUrl, IMAGE_REQUEST_TIMEOUT_MS, {
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif',
      });
      const contentType = imageResponse.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
      const extension = contentType ? contentTypeExtensions.get(contentType) : undefined;
      const declaredSize = Number(imageResponse.headers.get('content-length'));

      if (!imageResponse.ok || !extension || (Number.isFinite(declaredSize) && declaredSize > MAX_IMAGE_BYTES)) {
        continue;
      }

      const bytes = await imageResponse.arrayBuffer();
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) continue;

      return { bytes, contentType: contentType!, extension, sourceUrl };
    } catch {
      // 单张图片失败时继续尝试当天的下一个稳定候选。
    }
  }

  throw new AvatarUnavailableError('当天头像图片下载失败');
};

const getObjectForDay = async (bucket: R2Bucket, dayKey: string) => {
  const objectKey = `${DAILY_OBJECT_PREFIX}${dayKey}`;
  const object = await bucket.get(objectKey);

  if (object) {
    return object;
  }

  const legacyObjects = await bucket.list({
    prefix: objectKey,
    limit: 10,
  });

  for (const legacyObject of [...legacyObjects.objects].reverse()) {
    const legacyBody = await bucket.get(legacyObject.key);
    if (legacyBody) return legacyBody;
  }

  return null;
};

const listDailyObjects = async (bucket: R2Bucket) => {
  const objects: R2Object[] = [];
  let cursor: string | undefined;

  do {
    const result = await bucket.list({
      prefix: DAILY_OBJECT_PREFIX,
      cursor,
      limit: 1000,
      include: ['customMetadata'],
    });

    objects.push(...result.objects);
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);

  return objects;
};

const getObjectDayKey = (object: R2Object) => {
  return object.customMetadata?.dayKey || DAILY_OBJECT_PATTERN.exec(object.key)?.[1] || null;
};

const cleanupExpiredAvatars = async (bucket: R2Bucket) => {
  const objects = await listDailyObjects(bucket);
  const dayKeys = [...new Set(objects.map(getObjectDayKey).filter((value): value is string => Boolean(value)))].sort();
  const retainedDayKeys = new Set(dayKeys.slice(-RETENTION_DAYS));
  const expiredKeys = objects
    .filter((object) => {
      const dayKey = getObjectDayKey(object);
      return dayKey ? !retainedDayKeys.has(dayKey) : false;
    })
    .map((object) => object.key);

  for (let index = 0; index < expiredKeys.length; index += 1000) {
    await bucket.delete(expiredKeys.slice(index, index + 1000));
  }
};

const refreshDailyAvatar = async (bucket: R2Bucket, dayKey: string) => {
  const downloaded = await downloadDailyAvatar(dayKey);
  const objectKey = `${DAILY_OBJECT_PREFIX}${dayKey}`;

  await bucket.put(objectKey, downloaded.bytes, {
    onlyIf: new Headers({ 'If-None-Match': '*' }),
    httpMetadata: {
      contentType: downloaded.contentType,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      dayKey,
      sourceUrl: downloaded.sourceUrl,
    },
  });

  try {
    await cleanupExpiredAvatars(bucket);
  } catch (error) {
    console.warn('清理过期头像对象失败', error);
  }

  const object = await bucket.get(objectKey);
  if (!object) throw new AvatarUnavailableError('头像写入后无法读取');

  return object;
};

const getLatestReadyObject = async (bucket: R2Bucket) => {
  const objects = await listDailyObjects(bucket);

  for (const metadata of objects.reverse()) {
    const dayKey = getObjectDayKey(metadata);
    if (!dayKey) continue;

    const object = await bucket.get(metadata.key);
    if (object) return { dayKey, object };
  }

  return null;
};

export const getDailyAvatar = async (now = new Date()): Promise<DailyAvatar> => {
  const bucket = await getBindings();
  const dayKey = getShanghaiDay(now).key;
  const current = await getObjectForDay(bucket, dayKey);

  if (current) {
    return { dayKey, object: current };
  }

  try {
    const object = await refreshDailyAvatar(bucket, dayKey);
    return { dayKey, object };
  } catch (error) {
    console.error('刷新每日头像失败', { dayKey, error });
  }

  const fallback = await getLatestReadyObject(bucket);
  if (fallback) return fallback;

  throw new AvatarUnavailableError();
};
