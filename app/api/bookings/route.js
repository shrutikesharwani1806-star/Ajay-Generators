import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Generator from '@/models/Generator';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const query = user.role === 'admin' ? {} : { user: user._id };
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('generator', 'name capacity images')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });
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

    // Default OTP set to 1234 as requested
    const otp = '1234';
    body.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    };

    const booking = await Booking.create(body);

    // In production, send SMS here. For now, we return bookingId
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      bookingId: booking._id
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
