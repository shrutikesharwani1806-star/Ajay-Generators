import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const user = await protect(req);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
