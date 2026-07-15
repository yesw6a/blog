import type { ArticleSummary } from './article.types';

import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';

import { articleStyles } from './article.styles';

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

type ArticleListItemProps = {
  article: ArticleSummary;
};

export default function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <li {...stylex.props(articleStyles.articleItem)}>
      <time dateTime={article.publishedAt} {...stylex.props(articleStyles.articleDate)}>
        {dateFormatter.format(new Date(article.publishedAt))}
      </time>
      <article>
        <Link href={`/articles/${article.slug}`} {...stylex.props(articleStyles.articleLink)}>
          <h2 {...stylex.props(articleStyles.articleTitle)}>{article.title}</h2>
          <p {...stylex.props(articleStyles.articleDescription)}>{article.description}</p>
        </Link>
        <div {...stylex.props(articleStyles.articleMeta)}>
          <span>{article.readingTime} 分钟阅读</span>
          {article.draft ? <span {...stylex.props(articleStyles.draftBadge)}>草稿</span> : null}
          {article.tags.map((tag) => (
            <span key={tag} {...stylex.props(articleStyles.inlineTag)}>
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </li>
  );
}
