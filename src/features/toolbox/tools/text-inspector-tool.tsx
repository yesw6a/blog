'use client';

import { useMemo, useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from '../tool-ui.styles';
import { useCopyFeedback } from '../use-copy-feedback';

const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh-CN', { granularity: 'word' }) : null;

const countWords = (value: string) => {
  if (segmenter) return [...segmenter.segment(value)].filter((item) => item.isWordLike).length;
  return value.trim() ? value.trim().split(/\s+/).length : 0;
};

export default function TextInspectorTool() {
  const [text, setText] = useState('把一段文本放在这里，查看字符、词语、行数和字节统计。');
  const { copyStatus, copyText } = useCopyFeedback();

  const metrics = useMemo(
    () => [
      ['字符', [...text].length],
      ['汉字', text.match(/\p{Script=Han}/gu)?.length ?? 0],
      ['词语', countWords(text)],
      ['行数', text ? text.split(/\r\n?|\n/).length : 0],
      ['UTF-8 字节', new TextEncoder().encode(text).length],
      ['非空白字符', text.replace(/\s/gu, '').length],
    ],
    [text],
  );

  const trimLines = () =>
    setText((value) =>
      value
        .split(/\r\n?|\n/)
        .map((line) => line.trim())
        .join('\n'),
    );
  const collapseSpaces = () => setText((value) => value.replace(/[\t ]+/g, ' '));
  const normalizeBlankLines = () => setText((value) => value.replace(/\n{3,}/g, '\n\n'));

  return (
    <div>
      <section aria-labelledby="text-input-title" {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.field)}>
          <label id="text-input-title" htmlFor="text-inspector-input" {...stylex.props(styles.label)}>
            文本内容
          </label>
          <textarea
            id="text-inspector-input"
            value={text}
            onChange={(event) => setText(event.currentTarget.value)}
            {...stylex.props(styles.textarea)}
          />
        </div>
        <div {...stylex.props(styles.actions)}>
          <button type="button" onClick={trimLines} {...stylex.props(styles.button, styles.buttonPrimary)}>
            清理行首尾空白
          </button>
          <button type="button" onClick={collapseSpaces} {...stylex.props(styles.button)}>
            合并连续空格
          </button>
          <button type="button" onClick={normalizeBlankLines} {...stylex.props(styles.button)}>
            压缩空行
          </button>
          <button type="button" onClick={() => void copyText(text)} {...stylex.props(styles.button)}>
            复制文本
          </button>
          <button type="button" onClick={() => setText('')} {...stylex.props(styles.button, styles.buttonDanger)}>
            清空
          </button>
        </div>
        <p aria-live="polite" {...stylex.props(styles.status)}>
          {copyStatus}
        </p>
      </section>

      <section aria-labelledby="text-metrics-title" {...stylex.props(styles.panel, styles.panelWide)}>
        <h2 id="text-metrics-title" {...stylex.props(styles.label)}>
          文本统计
        </h2>
        <div {...stylex.props(styles.metrics, styles.fieldSpaced)}>
          {metrics.map(([label, value]) => (
            <div key={label} {...stylex.props(styles.metric)}>
              <span {...stylex.props(styles.metricValue)}>{value}</span>
              <span {...stylex.props(styles.metricLabel)}>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
