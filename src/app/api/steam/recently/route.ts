export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { STEAM_API_KEY, STEAM_USER_ID } from '../index';

export async function GET() {
  const res = await fetch(
    `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&format=json`,
  ).then((res) => res.json());
  return NextResponse.json(res.response);
}
