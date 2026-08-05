'use client';

import { useEffect, useRef, useState } from 'react';

import type { ArticleHeading } from './article.types';

import * as stylex from '@stylexjs/stylex';

import { articleStyles } from './article.styles';

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[];
};

type TocIndicatorPosition = {
  height: number;
  offset: number;
  visible: boolean;
};

const hiddenIndicatorPosition: TocIndicatorPosition = {
  height: 0,
  offset: 0,
  visible: false,
};

export default function ArticleTableOfContents({ headings }: ArticleTableOfContentsProps) {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(headings[0]?.id ?? null);
  const [indicatorPosition, setIndicatorPosition] = useState<TocIndicatorPosition>(hiddenIndicatorPosition);
  const tocAsideRef = useRef<HTMLElement | null>(null);
  const tocListRef = useRef<HTMLOListElement | null>(null);
  const tocItemRefs = useRef(new Map<string, HTMLLIElement>());

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

  useEffect(() => {
    const tocAside = tocAsideRef.current;
    const tocList = tocListRef.current;
    const activeItem = activeHeadingId ? tocItemRefs.current.get(activeHeadingId) : null;

    if (!tocAside || !tocList || !activeItem) {
      setIndicatorPosition(hiddenIndicatorPosition);
      return;
    }

    let animationFrameId: number | null = null;

    const updateIndicator = () => {
      animationFrameId = null;

      const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
      const indicatorInset = rootFontSize * 0.15;
      const nextPosition = {
        height: Math.max(activeItem.offsetHeight - indicatorInset * 2, 2),
        offset: activeItem.offsetTop + indicatorInset,
        visible: true,
      };

      setIndicatorPosition((currentPosition) => {
        if (
          currentPosition.height === nextPosition.height &&
          currentPosition.offset === nextPosition.offset &&
          currentPosition.visible
        ) {
          return currentPosition;
        }

        return nextPosition;
      });

      const tocAsideRect = tocAside.getBoundingClientRect();
      const activeItemRect = activeItem.getBoundingClientRect();
      const visibilityPadding = Math.min(24, tocAside.clientHeight / 4);
      const visibleTop = tocAsideRect.top + visibilityPadding;
      const visibleBottom = tocAsideRect.bottom - visibilityPadding;
      let nextScrollTop = tocAside.scrollTop;

      if (activeItemRect.top < visibleTop) {
        nextScrollTop += activeItemRect.top - visibleTop;
      } else if (activeItemRect.bottom > visibleBottom) {
        nextScrollTop += activeItemRect.bottom - visibleBottom;
      }

      if (Math.abs(nextScrollTop - tocAside.scrollTop) < 1) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      tocAside.scrollTo({
        top: nextScrollTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    };

    const scheduleIndicatorUpdate = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(updateIndicator);
    };

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleIndicatorUpdate);

    resizeObserver?.observe(tocAside);
    resizeObserver?.observe(tocList);
    window.addEventListener('resize', scheduleIndicatorUpdate);
    scheduleIndicatorUpdate();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleIndicatorUpdate);
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeHeadingId, headings]);

  if (headings.length === 0) return null;

  return (
    <aside ref={tocAsideRef} {...stylex.props(articleStyles.tocAside)}>
      <nav aria-label="文章目录" {...stylex.props(articleStyles.toc)}>
        <p {...stylex.props(articleStyles.tocTitle)}>本文目录</p>
        <ol ref={tocListRef} {...stylex.props(articleStyles.tocList)}>
          <li
            aria-hidden="true"
            {...stylex.props(articleStyles.tocIndicator)}
            style={{
              height: indicatorPosition.height,
              opacity: indicatorPosition.visible ? 1 : 0,
              transform: `translateY(${indicatorPosition.offset}px)`,
            }}
          />
          {headings.map((heading) => (
            <li
              key={heading.id}
              ref={(element) => {
                if (element) {
                  tocItemRefs.current.set(heading.id, element);
                } else {
                  tocItemRefs.current.delete(heading.id);
                }
              }}
              {...stylex.props(articleStyles.tocItem, heading.depth === 3 && articleStyles.tocItemNested)}
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
