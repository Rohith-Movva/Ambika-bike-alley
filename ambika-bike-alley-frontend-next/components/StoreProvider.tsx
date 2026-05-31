"use client";

import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import store from "../store/store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PayPalScriptProvider options={{ clientId: "test" }} deferLoading={true}>
        {children}
      </PayPalScriptProvider>
    </Provider>
  );
}