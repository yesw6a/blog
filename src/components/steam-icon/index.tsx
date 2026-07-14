'use client';

import { FC, useEffect, useState } from 'react';

import Image from 'next/image';
import { imgByWsrv } from '@/utils';
import * as stylex from '@stylexjs/stylex';

import { SteamIconProps } from './types';

const SteamIcon: FC<SteamIconProps> = ({ appid, hash, style, ...restProps }) => {
  const [src, setSrc] = useState('');
  const styleProps = stylex.props(style);

  useEffect(() => {
    if (!appid || !hash) {
      setSrc('');
      return;
    }
    const url = imgByWsrv(`http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg`);
    setSrc(url);
  }, [appid, hash]);

  return src ? (
    <Image
      src={src}
      alt=""
      {...restProps}
      className={styleProps.className}
      style={styleProps.style}
      onError={() => setSrc('')}
    />
  ) : (
    <div
      className={styleProps.className}
      style={{ ...styleProps.style, width: restProps.width, height: restProps.height }}
    />
  );
};

export default SteamIcon;
