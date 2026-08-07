'use client';

import { useEffect, useState } from 'react';

import Icon from '@/components/icon';
import Tooltip, { TooltipContent, TooltipTrigger } from '@/components/tooltip';
import * as stylex from '@stylexjs/stylex';

import { articleBackToTopStyles } from './article-back-to-top.styles';

type ArticleBackToTopProps = {
  targetId: string;
};

export default function ArticleBackToTop({ targetId }: ArticleBackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(target);

    return () => observer.disconnect();
  }, [targetId]);

  if (!visible) return null;

  const scrollToTop = () => {
    const target = document.getElementById(targetId);
    target?.focus({ preventScroll: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div {...stylex.props(articleBackToTopStyles.root)}>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="回到顶部"
            onClick={scrollToTop}
            {...stylex.props(articleBackToTopStyles.button)}
          >
            <Icon name="arrowUp" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" hideArrow>
          回到顶部
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
