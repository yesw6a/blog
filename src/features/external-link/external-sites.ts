import type { IconName } from '@/components/icon';

/** 站外链接的二次风险提示文案；为 null 表示点击后直接跳转。 */
export type ExternalSiteConfirmation = {
  title: string;
  lead: string;
  disclaimer: string;
  details: readonly string[];
  confirmLabel: string;
  cancelLabel: string;
};

export type ExternalSite = {
  id: 'travel' | 'life-guide';
  name: string;
  url: string;
  icon: IconName;
  tooltip: string;
  ariaLabel: string;
  menuHint: string;
  confirmation: ExternalSiteConfirmation | null;
};

/** 右上角多功能区里的站外入口；站点自身的跳转属性与确认文案保持单一数据源。 */
export const EXTERNAL_SITES: readonly ExternalSite[] = [
  {
    id: 'travel',
    name: '异次元之旅',
    url: 'https://travel.moe/go.html?travel=on',
    icon: 'travel',
    tooltip: '异次元之旅 · 自动跃迁',
    ariaLabel: '开启异次元之旅（在新窗口打开）',
    menuHint: '自动跃迁',
    confirmation: null,
  },
  {
    id: 'life-guide',
    name: '高性价比人生指南',
    url: 'https://eternity4719.github.io/HowToLiveBetter/',
    icon: 'compass',
    tooltip: '高性价比人生指南 · 站外链接',
    ariaLabel: '打开高性价比人生指南（站外链接，在新窗口打开）',
    menuHint: '站外链接 · 需确认',
    confirmation: {
      title: '即将离开本站',
      lead: '即将前往第三方站点「高性价比人生指南」（域名 eternity4719.github.io，GitHub Pages 托管）。该站内容未经本站核验，且其正文还会跳转到大量站外链接。',
      disclaimer: '第三方内容不构成本站的建议或背书；涉及账号、支付或下载时请特别留意。',
      details: [
        '该站页面会加载第三方统计脚本（Google Analytics）与 Google Fonts，并含一个第三方广告位。',
        '其正文约 1,700 条来源链接指向 230+ 个站外域名，跳转去向不在本站控制范围内。',
        '网上存在同名镜像站与衍生项目，请核对域名 eternity4719.github.io 是否为官方渠道。',
      ],
      confirmLabel: '继续访问 eternity4719.github.io',
      cancelLabel: '返回本站',
    },
  },
];
