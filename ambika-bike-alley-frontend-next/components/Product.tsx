import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Product = ({ product }: { product: any }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 w-full max-w-sm flex flex-col h-full">
      
      {/* 1. Image Section (With hover zoom effect) */}
      <Link href={`/product/${product._id}`} className="relative h-64 w-full block overflow-hidden bg-gray-50">
        {/* Next.js Image optimization requires width/height or 'fill' */}
        <img 
          src={product.image} 
          alt={product.name}
          className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Added a subtle category badge that wasn't there before but fits the theme! */}
        <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {product.brand}
        </span>
      </Link>

      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Title */}
        <Link href={`/product/${product._id}`}>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Reviews (Spaced properly) */}
        <div className="flex items-center mb-4 mt-auto">
          <div className="flex text-yellow-400 text-sm mr-2">
             {/* We will implement the actual star rating component later, for now we show the number */}
             ★ {product.rating.toFixed(1)}
          </div>
          <span className="text-sm text-gray-500">
            ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-2xl font-black text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          <Link 
            href={`/product/${product._id}`}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide"
          >
            Details 
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Product;