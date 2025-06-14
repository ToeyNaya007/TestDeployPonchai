import React, { useState } from "react";
import Prices from "components/Prices";
import { PRODUCTS } from "data/data";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import CommonLayout from "./CommonLayoutShop";

const PreparingProduct = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <p className="text-lg font-semibold">202410012255</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              เลขที่สั่งซื้อ
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
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">กำลังเตรียมสินค้า</h2>
          {renderOrder()}
        </div>
      </CommonLayout>
    </div>
  );
};

export default PreparingProduct;
