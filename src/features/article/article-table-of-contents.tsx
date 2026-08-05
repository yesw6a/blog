'use client';

import { useEffect, useState } from 'react';

import type { ArticleHeading } from './article.types';

import * as stylex from '@stylexjs/stylex';

import { articleStyles } from './article.styles';

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[];
};

export default function ArticleTableOfContents({ headings }: ArticleTableOfContentsProps) {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (headingElements.length === 0) return;

    let animationFrameId: number | null = null;
    let currentActiveHeadingId = headings[0]?.id ?? null;
    let readingOffset = Number.parseFloat(window.getComputedStyle(headingElements[0]).scrollMarginTop) || 96;

    const updateActiveHeading = () => {
      animationFrameId = null;

      const reachedPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let nextActiveHeadingId = headingElements[0].id;

      if (reachedPageEnd) {
        nextActiveHeadingId = headingElements[headingElements.length - 1].id;
      } else {
        for (const headingElement of headingElements) {
          if (headingElement.getBoundingClientRect().top > readingOffset) break;
          nextActiveHeadingId = headingElement.id;
        }
      }

      if (nextActiveHeadingId === currentActiveHeadingId) return;

      currentActiveHeadingId = nextActiveHeadingId;
      setActiveHeadingId(nextActiveHeadingId);
    };

    const scheduleActiveHeadingUpdate = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(updateActiveHeading);
    };

    const handleResize = () => {
      readingOffset = Number.parseFloat(window.getComputedStyle(headingElements[0]).scrollMarginTop) || 96;
      scheduleActiveHeadingUpdate();
    };

    scheduleActiveHeadingUpdate();
    window.addEventListener('scroll', scheduleActiveHeadingUpdate, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', scheduleActiveHeadingUpdate);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside {...stylex.props(articleStyles.tocAside)}>
      <nav aria-label="文章目录" {...stylex.props(articleStyles.toc)}>
        <p {...stylex.props(articleStyles.tocTitle)}>本文目录</p>
        <ol {...stylex.props(articleStyles.tocList)}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              {...stylex.props(
                articleStyles.tocItem,
                heading.depth === 3 && articleStyles.tocItemNested,
                heading.id === activeHeadingId && articleStyles.tocItemActive,
              )}
            >
              <a
                href={`#${heading.id}`}
                aria-current={heading.id === activeHeadingId ? 'location' : undefined}
                {...stylex.props(articleStyles.tocLink, heading.id === activeHeadingId && articleStyles.tocLinkActive)}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
