import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import LikeButton from "components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "components/BagIcon";
import NcInputNumber from "components/NcInputNumber";
import Prices from "components/Prices";
import toast from "react-hot-toast";
import NotifyAddTocart from "./NotifyAddTocart";
import AccordionInfo from "containers/ProductDetailPage/AccordionInfoForQuickView";
import { Link } from "react-router-dom";
import detail1JPG from "images/products/detail1.jpg";
import detail2JPG from "images/products/detail2.jpg";
import detail3JPG from "images/products/detail3.jpg";
import { useOptions } from "containers/OptionsContext";
import { ProductProp } from "data/productTypes";
import { Transition } from "@headlessui/react";
import { useLoginPopup } from "containers/LoginPopupContext";
import Cookies from "js-cookie";
import Auth from "utils/Auth";
import { checkAuthNow } from "utils/checkAuthNow";


export interface ProductQuickViewProps {
  className?: string;
  product: ProductProp;
  onClose?: () => void;
}

const ProductQuickView: FC<ProductQuickViewProps> = ({ className = "", product, onClose }) => {
  const [variantActive, setVariantActive] = useState(0);
  const [qualitySelected, setQualitySelected] = useState(1);
  const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];
  const [sizeSelected, setSizeSelected] = React.useState("");
  const [total, setTotal] = useState(0);
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const basePathImage = getOptionByName('siteurl');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { showLoginPopup, setShowLoginPopup } = useLoginPopup();
  const userID = Cookies.get("ponchaishop_userID") || "";


  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    setTotal(product?.price * qualitySelected)
  }, [qualitySelected, product]);


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
          user_id: userID,
          coolingCondition: sizeSelected
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
            src={imageError ? `${basePath}assets/images/category/default.svg` : product.image}
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
              <Prices price={(product?.price) * qualitySelected} className="mt-0.5 min-w-24 w-auto" />
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
  const renderSizeList = () => {
    // Check if product and its sizes are defined
    return (
      <div className="">
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="">
              ตัวเลือกสินค้า:
              <span className="ml-1 font-semibold">{Number(sizeSelected) === 2 ? ("แช่เย็น") : ("ไม่แช่เย็น")}</span>
            </span>
          </label>
        </div>
        <div className="flex gap-2 mt-3">
          {product.sizes.map((size: string, index: number) => {  // Explicitly define types here
            const isActive = size === sizeSelected;
            return (
              <div
                key={index}
                className={`relative p-2 w-20 sm:w-36 h-10 sm:h-11 rounded-2xl shadow-md border flex items-center justify-center 
                text-sm sm:text-base font-medium uppercase select-none overflow-hidden z-0 cursor-pointer
                  ${isActive
                    ? " border-2 border-green-500 bg-white dark:bg-slate-900"
                    : " bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800"
                  }`}
                onClick={() => {
                  setSizeSelected(size);
                }}
              >
                {Number(size) === 2 ? ("แช่เย็น") : ("ไม่แช่เย็น")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold hover:text-primary-6000 transition-colors">
            <Link to={`/p/${product.title}/${product.ID}`} onClick={onClose}>{product.title}</Link>
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={product?.price}
            />
            {product?.discountStatus === 1 && (
              <div className="flex items-center text-lg font-semibold">
                <span className="text-gray-400 line-through decoration-2">
                  ฿ {product?.oldPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="h-6 border-l border-slate-300 dark:border-slate-700"></div>
            {product?.discountStatus === 1 && (
              <div className="nc-shadow-lg rounded-full flex items-center justify-center relative px-2.5 py-1.5 text-xs bg-customRed text-slate-50 animate-slide-slow">
                {/* Discount Icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.9889 14.6604L2.46891 13.1404C1.84891 12.5204 1.84891 11.5004 2.46891 10.8804L3.9889 9.36039C4.2489 9.10039 4.4589 8.59038 4.4589 8.23038V6.08036C4.4589 5.20036 5.1789 4.48038 6.0589 4.48038H8.2089C8.5689 4.48038 9.0789 4.27041 9.3389 4.01041L10.8589 2.49039C11.4789 1.87039 12.4989 1.87039 13.1189 2.49039L14.6389 4.01041C14.8989 4.27041 15.4089 4.48038 15.7689 4.48038H17.9189C18.7989 4.48038 19.5189 5.20036 19.5189 6.08036V8.23038C19.5189 8.59038 19.7289 9.10039 19.9889 9.36039L21.5089 10.8804C22.1289 11.5004 22.1289 12.5204 21.5089 13.1404L19.9889 14.6604C19.7289 14.9204 19.5189 15.4304 19.5189 15.7904V17.9403C19.5189 18.8203 18.7989 19.5404 17.9189 19.5404H15.7689C15.4089 19.5404 14.8989 19.7504 14.6389 20.0104L13.1189 21.5304C12.4989 22.1504 11.4789 22.1504 10.8589 21.5304L9.3389 20.0104C9.0789 19.7504 8.5689 19.5404 8.2089 19.5404H6.0589C5.1789 19.5404 4.4589 18.8203 4.4589 17.9403V15.7904C4.4589 15.4204 4.2489 14.9104 3.9889 14.6604Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M9 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M14.4945 14.5H14.5035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M9.49451 9.5H9.50349" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="ml-1 leading-none ">ประหยัด ฿ {product?.oldPrice - product?.price}</span>
              </div>
            )}
            <div className="flex items-center">
              <Link
                to={`p/${product.title}/${product.ID}`}
                className="flex items-center text-sm font-medium"
              >
              </Link>
            </div>
          </div>
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="">{renderSizeList()}</div>
        )}

        <div className="flex space-x-3.5">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
            />
          </div>
          <ButtonPrimary
            className={`flex-1 flex-shrink-0 ${product.sizes.length > 0 && !sizeSelected ? "bg-slate-600 dark:bg-slate-500 dark:text-slate-300" : ""}`}
            onClick={product.sizes.length > 0 ? (sizeSelected ? notifyAddTocart : undefined) : notifyAddTocart}
            disabled={product.sizes.length > 0 && !sizeSelected}
          >
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ml-3">เพิ่มลงตะกร้า {total.toLocaleString(undefined, { minimumFractionDigits: 0 })} บาท</span>
          </ButtonPrimary>

        </div>

        <hr className="border-slate-200 dark:border-slate-700"></hr>

        <AccordionInfo
          data={[
            {
              name: "รายละเอียดสินค้า",
              content: product.detail,
            }
          ]}
        />
      </div>
    );
  };

  return (
    <div className={`nc-ProductQuickView ${className}`}>
      <div className="lg:flex">
        <div className="w-full lg:w-[50%] ">
          <div className="relative">
            <div className="aspect-w-16 aspect-h-16">
              <img
                src={imageError ? `${basePath}assets/images/category/default.svg` : product.image}
                className="w-full rounded-xl object-cover"
                alt={product.title}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>

          </div>
          {/*
          <div className="hidden lg:grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-5 xl:mt-5">
            {[LIST_IMAGES_DEMO[1], LIST_IMAGES_DEMO[2]].map((item, index) => {
              return (
                <div
                  key={index}
                  className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16"
                >
                  <img
                    src="https://placehold.co/800x900"// เปลี่ยนจาก "https://placehold.co/800x900" มาใช้ item
                    className="w-full rounded-2xl object-cover"
                    alt={`product detail ${index + 1}`} // เพิ่ม alt ที่แตกต่างกัน
                  />
                </div>
              );
            })}
          </div>
          */}
        </div>


        <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:pl-7 xl:pl-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;