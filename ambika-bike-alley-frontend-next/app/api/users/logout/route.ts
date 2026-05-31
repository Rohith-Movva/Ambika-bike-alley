import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Next.js 15+ requires awaiting the cookies() function
    const cookieStore = await cookies();
    
    // Destroy the cookie
    cookieStore.delete('jwt');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}