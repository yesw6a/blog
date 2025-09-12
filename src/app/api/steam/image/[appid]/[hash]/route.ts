export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ appid: string; hash: string }> }) {
  const { appid, hash } = await params;
  const res = await fetch(`http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg`).then(
    (res) => res.bytes(),
  );
  return new NextResponse(res, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
}
