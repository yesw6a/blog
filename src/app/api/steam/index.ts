import type { SteamApiError, SteamOwnedGames, SteamRecentlyPlayedGame } from './types';

const isSteamApiError = (value: unknown): value is SteamApiError =>
  typeof value === 'object' && value !== null && 'error' in value && typeof value.error === 'string';

const readJsonResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type')?.toLowerCase() || '';
  const body = await response.text();

  if (!contentType.includes('application/json')) {
    throw new Error(`Steam 接口返回了非 JSON 响应（${response.status}）`);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error(`Steam 接口返回了无效 JSON（${response.status}）`);
  }

  if (!response.ok) {
    throw new Error(isSteamApiError(payload) ? payload.error : `Steam 接口请求失败（${response.status}）`);
  }

  return payload as T;
};

const requestSteamData = <T>(path: string): Promise<T> =>
  fetch(path, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  }).then(readJsonResponse<T>);

/** 获取 Steam 最近游戏 */
export const getSteamRecentlyGames = (): Promise<SteamRecentlyPlayedGame> =>
  requestSteamData<SteamRecentlyPlayedGame>('/api/steam/recently');

/** 获取 Steam 所有游戏 */
export const getSteamOwnedGames = (): Promise<SteamOwnedGames> => requestSteamData<SteamOwnedGames>('/api/steam/owned');
