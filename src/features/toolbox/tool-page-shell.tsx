import type { IconName } from '@/components/icon';
import type { ReactNode } from 'react';
import type { ToolDataPolicy, ToolDefinition } from './toolbox.types';

import Link from 'next/link';
import Icon from '@/components/icon';
import { textLinkStyles } from '@/styles/text-link.styles';
import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from './tool-ui.styles';

type ToolPageShellProps = {
  tool: ToolDefinition;
  children: ReactNode;
};

const DATA_POLICY_NOTICES: Record<ToolDataPolicy, { icon: IconName; label: string }> = {
  'browser-local': {
    icon: 'checkCircle',
    label: '输入内容只在当前浏览器中处理，不会上传到服务器',
  },
  'desktop-direct': {
    icon: 'cloudServer',
    label: 'SceneMeld 客户端从本机直连你配置的 Endpoint；本站不会接收 API Key、提示词、参考图或生成结果',
  },
};

export default function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const dataPolicyNotice = DATA_POLICY_NOTICES[tool.dataPolicy];

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
          <Icon name={dataPolicyNotice.icon} style={styles.privacyNoteIcon} />
          <span>{dataPolicyNotice.label}</span>
        </span>
      </header>
      <div {...stylex.props(styles.workspace)}>{children}</div>
    </div>
  );
}
