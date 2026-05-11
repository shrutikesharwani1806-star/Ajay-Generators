import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { protect } from '@/lib/auth';

export async function GET(req) {
  const user = await protect(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const bookings = await Booking.find({ user: user._id })
      .populate('generator', 'name capacity images pricing')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
