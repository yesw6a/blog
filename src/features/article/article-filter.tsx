'use client';

import { type FormEvent, type MouseEvent, useTransition } from 'react';

import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';

import { articleStyles } from './article.styles';

type ArticleFilterProps = {
  tags: string[];
  query?: string;
  selectedTag?: string;
};

const filterHref = (query?: string, tag?: string) => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (tag) params.set('tag', tag);
  const search = params.toString();
  return search ? `/articles?${search}` : '/articles';
};

export default function ArticleFilter({ tags, query, selectedTag }: ArticleFilterProps) {
  const [isPending, startTransition] = useTransition();

  const navigateToFilter = (href: string) => {
    const currentHref = `${window.location.pathname}${window.location.search}`;
    if (currentHref === href) return;

    startTransition(() => {
      window.history.pushState(null, '', href);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get('q') ?? '').trim() || undefined;
    navigateToFilter(filterHref(nextQuery, selectedTag));
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.currentTarget.target === '_blank' ||
      event.currentTarget.hasAttribute('download')
    ) {
      return;
    }
    event.preventDefault();
    navigateToFilter(href);
  };

  return (
    <section aria-label="文章筛选" aria-busy={isPending} {...stylex.props(articleStyles.filter)}>
      <form action="/articles" method="get" onSubmit={handleSubmit}>
        <label htmlFor="article-search" {...stylex.props(articleStyles.filterLabel)}>
          搜索文章
        </label>
        <div {...stylex.props(articleStyles.searchRow)}>
          <input
            key={query ?? ''}
            id="article-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="搜索标题、摘要或标签"
            {...stylex.props(articleStyles.searchInput)}
          />
          {selectedTag ? <input name="tag" type="hidden" value={selectedTag} /> : null}
          <button type="submit" {...stylex.props(articleStyles.searchButton)}>
            搜索
          </button>
        </div>
      </form>

      {query || selectedTag ? (
        <div {...stylex.props(articleStyles.filterActions)}>
          <span aria-live="polite" {...stylex.props(articleStyles.filterStatus)}>
            {isPending ? '正在更新筛选…' : '当前筛选已生效'}
          </span>
          <Link
            href="/articles"
            onClick={(event) => handleLinkClick(event, '/articles')}
            {...stylex.props(articleStyles.clearLink)}
          >
            清除筛选
          </Link>
        </div>
      ) : null}

      <nav aria-label="按标签筛选" {...stylex.props(articleStyles.tagList)}>
        <Link
          href={filterHref(query)}
          onClick={(event) => handleLinkClick(event, filterHref(query))}
          aria-current={!selectedTag ? 'page' : undefined}
          {...stylex.props(articleStyles.tagLink, !selectedTag && articleStyles.tagLinkActive)}
        >
          全部
        </Link>
        {tags.map((tag) => {
          const active = selectedTag === tag;
          return (
            <Link
              key={tag}
              href={filterHref(query, tag)}
              onClick={(event) => handleLinkClick(event, filterHref(query, tag))}
              aria-current={active ? 'page' : undefined}
              {...stylex.props(articleStyles.tagLink, active && articleStyles.tagLinkActive)}
            >
              {tag}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
