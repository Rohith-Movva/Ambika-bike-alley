import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db'; // 4 dots up to root
import Order from '../../../../models/Order';
import { protect } from '../../../../lib/auth';

// @desc    Get order by ID
// @route   GET /api/orders/:id
export async function GET(request: Request, context: any) {
  try {
    await connectDB();
    
    // 1. Ensure user is logged in
    const { user, error } = await protect();
    if (error || !user) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // 2. Await params (Next.js 15+ requirement)
    const params = await context.params;
    
    // 3. Find the order and attach the user's name and email
    const order = await Order.findById(params.id).populate('user', 'name email');

    if (order) {
      // Security check: Only the user who placed the order (or an Admin) can view it
      if (order.user._id.toString() !== user._id.toString() && !user.isAdmin) {
         return NextResponse.json({ message: 'Not authorized to view this order' }, { status: 401 });
      }
      return NextResponse.json(order);
    } else {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}