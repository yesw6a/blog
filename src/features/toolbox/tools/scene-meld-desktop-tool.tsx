import Icon from '@/components/icon';
import * as stylex from '@stylexjs/stylex';

import { sceneMeldDesktopStyles as styles } from './scene-meld-desktop-tool.styles';

const RELEASES_URL = 'https://github.com/yesw6a/scene-meld/releases/latest';
const REPOSITORY_URL = 'https://github.com/yesw6a/scene-meld';

const PLATFORMS = ['Windows x64', 'macOS Intel', 'macOS Apple Silicon', 'Linux x64'] as const;

const REQUIREMENTS = [
  '自备兼容的图片 API Endpoint 与 API Key',
  'Endpoint 支持 images/generations 与 images/edits',
  '图片模型固定为 gpt-image-2',
] as const;

type DetailListProps = {
  title: string;
  items: readonly string[];
};

function DetailList({ title, items }: DetailListProps) {
  return (
    <section {...stylex.props(styles.detailPanel)}>
      <h2 {...stylex.props(styles.sectionTitle)}>{title}</h2>
      <ul {...stylex.props(styles.detailList)}>
        {items.map((item) => (
          <li key={item} {...stylex.props(styles.detailItem)}>
            <span aria-hidden {...stylex.props(styles.detailMarker)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SceneMeldDesktopTool() {
  return (
    <div {...stylex.props(styles.page)}>
      <section aria-labelledby="scene-meld-launch-title" {...stylex.props(styles.launchPanel)}>
        <div>
          <div {...stylex.props(styles.productRow)}>
            <span {...stylex.props(styles.productName)}>SceneMeld</span>
            <span {...stylex.props(styles.modeLabel)}>桌面客户端</span>
          </div>
          <h2 id="scene-meld-launch-title" {...stylex.props(styles.heading)}>
            绕过浏览器跨域，直接在本机创作
          </h2>
          <p {...stylex.props(styles.description)}>
            SceneMeld 提供对话生图、参考图编辑、批量生成与分镜创作。客户端使用本机网络请求，不依赖浏览器 CORS。
          </p>
          <div {...stylex.props(styles.actions)}>
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 SceneMeld 客户端下载（在新标签页打开）"
              {...stylex.props(styles.action, styles.primaryAction)}
            >
              查看客户端下载
              <span aria-hidden {...stylex.props(styles.externalMark)}>
                ↗
              </span>
            </a>
            <a
              href={REPOSITORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 SceneMeld 源码仓库（在新标签页打开）"
              {...stylex.props(styles.action, styles.secondaryAction)}
            >
              查看源码
              <span aria-hidden {...stylex.props(styles.externalMark)}>
                ↗
              </span>
            </a>
          </div>
        </div>

        <div {...stylex.props(styles.connectionCard)}>
          <h2 {...stylex.props(styles.sectionTitle)}>连接路径</h2>
          <div role="img" aria-label="SceneMeld 客户端从本机直连兼容 Endpoint" {...stylex.props(styles.connectionPath)}>
            <span {...stylex.props(styles.connectionNode)}>SceneMeld 客户端</span>
            <span aria-hidden {...stylex.props(styles.connectionArrow)}>
              →
            </span>
            <span {...stylex.props(styles.connectionNode)}>兼容 Endpoint</span>
          </div>
          <p {...stylex.props(styles.connectionNote)}>API Key、提示词和图片不会经过本站服务器。</p>
        </div>
      </section>

      <div {...stylex.props(styles.detailsGrid)}>
        <DetailList title="支持平台" items={PLATFORMS} />
        <DetailList title="开始前准备" items={REQUIREMENTS} />
      </div>

      <aside aria-labelledby="scene-meld-install-note" {...stylex.props(styles.warning)}>
        <Icon name="warning" style={styles.warningIcon} />
        <div {...stylex.props(styles.warningText)}>
          <h2 id="scene-meld-install-note" {...stylex.props(styles.sectionTitle)}>
            安装提示
          </h2>
          <p {...stylex.props(styles.warningDescription)}>
            当前 Windows 构建未配置 Authenticode，macOS 构建尚未完成公证，安装时可能触发 SmartScreen 或
            Gatekeeper。请在下载前核对仓库来源与发布说明。
          </p>
        </div>
      </aside>
    </div>
  );
}
