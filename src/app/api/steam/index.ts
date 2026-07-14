import { SteamRecentlyPlayedGame } from './types';

export const STEAM_API_KEY = 'A2982B4D437D0105DC79153E49B113CB';
export const STEAM_USER_ID = '76561198021235279';

/** 获取 Steam 最近游戏 */
export const getSteamRecentlyGames = (): Promise<SteamRecentlyPlayedGame> =>
  fetch('/api/steam/recently').then((res) => res.json());

/** 获取 Steam 所有游戏 */
export const getSteamOwnedGames = (): Promise<SteamRecentlyPlayedGame> =>
  fetch('/api/steam/owned').then((res) => res.json());
