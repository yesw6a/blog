import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';

import { notFoundStyles } from './not-found.styles';

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" {...stylex.props(notFoundStyles.page)}>
      <div aria-hidden {...stylex.props(notFoundStyles.errorCode)}>
        404
      </div>

      <div {...stylex.props(notFoundStyles.content)}>
        <h1 id="not-found-title" {...stylex.props(notFoundStyles.title)}>
          页面不存在
        </h1>
        <p {...stylex.props(notFoundStyles.description)}>链接可能已失效或地址有误。试试顶部搜索，或继续浏览文章。</p>
        <div {...stylex.props(notFoundStyles.actions)}>
          <Link href="/" {...stylex.props(notFoundStyles.primaryLink)}>
            返回首页
          </Link>
          <Link href="/articles" {...stylex.props(notFoundStyles.secondaryLink)}>
            浏览文章
          </Link>
        </div>
      </div>
    </section>
  );
}
