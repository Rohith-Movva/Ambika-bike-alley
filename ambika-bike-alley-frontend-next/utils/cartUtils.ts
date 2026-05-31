export const addDecimals = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state: any) => {
  // 1. Calculate Items Price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc: number, item: any) => acc + item.price * item.qty, 0)
  );

  // 2. Shipping Price (If order > $100, free. Else $10)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // 3. Tax Price (15% tax)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  // 4. Total Price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // 5. Save to Local Storage (Next.js SSR safe!)
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(state));
  }

  return state;
};