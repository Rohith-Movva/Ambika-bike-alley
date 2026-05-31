import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Order from '../../../models/Order';
import { protect, admin } from '../../../lib/auth';

// @desc    Create new order
// @route   POST /api/orders
export async function POST(request: Request) {
  try {
    await connectDB();
    
    // 1. Check if user is logged in
    const { user, error } = await protect();
    if (error || !user) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // 2. Get the order data from the frontend
    const body = await request.json();
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = body;

    if (orderItems && orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 });
    }

    // 3. Create the order in the database
    const order = new Order({
      orderItems: orderItems.map((x: any) => ({
        ...x,
        product: x.product,
        _id: undefined,
      })),
      user: user._id, // Assign the logged-in user's ID
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    return NextResponse.json(createdOrder, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export async function GET() {
  try {
    await connectDB();
    
    // 1. Check if user is an Admin
    const { user, error } = await admin();
    if (error || !user) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // 2. Fetch all orders and attach the user's name and ID
    const orders = await Order.find({}).populate('user', 'id name');
    return NextResponse.json(orders);

  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}