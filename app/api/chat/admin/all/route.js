import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const chats = await Chat.find()
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, chats });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
