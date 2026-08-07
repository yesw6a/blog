import type { HomeExternalLink } from '@/features/home/home.content';

import Link from 'next/link';
import { Icon, TextKeyword } from '@/components';
import { getPublishedArticleSummaries } from '@/features/article/article.repository';
import HomeAvatar from '@/features/home/home-avatar';
import { HOME_CONTENT, SITE_SERVICES, TECHNOLOGY_STACK } from '@/features/home/home.content';
import { homeStyles } from '@/features/home/home.styles';
import * as stylex from '@stylexjs/stylex';

export const dynamic = 'force-static';

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const getTopTopics = (articles: Awaited<ReturnType<typeof getPublishedArticleSummaries>>) => {
  const counts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.tags) {
      if (tag.toLocaleUpperCase('en-US') === 'AIGC') continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .toSorted(([leftTag, leftCount], [rightTag, rightCount]) => {
      return rightCount - leftCount || leftTag.localeCompare(rightTag, 'zh-CN');
    })
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
};

const ExternalLinks = ({ items }: { items: HomeExternalLink[] }) => (
  <>
    {items.map((item, index) => (
      <span key={item.name}>
        {index > 0 ? <span aria-hidden> · </span> : null}
        <a href={item.link} target="_blank" rel="noopener noreferrer" {...stylex.props(homeStyles.externalLink)}>
          {item.name}
        </a>
      </span>
    ))}
  </>
);

export default async function Home() {
  const articles = await getPublishedArticleSummaries();
  const latestArticles = articles.slice(0, 4);
  const topTopics = getTopTopics(articles);

  return (
    <div {...stylex.props(homeStyles.page)}>
      <section aria-labelledby="about-title" {...stylex.props(homeStyles.hero)}>
        <div {...stylex.props(homeStyles.profileRail)}>
          <HomeAvatar />
        </div>
        <div>
          <p {...stylex.props(homeStyles.eyebrow)}>About</p>
          <h1 id={HOME_CONTENT.aboutAnchorId} {...stylex.props(homeStyles.heroTitle)}>
            {HOME_CONTENT.name}
          </h1>
          <p {...stylex.props(homeStyles.heroDescription)}>
            {HOME_CONTENT.description.lead}
            <TextKeyword backgroundColor="#ff4757">{HOME_CONTENT.description.firstKeyword}</TextKeyword>
            {HOME_CONTENT.description.middle}
            <TextKeyword backgroundColor="#1e90ff">{HOME_CONTENT.description.secondKeyword}</TextKeyword>
            {HOME_CONTENT.description.tail}
          </p>
          <div aria-label="网站技术栈与服务" {...stylex.props(homeStyles.stackRows)}>
            <div {...stylex.props(homeStyles.stackRow)}>
              <Icon name="sourceCode" style={homeStyles.inlineIcon} />
              <span>
                构建于 <ExternalLinks items={TECHNOLOGY_STACK} />
              </span>
            </div>
            <div {...stylex.props(homeStyles.stackRow)}>
              <Icon name="cloudServer" style={homeStyles.inlineIcon} />
              <span>
                运行于 <ExternalLinks items={SITE_SERVICES} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <div {...stylex.props(homeStyles.contentGrid)}>
        <section aria-labelledby="latest-articles-title">
          <div {...stylex.props(homeStyles.sectionHeader)}>
            <h2 id="latest-articles-title" {...stylex.props(homeStyles.sectionTitle)}>
              最近文章
            </h2>
            <Link href="/articles" {...stylex.props(homeStyles.sectionLink)}>
              查看全部 →
            </Link>
          </div>
          <ol {...stylex.props(homeStyles.articleList)}>
            {latestArticles.map((article) => (
              <li key={article.slug} {...stylex.props(homeStyles.articleItem)}>
                <time dateTime={article.publishedAt} {...stylex.props(homeStyles.articleDate)}>
                  {dateFormatter.format(new Date(article.publishedAt))}
                </time>
                <article>
                  <Link href={`/articles/${article.slug}`} {...stylex.props(homeStyles.articleLink)}>
                    <h3 {...stylex.props(homeStyles.articleTitle)}>{article.title}</h3>
                    <p {...stylex.props(homeStyles.articleDescription)}>{article.description}</p>
                  </Link>
                  <div {...stylex.props(homeStyles.articleMeta)}>
                    <span>{article.readingTime} 分钟阅读</span>
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} {...stylex.props(homeStyles.articleTag)}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <aside aria-labelledby="topics-title" {...stylex.props(homeStyles.topics)}>
          <h2 id="topics-title" {...stylex.props(homeStyles.sectionTitle)}>
            主要写作主题
          </h2>
          <p {...stylex.props(homeStyles.topicsIntro)}>从现有公开文章中统计，点击即可按主题浏览。</p>
          <ol {...stylex.props(homeStyles.topicList)}>
            {topTopics.map((topic) => (
              <li key={topic.name}>
                <Link href={`/articles?tag=${encodeURIComponent(topic.name)}`} {...stylex.props(homeStyles.topicLink)}>
                  <span>#{topic.name}</span>
                  <span aria-label={`${topic.count} 篇文章`} {...stylex.props(homeStyles.topicCount)}>
                    {String(topic.count).padStart(2, '0')}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
