import { NextResponse } from 'next/server';
import { getJobById } from '@/lib/jobs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const job = await getJobById(id);
    if (!job) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: job });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch job' }, { status: 500 });
  }
}
