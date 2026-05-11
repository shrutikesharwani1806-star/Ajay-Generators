import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Generator from '@/models/Generator';
import { protect } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const generator = await Generator.findById(id);
    if (!generator) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, generator });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const admin = await protect(req);
    if (!admin || admin.role !== 'admin') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const body = await req.json();
    const generator = await Generator.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, generator });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const admin = await protect(req);
    if (!admin || admin.role !== 'admin') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    await Generator.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
