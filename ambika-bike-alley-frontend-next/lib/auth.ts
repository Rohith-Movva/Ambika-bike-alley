import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import connectDB from './db';

// 1. Replaces your old "protect" middleware
export async function protect() {
  await connectDB();
  
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return { user: null, error: 'Not authorized, no token' };
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as any;

    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Not authorized, token failed' };
  }
}

// 2. Replaces your old "admin" middleware
export async function admin() {
  // First, check if they are logged in at all
  const { user, error } = await protect();
  
  if (error || !user) {
    return { user: null, error };
  }

  // Second, check if they are an admin
  if (!user.isAdmin) {
    return { user: null, error: 'Not authorized as an admin' };
  }

  return { user, error: null };
}