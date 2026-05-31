"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js native routing
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../../components/CheckoutSteps';
import { savePaymentMethod } from '../../store/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state: any) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    // If no shipping address exists in Redux, kick them back to shipping screen
    if (!shippingAddress || !shippingAddress.address) {
      router.push('/shipping');
    }
  }, [shippingAddress, router]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    router.push('/placeorder');
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        {/* Progress Tracker Bar (Now highlighting Step 3) */}
        <CheckoutSteps step1 step2 step3 />

        {/* Form Container Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight">
              Payment Method
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select how you would like to securely pay for your order.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Custom Tailwind Radio Selection */}
            <div className="space-y-4">
              <label 
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'PayPal' 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  id="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-4 font-bold text-gray-900">
                  PayPal or Credit Card
                </span>
              </label>
              
              {/* Note: You can easily add a Stripe option right here in the future! */}
            </div>

            {/* CONTINUE BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gray-900 hover:bg-blue-600 text-white text-sm font-bold rounded-md uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                Continue to Final Review
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default PaymentScreen;