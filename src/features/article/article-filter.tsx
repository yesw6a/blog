'use client';

import { useState, useTransition } from 'react';

import type { FormEvent } from 'react';
import type { ArticleBrowseMode } from './article-navigation';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { textLinkStyles } from '@/styles/text-link.styles';
import * as stylex from '@stylexjs/stylex';

import { getArticleBrowseHref } from './article-navigation';
import { getArticleTagHref } from './article.constants';
import { articleStyles } from './article.styles';

type ArticleFilterProps = {
  basePath: string;
  browseMode?: ArticleBrowseMode;
  preserveBasePathOnClear?: boolean;
  tags: string[];
  query?: string;
  selectedTag?: string;
  selectedTagInPath?: boolean;
};

const MOBILE_VISIBLE_TAG_COUNT = 6;
const DESKTOP_VISIBLE_TAG_COUNT = 10;
const TAG_LIST_ID = 'article-tag-filter-list';

export default function ArticleFilter({
  basePath,
  browseMode = 'pagination',
  preserveBasePathOnClear,
  tags,
  query,
  selectedTag,
  selectedTagInPath,
}: ArticleFilterProps) {
  const router = useRouter();
  const [showAllTags, setShowAllTags] = useState(false);
  const [isPending, startTransition] = useTransition();
  const hasMobileOverflow = tags.length > MOBILE_VISIBLE_TAG_COUNT;
  const hasDesktopOverflow = tags.length > DESKTOP_VISIBLE_TAG_COUNT;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get('q') ?? '').trim() || undefined;
    const tagQuery = selectedTagInPath ? undefined : selectedTag;

    startTransition(() => {
      router.push(getArticleBrowseHref({ basePath, browseMode, query: nextQuery, tag: tagQuery }), { scroll: false });
    });
  };

  return (
    <section aria-label="文章筛选" aria-busy={isPending} {...stylex.props(articleStyles.filter)}>
      <form action={basePath} method="get" onSubmit={handleSubmit}>
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
            enterKeyHint="search"
            placeholder="搜索标题、正文或标签"
            {...stylex.props(articleStyles.searchInput)}
          />
          {!selectedTagInPath && selectedTag ? <input name="tag" type="hidden" value={selectedTag} /> : null}
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
            href={getArticleBrowseHref({ basePath: preserveBasePathOnClear ? basePath : '/articles', browseMode })}
            {...stylex.props(articleStyles.clearLink, textLinkStyles.hitArea)}
          >
            清除筛选
          </Link>
        </div>
      ) : null}

      <nav id={TAG_LIST_ID} aria-label="按标签筛选" {...stylex.props(articleStyles.tagList)}>
        <Link
          href={getArticleBrowseHref({ basePath: '/articles', browseMode, query })}
          aria-current={!selectedTag ? 'page' : undefined}
          {...stylex.props(articleStyles.tagLink, !selectedTag && articleStyles.tagLinkActive)}
        >
          全部
        </Link>
        {tags.map((tag, index) => {
          const active = selectedTag === tag;
          const collapsedOnMobile = !showAllTags && index >= MOBILE_VISIBLE_TAG_COUNT;
          const collapsedOnDesktop = !showAllTags && index >= DESKTOP_VISIBLE_TAG_COUNT;

          return (
            <Link
              key={tag}
              href={getArticleBrowseHref({ basePath: getArticleTagHref(tag), browseMode, query })}
              aria-current={active ? 'page' : undefined}
              {...stylex.props(
                articleStyles.tagLink,
                collapsedOnMobile && articleStyles.tagLinkCollapsedMobile,
                collapsedOnDesktop && articleStyles.tagLinkCollapsedDesktop,
                active && articleStyles.tagLinkActive,
                active && articleStyles.tagLinkForcedVisible,
              )}
            >
              {tag}
            </Link>
          );
        })}
        {hasMobileOverflow ? (
          <button
            type="button"
            aria-controls={TAG_LIST_ID}
            aria-expanded={showAllTags}
            onClick={() => setShowAllTags((expanded) => !expanded)}
            {...stylex.props(articleStyles.tagToggle, !hasDesktopOverflow && articleStyles.tagToggleMobileOnly)}
          >
            {showAllTags ? '收起标签' : '更多标签'}
          </button>
        ) : null}
      </nav>
    </section>
  );
}
