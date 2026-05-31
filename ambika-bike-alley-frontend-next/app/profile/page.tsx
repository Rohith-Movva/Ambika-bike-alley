"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaCheck } from 'react-icons/fa';

// We will need to update your slices to include these two hooks!
import { useProfileMutation } from '../../store/usersApiSlice';
import { useGetMyOrdersQuery } from '../../store/ordersApiSlice';
import { setCredentials } from '../../store/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: any) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading: loadingOrders, error } = useGetMyOrdersQuery({});

  useEffect(() => {
    // Protect the route: Kick them to login if not logged in
    if (!userInfo) {
      router.push('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, router]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        setPassword('');
        setConfirmPassword('');
        alert('Profile updated successfully!');
      } catch (err: any) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* --- LEFT COLUMN: UPDATE PROFILE FORM --- */}
        <div className="md:col-span-3">
          <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight mb-6">
            User Profile
          </h2>
          
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingUpdateProfile}
              className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors uppercase tracking-wider text-sm mt-4"
            >
              {loadingUpdateProfile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* --- RIGHT COLUMN: ORDER HISTORY TABLE --- */}
        <div className="md:col-span-9">
          <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight mb-6">
            My Orders
          </h2>
          
          {loadingOrders ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              {(error as any)?.data?.message || (error as any)?.error}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="bg-blue-50 text-blue-800 p-4 rounded-md">
              You do not have any past orders yet. <Link href="/" className="font-bold hover:underline">Go Shopping!</Link>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id.substring(0, 10)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {order.isPaid ? (
                          <span className="text-green-500">{order.paidAt.substring(0, 10)}</span>
                        ) : (
                          <FaTimes className="text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {order.isDelivered ? (
                          <span className="text-green-500">{order.deliveredAt.substring(0, 10)}</span>
                        ) : (
                          <FaTimes className="text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/order/${order._id}`} className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-1.5 px-3 rounded text-xs font-bold transition">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;