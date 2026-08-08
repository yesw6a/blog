import type { Metadata } from 'next';

import ToolboxCatalog from '@/features/toolbox/toolbox-catalog';
import { TOOL_DEFINITIONS } from '@/features/toolbox/toolbox.registry';
import { toolboxStyles } from '@/features/toolbox/toolbox.styles';
import * as stylex from '@stylexjs/stylex';

export const metadata: Metadata = {
  title: '工具箱',
  description: '处理文本、数据、时间和写作内容的浏览器本地工具。',
  alternates: { canonical: '/tools' },
};

export const dynamic = 'force-static';

export default function ToolsPage() {
  return (
    <div {...stylex.props(toolboxStyles.page)}>
      <header {...stylex.props(toolboxStyles.hero)}>
        <h1 {...stylex.props(toolboxStyles.title)}>工具箱</h1>
        <p {...stylex.props(toolboxStyles.description)}>
          一些处理文本、数据和写作内容的小工具。无需注册，输入内容仅在浏览器本地处理。
        </p>
      </header>
      <ToolboxCatalog tools={TOOL_DEFINITIONS} />
    </div>
  );
}
