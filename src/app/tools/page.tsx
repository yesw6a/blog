import type { Metadata } from 'next';

import ToolboxCatalog from '@/features/toolbox/toolbox-catalog';
import { TOOL_DEFINITIONS } from '@/features/toolbox/toolbox.registry';
import { toolboxStyles } from '@/features/toolbox/toolbox.styles';
import * as stylex from '@stylexjs/stylex';

export const metadata: Metadata = {
  title: '工具箱',
  description: '处理文本、数据、时间与视觉内容的浏览器工具和独立客户端入口。',
  alternates: { canonical: '/tools' },
};

export const dynamic = 'force-static';

export default function ToolsPage() {
  return (
    <div {...stylex.props(toolboxStyles.page)}>
      <header {...stylex.props(toolboxStyles.hero)}>
        <h1 {...stylex.props(toolboxStyles.title)}>工具箱</h1>
        <p {...stylex.props(toolboxStyles.description)}>
          一些处理文本、数据和创作内容的小工具。大多数浏览器工具在本地处理；需要安装或联网的工具会在详情页明确说明数据去向。
        </p>
      </header>
      <ToolboxCatalog tools={TOOL_DEFINITIONS} />
    </div>
  );
}
