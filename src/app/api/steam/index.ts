import { SteamRecentlyPlayedGame } from './types';

/** 获取 Steam 最近游戏 */
export const getSteamRecentlyGames = (): Promise<SteamRecentlyPlayedGame> =>
  fetch('/api/steam/recently').then((res) => res.json());

/** 获取 Steam 所有游戏 */
export const getSteamOwnedGames = (): Promise<SteamRecentlyPlayedGame> =>
  fetch('/api/steam/owned').then((res) => res.json());
