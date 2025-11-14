import { NextResponse } from 'next/server';
import { getResources } from '@/lib/resources';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params: any = {};
    if (url.searchParams.get('platform')) params.platform = url.searchParams.get('platform');
    if (url.searchParams.get('skill')) params.skill = url.searchParams.get('skill');

    const resources = await getResources(params);
    return NextResponse.json({ success: true, data: resources });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch resources' }, { status: 500 });
  }
}
