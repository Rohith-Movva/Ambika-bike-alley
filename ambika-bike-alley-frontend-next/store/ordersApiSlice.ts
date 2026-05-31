import { apiSlice } from './apiSlice';
import { ORDERS_URL } from './constants'; // <-- Adjusted to look in the same folder

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Create Order
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order },
      }),
    }),
    
    // 2. Get Order Details
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // 3. PayPal Client ID config
    getPaypalClientId: builder.query({
      query: () => ({
        url: '/api/config/paypal',
      }),
      keepUnusedDataFor: 5,
    }),

    // 4. Mark order as paid
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: { ...details },
      }),
    }),

    // 5. Get ALL orders (Admin only)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    // 6. Mark order as delivered
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`, // We will build this backend route next!
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetPaypalClientIdQuery, 
  useGetOrdersQuery, 
  useDeliverOrderMutation,
  useGetMyOrdersQuery
} = ordersApiSlice;