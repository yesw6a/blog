import type { SteamApiError, SteamOwnedGames } from '../types';

import { NextResponse } from 'next/server';

import { fetchSteamApi, SteamConfigurationError } from '../steam.server';

export const runtime = 'edge';

const responseHeaders = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    const response = await fetchSteamApi<Partial<SteamOwnedGames>>('GetOwnedGames');
    const data: SteamOwnedGames = {
      game_count: typeof response.game_count === 'number' ? response.game_count : 0,
      games: Array.isArray(response.games) ? response.games : [],
    };

    return NextResponse.json(data, { headers: responseHeaders });
  } catch (error) {
    const data: SteamApiError = { error: 'Steam 游戏库暂时不可用' };
    const status = error instanceof SteamConfigurationError ? 503 : 502;
    return NextResponse.json(data, { status, headers: responseHeaders });
  }
}
