'use client';

import { FC } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';

import { PageTitleProps } from './types';

const styles = stylex.create({
  title: {
    width: 'fit-content',
    cursor: 'pointer',
    fontSize: '1.25rem',
    fontWeight: 700,
    textDecorationLine: 'underline',
    textUnderlineOffset: '4px',
  },
});

const PageTitle: FC<PageTitleProps> = ({ children, style }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const [url] = pathname.split('/#');
    const newUrl = `${url}/#${children}`;
    router.push(newUrl);
  };

  return (
    <h1 {...stylex.props(styles.title, style)} onClick={handleClick}>
      {children}
    </h1>
  );
};

export default PageTitle;
