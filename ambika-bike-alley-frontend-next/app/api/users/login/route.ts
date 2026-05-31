import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';

export async function POST(request: Request) {
  try {
    await connectDB();

    // 1. Get email and password from the frontend request
    const body = await request.json();
    const { email, password } = body;

    // 2. Find the user in the database
    const user = await User.findOne({ email });

    // 3. Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      
      // 4. Generate the JWT Token
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: '30d',
      });

      // 5. Set the HTTP-Only Cookie using Next.js native cookie handler
      const cookieStore = await cookies();
      cookieStore.set('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/',
      });

      // 6. Send the user data back to the frontend (WITHOUT the password)
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });

    } else {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
}