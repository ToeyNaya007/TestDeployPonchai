import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import BagIcon from "./BagIcon";
import ModalQuickView from "./ModalQuickViewCustomNew";
import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import Prices from "./Prices";
import { useOptions } from "containers/OptionsContext";
import { useCartContext } from "containers/CartContext";
import { ProductProp } from "data/productTypes";
import AlertService from "./AlertServicce";
import Auth from "utils/Auth";
import Cookies from "js-cookie";
import { useLoginPopup } from "containers/LoginPopupContext";
import { checkAuthNow } from "utils/checkAuthNow";


const ProductCardCustom: FC<{
  product: ProductProp;
  fetchProductSavelist?: () => void;
  className?: string;
}> = ({ product, fetchProductSavelist, className }) => {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const { cartCount, setCartCount } = useCartContext();

  const [showModalQuickView, setShowModalQuickView] = React.useState(false);
  const [qualitySelected, setQualitySelected] = useState(1);
  const [isLiked, setIsLiked] = useState(product.savelist || false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  //const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { showLoginPopup, setShowLoginPopup } = useLoginPopup();
  const currentUserId = Cookies.get("ponchaishop_userID") || "";


  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const notifyAddTocart = async () => {
    if (!basePath) return;
    const isAuthenticated = await checkAuthNow(basePath);
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    try {
      const response = await fetch(`${basePath}api/AddToCart/index.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.ID,
          quantity: qualitySelected,
          user_id: currentUserId,
          coolingCondition: product.coolingCondition
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

  const handleLike = async () => {
    if (!basePath) return;
    const isAuthenticated = await checkAuthNow(basePath);
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    const endpoint = isLiked ? `${basePath}api/product/frontend/savelistRemove.php` : `${basePath}api/product/frontend/savelistAdd.php`;
    try {
      // ส่งข้อมูลที่อยู่ไปยัง API เพื่ออัพเดท
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ userID: currentUserId, pID: product.ID.toString() }).toString(),
      });
      const text = await response.text();
      const result = JSON.parse(text);
      if (result.status !== 200) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึกสินค้า");
        AlertService.showError("เกิดข้อผิดพลาด", result.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่");
      } else if (result.status == 409) {
        AlertService.showError("เกิดข้อผิดพลาด", result.message);
      }
      setIsLiked(!isLiked);
      // ถ้าเลือกเป็นที่อยู่หลัก อัพเดทที่อยู่หลักต่อ
      if (isLiked) {
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
                ลบสินค้าที่ชอบสำเร็จ !
              </p>
              <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
              {renderProductSavelistOnNotify(t.id)}
            </Transition>
          ),
          { position: "top-right", id: "nc-product-notify", duration: 3000 }
        );
      } else {
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
                เพิ่มสินค้าที่ชอบสำเร็จ !
              </p>
              <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
              {renderProductSavelistOnNotify(t.id)}
            </Transition>
          ),
          { position: "top-right", id: "nc-product-notify", duration: 3000 }
        );
      }

      if (fetchProductSavelist) {
        setTimeout(() => {
          fetchProductSavelist();
        }, 1000);
      }
    } catch (error) {
      AlertService.showError("เกิดข้อผิดพลาด", (error as Error).message);
    }
  };

  const renderProductSavelistOnNotify = (id: string) => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{product?.title}</h3>
              </div>
              <Prices price={product?.price} className="mt-0.5 min-w-24 w-auto" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <div className="flex">
              <Link
                to={"/account-savelists"}
                className="font-medium text-primary-6000 dark:text-primary-500 ">
                ไปที่รายการที่ถูกใจ
              </Link>
            </div>
            <div className="flex">
              <button
                onClick={() => toast.dismiss(id)}
                className=""
                title="ปิดการแจ้งเตือน"
              >
                <i className="text-3xl las la-times-circle text-slate-400/30 hover:text-slate-400 transition-colors"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium">{product.title}</h3>

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

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-slate-100 dark:bg-slate-800 rounded-3xl ${className ?? ""}`}
        data-nc-id="ProductCard"
      >
        <Link to={`/p/${product.slug}/${product.ID}`} className="absolute inset-0" />
        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-t-3xl overflow-hidden z-1 group">
          <Link to={`/p/${product.slug}/${product.ID}`} className="block">
            <div className="flex w-full h-full">
              <img
                src={imageError ? `${basePath}assets/images/category/default.svg` : product.image}
                alt={product.title}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="object-cover w-full h-full drop-shadow-xl"
              />
            </div>
          </Link>
          {!imageLoaded && !imageError && <div className="w-full h-full ">กำลังโหลดรูปภาพ</div>}
          <div className="flex flex-row justify-between">
            <div className="absolute top-3 right-3 z-10">
              <button className="p-2 bg-white rounded-full shadow-lg" onClick={handleLike} title={isLiked ? "อยู่ในรายการสินค้าที่ถูกใจ" : "เพิ่มเข้าสินค้าที่ถูกใจ"}>
                {/* Heart Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isLiked ? "red" : "none"}
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
              {product.title}
            </p>

          </div>

          {/* Price, discount, and rating section */}
          <div className="flex  pt-4 space-y-2  sm:justify-between sm:items-end sm:space-y-0">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex items-center border-2 border-green-500 rounded-lg py-1 px-2 text-sm font-medium">
                <span className="text-green-500 !leading-none">฿ {product.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            {product?.oldPrice && product?.oldPrice > product?.price && (
              <div className="flex items-center">
                <span className="text-sm ml-1 leading-none line-through text-slate-500"> ฿ {product?.oldPrice}</span>
              </div>
            )}

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
