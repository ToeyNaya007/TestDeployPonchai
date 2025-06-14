import Label from "components/Label/Label";
import React, { FC, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";
import CommonLayout from "./CommonLayoutShop";
import { Helmet } from "react-helmet-async";
import { avatarImgs } from "contains/fakeData";
import AccountOrder from "./AccountOrder";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { PRODUCTS } from "data/data";
import Prices from "components/Prices";

export interface AccountShopPageProps {
  className?: string;
}


const AccountShopPage: FC<AccountShopPageProps> = ({ className = "" }) => {
  const userID = '1008';
  const [isOpen, setIsOpen] = useState(false);
  const date = "2024/09/23 13:30"


  const toggleOrderDetails = () => {
    setIsOpen(!isOpen);
  };

  const renderProductItem = (product: any, index: number) => {
    const { image, name } = product;
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{"Natural"}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{"XL"}</span>
                </p>
              </div>
              <Prices className="mt-0.5 ml-2" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">จำนวน</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">1</span>
            </p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-indigo-600 dark:text-primary-500"
              >
                ไปที่รายการสินค้า
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrder = () => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-lg font-semibold">เลขที่สั่งซื้อ : 202410012255</p>
            <div className="inline-flex space-x-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                วันที่ {date}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                จำนวน : 10 รายการ
              </p>
            
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 sm:mt-2 font-semibold">
                ยอดรวม : 2,000.00 บาท
              </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
              onClick={toggleOrderDetails}
            >
              {isOpen ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
            </ButtonSecondary>
          </div>
        </div>
        {isOpen && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
            {[PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]].map(renderProductItem)}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className={`nc-AccountShopPage ${className}`} data-nc-id="AccountShopPage">

      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">รายการสั่งซื้อทั้งหมด</h2>
          {renderOrder()}
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountShopPage;
