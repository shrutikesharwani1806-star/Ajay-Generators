import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { protect } from '@/lib/auth';

export async function POST(req, { params }) {
  try {
    const { sessionId } = await params;
    await connectDB();
    const user = await protect(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { message } = await req.json();
    const chat = await Chat.findOne({ sessionId });

    if (!chat) {
      return NextResponse.json({ success: false, message: 'Chat session not found' }, { status: 404 });
    }

    const adminMessage = {
      sender: 'admin',
      message,
      timestamp: new Date(),
    };

    chat.messages.push(adminMessage);
    await chat.save();

    // In a real app with Socket.io, you would emit an event here
    // Since we are in a unified Next.js app without a custom server,
    // the frontend Chatbot component will have to poll or we use a separate socket service.

    return NextResponse.json({ success: true, message: 'Reply sent' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
