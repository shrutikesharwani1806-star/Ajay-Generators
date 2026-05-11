import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { protect } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { sessionId } = await params;
    await connectDB();
    const user = await protect(req);
    
    // Allow admin or the user themselves to see the chat
    // For now, simpler: anyone with the sessionId (public) or admin
    
    const chat = await Chat.findOne({ sessionId })
      .populate('user', 'name email phone');

    if (!chat) {
      return NextResponse.json({ success: false, message: 'Chat session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, chat });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { sessionId } = await params;
    await connectDB();
    const user = await protect(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    await Chat.findOneAndDelete({ sessionId });
    return NextResponse.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
