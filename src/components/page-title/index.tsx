'use client';

import classNames from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import styles from './index.module.scss';
import { PageTitleProps } from './types';

const PageTitle: FC<PageTitleProps> = ({ children, className }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const [url] = pathname.split('/#');
    const newUrl = `${url}/#${children}`;
    router.push(newUrl);
  };

  return (
    <h1 className={classNames(styles['title'], className)} onClick={handleClick}>
      {children}
    </h1>
  );
};

export default PageTitle;
