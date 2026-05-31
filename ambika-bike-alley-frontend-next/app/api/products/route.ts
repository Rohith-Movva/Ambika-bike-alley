import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Product from '../../../models/Product';

// GET ALL PRODUCTS
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Home Page DB Error:", error.message);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}