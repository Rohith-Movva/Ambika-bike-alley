import { NextResponse } from 'next/server';

export async function GET() {
  // Returns your real ID from .env.local, or 'test' if it doesn't exist yet
  return NextResponse.json({ clientId: process.env.PAYPAL_CLIENT_ID || 'test' });
}