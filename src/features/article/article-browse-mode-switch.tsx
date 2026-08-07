'use client';

import { useTransition } from 'react';

import type { ChangeEvent } from 'react';

import { useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';

import { articleBrowseControlStyles } from './article-browse-controls.styles';

type ArticleBrowseModeSwitchProps = {
  checked: boolean;
  href: string;
};

export default function ArticleBrowseModeSwitch({ checked, href }: ArticleBrowseModeSwitchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked === checked || isPending) return;
    startTransition(() => router.push(href, { scroll: false }));
  };

  return (
    <label
      aria-busy={isPending}
      {...stylex.props(
        articleBrowseControlStyles.switchGroup,
        isPending && articleBrowseControlStyles.switchGroupPending,
      )}
    >
      <span {...stylex.props(!checked && articleBrowseControlStyles.switchTextActive)}>分页</span>
      <span {...stylex.props(articleBrowseControlStyles.switchHitArea)}>
        <input
          type="checkbox"
          role="switch"
          aria-label="无限滚动加载"
          aria-checked={checked}
          checked={checked}
          onChange={handleChange}
          {...stylex.props(articleBrowseControlStyles.switchInput)}
        />
        <span
          aria-hidden="true"
          {...stylex.props(
            articleBrowseControlStyles.switchTrack,
            checked && articleBrowseControlStyles.switchTrackActive,
          )}
        >
          <span
            {...stylex.props(
              articleBrowseControlStyles.switchThumb,
              checked && articleBrowseControlStyles.switchThumbActive,
            )}
          />
        </span>
      </span>
      <span {...stylex.props(checked && articleBrowseControlStyles.switchTextActive)}>无限滚动加载</span>
    </label>
  );
}
