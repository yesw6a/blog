# DropdownMenu 下拉菜单

基于 React 复合组件与 StyleX 构建的下拉菜单，支持受控/非受控状态、键盘触发、点击外部关闭、四个显示方向和三种对齐方式。

## 基础用法

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components';

<DropdownMenu>
  <DropdownMenuTrigger>打开菜单</DropdownMenuTrigger>
  <DropdownMenuContent align="start" side="bottom" sideOffset={4}>
    <DropdownMenuItem onClick={() => console.log('edit')}>编辑</DropdownMenuItem>
    <DropdownMenuItem>复制</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem disabled>不可用</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

## 自定义 StyleX 样式

组件通过 `style` 接收 `StyleXStyles`，而不是 CSS 类名：

```tsx
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  content: { width: '16rem' },
  danger: { color: '#dc2626' },
});

<DropdownMenuContent style={styles.content}>
  <DropdownMenuItem style={styles.danger}>删除</DropdownMenuItem>
</DropdownMenuContent>;
```

`DropdownMenuContent`、`DropdownMenuItem` 和 `DropdownMenuSeparator` 均支持类型化 `style` 扩展。
