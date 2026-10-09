'use client';

import { useEffect, useId, useState } from 'react';

import type { MouseEvent, ReactElement } from 'react';
import type { ExternalSite } from './external-sites';

import Icon from '@/components/icon';
import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';

import { externalSitesMenuStyles as styles } from './external-sites-menu.styles';

type ExternalSitesMenuProps = {
  sites: readonly ExternalSite[];
  trigger: ReactElement;
  onGuardedSelect: (site: ExternalSite, returnFocus: HTMLElement | null) => void;
};

const APP_THEME_ROOT_ID = 'app-theme-root';

/** 窄屏下替代平铺站外入口的折叠菜单；受控开关，选完即关闭。 */
export default function ExternalSitesMenu({ sites, trigger, onGuardedSelect }: ExternalSitesMenuProps) {
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    setPortalContainer(document.getElementById(APP_THEME_ROOT_ID));
  }, []);

  const handleItemClick = (event: MouseEvent<HTMLAnchorElement>, site: ExternalSite) => {
    setOpen(false);
    if (!site.confirmation) return;
    // 修饰键点击保留浏览器原生「新标签页/新窗口」语义，不进入二次确认
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onGuardedSelect(site, event.currentTarget);
  };

  const contentStyleProps = stylex.props(styles.content);

  return (
    <Popover.Root modal={false} open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      {portalContainer ? (
        <Popover.Portal container={portalContainer}>
          <Popover.Content
            aria-labelledby={titleId}
            align="end"
            className={contentStyleProps.className ?? ''}
            collisionPadding={12}
            side="bottom"
            sideOffset={10}
            style={contentStyleProps.style}
          >
            <h2 id={titleId} {...stylex.props(styles.title)}>
              站外入口
            </h2>
            <ul {...stylex.props(styles.list)}>
              {sites.map((site) => (
                <li key={site.id}>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={site.ariaLabel}
                    onClick={(event) => handleItemClick(event, site)}
                    {...stylex.props(styles.item)}
                  >
                    <Icon name={site.icon} style={styles.itemIcon} />
                    <span {...stylex.props(styles.itemBody)}>
                      <span {...stylex.props(styles.itemName)}>{site.name}</span>
                      <span {...stylex.props(styles.itemHint)}>{site.menuHint}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      ) : null}
    </Popover.Root>
  );
}
