import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connect } from '@/lib/dbServer';
import UserModel from '@/models/user.model';

const SECRET = process.env.NEXTAUTH_SECRET || '';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET });
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  await connect();
  const user = await UserModel.findOne({ email: token.email }).lean();
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  // UserModel.toJSON is instance method; remove sensitive properties
  const { password, otp, otpExpiry, googleId, __v, _id, ...rest } = user as any;
  const safe = { id: _id?.toString?.() || _id, ...rest };
  return NextResponse.json({ success: true, data: safe });
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET });
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { skills, desiredJobRoles, desiredLocations } = body;

  await connect();
  const user = await UserModel.findOne({ email: token.email });
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  if (Array.isArray(skills)) user.skills = skills.map(String);
  if (Array.isArray(desiredJobRoles)) user.desiredJobRoles = desiredJobRoles.map(String);
  if (Array.isArray(desiredLocations)) user.desiredLocations = desiredLocations.map(String);

  await user.save();
  const safe = user.toJSON();
  return NextResponse.json({ success: true, data: safe });
}
