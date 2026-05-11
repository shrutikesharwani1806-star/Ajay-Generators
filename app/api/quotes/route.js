import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quote from '@/models/Quote';
import { protect } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const quote = await Quote.create(body);
    return NextResponse.json({ success: true, quote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await protect(req);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const quotes = await Quote.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
