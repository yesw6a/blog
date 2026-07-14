import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
} from '@/components';
import { contentPageStyles as pageStyles } from '@/styles/content-page.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  menuItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
});

export default function StorybookPage() {
  return (
    <div {...stylex.props(pageStyles.page)}>
      <div {...stylex.props(pageStyles.card)}>
        <h1 {...stylex.props(pageStyles.pageTitle)}>故事书 📚</h1>
        <p {...stylex.props(pageStyles.muted)}>这里是故事书页面，展示组件库和设计系统的各种组件用法和示例。</p>
      </div>

      <div {...stylex.props(pageStyles.card)}>
        <h2 {...stylex.props(pageStyles.sectionTitle)}>DropdownMenu 组件详细示例</h2>

        <div {...stylex.props(pageStyles.grid3)}>
          <div {...stylex.props(pageStyles.stack3)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>基础下拉菜单</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>基础菜单</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>编辑</DropdownMenuItem>
                <DropdownMenuItem>复制</DropdownMenuItem>
                <DropdownMenuItem>删除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div {...stylex.props(pageStyles.stack3)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>带图标的菜单</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" {...stylex.props(pageStyles.outlineButton)}>
                  <Icon name="moreVertical" style={pageStyles.icon16} />
                  操作
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem style={styles.menuItemRow}>
                  <Icon name="edit" style={pageStyles.icon16} />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem style={styles.menuItemRow}>
                  <Icon name="copy" style={pageStyles.icon16} />
                  复制
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={[styles.menuItemRow, pageStyles.red]}>
                  <Icon name="delete" style={pageStyles.icon16} />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div {...stylex.props(pageStyles.stack3)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>右对齐菜单</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>右对齐</DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>选项 1</DropdownMenuItem>
                <DropdownMenuItem>选项 2</DropdownMenuItem>
                <DropdownMenuItem>选项 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div {...stylex.props(pageStyles.stack3)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>包含禁用项</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>禁用示例</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>可用选项</DropdownMenuItem>
                <DropdownMenuItem disabled>禁用选项</DropdownMenuItem>
                <DropdownMenuItem>另一个可用选项</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div {...stylex.props(pageStyles.stack3)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>自定义样式</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" {...stylex.props(pageStyles.primaryButton)}>
                  自定义按钮
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={pageStyles.width56}>
                <DropdownMenuItem style={pageStyles.blue}>蓝色文本</DropdownMenuItem>
                <DropdownMenuItem style={pageStyles.green}>绿色文本</DropdownMenuItem>
                <DropdownMenuItem style={pageStyles.purple}>紫色文本</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div {...stylex.props(pageStyles.stack3)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>长文本处理</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>长内容菜单</DropdownMenuTrigger>
              <DropdownMenuContent style={pageStyles.width64}>
                <DropdownMenuItem>这是一个很长的菜单项文本，用来测试长文本的显示效果</DropdownMenuItem>
                <DropdownMenuItem>另一个长菜单项，包含更多的描述信息和内容</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>正常长度的项目</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div {...stylex.props(pageStyles.card)}>
        <h2 {...stylex.props(pageStyles.sectionTitle)}>组件特性</h2>
        <div {...stylex.props(pageStyles.grid2Compact)}>
          <div {...stylex.props(pageStyles.stack2)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>交互特性</h3>
            <ul {...stylex.props(pageStyles.stack1, pageStyles.listDisc, pageStyles.smallMuted)}>
              <li>点击触发器打开/关闭菜单</li>
              <li>点击外部区域自动关闭</li>
              <li>ESC 键关闭菜单</li>
              <li>键盘导航支持（Tab、Enter、Space）</li>
              <li>点击菜单项后自动关闭</li>
            </ul>
          </div>
          <div {...stylex.props(pageStyles.stack2)}>
            <h3 {...stylex.props(pageStyles.compactHeading)}>定制性</h3>
            <ul {...stylex.props(pageStyles.stack1, pageStyles.listDisc, pageStyles.smallMuted)}>
              <li>支持受控和非受控模式</li>
              <li>多种对齐方式（start、center、end）</li>
              <li>多种显示方向（top、bottom、left、right）</li>
              <li>可调节间距</li>
              <li>类型化 StyleX 样式扩展</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
