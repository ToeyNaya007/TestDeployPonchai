import React, { FC, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import AccordionInfo from "./AccordionInfoForQuickView";
import BagIcon from "components/BagIcon";
import NcInputNumber from "components/NcInputNumber";
import { PRODUCTS } from "data/data";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "components/IconDiscount";
import Prices from "components/Prices";
import toast from "react-hot-toast";
import SectionSliderProductCard from "components/SectionSliderProductCard";
import detail1JPG from "images/products/detail1.jpg";
import detail2JPG from "images/products/detail2.jpg";
import detail3JPG from "images/products/detail3.jpg";
import ModalViewAllReviews from "./ModalViewAllReviews";
import NotifyAddTocart from "components/NotifyAddTocart";
import SectionIdenticalProduct from "components/SectionIdenticalProduct";
import { Transition } from "@headlessui/react";
import { useOptions } from "containers/OptionsContext";
//import SectionProductImageMore from "components/SectionProductImageMore";
import { useCartContext } from "containers/CartContext";
import AlertService from "components/AlertServicce";
import Cookies, { set } from "js-cookie";
import { useLoginPopup } from "containers/LoginPopupContext";
import ProductCardCustom from "components/ProductCardCustomNew";
import PromotionSlider from "components/PromotionSlider";
//import SectionProductImageMore from "components/SectionProductImageMore";
import { ProductProp } from "data/productTypes";
import SectionPromotionAll from "components/SectionPromotionAll";

export interface ProductDetailPageProps {
  className?: string;
}

const ProductDetailPage: FC<ProductDetailPageProps> = ({ className = "" }) => {
  const [product, setProduct] = useState<any>(null);  // State to hold the product data
  const [loading, setLoading] = useState<boolean>(true);  // State to manage loading state
  const [error, setError] = useState<string | null>(null);  // State to manage error
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { id: pID } = useParams();  // ดึงค่า id จาก URL พารามิเตอร์
  const [isLiked, setIsLiked] = useState(false);
  const [total, setTotal] = useState(0);
  const { cartCount, setCartCount } = useCartContext();

  const { sizes, variants, status, allOfSizes } = PRODUCTS[0];
  const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];

  const [variantActive, setVariantActive] = React.useState(0);
  const [sizeSelected, setSizeSelected] = React.useState("");
  const [sizeValue, setSizeValue] = useState("");
  const [qualitySelected, setQualitySelected] = React.useState(1);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] = useState(false);
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [imageError, setImageError] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [promotion, setPromotion] = useState<any>(null);
  const [promotionType, setPromotionType] = useState<any>(null);
  const [productInSomePromotion, setProductInSomePromotion] = useState<ProductProp[]>([]);

  const convertSize = (size: string): string => {
    if (size === "1") {
      return "ไม่แช่เย็น";
    } else if (size === "2") {
      return "แช่เย็น";
    } else {
      return "แช่เย็น";
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    if (product?.savelist) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [product])

  useEffect(() => {
    setTotal(product?.price * qualitySelected)
  }, [qualitySelected, product]);

  useEffect(() => {
    if (basePath && pID) {
      const fetchProductData = async () => {
        try {
          setImageError(false); // Reset image error state before fetching new data
          setPromotion(null); // Reset promotion state before fetching new data
          setLoading(true);
          const response = await fetch(`${basePath}api/getProduct/frontend/getProductDetail.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ pID: pID }), // ส่งข้อมูลในรูปแบบ URL-encoded
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (data.results?.product?.length > 0) {
            setProduct(data.results.product[0]); // เซ็ตค่าผลลัพธ์ตัวแรกให้ state
            if (data.results?.promotion) {
              setPromotion(data.results?.promotion);
              setPromotionType(data.results?.promotion.type);
            }
          } else {
            setProduct(null); // หากไม่มีข้อมูล ให้เซ็ตเป็น null
          }

        } catch (error) {
          setError("Failed to fetch product data");
        } finally {
          setLoading(false);
        }
      };

      fetchProductData();
    }
  }, [pID, basePath]);

  useEffect(() => {
    if (basePath && pID && promotionType) {
      const fetchProductInSomePromotion = async (pID: string) => {
        try {
          const response = await fetch(`${basePath}api/getProduct/frontend/promotionProducts.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ pID: pID, promotionType: promotionType, action: 'productInSomePromotion' }), // ส่งข้อมูลในรูปแบบ URL-encoded
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          if (data.results?.product?.length > 0) {
            setProductInSomePromotion(data.results.product);
          } else {

          }
        } catch (error) {
          setError("Failed to fetch product data");
        }
      }
      fetchProductInSomePromotion(pID);
    }
  }, [basePath, promotionType, pID]);


  const handleLike = async () => {

    const endpoint = isLiked ? `${basePath}api/product/frontend/savelistRemove.php` : `${basePath}api/product/frontend/savelistAdd.php`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({pID: product.ID.toString() }).toString(),
      });
      const text = await response.text();
      const result = JSON.parse(text);
      if (result.status !== 200) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึกสินค้า");
        toast.error(result.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
      } else if (result.status == 409) {
        AlertService.showError("เกิดข้อผิดพลาด", result.message);
        toast.error(result.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
      }
      setIsLiked(!isLiked);

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
              {renderProductSavelistOnNotify()}
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
              {renderProductSavelistOnNotify()}
            </Transition>
          ),
          { position: "top-right", id: "nc-product-notify", duration: 3000 }
        );
      }
    } catch (error) {
      AlertService.showError("เกิดข้อผิดพลาด", (error as Error).message);
    }
  };

  const discountPercentage = product?.oldprice
    ? ((product?.oldprice - product?.price) / product?.oldprice) * 100
    : 0;

  const notifyAddTocart = async () => {

    try {
      const response = await fetch(`${basePath}api/AddToCart/index.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.ID,
          quantity: qualitySelected,
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
            src={product?.image}
            alt={product?.title}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium">{product?.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {sizeSelected ? (<span>{convertSize(sizeSelected)}</span>) : (<div></div>)}
                </p>
              </div>
              <Prices price={total} className="mt-0.5 min-w-24 w-auto" />
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

  const renderProductSavelistOnNotify = () => {
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
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium">{product?.title}</h3>
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
          </div>
        </div>
      </div>
    );
  };

  const renderVariants = () => {
    if (!variants || !variants.length) {
      return null;
    }

    return (
      <div className="">
        <label htmlFor="">
          <span className="text-sm font-medium">
            Color:
            <span className="ml-1 font-semibold">
              {variants[variantActive].name}
            </span>
          </span>
        </label>
        <div className="flex mt-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative flex-1 max-w-[75px] h-10 sm:h-11 rounded-full border-2 cursor-pointer ${variantActive === index
                ? "border-primary-6000 dark:border-primary-500"
                : "border-transparent"
                }`}
            >
              <div className="absolute inset-0.5 rounded-full overflow-hidden z-0">
                <img
                  src={variant.thumbnail}
                  alt=""
                  className="absolute w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSizeList = () => {
    // Check if product and its sizes are defined
    if (!product || !product?.allOfSizes || !product?.sizes || !product?.sizes.length) {
      return null;
    }

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
          {product?.allOfSizes.map((size: string, index: number) => {  // Explicitly define types here
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



  const renderStatus = () => {
    if (!product?.status) {
      return null;
    }
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-customRed text-slate-50 nc-shadow-lg rounded-full flex items-center justify-center";
    if (product?.status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{product?.status}</span>
        </div>
      );
    }
    if (product?.status === "50% Discount") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{product?.status}</span>
        </div>
      );
    }
    if (product?.status === "Sold Out") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{product?.status}</span>
        </div>
      );
    }
    if (product?.status === "limited edition") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{product?.status}</span>
        </div>
      );
    }
    return null;
  };


  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          {loading ? (<div className="bg-slate-300 animate-pulse w-full h-14 rounded-md"></div>
          ) : (
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {product?.title}
            </h2>
          )}


          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
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
            <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

            {promotion && (
              <div className="px-2 py-1 rounded-md border-2 border-[#ffd75e] bg-[#fef8e7] shadow-sm">
                <div className="flex items-center">
                  <div className="">

                    <p className="text-sm font-semibold text-red-500">ซื้อ {promotion.data.minQty} ชิ้น ราคา {promotion.data.specialPrice} บาท</p>
                  </div>
                </div>
              </div>
            )}


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
          </div>
        </div>
        <hr className=" 2xl:!my-5 border-slate-200 dark:border-slate-700"></hr>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        {product?.variants && product.variants.length > 0 && (
          <div className="">{renderVariants()}</div>
        )}

        {product?.sizes && product.sizes.length > 0 && (
          <div className="">{renderSizeList()}</div>
        )}


        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        {product?.allOfSizes?.length > 0 && !sizeSelected && (
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <span className="text-sm font-semibold text-red-500">กรุณาเลือกตัวเลือกสินค้า</span>
          </div>
        )}
        <div className="flex space-x-3.5">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
            />
          </div>
          <ButtonPrimary
            className={`flex-1 flex-shrink-0 disabled:!bg-slate-500 ${product?.allOfSizes?.length > 0 && !sizeSelected ? "bg-slate-600 dark:bg-slate-500 dark:text-slate-300" : ""}`}
            onClick={product?.allOfSizes?.length > 0 ? (sizeSelected ? notifyAddTocart : undefined) : notifyAddTocart}
            disabled={product?.allOfSizes?.length > 0 && !sizeSelected}
          >
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ml-3">เพิ่มลงตะกร้า {total.toLocaleString(undefined, { minimumFractionDigits: 0 })} บาท</span>
          </ButtonPrimary>
        </div>

        {product?.cart_quantity > 0 ? (
          <span className="flex text-slate-500">มีสินค้าชิ้นนี้ในตะกร้า {product?.cart_quantity} ชิ้น</span>
        ) : ("")}

      {productInSomePromotion.length > 0 && promotion && (
        <div className="p-2 rounded-md border-2 border-[#ffd75e] bg-[#fef8e7] shadow-sm">
          <div className="flex gap-2 items-center mb-2 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bag-check text-lg font-semibold text-yellow-700 mb-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
            </svg>
            <p className="text-lg font-semibold text-yellow-700">สินค้าอื่นที่ร่วมรายการ</p>
          </div>

          <ol className="flex flex-col gap-2 mt-2 list-decimal list-inside">
            {productInSomePromotion.map((product) => (
              <li key={product.ID}>
                <Link
                  to={`/p/${product.slug}/${product.ID}`}
                  className="underline line-clamp-1 text-red-500 inline"
                >
                  {product.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}



        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo
          data={[
            {
              name: "รายละเอียดสินค้า",
              content: product?.detail,
            }
          ]}
        />

        {/* ---------- 6 ----------  */}
        {/*          <div className="hidden xl:block">
          <Policy />
        </div> */}

      </div >
    );
  };

  const renderDetailSection = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold">รายละเอียดสินค้า</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
          <p>
            {product?.detail}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
  return (
    <div className="min-h-[50vh] flex justify-center items-center text-lg font-semibold">
      กำลังโหลดข้อมูลสินค้า...
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-[50vh] flex justify-center items-center text-red-600 text-lg font-semibold">
      เกิดข้อผิดพลาดในการโหลดสินค้า
    </div>
  );
}

if (!product) {
  return (
    <div className="min-h-[50vh] flex justify-center items-center text-gray-600 text-lg font-semibold">
      ไม่พบข้อมูลสินค้าที่คุณกำลังค้นหา
    </div>
  );
}

  return (
    <div className={`nc-ProductDetailPage ${className} mt-10`}>
      {/* MAIn */}
      <main className="container">
        <div className="lg:flex">
          {/* CONTENT */}
          <div className="w-full lg:w-[55%] ">
            {/* HEADING */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-16">
                {isImageLoading && (
                  <div className="h-full w-full animate-pulse bg-slate-300 rounded-2xl flex items-center justify-center">
                    <p className="animate-bounce"> กำลังโหลดรูปภาพ </p>
                  </div>
                )}

                {/* แสดงรูปภาพเมื่อโหลดเสร็จ */}
                <img
                  src={imageError ? `${basePath}assets/images/category/default.svg` : product?.image}
                  alt={product?.title}
                  onLoad={() => setIsImageLoading(false)} // รูปโหลดเสร็จ → ปิด Skeleton
                  onError={handleImageError}
                  className={`h-full w-full rounded-2xl object-cover transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                />

              </div>
              {/* META FAVORITES */}

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
            {/*<SectionProductImageMore />*/}

          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* DETAIL AND REVIEW */}
        <SectionPromotionAll link={`/category/${product?.cID}`} action="productInSomeCategory" limit={20} sText="สินค้าหมวดหมู่เดียวกัน" color="red" pID={pID} />
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">

          <div className="">
          </div>
          {renderDetailSection()}
          <hr className="border-slate-200 dark:border-slate-700" />
          {/* */}
          {/* <SectionIdenticalProduct /> */}
        </div>
      </main>

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
    </div>
  );
};

export default ProductDetailPage;
