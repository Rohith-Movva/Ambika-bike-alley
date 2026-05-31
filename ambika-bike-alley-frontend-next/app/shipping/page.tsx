"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js native navigation
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../../components/CheckoutSteps';
import { saveShippingAddress } from '../../store/cartSlice';

const ShippingScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // 1. Load existing address from Redux (if they came back to edit)
  const cart = useSelector((state: any) => state.cart);
  const { shippingAddress } = cart;

  // State handles parameters identically to your original code
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. Save data seamlessly into Redux Store
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    
    // 3. Move to Payment Screen via Next.js Router
    router.push('/payment');
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        {/* Progress Tracker Bar */}
        <CheckoutSteps step1 step2 />

        {/* Form Container Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight">
              Shipping Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Where should we send your high-performance gear?
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            
            {/* ADDRESS */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                id="address"
                type="text"
                required
                placeholder="Enter address"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* CITY */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                required
                placeholder="Enter city"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* POSTAL CODE */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                required
                placeholder="Enter postal code"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            {/* COUNTRY */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                id="country"
                type="text"
                required
                placeholder="Enter country"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {/* CONTINUE BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gray-900 hover:bg-blue-600 text-white text-sm font-bold rounded-md uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                Continue to Payment
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ShippingScreen;