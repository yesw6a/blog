'use client';

import { useState } from 'react';

import { useRequest } from 'ahooks';
import Image from 'next/image';
import IconDNF from '@/assets/img/icon-dnf.webp';
import IconLOL from '@/assets/img/icon-lol.png';
import { Icon, PageTitle, SteamIcon, TextKeyword } from '@/components';
import { useElementSpin } from '@/hooks';
import { colors } from '@/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { getSteamRecentlyGames } from './api/steam';

const AVATAR_SIZE = 160;
const AVATAR_SRC = '/api/haowallpaper/avatar/random';
const EMPTY_STEAM_GAMES = { total_count: 0, games: [] };

export default function Home() {
  const TECHNOLOGY_STACK = [
    { name: 'Next.js', link: 'https://nextjs.org/' },
    { name: 'StyleX', link: 'https://stylexjs.com/' },
  ];
  const SERVICES = [{ name: 'Cloudflare', link: 'https://www.cloudflare.com/' }];

  const GAMES_NOT_STEAM = [
    { name: '地下城与勇士（70版本公益服）', icon: IconDNF },
    { name: '英雄联盟', icon: IconLOL },
  ];

  const { elementRef: avatarRef, eventHandlers } = useElementSpin<HTMLDivElement>();

  const steamRecentlyGames = useRequest(getSteamRecentlyGames);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const recentlySteamGames = steamRecentlyGames.data ?? EMPTY_STEAM_GAMES;

  const handleLink = (link: string) => {
    window.open(link, '_blank');
  };

  const formatSteamGamePlayedTime = (
    /** 单位：分钟 */
    playtime: number,
  ) => {
    const hours = Math.floor(playtime / 60);
    const minutes = playtime % 60;
    if (hours === 0) {
      return `${minutes} 分钟`;
    }
    return `${hours} 小时 ${minutes} 分钟`;
  };

  const avatarStyleProps = stylex.props(styles.avatar);

  return (
    <div>
      <section>
        <div
          ref={avatarRef}
          className={avatarStyleProps.className}
          style={{
            ...avatarStyleProps.style,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
          }}
          {...eventHandlers}
        >
          {avatarFailed ? (
            <div aria-hidden {...stylex.props(styles.avatarPlaceholder)} />
          ) : (
            <Image
              {...stylex.props(styles.avatarImage)}
              src={AVATAR_SRC}
              alt="兮兮的头像"
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              onError={() => setAvatarFailed(true)}
              priority
              unoptimized
            />
          )}
        </div>
        <PageTitle>关于我</PageTitle>
        <p {...stylex.props(styles.paragraph)}>
          一名开发者，主职是<TextKeyword backgroundColor="#1e90ff">前端开发</TextKeyword>。
        </p>
        <p {...stylex.props(styles.paragraph)}>
          95后，<TextKeyword backgroundColor="#ff4757">火象</TextKeyword>
          。利用摸鱼时间建立个人站。重度游戏爱好者，菜且爱玩。
        </p>
        <p {...stylex.props(styles.paragraph)}>网站用到以下技术栈和服务实现：</p>
        <p {...stylex.props(styles.paragraph, styles.inlineRow)}>
          <Icon name="sourceCode" style={styles.inlineIcon} />
          {TECHNOLOGY_STACK.map((item, index) => (
            <span key={index}>
              {index === 0 ? '' : <span>&nbsp;|&nbsp;</span>}
              <button type="button" {...stylex.props(styles.link)} onClick={() => handleLink(item.link)}>
                {item.name}
              </button>
            </span>
          ))}
        </p>
        <p {...stylex.props(styles.paragraph, styles.inlineRow)}>
          <Icon name="cloudServer" style={styles.inlineIcon} />
          {SERVICES.map((item, index) => (
            <span key={index}>
              {index === 0 ? '' : <span>&nbsp;|&nbsp;</span>}
              <button type="button" {...stylex.props(styles.link)} onClick={() => handleLink(item.link)}>
                {item.name}
              </button>
            </span>
          ))}
        </p>
        <div {...stylex.props(styles.gamesHeader)}>
          <PageTitle>最近在玩</PageTitle>
          <span {...stylex.props(styles.sourceText)}>
            部分数据来源于
            <a
              href="https://developer.valvesoftware.com/wiki/Steam_Web_API#GetRecentlyPlayedGames_(v0001)"
              target="_blank"
              {...stylex.props(styles.sourceLink)}
            >
              SteamAPI
            </a>
          </span>
        </div>
        {GAMES_NOT_STEAM.map((game, index) => (
          <div key={index} {...stylex.props(styles.gameItem)}>
            <Image src={game.icon} {...stylex.props(styles.gameIcon)} width={32} height={32} alt={game.name} />
            <div {...stylex.props(styles.gameName)}>{game.name}</div>
          </div>
        ))}
        {steamRecentlyGames.loading ? (
          <div role="status" aria-live="polite" {...stylex.props(styles.gameStatus)}>
            Steam 数据加载中...
          </div>
        ) : steamRecentlyGames.error ? (
          <div role="status" aria-live="polite" {...stylex.props(styles.gameStatus)}>
            Steam 数据暂时不可用
          </div>
        ) : (
          <>
            {recentlySteamGames.games.map((game) => (
              <div key={game.appid} {...stylex.props(styles.gameItem)}>
                <SteamIcon appid={game.appid} hash={game.img_icon_url} style={styles.gameIcon} width={32} height={32} />
                <div {...stylex.props(styles.gameName)}>{game.name}</div>
                <div {...stylex.props(styles.spacer)} />
                <div>{formatSteamGamePlayedTime(game.playtime_2weeks)}</div>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
}

const styles = stylex.create({
  avatar: {
    marginBottom: '2rem',
    overflow: 'hidden',
    borderRadius: '9999px',
    backgroundColor: colors.avatarPlaceholder,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.avatarPlaceholder,
  },
  avatarImage: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  paragraph: {
    marginBlock: '0.5rem',
  },
  inlineRow: {
    display: 'flex',
    alignItems: 'center',
  },
  inlineIcon: {
    marginRight: '0.5rem',
    fontSize: '1.125rem',
  },
  link: {
    cursor: 'pointer',
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    color: {
      default: 'inherit',
      ':hover': colors.primary,
    },
    textDecorationLine: {
      default: 'none',
      ':hover': 'underline',
    },
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors.primary}`,
    },
    outlineOffset: {
      default: null,
      ':focus-visible': '2px',
    },
  },
  gamesHeader: {
    display: 'flex',
    marginTop: '2.5rem',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sourceText: {
    fontSize: '0.875rem',
    fontStyle: 'italic',
  },
  sourceLink: {
    textDecorationLine: 'underline',
  },
  gameItem: {
    display: 'flex',
    height: '2.75rem',
    marginBlock: '0.5rem',
    alignItems: 'center',
    borderRadius: '0.25rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.gameHover,
    },
    paddingInline: '0.5rem',
  },
  gameStatus: {
    display: 'flex',
    minHeight: '2.75rem',
    marginBlock: '0.5rem',
    alignItems: 'center',
    paddingInline: '0.5rem',
    fontSize: '0.875rem',
    opacity: 0.7,
  },
  gameIcon: {
    borderRadius: '0.25rem',
  },
  gameName: {
    marginLeft: '0.5rem',
  },
  spacer: {
    flex: 1,
  },
});
