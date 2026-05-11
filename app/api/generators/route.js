import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/db';
import Generator from '@/models/Generator';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const capacity = searchParams.get('capacity');
    const search = searchParams.get('search');
    
    const query = { isActive: true };
    if (capacity && capacity !== 'All') query.capacity = capacity;
    if (search) query.name = new RegExp(search, 'i');

    const generators = await Generator.find(query).sort({ isFeatured: -1, createdAt: -1 });
    return NextResponse.json({ success: true, generators });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const generator = await Generator.create(body);
    return NextResponse.json({ success: true, generator }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
