import React, { Component } from "react";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import Footer from "shared/Footer/Footer";
import PageHome from "containers/PageHome/PageHome";
import Page404 from "containers/Page404/Page404";
import AccountPage from "containers/AccountPage/AccountPage";
import PageContact from "containers/PageContact/PageContact";
import PageAbout from "containers/PageAbout/PageAbout";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageSubcription from "containers/PageSubcription/PageSubcription";
import BlogPage from "containers/BlogPage/BlogPage";
import BlogSingle from "containers/BlogPage/BlogSingle";
import SiteHeader from "containers/SiteHeader";
import PageCollection from "containers/PageCollection";
import PageSearch from "containers/PageSearch";
import PageHome2 from "containers/PageHome/PageHome2";
import PageHome3 from "containers/PageHome/PageHome3";
import ProductDetailPage2 from "containers/ProductDetailPage/ProductDetailPage2";
import AccountSavelists from "containers/AccountPage/AccountSavelists";
import AccountPass from "containers/AccountPage/AccountPass";
import AccountBilling from "containers/AccountPage/AccountBilling";
import CartPage from "containers/ProductDetailPage/CartPage";
import CheckoutPage from "containers/PageCheckout/CheckoutPage";
import PageCollection2 from "containers/PageCollection2";
import AccountShopPage from "containers/AccountShopPage/AccountShopPage";
import AccountOrderPage from "containers/AccountShopPage/AccountOrder";
import AccountWaitingPay from "containers/AccountShopPage/WaitingPay";
import AccountDeliveryDone from "containers/AccountShopPage/DeliveryDone";
import AccountDeliveryProduct from "containers/AccountShopPage/DeliveryProduct";
import AccountPreparingProduct from "containers/AccountShopPage/PreparingProduct";
import { Toaster } from "react-hot-toast";
import AccountAddress from "containers/AccountPage/AccountAddress";
import ProductDetailPage from "containers/ProductDetailPage/ProductDetailPage";
import AccountShopPage2 from "containers/AccountShopPage/AccountShopPage copy";
import PageCategory from "containers/PageCategory";
import PageProductList from "containers/PageProductList";
import TermsConditions from "containers/PageTermsConditions";
import PrivacyPolicy from "containers/PagePrivacyPolicy";
import PageLogin from "containers/PageLogin/PageLogin2";
import ProtectedRoute from "./ProtectedRoute";
import LoginNotifyPopup from "components/LoginNotifyPopup";
import TurnOnNotify from "containers/PageLogin/PageTurnOnNotify";
import TurnNotifyPopup from "components/TurnNotifyPopup";
import DeliveryArea from "containers/GetStartPage/DeliveryArea";
import OrderAndPayment from "containers/GetStartPage/OrderAndPayment";
import RegisterGuide from "containers/GetStartPage/RegisterGuide";
import testPage from "containers/GetStartPage/testPage";



export const pages: Page[] = [
  { path: "/", component: PageHome },
  { path: "/home2", component: PageHome2 },
  { path: "/home3", component: PageHome3 },
  //
  { path: "/home-header-2", component: PageHome },
  { path: "/p/:productName/:id", component: ProductDetailPage },
  { path: "/product-detail-2", component: ProductDetailPage2 },
  //
  { path: "/page-collection-2", component: PageCollection2 },
  { path: "/page-collection", component: PageCollection },
  { path: "/page-search", component: PageSearch },
  //
  { path: "/account", component: AccountPage },
  { path: "/account-savelists", component: (props) => <AccountSavelists products={[]} {...props} /> },
  { path: "/account-change-password", component: AccountPass },
  { path: "/account-billing", component: AccountBilling },
  { path: "/account-address", component: AccountAddress },
  //
  { path: "/cart", component: CartPage },
  { path: "/checkout", component: CheckoutPage },
  //
  { path: "/blog", component: BlogPage },
  { path: "/blog-single", component: BlogSingle },
  //
  { path: "/contact", component: PageContact },
  { path: "/about", component: PageAbout },
  { path: "/signup", component: PageSignUp },
  { path: "/login", component: PageLogin },
  { path: "/TurnOnNotify/:userIDFromMessageAPI", component: TurnOnNotify },
  { path: "/subscription", component: PageSubcription },

  { path: "/accountshop/:status", component: AccountShopPage },
  { path: "/accountshop2", component: AccountShopPage2 },
  { path: "/accountshop-order", component: AccountOrderPage },
  { path: "/accountshop-waitingpay", component: AccountWaitingPay },
  { path: "/accountshop-deliverydone", component: AccountDeliveryDone },
  { path: "/accountshop-deliveryproduct", component: AccountDeliveryProduct },
  { path: "/accountshop-preparingproduct", component: AccountPreparingProduct },

  { path: "/category/:id", component: PageCategory },
  { path: "/product-list/:action", component: PageProductList },
  { path: "/termsconditions", component: TermsConditions },
  { path: "/privacy", component: PrivacyPolicy },
  { path: "/register-guide", component: RegisterGuide },
  { path: "/order-and-payment", component: OrderAndPayment },
  { path: "/delivery-area", component: DeliveryArea },

  { path: "/testpage", component: testPage },

  { path: "/404", component: Page404 },

];

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <ScrollToTop />
      <SiteHeader />
      <LoginNotifyPopup />
      <Routes>
        {pages.map(({ component: Component, path }, index) => {
          // หน้าที่จำเป็นต้องล็อคอินก่อนเข้าถึง
          const protectedPaths = ["/cart", "/account", "/account-savelists", "/account-change-password", "/account-billing", "/account-address", "/accountshop/:status", "/TurnOnNotify/:userIDFromMessageAPI"];
          return protectedPaths.includes(path) ? (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route key={index} path={path} element={<Component />} />
          );
        })}
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MyRoutes;
