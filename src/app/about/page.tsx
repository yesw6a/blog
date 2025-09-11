export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">关于我们 ℹ️</h1>
        <p className="text-gray-600">
          了解这个博客项目的技术架构、开发理念和未来规划。
        </p>
      </div>

      {/* 项目信息 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">项目信息</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-medium text-gray-700">技术栈</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--code] h-4 w-4 text-blue-600" />
                <span className="text-sm">Next.js 15.5.2</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--code] h-4 w-4 text-blue-600" />
                <span className="text-sm">React 19.1.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--code] h-4 w-4 text-blue-600" />
                <span className="text-sm">TypeScript ^5</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--palette] h-4 w-4 text-purple-600" />
                <span className="text-sm">Tailwind CSS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--speed] h-4 w-4 text-green-600" />
                <span className="text-sm">Turbopack</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 font-medium text-gray-700">核心特性</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--check-circle] h-4 w-4 text-green-600" />
                <span className="text-sm">服务端渲染 (SSR)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--check-circle] h-4 w-4 text-green-600" />
                <span className="text-sm">静态生成 (SSG)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--check-circle] h-4 w-4 text-green-600" />
                <span className="text-sm">热重载开发</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--check-circle] h-4 w-4 text-green-600" />
                <span className="text-sm">多主题支持</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="icon-[material-symbols--check-circle] h-4 w-4 text-green-600" />
                <span className="text-sm">无障碍访问</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 架构设计 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">架构设计</h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-700">布局系统</h3>
            <p className="text-sm text-gray-600">
              采用 Layout 组件模式，将导航栏和主题切换逻辑提取到根布局中，
              实现统一的页面框架和导航体验。所有页面都在这个框架内渲染，
              提供一致的用户界面和交互模式。
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-700">组件化开发</h3>
            <p className="text-sm text-gray-600">
              使用现代化的 React 函数组件和 Hooks，结合 TypeScript 提供类型安全。
              组件采用复合模式设计，如 DropdownMenu 系列组件，提供灵活的组合方式。
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-700">样式系统</h3>
            <p className="text-sm text-gray-600">
              基于 Tailwind CSS 的原子化样式方案，配合 SCSS 模块化支持，
              实现响应式设计和主题切换。支持明亮、暗黑和跟随系统三种主题模式。
            </p>
          </div>
        </div>
      </div>

      {/* 开发规范 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">开发规范</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-medium text-gray-700">代码规范</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 使用 ES 模块导入/导出</li>
              <li>• TypeScript 严格模式</li>
              <li>• 函数组件优先</li>
              <li>• Hooks 进行状态管理</li>
              <li>• Context API 共享状态</li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 font-medium text-gray-700">样式规范</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Tailwind CSS 原子类优先</li>
              <li>• SCSS 模块化补充</li>
              <li>• 响应式设计原则</li>
              <li>• 无障碍访问支持</li>
              <li>• 语义化 HTML 标签</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 联系方式 */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">联系我们</h2>
        <p className="mb-4 text-gray-600">
          如果您对这个项目有任何问题或建议，欢迎通过以下方式联系我们：
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm shadow hover:shadow-md">
            <span className="icon-[material-symbols--mail] h-4 w-4" />
            发送邮件
          </button>
          <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm shadow hover:shadow-md">
            <span className="icon-[material-symbols--code] h-4 w-4" />
            查看源码
          </button>
          <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm shadow hover:shadow-md">
            <span className="icon-[material-symbols--bug-report] h-4 w-4" />
            报告问题
          </button>
        </div>
      </div>
    </div>
  );
}