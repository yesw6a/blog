import type { ArticleHeading } from './article.types';

import * as stylex from '@stylexjs/stylex';

import { articleStyles } from './article.styles';

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[];
};

export default function ArticleTableOfContents({ headings }: ArticleTableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <aside {...stylex.props(articleStyles.tocAside)}>
      <nav aria-label="文章目录" {...stylex.props(articleStyles.toc)}>
        <p {...stylex.props(articleStyles.tocTitle)}>本文目录</p>
        <ol {...stylex.props(articleStyles.tocList)}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              {...stylex.props(articleStyles.tocItem, heading.depth === 3 && articleStyles.tocItemNested)}
            >
              <a href={`#${heading.id}`} {...stylex.props(articleStyles.tocLink)}>
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
