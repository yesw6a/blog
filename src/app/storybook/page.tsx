import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components';

export default function StorybookPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">故事书 📚</h1>
        <p className="text-gray-600">这里是故事书页面，展示组件库和设计系统的各种组件用法和示例。</p>
      </div>

      {/* DropdownMenu 组件展示 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">DropdownMenu 组件详细示例</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 基础下拉菜单 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">基础下拉菜单</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>基础菜单</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>编辑</DropdownMenuItem>
                <DropdownMenuItem>复制</DropdownMenuItem>
                <DropdownMenuItem>删除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 带图标的菜单 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">带图标的菜单</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                  <span className="icon-[material-symbols--more-vert] h-4 w-4" />
                  操作
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="flex items-center gap-2">
                  <span className="icon-[material-symbols--edit] h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <span className="icon-[material-symbols--content-copy] h-4 w-4" />
                  复制
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <span className="icon-[material-symbols--delete] h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 不同对齐方式 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">右对齐菜单</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>右对齐</DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>选项 1</DropdownMenuItem>
                <DropdownMenuItem>选项 2</DropdownMenuItem>
                <DropdownMenuItem>选项 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 禁用状态 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">包含禁用项</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>禁用示例</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>可用选项</DropdownMenuItem>
                <DropdownMenuItem disabled>禁用选项</DropdownMenuItem>
                <DropdownMenuItem>另一个可用选项</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 自定义样式 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">自定义样式</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">自定义按钮</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem className="text-blue-600">蓝色文本</DropdownMenuItem>
                <DropdownMenuItem className="text-green-600">绿色文本</DropdownMenuItem>
                <DropdownMenuItem className="text-purple-600">紫色文本</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 长文本处理 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">长文本处理</h3>
            <DropdownMenu>
              <DropdownMenuTrigger>长内容菜单</DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuItem>这是一个很长的菜单项文本，用来测试长文本的显示效果</DropdownMenuItem>
                <DropdownMenuItem>另一个长菜单项，包含更多的描述信息和内容</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>正常长度的项目</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 组件特性说明 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">组件特性</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">交互特性</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>点击触发器打开/关闭菜单</li>
              <li>点击外部区域自动关闭</li>
              <li>ESC 键关闭菜单</li>
              <li>键盘导航支持（Tab、Enter、Space）</li>
              <li>点击菜单项后自动关闭</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">定制性</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>支持受控和非受控模式</li>
              <li>多种对齐方式（start、center、end）</li>
              <li>多种显示方向（top、bottom、left、right）</li>
              <li>可调节间距</li>
              <li>自定义样式类</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
