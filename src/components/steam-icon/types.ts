import type { StyleXStyles } from '@stylexjs/stylex';

import { ImageProps } from 'next/image';

export type SteamIconProps = Omit<Partial<ImageProps>, 'className' | 'style'> & {
  /** steam 游戏 appid */
  appid: number;
  /** steam 游戏图标 hash */
  hash: string;
  style?: StyleXStyles;
};
