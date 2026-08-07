import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';

import { getArticleBrowseHref } from './article-navigation';
import { articlePaginationStyles } from './article-pagination.styles';

type ArticlePaginationProps = {
  basePath: string;
  currentPage: number;
  mode?: 'path' | 'query';
  queryParams?: Record<string, string | undefined>;
  totalPages: number;
};

const getPageItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set([1, totalPages]);
  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) pages.add(page);
  }

  const ordered = [...pages].toSorted((left, right) => left - right);
  return ordered.flatMap<number | 'ellipsis'>((page, index) => {
    const previous = ordered[index - 1];
    return previous && page - previous > 1 ? ['ellipsis', page] : [page];
  });
};

export default function ArticlePagination({
  basePath,
  currentPage,
  mode = 'path',
  queryParams,
  totalPages,
}: ArticlePaginationProps) {
  if (totalPages <= 1) return null;

  const hrefForPage = (page: number) =>
    getArticleBrowseHref({
      basePath,
      browseMode: 'pagination',
      page,
      query: mode === 'query' ? queryParams?.q : undefined,
      tag: mode === 'query' ? queryParams?.tag : undefined,
    });
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav aria-label="文章分页" {...stylex.props(articlePaginationStyles.pagination)}>
      {previousPage >= 1 ? (
        <Link href={hrefForPage(previousPage)} rel="prev" {...stylex.props(articlePaginationStyles.direction)}>
          上一页
        </Link>
      ) : (
        <span
          aria-disabled="true"
          {...stylex.props(articlePaginationStyles.direction, articlePaginationStyles.disabled)}
        >
          上一页
        </span>
      )}

      <div {...stylex.props(articlePaginationStyles.pages)}>
        {getPageItems(currentPage, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} aria-hidden="true" {...stylex.props(articlePaginationStyles.ellipsis)}>
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefForPage(item)}
              aria-current={item === currentPage ? 'page' : undefined}
              {...stylex.props(
                articlePaginationStyles.link,
                item === currentPage && articlePaginationStyles.linkActive,
              )}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      <span {...stylex.props(articlePaginationStyles.mobileStatus)}>
        第 {currentPage} / {totalPages} 页
      </span>

      {nextPage <= totalPages ? (
        <Link href={hrefForPage(nextPage)} rel="next" {...stylex.props(articlePaginationStyles.direction)}>
          下一页
        </Link>
      ) : (
        <span
          aria-disabled="true"
          {...stylex.props(articlePaginationStyles.direction, articlePaginationStyles.disabled)}
        >
          下一页
        </span>
      )}
    </nav>
  );
}
