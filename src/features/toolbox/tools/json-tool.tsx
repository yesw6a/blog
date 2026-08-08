'use client';

import { useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from '../tool-ui.styles';
import { downloadText } from '../tool-utilities';
import { useCopyFeedback } from '../use-copy-feedback';

const SAMPLE_JSON = `{
  "site": "兮兮的个人站",
  "localOnly": true
}`;

export default function JsonTool() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState(SAMPLE_JSON);
  const [error, setError] = useState('');
  const { copyStatus, copyText } = useCopyFeedback();

  const transform = (space?: number) => {
    try {
      const value: unknown = JSON.parse(input);
      setOutput(JSON.stringify(value, null, space));
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'JSON 解析失败');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div {...stylex.props(styles.splitGrid)}>
      <section aria-labelledby="json-input-title" {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.field)}>
          <label id="json-input-title" htmlFor="json-input" {...stylex.props(styles.label)}>
            JSON 输入
          </label>
          <textarea
            id="json-input"
            value={input}
            spellCheck={false}
            onChange={(event) => setInput(event.currentTarget.value)}
            {...stylex.props(styles.textarea)}
          />
        </div>
        <div {...stylex.props(styles.actions)}>
          <button type="button" onClick={() => transform(2)} {...stylex.props(styles.button, styles.buttonPrimary)}>
            格式化
          </button>
          <button type="button" onClick={() => transform()} {...stylex.props(styles.button)}>
            压缩
          </button>
          <button type="button" onClick={clear} {...stylex.props(styles.button, styles.buttonDanger)}>
            清空
          </button>
        </div>
        <p role={error ? 'alert' : undefined} {...stylex.props(styles.status, Boolean(error) && styles.error)}>
          {error || '支持对象、数组、字符串、数字、布尔值和 null。'}
        </p>
      </section>

      <section aria-labelledby="json-output-title" {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.field)}>
          <label id="json-output-title" htmlFor="json-output" {...stylex.props(styles.label)}>
            处理结果
          </label>
          <textarea id="json-output" value={output} readOnly spellCheck={false} {...stylex.props(styles.textarea)} />
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
            onClick={() => output && downloadText(output, 'formatted.json', 'application/json;charset=utf-8')}
            {...stylex.props(styles.button)}
          >
            下载 JSON
          </button>
        </div>
        <p aria-live="polite" {...stylex.props(styles.status)}>
          {copyStatus}
        </p>
      </section>
    </div>
  );
}
