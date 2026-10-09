'use client';

import { useEffect, useId, useRef } from 'react';

import type { MouseEvent, SyntheticEvent } from 'react';
import type { ExternalSite } from './external-sites';

import Icon from '@/components/icon';
import * as stylex from '@stylexjs/stylex';

import { externalLinkDialogStyles as styles } from './external-link-dialog.styles';

type ExternalLinkDialogProps = {
  site: ExternalSite;
  onCancel: () => void;
  onConfirm: () => void;
};

/** 站外链接的二次风险提示；只做信息提示与确认，跳转由调用方在确认后执行。 */
export default function ExternalLinkDialog({ site, onCancel, onConfirm }: ExternalLinkDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => confirmButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const insideDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!insideDialog) onCancel();
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onCancel();
  };

  const { confirmation } = site;
  if (!confirmation) return null;

  const dialogStyleProps = stylex.props(styles.dialog);

  return (
    <dialog
      ref={dialogRef}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={`external-link-dialog ${dialogStyleProps.className ?? ''}`}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      style={dialogStyleProps.style}
    >
      <div {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.header)}>
          <span aria-hidden {...stylex.props(styles.mark)}>
            <Icon name="warning" />
          </span>
          <div {...stylex.props(styles.heading)}>
            <h2 id={titleId} {...stylex.props(styles.title)}>
              {confirmation.title}
            </h2>
            <p id={descriptionId} {...stylex.props(styles.lead)}>
              {confirmation.lead}
            </p>
          </div>
        </div>

        <p {...stylex.props(styles.addressRow)}>
          <span {...stylex.props(styles.addressLabel)}>{site.name} · 目标地址</span>
          <span {...stylex.props(styles.address)}>{site.url}</span>
        </p>

        <p {...stylex.props(styles.disclaimer)}>{confirmation.disclaimer}</p>

        <details {...stylex.props(styles.details)}>
          <summary {...stylex.props(styles.summary)}>了解详情</summary>
          <ul {...stylex.props(styles.detailList)}>
            {confirmation.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </details>

        <div {...stylex.props(styles.actions)}>
          <button type="button" onClick={onCancel} {...stylex.props(styles.button, styles.cancelButton)}>
            {confirmation.cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            {...stylex.props(styles.button, styles.confirmButton)}
          >
            {confirmation.confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
