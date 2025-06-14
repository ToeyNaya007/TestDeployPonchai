import React, { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Pagination from "shared/Pagination/Pagination";
import SectionSliderCollections from "components/SectionSliderLargeProduct";
import Promobar from "components/Promobar";
import ProductCardCustom from "components/ProductCardCustomNew";
import { useOptions } from "./OptionsContext";
import { ProductProp } from "data/productTypes";
import ProductCardSkeleton from "components/ProductCardSkeleton";
import { set } from "react-datepicker/dist/date_utils";
import Cookies from "js-cookie";

export interface PageProductListProps {
  className?: string;
}

const PageProductList: FC<PageProductListProps> = ({ className = "" }) => {
  const [searchResults, setSearchResults] = useState<ProductProp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const userID = Cookies.get("ponchaishop_userID") || "";

  const location = useLocation();
  const { action } = useParams();

  const [headerText, setHeaderText] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // เพิ่ม state สำหรับเก็บหน้าปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(10); // State สำหรับเก็บจำนวนรายการต่อหน้า
  const [isOpen, setIsOpen] = useState(false);
  const [itemsPerPageOptions, setItemsPerPageOptions] = useState<number[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);


  useEffect(() => {
    if (!action) return;
    if (action) {
      switch (action) {
        case "bestseller":
          setHeaderText("สินค้าขายดี 20 อันดับแรก");
          setItemsPerPageOptions([5, 10, 20]);
          break;
        case "buyagain":
          setHeaderText("สินค้าที่เคยซื้อ");
          setItemsPerPageOptions([5, 10, 20, 50, 100]);
          break;
        case "newproduct":
          setHeaderText("สินค้าใหม่");
          setItemsPerPageOptions([5, 10, 20]);
          break;
        case "productsale":
          setHeaderText("สินค้าลดราคา");
          setItemsPerPageOptions([5, 10, 20]);
          break;
        case "promotionmixmatch":
          setHeaderText("โปรโมชันจับคู่ซื้อ");
          setItemsPerPageOptions([5, 10, 20]);
          break;
        case "promotionsum":
          setHeaderText("โปรโมชันรวมชิ้น");
          setItemsPerPageOptions([5, 10, 20]);
          break;
      }
      setTotalProducts(0);
      setSearchResults([]);
      if (basePath) {
        fetchProductList();
      }
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [action, basePath, currentPage, itemsPerPage]);


  const fetchProductList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${basePath}api/getProduct/frontend/promotionProducts.php`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          page: String(currentPage), // ส่งค่า currentPage ไปยัง API
          limit: String(itemsPerPage), // ส่งค่า itemsPerPage ไปยัง API,
          userID: userID.toString(),
          action: action ? action.toString() : "",
        } as Record<string, string>).toString(),
      });
      const data = await response.json();

      if (data.status !== 200) {
        if (data.status === 201) {
          setSearchResults([]);
        } else {
          throw new Error(data.message || "เกิดข้อผิดพลาดจาก API");
        }
      }
      if (data && data.results && data.results.product && data.results.pagination) {
        setSearchResults(data.results.product);
        setTotalProducts(data.results.pagination.total_items || 0);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to fetch search results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // อัปเดต currentPage
    window.scrollTo(0, 0); // เลื่อนหน้าไปด้านบน
  };

  const handleSelect = (value: number) => {
    setItemsPerPage(value);
    setIsOpen(false);
    setCurrentPage(1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  return (
    <div className={`nc-PageProductList ${className}`} data-nc-id="PageProductList">
      <Promobar />

      <div className="container py-16 lg:pb-28 lg:pt-12 space-y-16 lg:space-y-28">
        <main>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-semibold">
                รายการสินค้า : <span className="text-red-500">{headerText}</span>
              </h2>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                จำนวน {totalProducts} รายการ
              </p>
            </div>

            <div className="relative w-48 mt-3 md:mt-0">
              <div
                className="p-2 border border-neutral-200 rounded-md cursor-pointer bg-white dark:bg-slate-800 shadow-sm flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span>แสดง {itemsPerPage} รายการ</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-caret-down-fill ml-2 transition-transform duration-200 ${isOpen ? '-rotate-180' : ''}`} viewBox="0 0 16 16">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
              </div>
              {isOpen && (
                <div className="absolute left-0 w-full mt-1 bg-white dark:bg-slate-800 border border-neutral-200 rounded-md shadow-md z-50">
                  {itemsPerPageOptions.map((option) => (
                    <div
                      key={option}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                      onClick={() => handleSelect(option)}
                    >
                      แสดง {option} รายการ
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 mt-8 lg:mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 mt-8 lg:mt-10">
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <ProductCardCustom key={product.ID} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center">ไม่พบสินค้าที่ตรงกับคำค้นหา</p>
              )}
            </div>
          </div>

          {searchResults.length > 0 && totalPages > 1 && (
            <div className="mt-8 lg:mt-10 flex flex-col md:flex-row gap-y-2 justify-between">
              <p className="text-slate-500 dark:text-slate-400">กำลังแสดง {startItem} ถึง {endItem} จาก {totalProducts} รายการ</p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}

        </main>

        <hr className="border-slate-200 dark:border-slate-700" />
        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" />
      </div>
    </div>
  );
};

export default PageProductList;