import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import BagIcon from "./BagIcon";
import ModalQuickView from "./ModalQuickViewCustom";
import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import Prices from "./Prices";
import { useOptions } from "containers/OptionsContext";
import { useCartContext } from "containers/CartContext";

export interface ProductCardProps {
  className?: string;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    rating: string;
    reviews: string;
    description: string;
    saleStatus: number;
    oldprice: number;
    score: number;
    allOfSizes: string[];
    sizes: string[];
    status: string;
    detail: string;

  };
}

const ProductCardCustom: FC<ProductCardProps> = ({ className = "", product }) => {

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');

  const { cartCount, setCartCount } = useCartContext();


  const [sizeSelected, setSizeSelected] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : "");
  const [showModalQuickView, setShowModalQuickView] = React.useState(false);
  const [qualitySelected, setQualitySelected] = useState(1);

  const notifyAddTocart = async () => {
    const currentUserId = "1008";
    try {
      const response = await fetch(`${basePath}api/AddToCart/index.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: qualitySelected,
          user_id: currentUserId
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Response is not valid JSON:', text);
        throw new Error('Invalid JSON response from server');
      }

      if (data.success) {
        setCartCount(cartCount + 1);
        toast.custom(
          (t) => (
            <Transition
              appear
              show={t.visible}
              className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
              enter="transition-all duration-150"
              enterFrom="opacity-0 translate-x-20"
              enterTo="opacity-100 translate-x-0"
              leave="transition-all duration-150"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-20"
            >
              <p className="block text-base font-semibold leading-none">
                เพิ่มไปในตะกร้าสำเร็จ !
              </p>
              <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
              {renderProductCartOnNotify()}
            </Transition>
          ),
          { position: "top-right", id: "nc-product-notify", duration: 3000 }
        );
      } else {
        toast.error(data.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };



  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{sizeSelected || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : "XL")}</span>
                </p>

              </div>
              <Prices price={product?.price} className="mt-0.5 min-w-24 w-auto" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">

            <p className="text-gray-500 dark:text-slate-400">จำนวน {qualitySelected}</p>

            <div className="flex">
              <Link
                to={"/cart"}
                className="font-medium text-primary-6000 dark:text-primary-500 ">
                ไปที่ตะกร้า
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const discountPercentage = product.oldprice
    ? ((product.oldprice - product.price) / product.oldprice) * 100
    : 0;

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-slate-100 rounded-3xl ${className}`}
        data-nc-id="ProductCard"
      >
        <Link to={`/p/${product.name}/${product.id}`} className="absolute inset-0" />
        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-t-3xl overflow-hidden z-1 group">
          <Link to={`/p/${product.name}/${product.id}`} className="block">
            <div className="flex w-full h-full">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full drop-shadow-xl"
              />
            </div>
          </Link>
          <div className="flex flex-row justify-between">
            <div className="absolute top-3 right-3 z-10">
              <button className="p-2 bg-white rounded-full shadow-lg">
                {/* Heart Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
            </div>

          </div>

          <div className="flex flex-col space-y-2 absolute bottom-0 group-hover:bottom-4 inset-x-1 justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <ButtonPrimary
              className="shadow-lg"
              fontSize="text-xs"
              sizeClass="py-2 px-4"
              onClick={() => notifyAddTocart()}
            >
              <BagIcon className="w-3.5 h-3.5 mb-0.5" />
              <span className="ml-1">เพิ่มลงตะกร้า</span>
            </ButtonPrimary>
            <ButtonSecondary
              className="ml-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
              fontSize="text-xs"
              sizeClass="py-2 px-4"
              onClick={() => setShowModalQuickView(true)}
            >
              <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
              <span className="ml-1">ดูแบบด่วน</span>
            </ButtonSecondary>
          </div>


        </div>

        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          <div>
            <p className="nc-ProductCard__title text-[16px] font-semibold transition-colors truncate">
              {product.name}
            </p>

          </div>

          {/* Price, discount, and rating section */}
          <div className="flex flex-col pt-4 space-y-2 sm:flex-row sm:justify-between sm:items-end sm:space-y-0">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex items-center border-2 border-green-500 rounded-lg py-1 px-2 text-sm font-medium">
                <span className="text-green-500 !leading-none">฿ {product.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              {product?.saleStatus == 1 && (
                <span className="text-gray-400 !leading-none line-through my-1">
                  ฿ {product.oldprice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
            <div className="flex items-center">
              {product?.saleStatus == 1 && (
                <div className="nc-shadow-lg rounded-full flex items-center w-24 justify-center relative px-2.5 py-1.5 text-xs bg-customRed text-slate-50 animate-slide-slow">
                  {/* Discount Icon */}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.9889 14.6604L2.46891 13.1404C1.84891 12.5204 1.84891 11.5004 2.46891 10.8804L3.9889 9.36039C4.2489 9.10039 4.4589 8.59038 4.4589 8.23038V6.08036C4.4589 5.20036 5.1789 4.48038 6.0589 4.48038H8.2089C8.5689 4.48038 9.0789 4.27041 9.3389 4.01041L10.8589 2.49039C11.4789 1.87039 12.4989 1.87039 13.1189 2.49039L14.6389 4.01041C14.8989 4.27041 15.4089 4.48038 15.7689 4.48038H17.9189C18.7989 4.48038 19.5189 5.20036 19.5189 6.08036V8.23038C19.5189 8.59038 19.7289 9.10039 19.9889 9.36039L21.5089 10.8804C22.1289 11.5004 22.1289 12.5204 21.5089 13.1404L19.9889 14.6604C19.7289 14.9204 19.5189 15.4304 19.5189 15.7904V17.9403C19.5189 18.8203 18.7989 19.5404 17.9189 19.5404H15.7689C15.4089 19.5404 14.8989 19.7504 14.6389 20.0104L13.1189 21.5304C12.4989 22.1504 11.4789 22.1504 10.8589 21.5304L9.3389 20.0104C9.0789 19.7504 8.5689 19.5404 8.2089 19.5404H6.0589C5.1789 19.5404 4.4589 18.8203 4.4589 17.9403V15.7904C4.4589 15.4204 4.2489 14.9104 3.9889 14.6604Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M9 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M14.4945 14.5H14.5035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M9.49451 9.5H9.50349" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="ml-1 leading-none ">ลด {Math.round(discountPercentage)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalQuickView
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
        product={product}
      />
    </>
  );
};

export default ProductCardCustom;
