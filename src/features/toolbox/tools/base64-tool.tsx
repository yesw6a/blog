'use client';

import { useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from '../tool-ui.styles';
import { useCopyFeedback } from '../use-copy-feedback';

const encodeBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const decodeBase64 = (value: string) => {
  const binary = atob(value.replace(/\s+/g, ''));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
};

export default function Base64Tool() {
  const [input, setInput] = useState('工具箱里的内容只在本地处理。');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { copyStatus, copyText } = useCopyFeedback();

  const run = (operation: () => string) => {
    try {
      setOutput(operation());
      setError('');
    } catch {
      setOutput('');
      setError('输入不是有效的 UTF-8 Base64 字符串');
    }
  };

  return (
    <div {...stylex.props(styles.splitGrid)}>
      <section aria-labelledby="base64-input-title" {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.field)}>
          <label id="base64-input-title" htmlFor="base64-input" {...stylex.props(styles.label)}>
            输入内容
          </label>
          <textarea
            id="base64-input"
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            {...stylex.props(styles.textarea, styles.textareaCompact)}
          />
        </div>
        <div {...stylex.props(styles.actions)}>
          <button
            type="button"
            onClick={() => run(() => encodeBase64(input))}
            {...stylex.props(styles.button, styles.buttonPrimary)}
          >
            编码为 Base64
          </button>
          <button type="button" onClick={() => run(() => decodeBase64(input))} {...stylex.props(styles.button)}>
            解码为文本
          </button>
        </div>
        <p role={error ? 'alert' : undefined} {...stylex.props(styles.status, Boolean(error) && styles.error)}>
          {error || '使用 UTF-8 编码，支持中文和其他 Unicode 字符。'}
        </p>
      </section>

      <section aria-labelledby="base64-output-title" {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.field)}>
          <label id="base64-output-title" htmlFor="base64-output" {...stylex.props(styles.label)}>
            处理结果
          </label>
          <textarea
            id="base64-output"
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
