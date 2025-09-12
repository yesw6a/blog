'use client';

import IconDNF from '@/assets/img/icon-dnf.webp';
import IconLOL from '@/assets/img/icon-lol.png';
import { PageTitle, SteamIcon, TextKeyword } from '@/components';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import Image from 'next/image';
import { useMemo } from 'react';
import { getSteamRecentlyGames } from './api/steam';
import styles from './page.module.scss';

export default function Home() {
  const TECHNOLOGY_STACK = [
    { name: 'Next.js', link: 'https://nextjs.org/' },
    { name: 'TailwindCSS', link: 'https://v3.tailwindcss.com/' },
    { name: 'Iconify', link: 'https://iconify.design/' },
  ];
  const SERVICES = [{ name: 'Cloudflare', link: 'https://www.cloudflare.com/' }];

  const GAMES_NOT_STEAM = [
    { name: '地下城与勇士（70版本公益服）', icon: IconDNF },
    { name: '英雄联盟', icon: IconLOL },
  ];

  const steamRecentlyGames = useRequest(getSteamRecentlyGames);

  const recentlySteamGames = useMemo(() => {
    const steamGames = steamRecentlyGames.data;
    const games = {
      total_count: steamGames?.total_count || 0,
      games: steamGames?.games || [],
    };
    return games;
  }, [steamRecentlyGames]);

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

  return (
    <div>
      <section className={styles['section']}>
        <PageTitle>关于我</PageTitle>
        <p>
          一名开发者，主职是<TextKeyword backgroundColor="#1e90ff">前端开发</TextKeyword>。
        </p>
        <p>
          95后，<TextKeyword backgroundColor="#ff4757">火象</TextKeyword>
          。利用摸鱼时间建立个人站。重度游戏爱好者，菜且爱玩。
        </p>
        <p>网站用到以下技术栈和服务实现：</p>
        <p className="flex items-center">
          <span className="icon-[hugeicons--source-code-square] mr-2 text-lg" />
          {TECHNOLOGY_STACK.map((item, index) => (
            <span key={index}>
              {index === 0 ? '' : <span>&nbsp;|&nbsp;</span>}
              <span className={styles['link']} onClick={() => handleLink(item.link)}>
                {item.name}
              </span>
            </span>
          ))}
        </p>
        <p className="flex items-center">
          <span className="icon-[hugeicons--cloud-server] mr-2 text-lg" />
          {SERVICES.map((item, index) => (
            <span key={index}>
              {index === 0 ? '' : <span>&nbsp;|&nbsp;</span>}
              <span className={styles['link']} onClick={() => handleLink(item.link)}>
                {item.name}
              </span>
            </span>
          ))}
        </p>
        <div className="mt-10 flex items-end justify-between">
          <PageTitle>最近在玩</PageTitle>
          <span className="text-sm italic">
            部分数据来源于
            <a
              href="https://developer.valvesoftware.com/wiki/Steam_Web_API#GetRecentlyPlayedGames_(v0001)"
              target="_blank"
              className="underline"
            >
              SteamAPI
            </a>
          </span>
        </div>
        {steamRecentlyGames.loading ? (
          <div>loading</div>
        ) : (
          <>
            {GAMES_NOT_STEAM.map((game, index) => (
              <div key={index} className={classNames(styles['game-item'], 'hover:bg-gray-200 hover:dark:bg-white/10')}>
                <Image src={game.icon} className="rounded" width={32} height={32} alt={game.name} />
                <div className="ml-2">{game.name}</div>
              </div>
            ))}
            {recentlySteamGames.games.map((game) => (
              <div
                key={game.appid}
                className={classNames(styles['game-item'], 'hover:bg-gray-200 hover:dark:bg-white/10')}
              >
                <SteamIcon appid={game.appid} hash={game.img_icon_url} className="rounded" width={32} height={32} />
                <div className="ml-2">{game.name}</div>
                <div className="flex-1" />
                <div>{formatSteamGamePlayedTime(game.playtime_2weeks)}</div>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
