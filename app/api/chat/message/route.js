import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const message = formData.get('message');
    const sessionId = formData.get('sessionId');
    const file = formData.get('file');

    const { protect } = require('@/lib/auth');
    const user = await protect(req).catch(() => null);

    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = await Chat.create({ 
        sessionId, 
        user: user?._id,
        messages: [] 
      });
    } else if (user && !chat.user) {
      chat.user = user._id;
      await chat.save();
    }

    const userMessage = {
      sender: 'user',
      message: message || '',
      timestamp: new Date(),
    };

    // Note: Handling files (saving to Cloudinary) would go here
    // For now, we'll just handle text with Gemini
    
    chat.messages.push(userMessage);

    const isPersonal = formData.get('isPersonal') === 'true';
    
    if (isPersonal) {
      await chat.save();
      return NextResponse.json({ success: true, message: 'Message sent to admin' });
    }

    // Get AI Reply (for general chatbot)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `You are the AI assistant for Ajay Generators, a premium generator rental service in Burhar, Madhya Pradesh. 
    Owner: Ajay Kumar Kesharwani. 
    Contact: +91 91651 46680.
    Services: Rental of 30KV to 250KV generators for Industries, Weddings, Construction, and Hospitals.
    Rates: ₹30,000/month (30KV), ₹35,000/month (35KV).
    Be professional, helpful, and concise. Answer questions about generators, pricing, and booking.`;

    const chatHistory = chat.messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.message || ' ' }],
    }));

    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...chatHistory.slice(-6) // Send last 6 messages for context
      ]
    });

    const botReplyText = result.response.text();
    
    const botReply = {
      sender: 'bot',
      message: botReplyText,
      timestamp: new Date(),
    };

    chat.messages.push(botReply);
    await chat.save();

    return NextResponse.json({
      success: true,
      botReply: botReplyText,
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
