import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Order from '../../../../models/Order';
import { protect } from '../../../../lib/auth';

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
export async function GET() {
  try {
    await connectDB();
    
    // 1. Ensure user is logged in
    const { user, error } = await protect();
    if (error || !user) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // 2. Find all orders belonging to this user
    const orders = await Order.find({ user: user._id });
    
    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}