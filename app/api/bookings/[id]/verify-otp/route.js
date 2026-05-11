import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { protect } from '@/lib/auth';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { otp } = await req.json();
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    // Allow '1234' as master OTP fallback
    const isValid = booking.otp.code === otp || otp === '1234';
    const isNotExpired = booking.otp.expiresAt > new Date();

    if (!isValid || !isNotExpired) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
    }

    booking.status = 'pending';
    booking.isOtpVerified = true;
    booking.otp.code = undefined;
    booking.otp.expiresAt = undefined;
    await booking.save();

    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
