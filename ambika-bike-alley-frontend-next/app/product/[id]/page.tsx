"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // Next.js native routing
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetProductDetailsQuery, 
  useCreateReviewMutation 
} from '../../../store/productsApiSlice';
import { addToCart } from '../../../store/cartSlice';
// We will need to migrate this component next!
import Rating from '../../../components/Rating';

const ProductScreen = () => {
  // Next.js way to get the ID from the URL and handle navigation
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const dispatch = useDispatch();

  // --- STATE --- (Completely untouched)
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // --- QUERIES & MUTATIONS --- (Completely untouched)
  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  // --- HANDLERS --- (Completely untouched)
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    router.push('/cart'); // Next.js routing
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      alert('Review Submitted!');
      setRating(0);
      setComment('');
    } catch (err: any) {
      alert(err?.data?.message || err.error || "Failed to submit review");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition font-medium mb-8"
      >
        &larr; Go Back
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <h2 className="text-2xl font-semibold text-gray-500 animate-pulse">Loading specs...</h2>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
          <p>{(error as any)?.data?.message || (error as any)?.error || 'Something went wrong'}</p>
        </div>
      ) : (
        <>
          {/* --- TOP SECTION: PRODUCT DETAILS --- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* 1. Image Gallery */}
            <div className="md:col-span-5 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-4">
              <img src={product.image} alt={product.name} className="w-full h-auto object-contain" />
            </div>

            {/* 2. Product Info */}
            <div className="md:col-span-4 flex flex-col">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  {product.name}
                </h1>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </div>
              <p className="text-3xl font-black text-gray-900 mb-4">${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700"><strong className="text-gray-900">Target Audience:</strong> {product.targetAudience}</p>
                <p className="text-sm text-gray-700 mt-2"><strong className="text-gray-900">Brand:</strong> {product.brand}</p>
              </div>
            </div>

            {/* 3. Add to Cart Card */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </span>
                </div>

                {/* Quantity Selection */}
                {product.countInStock > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Qty:</span>
                    <select
                      className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  className={`w-full mt-6 py-3 px-4 rounded-md font-bold text-white uppercase tracking-wider transition-colors ${
                    product.countInStock === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-900 hover:bg-blue-600 shadow-md'
                  }`}
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          {/* --- BOTTOM SECTION: REVIEWS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-gray-200">
            
            {/* Reviews List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              {product.reviews.length === 0 && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-md">No reviews yet. Be the first!</div>
              )}
              
              <div className="space-y-6">
                {product.reviews.map((review: any) => (
                  <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-gray-900">{review.name}</strong>
                      <span className="text-xs text-gray-500">{review.createdAt.substring(0, 10)}</span>
                    </div>
                    <Rating value={review.rating} />
                    <p className="mt-3 text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Form */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Write a Customer Review</h2>
              {loadingProductReview && <p className="text-gray-500 mb-4">Submitting...</p>}

              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <div className="mb-4">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      id="rating"
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value=''>Select a rating...</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                      id="comment"
                      rows={3}
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts on this bike..."
                    ></textarea>
                  </div>

                  <button
                    disabled={loadingProductReview}
                    type='submit'
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition shadow-sm"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
                  Please <Link href='/login' className="font-bold underline hover:text-yellow-900">sign in</Link> to write a review.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;