"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
// 1. IMPORT DISPATCH_ACTION AND SCRIPT_LOADING_STATE CONSTANTS FROM PAYPAL
import { PayPalButtons, usePayPalScriptReducer, DISPATCH_ACTION, SCRIPT_LOADING_STATE } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation 
} from '../../../store/ordersApiSlice';

const OrderScreen = () => {
  const params = useParams();
  const orderId = params.id as string;

  // --- DATA FETCHING ---
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation({});
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation({});
  
  // FIX: Pass a fallback string or payload placeholder to satisfy the RTK Query argument requirement
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery(""); 
  
  const { userInfo } = useSelector((state: any) => state.auth);
  
  // --- PAYPAL SCRIPT MANAGEMENT ---
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        // FIX: Use the native object enum type mappings instead of plain strings
        paypalDispatch({
          type: DISPATCH_ACTION.RESET_OPTIONS,
          value: {
            clientId: paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ 
          type: DISPATCH_ACTION.LOADING_STATUS, 
          value: SCRIPT_LOADING_STATE.PENDING 
        });
      };
      
      if (order && !order.isPaid) {
        if (!(window as any).paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  // --- HANDLERS (Untouched Functionality) ---
  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async function (details: any) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        alert('Payment Successful!');
      } catch (err: any) {
        alert(err?.data?.message || err.error);
      }
    });
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { 
            value: Number(order.totalPrice).toFixed(2), 
          },
        },
      ],
    });
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      alert('Order Delivered');
    } catch (err: any) {
      alert(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <h2 className="text-2xl font-semibold text-gray-500 animate-pulse">Loading Order Details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          {(error as any)?.data?.message || (error as any)?.error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        Order <span className="text-blue-600">#{order._id}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 pb-4 border-b border-gray-100">
              Shipping Details
            </h2>
            <div className="space-y-2 mb-4 text-gray-700">
              <p><strong className="text-gray-900">Name:</strong> {order.user?.name}</p>
              <p>
                <strong className="text-gray-900">Email:</strong>{' '}
                <a href={`mailto:${order.user?.email}`} className="text-blue-600 hover:underline">{order.user?.email}</a>
              </p>
              <p>
                <strong className="text-gray-900">Address:</strong>{' '}
                {order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>
            </div>
            
            {order.isDelivered ? (
              <div className="bg-green-50 text-green-800 border-l-4 border-green-500 p-4 rounded-r-md font-medium">
                Delivered on {order.deliveredAt?.substring(0, 10)}
              </div>
            ) : (
              <div className="bg-red-50 text-red-800 border-l-4 border-red-500 p-4 rounded-r-md font-medium">
                Not Delivered
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 pb-4 border-b border-gray-100">
              Payment Method
            </h2>
            <p className="text-gray-700 mb-4">
              <strong className="text-gray-900">Method:</strong> {order.paymentMethod}
            </p>
            
            {order.isPaid ? (
              <div className="bg-green-50 text-green-800 border-l-4 border-green-500 p-4 rounded-r-md font-medium">
                Paid on {order.paidAt?.substring(0, 10)}
              </div>
            ) : (
              <div className="bg-red-50 text-red-800 border-l-4 border-red-500 p-4 rounded-r-md font-medium">
                Not Paid
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 pb-4 border-b border-gray-100">
              Order Items
            </h2>
            <div className="divide-y divide-gray-100">
              {order.orderItems?.map((item: any, index: number) => (
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
                    {item.qty} x ${item.price?.toFixed(2)} = <span className="font-bold">${(item.qty * item.price)?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-medium text-gray-900">${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">${order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-gray-900">${order.taxPrice?.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!order.isPaid && (
              <div className="mt-6">
                {loadingPay && <p className="text-sm text-gray-500 mb-2">Processing Payment...</p>}
                {isPending ? (
                  <p className="text-sm text-blue-500 animate-pulse">Loading PayPal...</p>
                ) : (
                  <div className="z-0 relative">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={(err) => alert(err)}
                    />
                  </div>
                )}
              </div>
            )}

            {loadingDeliver && <p className="text-sm text-gray-500 mt-4">Updating Delivery Status...</p>}
            
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                className="w-full mt-6 py-3 px-4 bg-gray-900 hover:bg-green-600 text-white text-sm font-bold rounded-md uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;