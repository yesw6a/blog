export type HomeExternalLink = {
  name: string;
  link: string;
};

export const HOME_CONTENT = {
  name: '兮兮',
  aboutAnchorId: 'about-title',
  description: {
    lead: '一名 95 后',
    firstKeyword: '火象星座',
    middle: '的',
    secondKeyword: '前端开发者',
    tail: '，这个个人站由 AIGC 创作与维护，记录工程实践、技术折腾和偶尔冒出的想法。',
  },
  articleArchiveDescription: '记录前端开发、工程实践，以及那些值得在写代码之外继续想一想的问题。',
} as const;

export const HOME_DESCRIPTION_TEXT = [
  HOME_CONTENT.description.lead,
  HOME_CONTENT.description.firstKeyword,
  HOME_CONTENT.description.middle,
  HOME_CONTENT.description.secondKeyword,
  HOME_CONTENT.description.tail,
].join('');

export const TECHNOLOGY_STACK: HomeExternalLink[] = [
  { name: 'Next.js', link: 'https://nextjs.org/' },
  { name: 'StyleX', link: 'https://stylexjs.com/' },
];

export const SITE_SERVICES: HomeExternalLink[] = [{ name: 'Cloudflare', link: 'https://www.cloudflare.com/' }];
