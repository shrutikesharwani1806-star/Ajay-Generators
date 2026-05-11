import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quote from '@/models/Quote';
import { protect } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const admin = await protect(req);

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const quote = await Quote.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
