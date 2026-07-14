import qs, { ParsedQuery } from 'query-string';

/** 获取头像 */
export const getAvatar = async ({ params }: { params: ParsedQuery }) =>
  fetch(qs.stringifyUrl({ url: '/api/haowallpaper/avatar/random', query: params })).then((res) => res.bytes());
