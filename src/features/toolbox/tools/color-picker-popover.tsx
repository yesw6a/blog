'use client';

import { useEffect, useId, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import type { CSSProperties, ReactElement } from 'react';

import Icon from '@/components/icon';
import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';

import { colorPickerPopoverStyles as styles } from './color-picker-popover.styles';
import pickerCss from './color-picker-popover.module.css';

type ColorPickerPopoverProps = {
  label: string;
  value: string;
  open: boolean;
  trigger: ReactElement;
  onChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
};

const APP_THEME_ROOT_ID = 'app-theme-root';

const hexToRgb = (value: string) => ({
  r: Number.parseInt(value.slice(1, 3), 16),
  g: Number.parseInt(value.slice(3, 5), 16),
  b: Number.parseInt(value.slice(5, 7), 16),
});

export default function ColorPickerPopover({
  label,
  value,
  open,
  trigger,
  onChange,
  onOpenChange,
}: ColorPickerPopoverProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const titleId = useId();
  const rgb = hexToRgb(value);

  useEffect(() => {
    setPortalContainer(document.getElementById(APP_THEME_ROOT_ID));
  }, []);

  const contentStyleProps = stylex.props(styles.content);
  const swatchStyleProps = stylex.props(styles.currentSwatch);

  return (
    <Popover.Root open={open} modal={false} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      {portalContainer ? (
        <Popover.Portal container={portalContainer}>
          <Popover.Content
            aria-labelledby={titleId}
            side="bottom"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            className={`${pickerCss.content} ${contentStyleProps.className ?? ''}`}
            style={
              {
                ...contentStyleProps.style,
                '--picker-focus': 'currentColor',
              } as CSSProperties
            }
          >
            <header {...stylex.props(styles.header)}>
              <div {...stylex.props(styles.headingGroup)}>
                <span
                  aria-hidden
                  className={swatchStyleProps.className}
                  style={{ ...swatchStyleProps.style, backgroundColor: value }}
                />
                <div {...stylex.props(styles.headingCopy)}>
                  <h3 id={titleId} {...stylex.props(styles.title)}>
                    选择{label}
                  </h3>
                  <p {...stylex.props(styles.currentValue)}>{value}</p>
                </div>
              </div>

              <Popover.Close asChild>
                <button type="button" aria-label="关闭颜色选择器" {...stylex.props(styles.closeButton)}>
                  <Icon name="close" />
                </button>
              </Popover.Close>
            </header>

            <div {...stylex.props(styles.body)}>
              <div role="group" aria-label={`${label}色盘`} {...stylex.props(styles.pickerFrame)}>
                <HexColorPicker
                  className={pickerCss.picker}
                  color={value}
                  onChange={(nextValue) => onChange(nextValue.toLocaleUpperCase('en-US'))}
                />
              </div>

              <dl {...stylex.props(styles.valueGrid)}>
                <div {...stylex.props(styles.valueItem)}>
                  <dt {...stylex.props(styles.valueLabel)}>HEX</dt>
                  <dd {...stylex.props(styles.valueText)}>{value}</dd>
                </div>
                <div {...stylex.props(styles.valueItem, styles.valueItemSeparated)}>
                  <dt {...stylex.props(styles.valueLabel)}>RGB</dt>
                  <dd {...stylex.props(styles.valueText)}>
                    {rgb.r}, {rgb.g}, {rgb.b}
                  </dd>
                </div>
              </dl>

              <p {...stylex.props(styles.hint)}>拖动色盘或使用方向键精调，颜色会实时应用。</p>
            </div>

            <Popover.Arrow width={12} height={6} {...stylex.props(styles.arrow)} />
          </Popover.Content>
        </Popover.Portal>
      ) : null}
    </Popover.Root>
  );
}
