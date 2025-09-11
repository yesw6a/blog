'use client';

import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTooltip } from './index';
import { TooltipContentProps } from './types';

type Side = 'top' | 'right' | 'bottom' | 'left';
type PositionResult = {
  x: number;
  y: number;
  finalSide: Side;
  finalAlign: 'start' | 'center' | 'end';
};

const TooltipContent: FC<TooltipContentProps> = ({
  children,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  className = '',
  arrowClassName = '',
  hideArrow = false,
}) => {
  const { open, triggerRef, contentRef } = useTooltip();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<PositionResult>({
    x: 0,
    y: 0,
    finalSide: side,
    finalAlign: align,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 计算指定方向的空间是否足够
  const calculateSpaceAvailable = (
    triggerRect: DOMRect,
    contentWidth: number,
    contentHeight: number,
    testSide: Side
  ) => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const padding = 8;

    switch (testSide) {
      case 'top':
        return triggerRect.top - sideOffset >= contentHeight + padding;
      case 'bottom':
        return viewport.height - triggerRect.bottom - sideOffset >= contentHeight + padding;
      case 'left':
        return triggerRect.left - sideOffset >= contentWidth + padding;
      case 'right':
        return viewport.width - triggerRect.right - sideOffset >= contentWidth + padding;
    }
  };

  // 计算单个方向的位置
  const calculatePositionForSide = (
    triggerRect: DOMRect,
    contentWidth: number,
    contentHeight: number,
    testSide: Side,
    testAlign: 'start' | 'center' | 'end'
  ): { x: number; y: number } => {
    let x = 0;
    let y = 0;

    // 计算基础位置
    switch (testSide) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.top - sideOffset - contentHeight;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.bottom + sideOffset;
        break;
      case 'left':
        x = triggerRect.left - sideOffset - contentWidth;
        y = triggerRect.top + triggerRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + sideOffset;
        y = triggerRect.top + triggerRect.height / 2;
        break;
    }

    // 调整对齐方式
    if (testSide === 'top' || testSide === 'bottom') {
      switch (testAlign) {
        case 'start':
          x = triggerRect.left + alignOffset;
          break;
        case 'end':
          x = triggerRect.right - contentWidth - alignOffset;
          break;
        case 'center':
        default:
          x = triggerRect.left + triggerRect.width / 2 - contentWidth / 2 + alignOffset;
          break;
      }
    } else {
      switch (testAlign) {
        case 'start':
          y = triggerRect.top + alignOffset;
          break;
        case 'end':
          y = triggerRect.bottom - contentHeight - alignOffset;
          break;
        case 'center':
        default:
          y = triggerRect.top + triggerRect.height / 2 - contentHeight / 2 + alignOffset;
          break;
      }
    }

    return { x, y };
  };

  // 智能计算最佳位置
  const calculateOptimalPosition = (
    triggerRect: DOMRect,
    contentWidth: number,
    contentHeight: number
  ): PositionResult => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const padding = 8;

    // 方向优先级：用户指定的方向 -> 相对方向 -> 其他方向
    const sidePreference: Side[] = [
      side, // 用户指定的首选方向
    ];

    // 添加其他方向作为备选
    const allSides: Side[] = ['top', 'bottom', 'left', 'right'];
    allSides.forEach(s => {
      if (s !== side) {
        sidePreference.push(s);
      }
    });

    // 对齐方式优先级
    const allAligns = ['start', 'center', 'end'] as const;
    const alignOptions: ('start' | 'center' | 'end')[] = [align];
    allAligns.forEach(a => {
      if (a !== align) {
        alignOptions.push(a);
      }
    });
    const alignPreference = alignOptions;

    // 尝试找到最佳位置
    for (const testSide of sidePreference) {
      for (const testAlign of alignPreference) {
        // 检查空间是否足够
        if (!calculateSpaceAvailable(triggerRect, contentWidth, contentHeight, testSide)) {
          continue;
        }

        const pos = calculatePositionForSide(
          triggerRect,
          contentWidth,
          contentHeight,
          testSide,
          testAlign
        );

        // 检查是否在视口范围内
        const inViewport =
          pos.x >= padding &&
          pos.x + contentWidth <= viewport.width - padding &&
          pos.y >= padding &&
          pos.y + contentHeight <= viewport.height - padding;

        if (inViewport) {
          return {
            x: pos.x,
            y: pos.y,
            finalSide: testSide,
            finalAlign: testAlign,
          };
        }
      }
    }

    // 如果没有找到完全合适的位置，使用用户指定的方向并调整到视口内
    const fallbackPos = calculatePositionForSide(
      triggerRect,
      contentWidth,
      contentHeight,
      side,
      align
    );

    return {
      x: Math.max(padding, Math.min(fallbackPos.x, viewport.width - contentWidth - padding)),
      y: Math.max(padding, Math.min(fallbackPos.y, viewport.height - contentHeight - padding)),
      finalSide: side,
      finalAlign: align,
    };
  };

  useEffect(() => {
    if (!open || !triggerRef.current || !mounted) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentElement = contentRef.current;

      if (!contentElement) return;

      // 首先显示元素以获取真实尺寸
      const originalStyle = {
        visibility: contentElement.style.visibility,
        position: contentElement.style.position,
        top: contentElement.style.top,
        left: contentElement.style.left,
      };

      contentElement.style.visibility = 'hidden';
      contentElement.style.position = 'fixed';
      contentElement.style.top = '0px';
      contentElement.style.left = '0px';

      const contentRect = contentElement.getBoundingClientRect();
      const contentWidth = contentRect.width;
      const contentHeight = contentRect.height;

      // 恢复原始样式
      Object.assign(contentElement.style, originalStyle);

      // 计算最佳位置
      const optimalPosition = calculateOptimalPosition(triggerRect, contentWidth, contentHeight);
      setPosition(optimalPosition);
    };

    // 延迟执行以确保DOM已经渲染
    const timer = setTimeout(updatePosition, 0);

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open, side, align, sideOffset, alignOffset, mounted]);

  if (!mounted || !open) return null;

  const getArrowPosition = (currentSide: Side) => {
    const arrowSize = 6;
    const arrowStyle: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
    };

    switch (currentSide) {
      case 'top':
        arrowStyle.bottom = -arrowSize;
        arrowStyle.left = '50%';
        arrowStyle.transform = 'translateX(-50%)';
        arrowStyle.borderLeft = `${arrowSize}px solid transparent`;
        arrowStyle.borderRight = `${arrowSize}px solid transparent`;
        arrowStyle.borderTop = `${arrowSize}px solid rgb(15 23 42)`;
        break;
      case 'bottom':
        arrowStyle.top = -arrowSize;
        arrowStyle.left = '50%';
        arrowStyle.transform = 'translateX(-50%)';
        arrowStyle.borderLeft = `${arrowSize}px solid transparent`;
        arrowStyle.borderRight = `${arrowSize}px solid transparent`;
        arrowStyle.borderBottom = `${arrowSize}px solid rgb(15 23 42)`;
        break;
      case 'left':
        arrowStyle.right = -arrowSize;
        arrowStyle.top = '50%';
        arrowStyle.transform = 'translateY(-50%)';
        arrowStyle.borderTop = `${arrowSize}px solid transparent`;
        arrowStyle.borderBottom = `${arrowSize}px solid transparent`;
        arrowStyle.borderLeft = `${arrowSize}px solid rgb(15 23 42)`;
        break;
      case 'right':
        arrowStyle.left = -arrowSize;
        arrowStyle.top = '50%';
        arrowStyle.transform = 'translateY(-50%)';
        arrowStyle.borderTop = `${arrowSize}px solid transparent`;
        arrowStyle.borderBottom = `${arrowSize}px solid transparent`;
        arrowStyle.borderRight = `${arrowSize}px solid rgb(15 23 42)`;
        break;
    }

    return arrowStyle;
  };

  const content = (
    <div
      ref={contentRef}
      className={`fade-in-0 zoom-in-95 fixed z-50 animate-in rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-md ${className}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {children}
      {!hideArrow && (
        <div
          className={`tooltip-arrow ${arrowClassName}`}
          style={getArrowPosition(position.finalSide)}
        />
      )}
    </div>
  );

  return createPortal(content, document.body);
};

export default TooltipContent;
