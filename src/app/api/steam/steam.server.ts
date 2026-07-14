type SteamApiMethod = 'GetOwnedGames' | 'GetRecentlyPlayedGames';

type SteamApiEnvelope<T> = {
  response: T;
};

export class SteamConfigurationError extends Error {
  constructor() {
    super('Steam API 配置缺失');
    this.name = 'SteamConfigurationError';
  }
}

const getSteamConfig = () => {
  const apiKey = process.env.STEAM_API_KEY;
  const userId = process.env.STEAM_USER_ID;

  if (!apiKey || !userId) {
    throw new SteamConfigurationError();
  }

  return { apiKey, userId };
};

export const fetchSteamApi = async <T>(method: SteamApiMethod): Promise<T> => {
  const { apiKey, userId } = getSteamConfig();
  const url = new URL(`https://api.steampowered.com/IPlayerService/${method}/v0001/`);
  url.search = new URLSearchParams({ key: apiKey, steamid: userId, format: 'json' }).toString();

  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  const contentType = response.headers.get('content-type')?.toLowerCase() || '';
  const body = await response.text();

  if (!response.ok || !contentType.includes('application/json')) {
    throw new Error(`Steam 上游响应异常（${response.status}）`);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error('Steam 上游返回了无效 JSON');
  }

  if (typeof payload !== 'object' || payload === null || !('response' in payload)) {
    throw new Error('Steam 上游响应结构无效');
  }

  return (payload as SteamApiEnvelope<T>).response;
};
