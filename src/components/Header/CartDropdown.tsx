import { Popover, Transition } from "@headlessui/react";
import BagIcon from "components/BagIcon";
import Prices from "components/Prices";
import { useOptions } from "containers/OptionsContext";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useCartContext } from "containers/CartContext";
import Cookies from "js-cookie";


export interface Product {
  ID: number;
  pID: number;
  customerID: string;
  quantity: number;
  coolingCondition: number;
  price: number;
  image: string;
  title: string;
}

export default function CartDropdown() {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const { cartCount } = useCartContext();
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [amountAll, setAmountAll] = useState(0);
  const [quantityAll, setQuantityAll] = useState(0);
  const amountofcart = 3;

  useEffect(() => {
    if (basePath && userID) {
      const fetchCartItems = async () => {
        try {
          const formData = new URLSearchParams();
          formData.append('customerID', userID);
          formData.append('limit', '3'); // เพิ่ม limit
  
          const response = await fetch(`${basePath}api/cart/frontend/getCartByID.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // เปลี่ยน Content-Type
            },
            body: formData.toString(), // ส่งข้อมูลในรูปแบบ x-www-form-urlencoded
          });
          const result = await response.json();
          if (result.status === 200) {
            setCartItems(result.results.product);
          } else {
            console.error(result.error);
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };
  
      fetchCartItems();
    }
  }, [userID, basePath, cartCount]);

  useEffect(() => {
    if (basePath && userID) {
      const fetchCartQuantity = async () => {
        try {
          const formData = new URLSearchParams();
          formData.append('customerID', userID);
          formData.append('limit', '3');
          const response = await fetch(`${basePath}api/cart/frontend/getAmountCart.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // เปลี่ยน Content-Type
            },
            body: formData.toString(), // ส่งข้อมูลในรูปแบบ x-www-form-urlencoded
          });
          const result = await response.json();
          if (result.status === 200) {
            setAmountAll(result.results.totalPrice);
            setQuantityAll(result.results.totalQuantity);
          } else {
            console.error(result.error);
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };

      fetchCartQuantity();
    }
  }, [userID, basePath,cartCount]);



  const renderProduct = (item: Product, index: number, close: () => void) => {
    const { pID, title, price, image, quantity, coolingCondition } = item;
    return (
      <div key={index} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain object-center"
          />
          <Link
            onClick={close}
            className="absolute inset-0"
            to={`p/${title}/${pID}`}
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium truncate w-64">
                  <Link onClick={close} to={`p/${title}/${pID}`} className="hover:underline">
                    {title}
                  </Link>
                </h3>

                {coolingCondition === 1 ? (
                  <div className="flex items-center mt-1">
                    <span className="text-sm font-medium text-green-500">อุ่นสินค้า</span>
                  </div>
                ) : (
                  <></>
                )}

              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">{`จำนวน : ${quantity}`}</p>

            <div className="flex">
              <Prices price={price * quantity} className="mt-0.5" />

            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              <span className="mt-[1px]">{quantityAll}</span>
            </div>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Link className="block md:hidden absolute inset-0" to={"/cart"} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <div className="relative bg-white dark:bg-neutral-800">
                  <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                    <h3 className="text-xl font-semibold">ตะกร้าสินค้า</h3>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {cartItems.map((item, index) =>
                        renderProduct(item, index, close)
                      )}
                    </div>
                  </div>
                  {quantityAll > 3 ? (
                    <div className="p-5">
                      <Link to="/cart" onClick={close}>
                        <p className="text-base font-semibold hover:underline">และอีก {quantityAll - amountofcart} รายการ</p>
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )
                  }

                  <div className="bg-neutral-50 dark:bg-slate-900 p-5">
                    <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                      <span>
                        <span>รวมทั้งหมด</span>
                        <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                          ค่าจัดส่งและภาษีจะคำนวณเมื่อท่านชำระเงิน.
                        </span>
                      </span>
                      <span className="">
                        {(Number(amountAll) || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
                      </span>
                    </p>
                    <div className="flex space-x-2 mt-5">

                      <ButtonPrimary
                        href="/cart"
                        onClick={close}
                        className="flex-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash  mr-2" viewBox="0 0 16 16">
                          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                          <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                        </svg>
                        ดูสินค้าในตะกร้าและชำระเงิน
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
