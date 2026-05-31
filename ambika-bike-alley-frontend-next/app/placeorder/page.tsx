"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Next.js routing
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../../components/CheckoutSteps';
import { useCreateOrderMutation } from '../../store/ordersApiSlice';
import { clearCartItems } from '../../store/cartSlice';

const PlaceOrderScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);

  // We will need to migrate the ordersApiSlice next for this to work!
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    // If they haven't picked a shipping address or payment method, send them back
    if (!cart.shippingAddress.address) {
      router.push('/shipping');
    } else if (!cart.paymentMethod) {
      router.push('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, router]);

  const placeOrderHandler = async () => {
    try {
      // 1. Send data to Backend
      const res = await createOrder({
        orderItems: cart.cartItems.map((item: any) => ({
          ...item,
          product: item._id, // The Translation map
          _id: undefined,    // Clean up the old ID
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      // 2. Clear the cart
      dispatch(clearCartItems());

      // 3. Redirect to the Receipt Page (Order Details)
      router.push(`/order/${res._id}`);
    } catch (err: any) {
      alert(err?.data?.message || err.error || "Failed to place order.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Progress Tracker Bar (Now highlighting Step 4) */}
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        
        {/* --- LEFT COLUMN: ORDER DETAILS --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 pb-4 border-b border-gray-100">
              Shipping
            </h2>
            <p className="text-gray-700">
              <strong className="text-gray-900 font-semibold mr-2">Address:</strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 pb-4 border-b border-gray-100">
              Payment Method
            </h2>
            <p className="text-gray-700">
              <strong className="text-gray-900 font-semibold mr-2">Method:</strong>
              {cart.paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 pb-4 border-b border-gray-100">
              Order Items
            </h2>
            
            {cart.cartItems.length === 0 ? (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-md">Your cart is empty</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.cartItems.map((item: any, index: number) => (
                  <div key={index} className="py-4 flex items-center">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-md border border-gray-200 p-1 mr-4">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product}`} className="text-sm font-bold text-gray-900 hover:text-blue-600 truncate block">
                        {item.name}
                      </Link>
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-900">
                      {item.qty} x ${item.price.toFixed(2)} = <span className="font-bold">${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-medium text-gray-900">${cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">${cart.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-gray-900">${cart.taxPrice}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">${cart.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">
                {(error as any)?.data?.message || (error as any)?.error}
              </div>
            )}

            <button
              type="button"
              className={`w-full mt-8 py-4 px-4 rounded-md font-bold text-white uppercase tracking-wider transition-all shadow-md ${
                cart.cartItems.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-blue-600 hover:shadow-lg'
              }`}
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrderScreen;