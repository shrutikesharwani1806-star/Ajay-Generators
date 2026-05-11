import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Generator from '@/models/Generator';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');

    const query = { isActive: true, availability: 'available' };
    if (state) query['availableCities.state'] = new RegExp(state, 'i');
    if (city) query['availableCities.city'] = new RegExp(city, 'i');

    const generators = await Generator.find(query);
    return NextResponse.json({
      success: true,
      available: generators.length > 0,
      count: generators.length,
      generators,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
