import qs, { ParsedQuery } from 'query-string';

/**
 * 中转图片链接
 * @link https://wsrv.nl
 **/
export const imgByWsrv = (url: string, query?: ParsedQuery) => {
  const finalUrl = qs.stringifyUrl({ url: 'https://wsrv.nl/', query: Object.assign({}, query, { url }) });
  return finalUrl;
};
