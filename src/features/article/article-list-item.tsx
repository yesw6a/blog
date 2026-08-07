import type { ArticleSearchMatch, ArticleSummary } from './article.types';

import Link from 'next/link';
import HighlightedText from '@/features/search/highlighted-text';
import * as stylex from '@stylexjs/stylex';

import { getArticleTagHref } from './article.constants';
import { articleStyles } from './article.styles';

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

type ArticleListItemProps = {
  article: ArticleSummary;
  searchMatch?: ArticleSearchMatch;
};

export default function ArticleListItem({ article, searchMatch }: ArticleListItemProps) {
  const articleHref = searchMatch?.url ?? `/articles/${article.slug}`;

  return (
    <li {...stylex.props(articleStyles.articleItem)}>
      <time dateTime={article.publishedAt} {...stylex.props(articleStyles.articleDate)}>
        {dateFormatter.format(new Date(article.publishedAt))}
      </time>
      <article>
        <Link href={articleHref} {...stylex.props(articleStyles.articleLink)}>
          <h2 {...stylex.props(articleStyles.articleTitle)}>
            {searchMatch ? <HighlightedText value={searchMatch.title} /> : article.title}
          </h2>
          {searchMatch?.sectionTitle ? (
            <span {...stylex.props(articleStyles.searchMatchSection)}>
              命中章节 · <HighlightedText value={searchMatch.sectionTitle} />
            </span>
          ) : null}
          <p {...stylex.props(articleStyles.articleDescription)}>
            {searchMatch?.excerpt ? <HighlightedText value={searchMatch.excerpt} /> : article.description}
          </p>
          {searchMatch?.metadataMatches.length ? (
            <p {...stylex.props(articleStyles.searchMatchMetadata)}>
              <span>命中关键词 · </span>
              {searchMatch.metadataMatches.map((match, index) => (
                <span key={match.text}>
                  {index > 0 ? '、' : null}
                  <HighlightedText value={match} />
                </span>
              ))}
            </p>
          ) : null}
        </Link>
        <div {...stylex.props(articleStyles.articleMeta)}>
          <span>{article.readingTime} 分钟阅读</span>
          {article.draft ? <span {...stylex.props(articleStyles.draftBadge)}>草稿</span> : null}
          {article.tags.map((tag) => (
            <Link key={tag} href={getArticleTagHref(tag)} {...stylex.props(articleStyles.inlineTag)}>
              #{tag}
            </Link>
          ))}
        </div>
      </article>
    </li>
  );
}
