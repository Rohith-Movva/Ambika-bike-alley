"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; 
import { FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../store/usersApiSlice';
import { logout } from '../store/authSlice'; 


const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();


  // Initialize the API mutation
  const [logoutApiCall] = useLogoutMutation();

    const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = useSelector((state: any) => state.cart);
  const { cartItems } = cart;



  const auth = useSelector((state: any) => state.auth);
  const { userInfo } = auth;

  // --- THE UPDATED LOGOUT FUNCTION ---
  const logoutHandler = async () => {
    try {
      // 1. Call the backend to destroy the HTTP-only cookie
      await logoutApiCall({}).unwrap();
      
      // 2. Clear out the local Redux state and localStorage
      dispatch(logout());
      
      // 3. Redirect to login
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link href="/" className="text-xl font-bold hover:text-gray-300 transition">
            Ambika Bike Alley
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-6">
            
            {/* CART LINK */}

            <Link href="/cart" className="flex items-center hover:text-gray-300 transition relative">
              <FaShoppingCart className="mr-2" /> Cart
              
              {/* UPDATE THIS BLOCK TO INCLUDE 'mounted &&' */}
              {mounted && cartItems.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((acc: any, item: any) => acc + item.qty, 0)}
                </span>
              )}
            </Link>


            {/* USER MENU */}
            {mounted && userInfo ? ( // <-- Add 'mounted &&' here
            <div className="relative group">
                <button className="flex items-center hover:text-gray-300 transition">
                <FaUser className="mr-2" /> {userInfo.name}
                </button>
                {/* Dropdown Menu */}
                {/* <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                </Link>
                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                </button>
                </div> */}
                
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                    {/* Move your Links inside this inner wrapper */}
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                    </Link>
                    <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                    </button>
                </div>
                </div>


            </div>
            ) : mounted ? ( // <-- Add 'mounted ?' here instead of just ':'
            <Link href="/login" className="flex items-center hover:text-gray-300 transition">
                <FaUser className="mr-2" /> Sign In
            </Link>
            ) : null} {/* <-- Add ': null' at the very end so it stays blank for a split second on the server */}




            {/* ADMIN MENU */}
            {userInfo && userInfo.isAdmin && (
               <div className="relative group">
               <button className="flex items-center text-yellow-400 hover:text-yellow-200 transition">
                 Admin
               </button>
               {/* Dropdown Menu */}



               <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                    <Link href="/admin/productlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Products</Link>
                    <Link href="/admin/userlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Users</Link>
                    <Link href="/admin/orderlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                </div>
                </div>
             </div>
            )}
          </nav>

          {/* MOBILE MENU BUTTON (Hidden on Desktop) */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-300 hover:text-white">
              <FaBars size={24} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;