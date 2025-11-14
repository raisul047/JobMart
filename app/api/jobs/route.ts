import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/jobs';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params: any = {};
    if (url.searchParams.get('type')) params.type = url.searchParams.get('type');
    if (url.searchParams.get('location')) params.location = url.searchParams.get('location');
    if (url.searchParams.get('track')) params.track = url.searchParams.get('track');
    if (url.searchParams.get('experienceLevel')) params.experienceLevel = url.searchParams.get('experienceLevel');
    if (url.searchParams.get('skill')) params.skill = url.searchParams.get('skill');

    const jobs = await getJobs(params);
    return NextResponse.json({ success: true, data: jobs });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
