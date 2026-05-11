import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { protect } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const booking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('generator', 'name capacity images pricing');

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const admin = await protect(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const booking = await Booking.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const admin = await protect(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
