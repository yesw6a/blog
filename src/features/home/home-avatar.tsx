'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useElementSpin } from '@/hooks';
import * as stylex from '@stylexjs/stylex';

import { homeStyles } from './home.styles';

const AVATAR_SIZE = 160;
const AVATAR_SRC = '/api/haowallpaper/avatar/random';

export default function HomeAvatar() {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const { elementRef, eventHandlers } = useElementSpin<HTMLDivElement>();
  const avatarStyleProps = stylex.props(homeStyles.avatar);

  return (
    <div
      ref={elementRef}
      className={avatarStyleProps.className}
      style={{
        ...avatarStyleProps.style,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
      }}
      {...eventHandlers}
    >
      {avatarFailed ? (
        <span role="img" aria-label="头像暂时不可用" {...stylex.props(homeStyles.avatarPlaceholder)}>
          兮
        </span>
      ) : (
        <Image
          src={AVATAR_SRC}
          alt="兮兮的每日头像"
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          priority
          unoptimized
          onError={() => setAvatarFailed(true)}
          {...stylex.props(homeStyles.avatarImage)}
        />
      )}
    </div>
  );
}
