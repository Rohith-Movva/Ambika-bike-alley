import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/users
export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // --- REMOVED THE MANUAL BCRYPT HASHING STEPS HERE ---
    // Let Mongoose handle it automatically behind the scenes!

    // Create the user passing the PLAIN TEXT password
    const user = await User.create({
      name,
      email,
      password, // <-- Pass the plain password here
    });

    if (user) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30m' }
      );

      const cookieStore = await cookies();
      cookieStore.set({
        name: 'jwt',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 60,
        path: '/',
      });

      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }, { status: 201 });

    } else {
      return NextResponse.json({ message: 'Invalid user data received' }, { status: 400 });
    }

  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}