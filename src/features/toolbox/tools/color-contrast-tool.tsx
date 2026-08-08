'use client';

import { useMemo, useState } from 'react';

import type { CSSProperties } from 'react';

import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from '../tool-ui.styles';
import ColorPickerPopover from './color-picker-popover';

type Rgb = { r: number; g: number; b: number };
type ActivePicker = 'foreground' | 'background' | null;

type ColorFieldProps = {
  id: string;
  label: string;
  value: string;
  pickerValue: string;
  helperId?: string;
  invalid: boolean;
  pickerOpen: boolean;
  onChange: (value: string) => void;
  onPickerChange: (value: string) => void;
  onPickerOpenChange: (open: boolean) => void;
};

const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)));

const parseColor = (value: string): Rgb | null => {
  const normalized = value.trim().toLocaleLowerCase('en-US');
  const shortHex = normalized.match(/^#([\da-f])([\da-f])([\da-f])$/i);
  if (shortHex) {
    return {
      r: Number.parseInt(shortHex[1] + shortHex[1], 16),
      g: Number.parseInt(shortHex[2] + shortHex[2], 16),
      b: Number.parseInt(shortHex[3] + shortHex[3], 16),
    };
  }

  const hex = normalized.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (hex) {
    return {
      r: Number.parseInt(hex[1], 16),
      g: Number.parseInt(hex[2], 16),
      b: Number.parseInt(hex[3], 16),
    };
  }

  const rgb = normalized.match(/^rgb\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/);
  if (!rgb) return null;
  return { r: clamp(Number(rgb[1])), g: clamp(Number(rgb[2])), b: clamp(Number(rgb[3])) };
};

const toHex = ({ r, g, b }: Rgb) =>
  `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`.toLocaleUpperCase('en-US');

const luminance = ({ r, g, b }: Rgb) => {
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

function ColorField({
  id,
  label,
  value,
  pickerValue,
  helperId,
  invalid,
  pickerOpen,
  onChange,
  onPickerChange,
  onPickerOpenChange,
}: ColorFieldProps) {
  const swatchStyleProps = stylex.props(styles.colorSwatch);

  return (
    <div {...stylex.props(styles.field, styles.fieldSpaced)}>
      <label htmlFor={id} {...stylex.props(styles.label)}>
        {label}
      </label>
      <div {...stylex.props(styles.colorControl, invalid && styles.colorControlInvalid)}>
        <ColorPickerPopover
          label={label}
          value={pickerValue}
          open={pickerOpen}
          onChange={onPickerChange}
          onOpenChange={onPickerOpenChange}
          trigger={
            <button
              type="button"
              aria-label={`打开${label}选择器，当前颜色 ${pickerValue}`}
              {...stylex.props(styles.colorSwatchButton)}
            >
              <span
                aria-hidden
                className={swatchStyleProps.className}
                style={{ ...swatchStyleProps.style, backgroundColor: pickerValue } as CSSProperties}
              />
            </button>
          }
        />
        <input
          id={id}
          type="text"
          value={value}
          aria-describedby={helperId}
          aria-invalid={invalid}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => onChange(event.currentTarget.value)}
          {...stylex.props(styles.colorTextInput)}
        />
      </div>
    </div>
  );
}

export default function ColorContrastTool() {
  const [foreground, setForeground] = useState('#1F1D1A');
  const [background, setBackground] = useState('#FFFDF9');
  const [foregroundPicker, setForegroundPicker] = useState('#1F1D1A');
  const [backgroundPicker, setBackgroundPicker] = useState('#FFFDF9');
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const updateForegroundText = (value: string) => {
    setForeground(value);
    const parsed = parseColor(value);
    if (parsed) setForegroundPicker(toHex(parsed));
  };

  const updateBackgroundText = (value: string) => {
    setBackground(value);
    const parsed = parseColor(value);
    if (parsed) setBackgroundPicker(toHex(parsed));
  };

  const updateForegroundPicker = (value: string) => {
    const normalized = value.toLocaleUpperCase('en-US');
    setForegroundPicker(normalized);
    setForeground(normalized);
  };

  const updateBackgroundPicker = (value: string) => {
    const normalized = value.toLocaleUpperCase('en-US');
    setBackgroundPicker(normalized);
    setBackground(normalized);
  };

  const result = useMemo(() => {
    const foregroundRgb = parseColor(foreground);
    const backgroundRgb = parseColor(background);
    if (!foregroundRgb || !backgroundRgb) return null;
    const lighter = Math.max(luminance(foregroundRgb), luminance(backgroundRgb));
    const darker = Math.min(luminance(foregroundRgb), luminance(backgroundRgb));
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      foregroundRgb,
      backgroundRgb,
      foregroundHex: toHex(foregroundRgb),
      backgroundHex: toHex(backgroundRgb),
      ratio,
    };
  }, [background, foreground]);

  const foregroundInvalid = parseColor(foreground) === null;
  const backgroundInvalid = parseColor(background) === null;
  const previewStyleProps = stylex.props(styles.preview);

  return (
    <div {...stylex.props(styles.splitGrid)}>
      <section aria-labelledby="color-input-title" {...stylex.props(styles.panel)}>
        <h2 id="color-input-title" {...stylex.props(styles.label)}>
          颜色输入
        </h2>
        <ColorField
          id="foreground-color"
          label="文字颜色"
          value={foreground}
          pickerValue={foregroundPicker}
          helperId="color-format-helper"
          invalid={foregroundInvalid}
          pickerOpen={activePicker === 'foreground'}
          onChange={updateForegroundText}
          onPickerChange={updateForegroundPicker}
          onPickerOpenChange={(open) => setActivePicker(open ? 'foreground' : null)}
        />
        <ColorField
          id="background-color"
          label="背景颜色"
          value={background}
          pickerValue={backgroundPicker}
          helperId="color-format-helper"
          invalid={backgroundInvalid}
          pickerOpen={activePicker === 'background'}
          onChange={updateBackgroundText}
          onPickerChange={updateBackgroundPicker}
          onPickerOpenChange={(open) => setActivePicker(open ? 'background' : null)}
        />
        <span id="color-format-helper" {...stylex.props(styles.helper)}>
          支持 #RGB、#RRGGBB 或 rgb(0, 0, 0)。点击色块打开完整色盘。
        </span>
        {!result ? (
          <p role="alert" {...stylex.props(styles.status, styles.error)}>
            请输入有效的 HEX 或 RGB 颜色，或通过色盘重新选择。
          </p>
        ) : null}
      </section>

      <section aria-labelledby="contrast-preview-title" {...stylex.props(styles.panel)}>
        <h2 id="contrast-preview-title" {...stylex.props(styles.label)}>
          实时预览
        </h2>
        <div
          className={previewStyleProps.className}
          style={{
            ...previewStyleProps.style,
            color: result?.foregroundHex ?? undefined,
            backgroundColor: result?.backgroundHex ?? undefined,
          }}
        >
          清晰的文字让内容更容易阅读
        </div>
      </section>

      <section aria-labelledby="contrast-result-title" {...stylex.props(styles.panel, styles.panelWide)}>
        <h2 id="contrast-result-title" {...stylex.props(styles.label)}>
          WCAG 对比度结果
        </h2>
        {result ? (
          <div {...stylex.props(styles.resultList, styles.fieldSpaced)}>
            {[
              ['标准化颜色', `${result.foregroundHex} / ${result.backgroundHex}`],
              ['对比度', `${result.ratio.toFixed(2)}:1`],
              ['普通文本 AA', result.ratio >= 4.5 ? '通过' : '未通过'],
              ['普通文本 AAA', result.ratio >= 7 ? '通过' : '未通过'],
              ['大号文本 AA', result.ratio >= 3 ? '通过' : '未通过'],
              ['大号文本 AAA', result.ratio >= 4.5 ? '通过' : '未通过'],
            ].map(([label, value]) => (
              <div key={label} {...stylex.props(styles.resultRow)}>
                <span {...stylex.props(styles.resultLabel)}>{label}</span>
                <span {...stylex.props(styles.resultValue)}>{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p {...stylex.props(styles.status)}>修正颜色格式后即可查看结果。</p>
        )}
      </section>
    </div>
  );
}
