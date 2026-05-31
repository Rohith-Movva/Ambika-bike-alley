import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Product from '../../../../models/Product';

// @desc    Fetch single product
// @route   GET /api/products/:id
export async function GET(request: NextRequest, context: any) {
  try {
    await connectDB();
    
    // Safely awaiting params context
    const params = await context.params;
    const productId = params.id;

    const product = await Product.findById(productId);

    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Single Product DB Error:", error.message);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
export async function PUT(request: NextRequest, context: any) {
  try {
    await connectDB();
    
    // Await the params context before reading the ID
    const params = await context.params;
    const productId = params.id;

    // TODO: Add Admin Authentication Check Here

    const body = await request.json();
    const product = await Product.findById(productId);

    if (product) {
      product.name = body.name || product.name;
      product.price = body.price || product.price;
      product.description = body.description || product.description;
      product.image = body.image || product.image;
      product.brand = body.brand || product.brand;
      product.category = body.category || product.category;
      product.subCategory = body.subCategory || product.subCategory;
      product.targetAudience = body.targetAudience || product.targetAudience;
      product.countInStock = body.countInStock || product.countInStock;

      const updatedProduct = await product.save();
      return NextResponse.json(updatedProduct);
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
export async function DELETE(request: NextRequest, context: any) {
  try {
    await connectDB();

    // Await the params context before reading the ID
    const params = await context.params;
    const productId = params.id;

    // TODO: Add Admin Authentication Check Here

    const product = await Product.findById(productId);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      return NextResponse.json({ message: 'Product removed' });
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}