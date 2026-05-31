"use client"; // Required because we are using Redux hooks (Client-side functionality)

import React from 'react';
import Product from '../components/Product';
// Your exact Redux hook logic remains completely untouched!
import { useGetProductsQuery } from '../store/productsApiSlice'; 

const HomeScreen = () => {
  // We use your exact same state variables
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isLoading ? (
        // Upgraded the simple "Loading..." text to a more professional centered spinner/message
        <div className="flex justify-center items-center h-64">
          <h2 className="text-2xl font-semibold text-gray-500 animate-pulse">
            Loading latest inventory...
          </h2>
        </div>
      ) : error ? (
        // Upgraded the error message to a highly visible alert box
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-8 shadow-sm">
          <p className="font-bold">Error loading products</p>
          <p>{(error as any)?.data?.message || (error as any)?.error || "Something went wrong"}</p>
        </div>
      ) : (
        <>
          {/* A premium section header fitting the Bike Shop theme */}
          <div className="border-b-2 border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
              Latest Arrivals
            </h1>
            <p className="text-gray-500 mt-2">Explore our newest high-performance bicycles and gear.</p>
          </div>

          {/* Replaced Bootstrap <Row> and <Col> with Tailwind CSS Grid.
            - grid-cols-1: Mobile view (1 item per row)
            - sm:grid-cols-2: Tablet view (2 items per row)
            - lg:grid-cols-3: Small desktop (3 items per row)
            - xl:grid-cols-4: Large desktop (4 items per row)
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <div key={product._id} className="flex justify-center">
                {/* Your Product component call remains exactly the same */}
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeScreen;