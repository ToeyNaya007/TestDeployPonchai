import React from "react";
import MyRouter from "routers/index";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { OptionsProvider, useOptions } from "./containers/OptionsContext";
import { UserProvider, useUser } from "containers/UsersContext";
import { CartProvider } from "containers/CartContext";
import { LoginPopupProvider, useLoginPopup } from "containers/LoginPopupContext";
import { CustomerProvider } from "containers/CustomerContext";
import { CategoryProvider } from "containers/CategoryContext";

function App() {

  const { foundSystemValue } = useOptions();
  return (
    <HelmetProvider>
      <Helmet>
        <title>{foundSystemValue}</title>
        <meta charSet="utf-8" />
        <meta name="description" content="Ponchaishop" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Helmet>
      {/* MAIN APP */}
      <div className="bg-white text-base dark:bg-slate-900 text-slate-900 dark:text-slate-200">
        <MyRouter />
        <div id="google_translate_element2"></div>
      </div>
    </HelmetProvider>
  );
}

export default function WrappedApp() {
  return (
    <OptionsProvider>
      <CustomerProvider>
        <LoginPopupProvider>
          <CategoryProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </CategoryProvider>
        </LoginPopupProvider>
      </CustomerProvider>
    </OptionsProvider>
  );
}
