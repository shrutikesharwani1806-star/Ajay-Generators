import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from './db';
import { cookies } from 'next/headers';

export async function protect(req) {
  try {
    await connectDB();
    
    let token;
    const authHeader = req.headers.get('authorization');
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('token')?.value;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    return user;
  } catch (error) {
    return null;
  }
}

export function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
}
