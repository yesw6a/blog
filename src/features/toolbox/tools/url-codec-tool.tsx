'use client';

import { useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from '../tool-ui.styles';
import { useCopyFeedback } from '../use-copy-feedback';

const parseQuery = (value: string) => {
  const candidate = value.includes('?') ? value : `https://local.invalid/?${value.replace(/^\?/, '')}`;
  const url = new URL(candidate, 'https://local.invalid');
  const result: Record<string, string | string[]> = {};

  for (const [key, item] of url.searchParams) {
    const current = result[key];
    if (current === undefined) result[key] = item;
    else if (Array.isArray(current)) current.push(item);
    else result[key] = [current, item];
  }

  return JSON.stringify(result, null, 2);
};

export default function UrlCodecTool() {
  const [input, setInput] = useState('https://example.com/search?q=工具箱&tag=nextjs');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { copyStatus, copyText } = useCopyFeedback();

  const run = (operation: () => string) => {
    try {
      setOutput(operation());
      setError('');
    } catch (cause) {
      setOutput('');
      setError(cause instanceof Error ? cause.message : 'URL 处理失败');
    }
  };

  return (
    <div {...stylex.props(styles.splitGrid)}>
      <section aria-labelledby="url-input-title" {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.field)}>
          <label id="url-input-title" htmlFor="url-input" {...stylex.props(styles.label)}>
            URL 或文本
          </label>
          <textarea
            id="url-input"
            value={input}
            spellCheck={false}
            onChange={(event) => setInput(event.currentTarget.value)}
            {...stylex.props(styles.textarea, styles.textareaCompact)}
          />
        </div>
        <div {...stylex.props(styles.actions)}>
          <button
            type="button"
            onClick={() => run(() => encodeURIComponent(input))}
            {...stylex.props(styles.button, styles.buttonPrimary)}
          >
            编码组件
          </button>
          <button type="button" onClick={() => run(() => decodeURIComponent(input))} {...stylex.props(styles.button)}>
            解码组件
          </button>
          <button type="button" onClick={() => run(() => parseQuery(input))} {...stylex.props(styles.button)}>
            解析查询参数
          </button>
        </div>
        <p role={error ? 'alert' : undefined} {...stylex.props(styles.status, Boolean(error) && styles.error)}>
          {error || '“编码组件”适用于查询参数值，不会保留斜杠和问号。'}
        </p>
      </section>

      <section aria-labelledby="url-output-title" {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.field)}>
          <label id="url-output-title" htmlFor="url-output" {...stylex.props(styles.label)}>
            处理结果
          </label>
          <textarea
            id="url-output"
            value={output}
            readOnly
            spellCheck={false}
            {...stylex.props(styles.textarea, styles.textareaCompact)}
          />
        </div>
        <div {...stylex.props(styles.actions)}>
          <button
            type="button"
            onClick={() => void copyText(output)}
            {...stylex.props(styles.button, styles.buttonPrimary)}
          >
            复制结果
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('');
              setOutput('');
              setError('');
            }}
            {...stylex.props(styles.button, styles.buttonDanger)}
          >
            清空
          </button>
        </div>
        <p aria-live="polite" {...stylex.props(styles.status)}>
          {copyStatus}
        </p>
      </section>
    </div>
  );
}
