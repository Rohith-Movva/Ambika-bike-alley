import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../lib/db';

// The GET function handles all 'GET' requests to this exact URL
export async function GET() {
  try {
    // 1. Tell Next.js to connect to MongoDB
    await connectDB();

    // 2. Check the connection status (1 means fully connected)
    const isConnected = mongoose.connection.readyState === 1;

    // 3. Send a response back to the browser
    if (isConnected) {
      return NextResponse.json({ 
        message: 'Success! Next.js is talking to MongoDB. 🚀', 
        status: 'Connected' 
      });
    } else {
      return NextResponse.json({ 
        message: 'Something is wrong. Database is not ready.', 
      }, { status: 500 });
    }

  } catch (error: any) {
    // If your password or link is wrong in .env.local, it will show the error here
    return NextResponse.json({ 
      message: 'Failed to connect to database', 
      error: error.message 
    }, { status: 500 });
  }
}