'use client';

import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { SteamIconProps } from './types';

const SteamIcon: FC<SteamIconProps> = ({ appid, hash, ...restProps }) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (!appid || !hash) {
      setSrc('');
      return;
    }
    const url = `https://wsrv.nl/?url=http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg`;
    setSrc(url);
  }, [appid, hash]);

  return src ? (
    <Image src={src} alt="" {...restProps} onError={() => setSrc('')} />
  ) : (
    <div className={restProps.className} style={{ width: restProps.width, height: restProps.height }} />
  );
};

export default SteamIcon;
