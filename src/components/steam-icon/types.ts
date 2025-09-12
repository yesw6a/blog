import { ImageProps } from 'next/image';

export type SteamIconProps = Partial<ImageProps> & {
  /** steam 游戏 appid */
  appid: number;
  /** steam 游戏图标 hash */
  hash: string;
  className?: string;
};
