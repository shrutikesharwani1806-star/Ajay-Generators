import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import User from '@/models/User';

export async function PUT(req) {
  const user = await protect(req);
  
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  try {
    const { name, phone, address } = await req.json();
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
