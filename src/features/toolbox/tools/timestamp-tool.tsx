'use client';

import { useMemo, useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import { toolUiStyles as styles } from '../tool-ui.styles';
import { useCopyFeedback } from '../use-copy-feedback';

type TimestampUnit = 'seconds' | 'milliseconds';

const toLocalInputValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState('');
  const [unit, setUnit] = useState<TimestampUnit>('seconds');
  const [localDateTime, setLocalDateTime] = useState('');
  const { copyStatus, copyText } = useCopyFeedback();

  const result = useMemo(() => {
    if (!timestamp.trim()) return null;
    const numeric = Number(timestamp);
    if (!Number.isFinite(numeric)) return { error: '请输入有效的数字时间戳' } as const;
    const date = new Date(unit === 'seconds' ? numeric * 1000 : numeric);
    if (Number.isNaN(date.getTime())) return { error: '时间戳超出有效日期范围' } as const;

    return {
      date,
      milliseconds: date.getTime(),
      seconds: Math.floor(date.getTime() / 1000),
      local: new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full', timeStyle: 'long' }).format(date),
      utc: date.toUTCString(),
      iso: date.toISOString(),
    } as const;
  }, [timestamp, unit]);

  const useCurrentTime = () => {
    const now = new Date();
    setUnit('seconds');
    setTimestamp(String(Math.floor(now.getTime() / 1000)));
    setLocalDateTime(toLocalInputValue(now));
  };

  const convertLocalDate = () => {
    if (!localDateTime) return;
    const date = new Date(localDateTime);
    if (Number.isNaN(date.getTime())) return;
    setTimestamp(String(unit === 'seconds' ? Math.floor(date.getTime() / 1000) : date.getTime()));
  };

  const copyValue = result && !('error' in result) ? `${result.seconds}` : '';

  return (
    <div {...stylex.props(styles.splitGrid)}>
      <section aria-labelledby="timestamp-input-title" {...stylex.props(styles.panel)}>
        <h2 id="timestamp-input-title" {...stylex.props(styles.label)}>
          时间戳转日期
        </h2>
        <div {...stylex.props(styles.field, styles.fieldSpaced)}>
          <label htmlFor="timestamp-value" {...stylex.props(styles.label)}>
            时间戳
          </label>
          <input
            id="timestamp-value"
            type="text"
            inputMode="numeric"
            value={timestamp}
            placeholder="例如 1786093200"
            onChange={(event) => setTimestamp(event.currentTarget.value)}
            {...stylex.props(styles.input)}
          />
        </div>
        <div {...stylex.props(styles.field, styles.fieldSpaced)}>
          <label htmlFor="timestamp-unit" {...stylex.props(styles.label)}>
            时间戳单位
          </label>
          <select
            id="timestamp-unit"
            value={unit}
            onChange={(event) => setUnit(event.currentTarget.value as TimestampUnit)}
            {...stylex.props(styles.input, styles.select)}
          >
            <option value="seconds">秒</option>
            <option value="milliseconds">毫秒</option>
          </select>
        </div>
        <div {...stylex.props(styles.actions)}>
          <button type="button" onClick={useCurrentTime} {...stylex.props(styles.button, styles.buttonPrimary)}>
            使用当前时间
          </button>
          <button type="button" onClick={() => void copyText(copyValue)} {...stylex.props(styles.button)}>
            复制秒时间戳
          </button>
        </div>
        <p aria-live="polite" {...stylex.props(styles.status)}>
          {copyStatus}
        </p>
      </section>

      <section aria-labelledby="date-input-title" {...stylex.props(styles.panel)}>
        <h2 id="date-input-title" {...stylex.props(styles.label)}>
          本地日期转时间戳
        </h2>
        <div {...stylex.props(styles.field, styles.fieldSpaced)}>
          <label htmlFor="local-datetime" {...stylex.props(styles.label)}>
            本地日期和时间
          </label>
          <input
            id="local-datetime"
            type="datetime-local"
            value={localDateTime}
            onChange={(event) => setLocalDateTime(event.currentTarget.value)}
            {...stylex.props(styles.input)}
          />
        </div>
        <div {...stylex.props(styles.actions)}>
          <button type="button" onClick={convertLocalDate} {...stylex.props(styles.button, styles.buttonPrimary)}>
            转换为时间戳
          </button>
        </div>
        <p {...stylex.props(styles.status)}>日期输入会按照当前设备的本地时区解析。</p>
      </section>

      <section aria-labelledby="timestamp-result-title" {...stylex.props(styles.panel, styles.panelWide)}>
        <h2 id="timestamp-result-title" {...stylex.props(styles.label)}>
          转换结果
        </h2>
        {result && 'error' in result ? (
          <p role="alert" {...stylex.props(styles.status, styles.error)}>
            {result.error}
          </p>
        ) : result ? (
          <div {...stylex.props(styles.resultList, styles.fieldSpaced)}>
            {[
              ['秒时间戳', result.seconds],
              ['毫秒时间戳', result.milliseconds],
              ['本地时间', result.local],
              ['UTC', result.utc],
              ['ISO 8601', result.iso],
            ].map(([label, value]) => (
              <div key={label} {...stylex.props(styles.resultRow)}>
                <span {...stylex.props(styles.resultLabel)}>{label}</span>
                <span {...stylex.props(styles.resultValue)}>{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p {...stylex.props(styles.status)}>输入时间戳或选择本地日期后查看结果。</p>
        )}
      </section>
    </div>
  );
}
