"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '@/store/usersApiSlice';
import { setCredentials } from '@/store/authSlice';

// 1. Separate component to safely handle Next.js searchParams requirements
const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  // Safely grab redirect target string from URL
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If user session exists, auto-redirect them away from sign-up screen
    if (userInfo) {
      router.push(redirect);
    }
  }, [router, redirect, userInfo]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        router.push(redirect);
      } catch (err: any) {
        alert(err?.data?.message || err.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6">
        Sign Up
      </h1>
      
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none transition text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none transition text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none transition text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none transition text-gray-900"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md transition-colors uppercase tracking-wider text-sm mt-6"
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
        Already have an account?{' '}
        <Link 
          href={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'} 
          className="font-bold text-gray-900 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

// 2. Main screen wrapped in Suspense (Mandatory for next.js useSearchParams handling)
const RegisterScreen = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<div className="text-center text-gray-500">Loading form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default RegisterScreen;