import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    body.user = user._id;
    body.name = user.name;
    body.avatar = user.avatar?.url || '';
    body.isApproved = true; // Auto-approve

    const review = await Review.create(body);
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
