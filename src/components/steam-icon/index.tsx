'use client';

import { getSteamImage } from '@/app/api/steam';
import { useRequest } from 'ahooks';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { SteamIconProps } from './types';

const SteamIcon: FC<SteamIconProps> = ({ appid, hash, ...restProps }) => {
  const [src, setSrc] = useState('');

  const { data } = useRequest(() => getSteamImage(appid, hash));

  useEffect(() => {
    if (data) {
      const blob = new Blob([data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setSrc(url);

      return () => {
        console.log('revoke');
        URL.revokeObjectURL(url);
      };
    }
  }, [data]);

  return src ? (
    <Image src={src} alt="" {...restProps} />
  ) : (
    <div className={restProps.className} style={{ width: restProps.width, height: restProps.height }} />
  );
};

export default SteamIcon;
