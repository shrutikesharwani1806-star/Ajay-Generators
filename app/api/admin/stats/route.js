import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Generator from '@/models/Generator';
import Booking from '@/models/Booking';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const user = await protect(req);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalGenerators = await Generator.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const activeRentals = await Booking.countDocuments({ status: { $in: ['accepted', 'processing', 'delivered'] } });

    const revenueAgg = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('generator', 'name capacity')
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalGenerators,
        totalBookings,
        pendingBookings,
        activeRentals,
        totalRevenue,
        monthlyBookings,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
