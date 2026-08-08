'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const useCopyFeedback = () => {
  const [copyStatus, setCopyStatus] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyText = useCallback(async (value: string) => {
    if (!value) {
      setCopyStatus('没有可复制的内容');
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus('已复制到剪贴板');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopyStatus(''), 2200);
      return true;
    } catch {
      setCopyStatus('复制失败，请手动选择内容');
      return false;
    }
  }, []);

  return { copyStatus, copyText };
};
