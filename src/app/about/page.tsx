import { Icon } from '@/components';
import { contentPageStyles as styles } from '@/styles/content-page.stylex';
import * as stylex from '@stylexjs/stylex';

const technologyItems = [
  { icon: 'code' as const, color: styles.blue, label: 'Next.js 15.5.2' },
  { icon: 'code' as const, color: styles.blue, label: 'React 19.1.0' },
  { icon: 'code' as const, color: styles.blue, label: 'TypeScript ^5' },
  { icon: 'palette' as const, color: styles.purple, label: 'StyleX' },
  { icon: 'speed' as const, color: styles.green, label: 'Turbopack' },
];

const featureItems = ['服务端渲染 (SSR)', '静态生成 (SSG)', '热重载开发', '多主题支持', '无障碍访问'];

export default function AboutPage() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.card)}>
        <h1 {...stylex.props(styles.pageTitle)}>关于我们 ℹ️</h1>
        <p {...stylex.props(styles.muted)}>了解这个博客项目的技术架构、开发理念和未来规划。</p>
      </div>

      <div {...stylex.props(styles.card)}>
        <h2 {...stylex.props(styles.sectionTitle)}>项目信息</h2>
        <div {...stylex.props(styles.grid2)}>
          <div>
            <h3 {...stylex.props(styles.heading)}>技术栈</h3>
            <div {...stylex.props(styles.stack2)}>
              {technologyItems.map((item) => (
                <div key={item.label} {...stylex.props(styles.row)}>
                  <Icon name={item.icon} style={[styles.icon16, item.color]} />
                  <span {...stylex.props(styles.small)}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 {...stylex.props(styles.heading)}>核心特性</h3>
            <div {...stylex.props(styles.stack2)}>
              {featureItems.map((item) => (
                <div key={item} {...stylex.props(styles.row)}>
                  <Icon name="checkCircle" style={[styles.icon16, styles.green]} />
                  <span {...stylex.props(styles.small)}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div {...stylex.props(styles.card)}>
        <h2 {...stylex.props(styles.sectionTitle)}>架构设计</h2>
        <div {...stylex.props(styles.stack4)}>
          <div {...stylex.props(styles.featurePanel)}>
            <h3 {...stylex.props(styles.featureTitle)}>布局系统</h3>
            <p {...stylex.props(styles.smallMuted)}>
              采用 Layout
              组件模式，将导航栏和主题切换逻辑提取到根布局中，实现统一的页面框架和导航体验。所有页面都在这个框架内渲染，提供一致的用户界面和交互模式。
            </p>
          </div>
          <div {...stylex.props(styles.featurePanel)}>
            <h3 {...stylex.props(styles.featureTitle)}>组件化开发</h3>
            <p {...stylex.props(styles.smallMuted)}>
              使用现代化的 React 函数组件和 Hooks，结合 TypeScript 提供类型安全。组件采用复合模式设计，如 DropdownMenu
              系列组件，提供灵活的组合方式。
            </p>
          </div>
          <div {...stylex.props(styles.featurePanel)}>
            <h3 {...stylex.props(styles.featureTitle)}>样式系统</h3>
            <p {...stylex.props(styles.smallMuted)}>
              基于 StyleX 的静态提取样式方案，通过类型化样式、主题变量和组件就近定义实现响应式设计与主题切换。
            </p>
          </div>
        </div>
      </div>

      <div {...stylex.props(styles.card)}>
        <h2 {...stylex.props(styles.sectionTitle)}>开发规范</h2>
        <div {...stylex.props(styles.grid2Compact)}>
          <div>
            <h3 {...stylex.props(styles.heading)}>代码规范</h3>
            <ul {...stylex.props(styles.stack1, styles.smallMuted)}>
              <li>• 使用 ES 模块导入/导出</li>
              <li>• TypeScript 严格模式</li>
              <li>• 函数组件优先</li>
              <li>• Hooks 进行状态管理</li>
              <li>• Context API 共享状态</li>
            </ul>
          </div>
          <div>
            <h3 {...stylex.props(styles.heading)}>样式规范</h3>
            <ul {...stylex.props(styles.stack1, styles.smallMuted)}>
              <li>• StyleX 类型化样式优先</li>
              <li>• 样式与组件就近维护</li>
              <li>• 响应式设计原则</li>
              <li>• 无障碍访问支持</li>
              <li>• 语义化 HTML 标签</li>
            </ul>
          </div>
        </div>
      </div>

      <div {...stylex.props(styles.contactCard)}>
        <h2 {...stylex.props(styles.sectionTitle)}>联系我们</h2>
        <p {...stylex.props(styles.muted)} style={{ marginBottom: '1rem' }}>
          如果您对这个项目有任何问题或建议，欢迎通过以下方式联系我们：
        </p>
        <div {...stylex.props(styles.wrapRow)}>
          <button type="button" {...stylex.props(styles.button)}>
            <Icon name="mail" style={styles.icon16} />
            发送邮件
          </button>
          <button type="button" {...stylex.props(styles.button)}>
            <Icon name="code" style={styles.icon16} />
            查看源码
          </button>
          <button type="button" {...stylex.props(styles.button)}>
            <Icon name="bugReport" style={styles.icon16} />
            报告问题
          </button>
        </div>
      </div>
    </div>
  );
}
