import type { ReactNode } from 'react';
import type { ToolDefinition } from './toolbox.types';

import Link from 'next/link';
import Icon from '@/components/icon';
import { textLinkStyles } from '@/styles/text-link.styles';
import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from './tool-ui.styles';

type ToolPageShellProps = {
  tool: ToolDefinition;
  children: ReactNode;
};

export default function ToolPageShell({ tool, children }: ToolPageShellProps) {
  return (
    <div {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <Link href="/tools" {...stylex.props(styles.backLink, textLinkStyles.hitArea)}>
          ← 返回工具箱
        </Link>
        <div {...stylex.props(styles.titleRow)}>
          <span {...stylex.props(styles.iconTile)}>
            <Icon name={tool.icon} />
          </span>
          <h1 {...stylex.props(styles.title)}>{tool.name}</h1>
        </div>
        <p {...stylex.props(styles.description)}>{tool.description}</p>
        <span {...stylex.props(styles.privacyNote)}>
          <Icon name="checkCircle" />
          输入内容只在当前浏览器中处理，不会上传到服务器
        </span>
      </header>
      <div {...stylex.props(styles.workspace)}>{children}</div>
    </div>
  );
}
