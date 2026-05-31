import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { protect } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';

// @desc    Get user profile data
// @route   GET /api/users/profile
export async function GET() {
  try {
    await connectDB();
    
    // 1. Run the security checkpoint
    const { user, error } = await protect();

    // 2. If there is an error (no token, bad token), kick them out
    if (error || !user) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // 3. Send them their profile data!
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    
  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}

// @desc    Update user profile data
// @route   PUT /api/users/profile
export async function PUT(request: Request) {
  try {
    await connectDB();

    // 1. Run the security checkpoint
    const { user, error } = await protect();
    if (error || !user) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // 2. Parse the incoming updates from the frontend form
    const { name, email, password } = await request.json();
    const dbUser = await User.findById(user._id);

    if (dbUser) {
      // Update fields if provided, otherwise keep old ones
      dbUser.name = name || dbUser.name;
      dbUser.email = email || dbUser.email;

      // Hash the new password if they typed one in
      if (password) {
        dbUser.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await dbUser.save();
      
      return NextResponse.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}