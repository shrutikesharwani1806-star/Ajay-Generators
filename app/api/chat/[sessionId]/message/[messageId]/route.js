import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { protect } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { sessionId, messageId } = await params;

    const chat = await Chat.findOne({ sessionId });
    if (!chat) {
      return NextResponse.json({ success: false, message: 'Chat not found' }, { status: 404 });
    }

    // Find the specific message
    const messageIndex = chat.messages.findIndex(m => m._id.toString() === messageId);
    if (messageIndex === -1) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    // Update flag based on role
    if (user.role === 'admin') {
      chat.messages[messageIndex].deletedByAdmin = true;
    } else {
      chat.messages[messageIndex].deletedByUser = true;
    }

    await chat.save();

    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
