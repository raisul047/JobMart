import { NextResponse } from 'next/server';
import { getResourceById } from '@/lib/resources';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const resource = await getResourceById(id);
    if (!resource) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: resource });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch resource' }, { status: 500 });
  }
}
