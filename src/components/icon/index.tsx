import type { StyleXStyles } from '@stylexjs/stylex';

import * as stylex from '@stylexjs/stylex';

const ICONS = {
  home: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M3 11.99v2.51c0 3.3 0 4.95 1.025 5.975S6.7 21.5 10 21.5h4c3.3 0 4.95 0 5.975-1.025S21 17.8 21 14.5v-2.51c0-1.682 0-2.522-.356-3.25s-1.02-1.244-2.346-2.276l-2-1.555C14.233 3.303 13.2 2.5 12 2.5s-2.233.803-4.298 2.409l-2 1.555C4.375 7.496 3.712 8.012 3.356 8.74S3 10.308 3 11.99"/><path d="M15 17c-.8.622-1.85 1-3 1s-2.2-.378-3-1"/></g>',
  moon: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.5 14.078A8.557 8.557 0 0 1 9.922 2.5C5.668 3.497 2.5 7.315 2.5 11.873a9.627 9.627 0 0 0 9.627 9.627c4.558 0 8.376-3.168 9.373-7.422"/>',
  sun: '<g fill="none" stroke="currentColor"><path stroke-width="1.5" d="M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0Z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.996 3h.008m-.008 18h.01m6.353-15.364h.009M5.634 18.364h.01m-.01-12.728h.01m12.714 12.729h.01M20.99 12H21M3 12h.009"/></g>',
  sourceCode:
    '<g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m16 10l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L16 14m-8-4l-1.227 1.057C6.258 11.502 6 11.724 6 12s.258.498.773.943L8 14m5-5l-2 6"/><path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"/></g>',
  article:
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M4 5.5c2.8-.8 5.45-.3 8 1.5v12c-2.55-1.8-5.2-2.3-8-1.5zM20 5.5c-2.8-.8-5.45-.3-8 1.5v12c2.55-1.8 5.2-2.3 8-1.5z"/><path d="M7 9.25c.85-.05 1.65.07 2.4.35M7 12.25c.85-.05 1.65.07 2.4.35m7.6-3.35c-.85-.05-1.65.07-2.4.35m2.4 2.65c-.85-.05-1.65.07-2.4.35"/></g>',
  cloudServer:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.478 8h.022a4.5 4.5 0 1 1 0 9H7a5 5 0 0 1-.48-9.977M17.478 8q.021-.247.022-.5a5.5 5.5 0 0 0-10.98-.477M17.478 8a5.5 5.5 0 0 1-1.235 3M6.52 7.023Q6.757 7 7 7c1.126 0 2.165.372 3 1m4 12.75v-.25a1 1 0 0 0-1-1h-1m2 1.25V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.25m4 0h5m-9 0v-.25a1 1 0 0 1 1-1h1m-2 1.25H5m7-1.25V17"/>',
  code: '<path fill="currentColor" d="m8 18l-6-6l6-6l1.425 1.425l-4.6 4.6L9.4 16.6zm8 0l-1.425-1.425l4.6-4.6L14.6 7.4L16 6l6 6z"/>',
  palette:
    '<path fill="currentColor" d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.813-3.9t2.2-3.175T8.25 2.788T12.2 2q2 0 3.775.688t3.113 1.9t2.125 2.875T22 11.05q0 2.875-1.75 4.413T16 17h-1.85q-.225 0-.312.125t-.088.275q0 .3.375.863t.375 1.287q0 1.25-.687 1.85T12 22m-5.5-9q.65 0 1.075-.425T8 11.5t-.425-1.075T6.5 10t-1.075.425T5 11.5t.425 1.075T6.5 13m3-4q.65 0 1.075-.425T11 7.5t-.425-1.075T9.5 6t-1.075.425T8 7.5t.425 1.075T9.5 9m5 0q.65 0 1.075-.425T16 7.5t-.425-1.075T14.5 6t-1.075.425T13 7.5t.425 1.075T14.5 9m3 4q.65 0 1.075-.425T19 11.5t-.425-1.075T17.5 10t-1.075.425T16 11.5t.425 1.075T17.5 13"/>',
  speed:
    '<path fill="currentColor" d="M10.45 15.5q.625.625 1.575.588T13.4 15.4L19 7l-8.4 5.6q-.65.45-.712 1.362t.562 1.538M5.1 20q-.55 0-1.012-.238t-.738-.712q-.65-1.175-1-2.437T2 14q0-2.075.788-3.9t2.137-3.175T8.1 4.788T12 4q2.05 0 3.85.775T19 6.888t2.15 3.125t.825 3.837q.025 1.375-.312 2.688t-1.038 2.512q-.275.475-.737.713T18.874 20z"/>',
  checkCircle:
    '<path fill="currentColor" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/>',
  mail: '<path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z"/>',
  bugReport:
    '<path fill="currentColor" d="M12 21q-1.625 0-3.012-.8T6.8 18H4v-2h2.1q-.075-.5-.088-1T6 14H4v-2h2q0-.5.012-1t.088-1H4V8h2.8q.35-.575.788-1.075T8.6 6.05L7 4.4L8.4 3l2.15 2.15q.7-.225 1.425-.225t1.425.225L15.6 3L17 4.4l-1.65 1.65q.575.375 1.038.862T17.2 8H20v2h-2.1q.075.5.088 1T18 12h2v2h-2q0 .5-.013 1t-.087 1H20v2h-2.8q-.8 1.4-2.187 2.2T12 21m-2-5h4v-2h-4zm0-4h4v-2h-4z"/>',
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number | string;
  label?: string;
  style?: StyleXStyles;
};

const styles = stylex.create({
  icon: {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
});

export default function Icon({ name, size = '1em', label, style }: IconProps) {
  return (
    <svg
      {...stylex.props(styles.icon, style)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
      height={size}
      role={label ? 'img' : undefined}
      viewBox="0 0 24 24"
      width={size}
    />
  );
}
