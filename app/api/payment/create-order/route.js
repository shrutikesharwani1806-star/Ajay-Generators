import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { protect } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export async function POST(req) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const { amount, bookingId } = await req.json();

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: { bookingId, userId: user._id.toString() },
    };

    const order = await razorpay.orders.create(options);

    await Booking.findByIdAndUpdate(bookingId, {
      'payment.razorpayOrderId': order.id,
      'payment.amount': amount,
    });

    return NextResponse.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
