'use client';

import Icon from '@/components/icon';
import Tooltip, { TooltipContent, TooltipTrigger } from '@/components/tooltip';
import * as stylex from '@stylexjs/stylex';

import { homeStyles } from './home.styles';

export default function HomeActionLinks() {
  return (
    <nav aria-label="站点相关链接" {...stylex.props(homeStyles.aboutActions)}>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <a
            href="/rss.xml"
            type="application/rss+xml"
            aria-label="通过 RSS 订阅文章"
            {...stylex.props(homeStyles.aboutActionLink)}
          >
            <Icon name="rss" />
          </a>
        </TooltipTrigger>
        <TooltipContent hideArrow>RSS 订阅</TooltipContent>
      </Tooltip>
    </nav>
  );
}
