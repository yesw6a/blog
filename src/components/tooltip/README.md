# Tooltip 组件

一个灵活且功能丰富的 React Tooltip 文字提示组件，基于 React Context 实现状态管理，为用户提供优雅的信息提示体验。

## 概述

Tooltip 组件是一个轻量级、高性能的提示组件，遵循现代 Web 设计规范，提供丰富的自定义选项和无障碍访问支持。组件采用复合组件（Compound Component）模式设计，提供了清晰的 API 和良好的开发体验。

## 特性

- 🎯 **智能定位**: 支持四个方向（top、right、bottom、left）和三种对齐方式（start、center、end）
- ⚡ **性能优化**: 使用 Portal 渲染，避免层级问题，提供流畅的用户体验
- 🎨 **完全可定制**: 支持自定义样式、箭头样式和动画效果
- 🔄 **自动调整**: 自动检测视口边界，智能调整位置防止溢出
- ⌨️ **可访问性**: 支持键盘导航和焦点管理，遵循 ARIA 最佳实践
- 📱 **响应式**: 自适应不同屏幕尺寸，支持滚动和窗口调整
- ⏱️ **延迟控制**: 可配置显示延迟时间，避免误触，提供更好的交互体验
- 🔧 **开发友好**: TypeScript 支持，完善的类型定义和 IntelliSense 提示
- 🌍 **浏览器兼容**: 支持所有现代浏览器，优雅降级
- 📦 **轻量级**: 无外部依赖，仅依赖 React 和 ReactDOM

## 快速开始

### 安装

组件已集成在项目中，可以直接从 `@/components` 导入使用：

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components';
```

### 最简单的例子

```tsx
<Tooltip>
  <TooltipTrigger>
    <button>悬停查看</button>
  </TooltipTrigger>
  <TooltipContent>这是一个提示！</TooltipContent>
</Tooltip>
```

## 使用方法

### 基础用法

最简单的使用方式，默认显示在顶部中间位置：

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components';

function Example() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">悬停查看提示</button>
      </TooltipTrigger>
      <TooltipContent>这是一个提示信息</TooltipContent>
    </Tooltip>
  );
}
```

### 不同位置

```tsx
function PositionExample() {
  return (
    <div className="space-x-4">
      <Tooltip>
        <TooltipTrigger>
          <button>顶部</button>
        </TooltipTrigger>
        <TooltipContent side="top">顶部提示</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <button>右侧</button>
        </TooltipTrigger>
        <TooltipContent side="right">右侧提示</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <button>底部</button>
        </TooltipTrigger>
        <TooltipContent side="bottom">底部提示</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <button>左侧</button>
        </TooltipTrigger>
        <TooltipContent side="left">左侧提示</TooltipContent>
      </Tooltip>
    </div>
  );
}
```

### 自定义样式

```tsx
function CustomStyleExample() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <button>自定义样式</button>
      </TooltipTrigger>
      <TooltipContent className="border border-blue-700 bg-blue-600 text-white" arrowClassName="border-blue-700">
        自定义颜色的提示
      </TooltipContent>
    </Tooltip>
  );
}
```

### 控制显示状态

```tsx
function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger>
        <button>受控提示</button>
      </TooltipTrigger>
      <TooltipContent>受控的提示内容</TooltipContent>
    </Tooltip>
  );
}
```

### 使用 asChild 属性

```tsx
function AsChildExample() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href="#" className="text-blue-500 underline">
          链接元素
        </a>
      </TooltipTrigger>
      <TooltipContent>这是一个链接的提示</TooltipContent>
    </Tooltip>
  );
}
```

## 高级用法

### 自定义延迟时间

不同的使用场景可能需要不同的延迟时间：

```tsx
function DelayExample() {
  return (
    <div className="space-x-4">
      {/* 快速显示，适用于帮助信息 */}
      <Tooltip delayDuration={200}>
        <TooltipTrigger>
          <button>快速提示</button>
        </TooltipTrigger>
        <TooltipContent>帮助信息</TooltipContent>
      </Tooltip>

      {/* 正常延迟，默认值 */}
      <Tooltip delayDuration={700}>
        <TooltipTrigger>
          <button>正常提示</button>
        </TooltipTrigger>
        <TooltipContent>正常提示信息</TooltipContent>
      </Tooltip>

      {/* 较长延迟，防止意外触发 */}
      <Tooltip delayDuration={1000}>
        <TooltipTrigger>
          <button>谨慎提示</button>
        </TooltipTrigger>
        <TooltipContent>重要的操作提示</TooltipContent>
      </Tooltip>
    </div>
  );
}
```

### 复杂内容提示

提示内容可以包含复杂的 JSX 结构：

```tsx
function ComplexContentExample() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="cursor-help rounded border p-3">📊 数据统计</div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <div className="text-sm font-semibold">详细统计</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>总访问量：</span>
              <span className="font-mono">1,234</span>
            </div>
            <div className="flex justify-between">
              <span>今日访问：</span>
              <span className="font-mono text-green-400">89</span>
            </div>
            <div className="flex justify-between">
              <span>跳出率：</span>
              <span className="font-mono">23.5%</span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
```

### 条件性显示

根据条件动态显示或隐藏提示：

```tsx
function ConditionalExample() {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-x-4">
      <Tooltip open={hasError}>
        <TooltipTrigger>
          <input
            type="email"
            className={`rounded border px-3 py-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
            onBlur={(e) => {
              setHasError(!e.target.value.includes('@'));
            }}
            placeholder="输入邮箱"
          />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-red-600 text-white">
          请输入正确的邮箱地址
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <button disabled={isLoading} className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50">
            {isLoading ? '加载中...' : '提交'}
          </button>
        </TooltipTrigger>
        <TooltipContent>{isLoading ? '请稍等...' : '点击提交表单'}</TooltipContent>
      </Tooltip>
    </div>
  );
}
```

### 与其他组件组合

组合使用各种 UI 组件：

```tsx
function CombinedExample() {
  return (
    <div className="space-y-4">
      {/* 与图标组合 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help items-center gap-1">
            <span>设置</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </TooltipTrigger>
        <TooltipContent>配置应用程序的各种设置选项</TooltipContent>
      </Tooltip>

      {/* 与分组组合 */}
      <div className="flex items-center space-x-2">
        <span>通知设置：</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <label className="flex cursor-pointer items-center">
              <input type="checkbox" className="mr-2" />
              <span>邮件提醒</span>
            </label>
          </TooltipTrigger>
          <TooltipContent side="right">开启后将通过邮件发送重要通知</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
```

## API 参考

### Tooltip 属性

| 属性            | 类型                      | 默认值 | 说明                 |
| --------------- | ------------------------- | ------ | -------------------- |
| `children`      | `ReactNode`               | -      | 子组件               |
| `delayDuration` | `number`                  | `700`  | 显示延迟时间（毫秒） |
| `open`          | `boolean`                 | -      | 受控模式下的显示状态 |
| `onOpenChange`  | `(open: boolean) => void` | -      | 状态改变回调         |

### TooltipTrigger 属性

| 属性       | 类型        | 默认值  | 说明                   |
| ---------- | ----------- | ------- | ---------------------- |
| `children` | `ReactNode` | -       | 触发器内容             |
| `asChild`  | `boolean`   | `false` | 是否将属性传递给子元素 |

### TooltipContent 属性

| 属性             | 类型                                     | 默认值     | 说明               |
| ---------------- | ---------------------------------------- | ---------- | ------------------ |
| `children`       | `ReactNode`                              | -          | 提示内容           |
| `side`           | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    | 显示位置           |
| `align`          | `'start' \| 'center' \| 'end'`           | `'center'` | 对齐方式           |
| `sideOffset`     | `number`                                 | `8`        | 距离触发器的偏移量 |
| `alignOffset`    | `number`                                 | `0`        | 对齐偏移量         |
| `className`      | `string`                                 | -          | 自定义样式类名     |
| `arrowClassName` | `string`                                 | -          | 箭头样式类名       |
| `hideArrow`      | `boolean`                                | `false`    | 是否隐藏箭头       |

## 交互行为

- **鼠标悬停**: 鼠标悬停在触发器上时显示提示，离开时隐藏
- **键盘导航**: 使用 Tab 键聚焦到触发器时显示提示，失去焦点时隐藏
- **延迟显示**: 支持配置延迟时间，避免误触
- **智能定位**: 自动检测视口边界，智能调整位置防止溢出
- **响应式**: 窗口大小改变和滚动时自动重新定位

## 样式定制

组件使用 Tailwind CSS 进行样式设置，你可以通过以下方式自定义样式：

1. **使用 className 属性**：传入自定义的 CSS 类名
2. **修改默认样式**：在全局 CSS 中覆盖默认样式
3. **使用 CSS 变量**：定义自定义的颜色变量

### 主题示例

```tsx
// 成功主题
<TooltipContent className="bg-green-600 text-white">
  操作成功！
</TooltipContent>

// 警告主题
<TooltipContent className="bg-yellow-500 text-black">
  请注意这个操作
</TooltipContent>

// 错误主题
<TooltipContent className="bg-red-600 text-white">
  发生了错误
</TooltipContent>

// 暗色主题
<TooltipContent className="bg-gray-800 text-gray-100 border border-gray-600">
  暗色主题提示
</TooltipContent>
```

## 无障碍访问

- 支持键盘导航（Tab 键聚焦）
- 提供适当的焦点管理
- 支持屏幕阅读器
- 遵循 ARIA 最佳实践

## 最佳实践

### 1. 内容原则

- **简洁明了**：保持提示内容简短，一般不超过 1-2 句话
- **有用信息**：提供有价值的内容，避免重复显而易见的信息
- **及时更新**：确保提示内容与当前状态保持同步

### 2. 交互设计

- **合适延迟**：根据使用场景设置合适的延迟时间
- **位置选择**：优先使用顶部或底部，避免遮挡重要内容
- **响应式**：在移动设备上考虑使用替代方案（如模态框）

### 3. 性能优化

- **延迟加载**：对于复杂内容，可以考虑延迟加载
- **内存管理**：遵循 React 最佳实践，及时清理事件监听器
- **批量使用**：在页面中大量使用时考虑性能影响

### 4. 可访问性

- **键盘支持**：确保所有交互都支持键盘操作
- **屏幕阅读器**：为复杂内容添加适当的 ARIA 标签
- **对比度**：确保提示内容具有足够的颜色对比度

## 故障排除

### 常见问题

**Q: 提示不显示或位置不正确？**

A: 检查以下几点：

- 确保父容器没有 `overflow: hidden`
- 检查是否有 CSS 样式冲突
- 验证 Portal 渲染是否正常工作

**Q: 在移动设备上体验不佳？**

A: 考虑使用条件性渲染：

```tsx
// 仅在桌面设备上显示 tooltip
const isDesktop = useMediaQuery('(min-width: 768px)');

return isDesktop ? (
  <Tooltip>{/* tooltip 内容 */}</Tooltip>
) : (
  <button onClick={() => setShowModal(true)}>{/* 移动设备使用模态框 */}</button>
);
```

**Q: 性能问题或内存泄漏？**

A: 组件已经内置了清理机制，但在以下情况下需要额外注意：

- 避免在循环中创建大量 tooltip 实例
- 使用 `React.memo` 优化重渲染
- 合理设置 `delayDuration` 参数

## 技术实现

组件采用以下技术实现：

- **React Context**：管理组件内部状态和通信
- **Portal 渲染**：使用 `createPortal` 避免层级和样式问题
- **位置计算**：动态计算最优显示位置，支持边界检测
- **事件处理**：支持鼠标和键盘事件，提供完整的交互体验
- **响应式**：监听窗口大小和滚动事件，实时调整位置

## 更新日志

- **v1.0.0**: 初始版本，包含所有基础功能
  - 支持四个方向和三种对齐方式
  - 完整的 TypeScript 类型支持
  - 无障碍访问和键盘导航支持
  - Portal 渲染和智能定位
  - 自定义样式和动画效果

---

如果您在使用过程中遇到问题或有改进建议，欢迎提供反馈！
