import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { protect } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      await Booking.findByIdAndUpdate(bookingId, {
        'payment.razorpayPaymentId': razorpay_payment_id,
        'payment.razorpaySignature': razorpay_signature,
        'payment.status': 'paid',
      });

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
