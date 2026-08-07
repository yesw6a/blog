'use client';

import { useDeferredValue, useEffect, useId, useRef, useState } from 'react';

import type { KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';
import type { SearchDocumentType, SiteSearchResult } from './search.types';

import { useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import * as stylex from '@stylexjs/stylex';

import HighlightedText from './highlighted-text';
import { searchSite } from './search';
import { siteSearchDialogStyles as styles } from './site-search-dialog.styles';

type SiteSearchDialogProps = {
  onClose: () => void;
};

type SearchStatus = 'idle' | 'loading' | 'ready' | 'error';

const RESULT_LIMIT = 10;
const TYPE_LABELS: Record<SearchDocumentType, string> = {
  page: '页面',
  article: '文章',
  section: '章节',
};

export default function SiteSearchDialog({ onClose }: SiteSearchDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  useEffect(() => {
    const normalizedQuery = deferredQuery.trim();
    if (!normalizedQuery) {
      setStatus('idle');
      setResults([]);
      setActiveIndex(0);
      return;
    }

    let cancelled = false;
    setStatus('loading');

    searchSite(normalizedQuery, { limit: RESULT_LIMIT })
      .then((nextResults) => {
        if (cancelled) return;
        setResults(nextResults);
        setActiveIndex(0);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  const selectResult = (result: SiteSearchResult) => {
    onClose();
    router.push(result.document.url);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
      return;
    }

    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      selectResult(results[activeIndex]);
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const insideDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!insideDialog) onClose();
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const activeResultId = results[activeIndex] ? `${listId}-option-${activeIndex}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${listId}-title`}
      className={`site-search-dialog ${stylex.props(styles.dialog).className ?? ''}`}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      style={stylex.props(styles.dialog).style}
    >
      <h2 id={`${listId}-title`} {...stylex.props(styles.visuallyHidden)}>
        搜索全站
      </h2>

      <div {...stylex.props(styles.searchHeader)}>
        <Icon name="search" style={styles.searchIcon} />
        <input
          ref={inputRef}
          role="combobox"
          type="search"
          value={query}
          aria-activedescendant={activeResultId}
          aria-autocomplete="list"
          aria-controls={results.length > 0 ? listId : undefined}
          aria-expanded={results.length > 0}
          aria-label="搜索全站内容"
          autoComplete="off"
          enterKeyHint="go"
          placeholder="搜索页面、文章或正文内容"
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={handleInputKeyDown}
          {...stylex.props(styles.input)}
        />
        <button type="button" aria-label="关闭搜索" onClick={onClose} {...stylex.props(styles.closeButton)}>
          <Icon name="close" />
        </button>
      </div>

      <div {...stylex.props(styles.resultRegion)}>
        {status === 'idle' ? (
          <p {...stylex.props(styles.status)}>输入关键词，搜索首页、文章标题、标签和正文内容。</p>
        ) : status === 'loading' ? (
          <p role="status" {...stylex.props(styles.status)}>
            正在加载站内搜索索引…
          </p>
        ) : status === 'error' ? (
          <p role="alert" {...stylex.props(styles.status)}>
            搜索索引暂时无法加载，请稍后重试。
          </p>
        ) : results.length === 0 ? (
          <p role="status" {...stylex.props(styles.status)}>
            没有找到相关内容。可以尝试更短的关键词或文章标签。
          </p>
        ) : (
          <ol id={listId} role="listbox" aria-label="搜索结果" {...stylex.props(styles.resultList)}>
            {results.map((result, index) => {
              const { document } = result;
              const active = index === activeIndex;
              const title = document.type === 'section' && result.sectionTitle ? result.sectionTitle : result.title;

              return (
                <li
                  key={document.id}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-label={`${TYPE_LABELS[document.type]}：${title.text}`}
                  aria-selected={active}
                  onClick={() => selectResult(result)}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => setActiveIndex(index)}
                  {...stylex.props(styles.resultOption, active && styles.resultOptionActive)}
                >
                  <div {...stylex.props(styles.resultMeta)}>
                    <span {...stylex.props(styles.resultType)}>{TYPE_LABELS[document.type]}</span>
                    <span {...stylex.props(styles.resultTitle)}>
                      <HighlightedText value={title} />
                    </span>
                  </div>
                  {document.type === 'section' ? (
                    <p {...stylex.props(styles.resultParent)}>
                      来自《
                      <HighlightedText value={result.title} />》
                    </p>
                  ) : null}
                  {result.excerpt ? (
                    <p {...stylex.props(styles.resultExcerpt)}>
                      <HighlightedText value={result.excerpt} />
                    </p>
                  ) : null}
                  {result.metadataMatches.length > 0 ? (
                    <p {...stylex.props(styles.resultMetadata)}>
                      <span>命中关键词 · </span>
                      {result.metadataMatches.map((match, matchIndex) => (
                        <span key={match.text}>
                          {matchIndex > 0 ? '、' : null}
                          <HighlightedText value={match} />
                        </span>
                      ))}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <footer {...stylex.props(styles.footer)}>
        <span>最多显示 {RESULT_LIMIT} 条最相关结果</span>
        <span {...stylex.props(styles.keyHints)}>
          <span {...stylex.props(styles.keyHint)}>
            <kbd {...stylex.props(styles.keycap)}>↑↓</kbd>选择
          </span>
          <span {...stylex.props(styles.keyHint)}>
            <kbd {...stylex.props(styles.keycap)}>↵</kbd>打开
          </span>
          <span {...stylex.props(styles.keyHint)}>
            <kbd {...stylex.props(styles.keycap)}>Esc</kbd>关闭
          </span>
        </span>
      </footer>
    </dialog>
  );
}
