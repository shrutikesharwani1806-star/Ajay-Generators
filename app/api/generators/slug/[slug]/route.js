import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Generator from '@/models/Generator';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const generator = await Generator.findOne({ slug });
    
    if (!generator) {
      return NextResponse.json({ success: false, message: 'Generator not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, generator });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
