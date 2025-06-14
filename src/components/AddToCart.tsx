import React from "react";
import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Prices from "components/Prices";

interface AddToCartProps {
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    sizes: string[];
  };
  sizeSelected: string;
  qualitySelected: number;
}

// ฟังก์ชันสำหรับการแจ้งเตือนเมื่อเพิ่มสินค้าไปที่ตะกร้า
export const notifyAddTocart = (
  product: AddToCartProps["product"],
  sizeSelected: string,
  qualitySelected: number
) => {
  const renderProductCartOnNotify = () => (
    <div className="flex">
      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-medium">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                <span>{sizeSelected || (product.sizes.length > 0 ? product.sizes[0] : "XL")}</span>
              </p>
            </div>
            <Prices price={product.price} className="mt-0.5 min-w-24 w-auto" />
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500 dark:text-slate-400">จำนวน {qualitySelected}</p>
          <div className="flex">
            <Link to={"/cart"} className="font-medium text-primary-6000 dark:text-primary-500">
              ไปที่ตะกร้า
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

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
};

// ไม่จำเป็นต้องใช้ React.FC ที่นี่ เพราะเราไม่ได้คืนค่า JSX
const AddToCart = () => {
  return null; // ไม่ต้องคืนค่า JSX เพราะไม่มีการแสดงผล
};

export default AddToCart;
