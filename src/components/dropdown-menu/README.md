# DropdownMenu 下拉菜单组件

一个功能完整、易于使用的 React 下拉菜单组件，基于 Tailwind CSS 构建。

## 功能特性

- ✅ **完全可控**：支持受控和非受控模式
- ✅ **键盘导航**：支持 ESC 键关闭菜单
- ✅ **点击外部关闭**：自动检测外部点击并关闭菜单
- ✅ **灵活定位**：支持多种对齐方式（start、center、end）和方向（top、bottom、left、right）
- ✅ **自定义样式**：支持传入自定义 className
- ✅ **无障碍访问**：遵循 WAI-ARIA 标准
- ✅ **动画效果**：内置淡入和缩放动画
- ✅ **TypeScript 支持**：完整的类型定义

## 组件结构

```
DropdownMenu/
├── index.tsx                    # 主组件和 Context 提供者
├── types.ts                     # TypeScript 类型定义
├── dropdown-menu-trigger.tsx    # 触发器组件
├── dropdown-menu-content.tsx    # 内容容器组件
├── dropdown-menu-item.tsx       # 菜单项组件
└── dropdown-menu-separator.tsx  # 分隔线组件
```

## 基础用法

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components';

function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        打开菜单
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log('选项 1')}>
          选项 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log('选项 2')}>
          选项 2
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log('更多操作')}>
          更多操作
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## 自定义触发器

使用 `asChild` 属性可以将任何元素作为触发器：

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="custom-button">
      <span>自定义按钮</span>
      <ChevronDownIcon />
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {/* 菜单内容 */}
  </DropdownMenuContent>
</DropdownMenu>
```

## 定位和对齐

### 对齐方式

```tsx
{/* 左对齐（默认） */}
<DropdownMenuContent align="start">
  {/* 内容 */}
</DropdownMenuContent>

{/* 居中对齐 */}
<DropdownMenuContent align="center">
  {/* 内容 */}
</DropdownMenuContent>

{/* 右对齐 */}
<DropdownMenuContent align="end">
  {/* 内容 */}
</DropdownMenuContent>
```

### 显示方向

```tsx
{/* 底部显示（默认） */}
<DropdownMenuContent side="bottom">
  {/* 内容 */}
</DropdownMenuContent>

{/* 顶部显示 */}
<DropdownMenuContent side="top">
  {/* 内容 */}
</DropdownMenuContent>

{/* 左侧显示 */}
<DropdownMenuContent side="left">
  {/* 内容 */}
</DropdownMenuContent>

{/* 右侧显示 */}
<DropdownMenuContent side="right">
  {/* 内容 */}
</DropdownMenuContent>
```

### 间距调整

```tsx
<DropdownMenuContent sideOffset={8}>
  {/* 内容 */}
</DropdownMenuContent>
```

## 受控模式

```tsx
function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        {open ? '关闭菜单' : '打开菜单'}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setOpen(false)}>
          关闭菜单
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## 禁用菜单项

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>正常菜单项</DropdownMenuItem>
  <DropdownMenuItem disabled>禁用的菜单项</DropdownMenuItem>
</DropdownMenuContent>
```

## 自定义样式

```tsx
<DropdownMenuContent className="w-64">
  <DropdownMenuItem className="text-red-600">
    删除
  </DropdownMenuItem>
</DropdownMenuContent>
```

## 复杂示例：主题切换器

```tsx
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const themes = [
    { label: '明亮模式', value: 'light', icon: SunIcon },
    { label: '暗黑模式', value: 'dark', icon: MoonIcon },
    { label: '跟随系统', value: 'system', icon: ComputerIcon },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md">
          <currentTheme.icon className="h-4 w-4" />
          {currentTheme.label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={cn(
              'flex items-center gap-2',
              theme === themeOption.value && 'bg-gray-100'
            )}
          >
            <themeOption.icon className="h-4 w-4" />
            {themeOption.label}
            {theme === themeOption.value && (
              <CheckIcon className="ml-auto h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## API 参考

### DropdownMenu

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 菜单内容 |
| `open` | `boolean` | - | 受控模式下的开启状态 |
| `onOpenChange` | `(open: boolean) => void` | - | 状态变化回调 |

### DropdownMenuTrigger

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 触发器内容 |
| `asChild` | `boolean` | `false` | 是否将子元素作为触发器 |

### DropdownMenuContent

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 菜单内容 |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | 对齐方式 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 显示方向 |
| `sideOffset` | `number` | `4` | 与触发器的间距 |
| `className` | `string` | - | 自定义样式类 |

### DropdownMenuItem

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 菜单项内容 |
| `onClick` | `() => void` | - | 点击事件处理器 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `className` | `string` | - | 自定义样式类 |

### DropdownMenuSeparator

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `className` | `string` | - | 自定义样式类 |

## 键盘快捷键

- `Space` / `Enter`: 触发菜单开关
- `Escape`: 关闭菜单
- `Tab`: 在菜单项之间导航

## 最佳实践

1. **使用语义化的标签**：确保触发器和菜单项具有正确的语义
2. **合理的菜单项数量**：避免菜单项过多，考虑分组或嵌套
3. **一致的交互模式**：在整个应用中保持一致的下拉菜单行为
4. **提供视觉反馈**：确保用户能够清楚地看到当前状态
5. **考虑移动端**：在移动设备上确保触摸友好

## 注意事项

- 确保项目中已正确配置 Tailwind CSS
- 需要安装 `classnames` 依赖
- 组件需要在 React 18+ 环境中使用
- 确保正确导入所需的图标组件