import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { protect } from '@/lib/auth';

export async function PUT(req, { params }) {
  const user = await protect(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Admin access only' }, { status: 403 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const { status, adminNotes } = await req.json();
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    ).populate('user', 'name email');

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
