import type { SteamApiError, SteamRecentlyPlayedGame } from '../types';

import { NextResponse } from 'next/server';

import { fetchSteamApi, SteamConfigurationError } from '../steam.server';

const responseHeaders = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    const response = await fetchSteamApi<Partial<SteamRecentlyPlayedGame>>('GetRecentlyPlayedGames');
    const data: SteamRecentlyPlayedGame = {
      total_count: typeof response.total_count === 'number' ? response.total_count : 0,
      games: Array.isArray(response.games) ? response.games : [],
    };

    return NextResponse.json(data, { headers: responseHeaders });
  } catch (error) {
    const data: SteamApiError = { error: 'Steam 最近游戏暂时不可用' };
    const status = error instanceof SteamConfigurationError ? 503 : 502;
    return NextResponse.json(data, { status, headers: responseHeaders });
  }
}
