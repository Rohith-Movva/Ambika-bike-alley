import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import Product from '../../../../../models/Product';
import { protect } from '../../../../../lib/auth';

// @desc    Create new review
// @route   POST /api/products/:id/reviews
export async function POST(request: Request, context: any) {
  try {
    await connectDB();

    // 1. Run user authentication check
    const { user, error } = await protect();
    if (error || !user) {
      return NextResponse.json({ message: error || 'Not authorized' }, { status: 401 });
    }

    // 2. Extract review details from payload
    const { rating, comment } = await request.json();
    
    // 3. Destructure and await params for Next.js 15+ stability
    const params = await context.params;
    const product = await Product.findById(params.id);

    if (product) {
      // 4. Validate if the user has already left a review
      const alreadyReviewed = product.reviews.find(
        (r: any) => r.user.toString() === user._id.toString()
      );

      if (alreadyReviewed) {
        return NextResponse.json({ message: 'Product already reviewed' }, { status: 400 });
      }

      // 5. Structure the fresh review subdocument
      const review = {
        name: user.name,
        rating: Number(rating),
        comment,
        user: user._id,
      };

      // 6. Append review, update counter, and recalculate score averages
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      
      product.rating =
        product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      return NextResponse.json({ message: 'Review added successfully' }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}