"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Next.js native navigation hooks
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../store/usersApiSlice';
import { setCredentials } from '../../store/authSlice';
import { Suspense } from 'react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();
  
  // Next.js hook to read URL query params like ?redirect=/shipping
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  // Handle automatic redirects if already authenticated
  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [router, redirect, userInfo]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Call the API (your exact logic)
      const res = await login({ email, password }).unwrap();
      
      // 2. Save result to Redux/Local Storage
      dispatch(setCredentials({ ...res }));
      
      // 3. Redirect using Next.js router
      router.push(redirect);
    } catch (err: any) {
      alert(err?.data?.message || err.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Centered Premium Auth Card */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
            Sign In
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Welcome back to Ambika Bike Alley
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">
            
            {/* EMAIL INPUT */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

          </div>

          {/* SIGN IN BUTTON */}
          <div>
            <button
              disabled={isLoading}
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white uppercase tracking-wider transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-blue-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* REGISTRATION LINK */}
        <div className="text-center pt-4 border-t border-gray-100 text-sm text-gray-600">
          New Customer?{' '}
          <Link 
            href={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}
            className="font-bold text-blue-600 hover:text-blue-800 transition underline"
          >
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

// Create a wrapper component to handle the Suspense boundary
const LoginScreenWithSuspense = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginScreen />
    </Suspense>
  );
};

export default LoginScreenWithSuspense;