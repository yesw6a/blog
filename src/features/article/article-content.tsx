import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import * as stylex from '@stylexjs/stylex';

import { articleStyles } from './article.styles';

type CalloutProps = {
  title: string;
  children: ReactNode;
};

const Callout = ({ title, children }: CalloutProps) => (
  <aside {...stylex.props(articleStyles.callout)}>
    <p {...stylex.props(articleStyles.calloutTitle)}>{title}</p>
    <div {...stylex.props(articleStyles.calloutBody)}>{children}</div>
  </aside>
);

const ArticleLink = ({ href = '', children, className, ...props }: ComponentPropsWithoutRef<'a'>) => {
  const isHeadingAnchor = className?.includes('article-heading-link');
  const styles = isHeadingAnchor ? {} : stylex.props(articleStyles.proseLink);
  const mergedClassName = [className, styles.className].filter(Boolean).join(' ');
  if (href.startsWith('/')) {
    return (
      <Link className={mergedClassName} href={href} style={styles.style} title={props.title}>
        {children}
      </Link>
    );
  }

  const external = /^https?:\/\//.test(href);
  return (
    <a
      {...props}
      {...styles}
      className={mergedClassName}
      href={href}
      rel={external ? 'noreferrer noopener' : props.rel}
      target={external ? '_blank' : props.target}
    >
      {children}
    </a>
  );
};

const ArticleImage = ({ src, alt = '', title }: ComponentPropsWithoutRef<'img'>) => {
  if (typeof src !== 'string') return null;
  return (
    <Image
      {...stylex.props(articleStyles.image)}
      src={src}
      alt={alt}
      title={title}
      width={1200}
      height={675}
      sizes="(max-width: 768px) 100vw, 760px"
    />
  );
};

const articleComponents = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 {...props} {...stylex.props(articleStyles.heading2)} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 {...props} {...stylex.props(articleStyles.heading3)} />,
  p: (props: ComponentPropsWithoutRef<'p'>) => <p {...props} {...stylex.props(articleStyles.paragraph)} />,
  a: ArticleLink,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul {...props} {...stylex.props(articleStyles.list)} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol {...props} {...stylex.props(articleStyles.list)} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} {...stylex.props(articleStyles.listItem)} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote {...props} {...stylex.props(articleStyles.blockquote)} />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => <pre {...props} {...stylex.props(articleStyles.codeBlock)} />,
  code: ({ className, ...props }: ComponentPropsWithoutRef<'code'>) => (
    <code
      {...props}
      className={className}
      {...stylex.props(articleStyles.inlineCode, className?.startsWith('language-') && articleStyles.codeInBlock)}
    />
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div {...stylex.props(articleStyles.tableScroll)}>
      <table {...props} {...stylex.props(articleStyles.table)} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => <thead {...props} {...stylex.props(articleStyles.tableHead)} />,
  th: (props: ComponentPropsWithoutRef<'th'>) => <th {...props} {...stylex.props(articleStyles.tableCell)} />,
  td: (props: ComponentPropsWithoutRef<'td'>) => <td {...props} {...stylex.props(articleStyles.tableCell)} />,
  img: ArticleImage,
  Callout,
};

type ArticleContentProps = {
  source: string;
};

export default function ArticleContent({ source }: ArticleContentProps) {
  return (
    <div {...stylex.props(articleStyles.prose)}>
      <MDXRemote
        source={source}
        components={articleComponents}
        options={{
          blockJS: false,
          blockDangerousJS: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: { className: ['article-heading-link'] },
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
