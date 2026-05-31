"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa'; // Upgraded from the old FontAwesome <i> tag
import { addToCart, removeFromCart } from '../../store/cartSlice';

const CartScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // 1. Get cart items from Redux Store
  const cart = useSelector((state: any) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product: any, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // If logged in, go to shipping. If not, go to login.
    router.push('/login?redirect=/shipping');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase mb-8 border-b-2 border-gray-200 pb-4">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- LEFT COLUMN: CART ITEMS --- */}
        <div className="lg:col-span-8">
          {cartItems.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-lg flex flex-col items-start shadow-sm">
              <p className="text-lg font-medium mb-4">Your cart is currently empty.</p>
              <Link 
                href="/" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {cartItems.map((item: any) => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-gray-50 transition">
                  
                  {/* Product Image & Name */}
                  <div className="flex items-center w-full sm:w-2/5 mb-4 sm:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain rounded-md bg-white border border-gray-200 mr-4 p-1"
                    />
                    <Link 
                      href={`/product/${item._id}`}
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2"
                    >
                      {item.name}
                    </Link>
                  </div>

                  {/* Price */}
                  <div className="w-full sm:w-1/5 text-lg font-black text-gray-900 mb-4 sm:mb-0 sm:text-center">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity Selector */}
                  <div className="w-full sm:w-1/5 mb-4 sm:mb-0 flex sm:justify-center">
                    <select
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 shadow-sm"
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delete Button */}
                  <div className="w-full sm:w-1/5 flex justify-end">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-3 rounded-full transition-colors"
                      onClick={() => removeFromCartHandler(item._id)}
                      title="Remove from cart"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span>Items ({cartItems.reduce((acc: number, item: any) => acc + item.qty, 0)}):</span>
              <span className="font-medium text-gray-900">
                ${cartItems.reduce((acc: number, item: any) => acc + item.qty * item.price, 0).toFixed(2)}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Subtotal</span>
                <span className="text-2xl font-black text-gray-900">
                  ${cartItems.reduce((acc: number, item: any) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className={`w-full py-4 px-4 rounded-md font-bold text-white uppercase tracking-wider transition-all shadow-md ${
                cartItems.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-blue-600 hover:shadow-lg'
              }`}
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartScreen;