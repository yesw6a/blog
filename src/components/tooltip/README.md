# Tooltip 文字提示

基于 React Context、Portal 和 StyleX 构建的提示组件。它会根据视口空间自动选择位置，并在滚动或窗口尺寸变化时重新定位。

## 基础用法

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components';

<Tooltip delayDuration={700}>
  <TooltipTrigger asChild>
    <button type="button">悬停查看</button>
  </TooltipTrigger>
  <TooltipContent side="top" align="center">
    提示内容
  </TooltipContent>
</Tooltip>;
```

## 自定义 StyleX 样式

```tsx
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  content: {
    border: '1px solid #1d4ed8',
    backgroundColor: '#2563eb',
  },
});

<TooltipContent style={styles.content}>自定义提示</TooltipContent>;
```

`TooltipContent` 支持 `style`、`arrowStyle`、`hideArrow`、`sideOffset` 和 `alignOffset`。
