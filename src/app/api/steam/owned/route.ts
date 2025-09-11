export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(
    'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=EFA1F72FE84908F133513654BE2CF818&steamid=76561198021235279&format=json',
  ).then((res) => res.json());
  return NextResponse.json(res.response);
}
