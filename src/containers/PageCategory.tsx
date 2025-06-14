import React, { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Pagination from "shared/Pagination/Pagination";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import SectionSliderCollections from "components/SectionSliderLargeProduct";
import SectionPromo1 from "components/SectionPromo1";
import HeaderFilterSearchPage from "components/HeaderFilterSearchPage";
import Promobar from "components/Promobar";
import ProductCardCustom from "components/ProductCardCustomNew";
import { useOptions } from "./OptionsContext";
import { ProductProp } from "data/productTypes";
import ProductCardSkeleton from "components/ProductCardSkeleton";
import Cookies from "js-cookie";

export interface PageCategoryProps {
  className?: string;
}

const PageCategory: FC<PageCategoryProps> = ({ className = "" }) => {
  const [searchResults, setSearchResults] = useState<ProductProp[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // เพิ่ม state สำหรับเก็บหน้าปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(20); // State สำหรับเก็บจำนวนรายการต่อหน้า
  const [isOpen, setIsOpen] = useState(false);
  const itemsPerPageOptions = [10, 20, 50, 100];

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName("basePathAdmin");

  const { id } = useParams();
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [searchKey, setSearchKey] = useState("");


  useEffect(() => {
    if (!id || !basePath) return;
    fetchSearchResults();
  }, [id, basePath, currentPage, itemsPerPage]); // เรียก fetchSearchResults เมื่อ currentPage เปลี่ยน

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${basePath}api/category/frontend/getProductByCategoryID.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          categoryID: String(id),
          userID: String(userID),
          page: String(currentPage), // ส่งค่า currentPage ไปยัง API
          limit: String(itemsPerPage), // ส่งค่า itemsPerPage ไปยัง API
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data && data.results && data.results.product) {
        setSearchResults(data.results.product);
        setTotalProducts(data.results.pagination.total_items || 0); // อัปเดต totalProducts จาก pagination
      } else {
        setSearchResults([]);
        setTotalProducts(0);
      }
    } catch (err) {
      setError("Failed to fetch search results");
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

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage); // อัปเดตจำนวนรายการต่อหน้า
    setCurrentPage(1); // รีเซ็ตกลับไปหน้าที่ 1 เมื่อเปลี่ยนจำนวนรายการต่อหน้า
  };

  const handleSelect = (value: number) => {
    setItemsPerPage(value);
    setIsOpen(false);
  };

  const filteredResults = searchResults.filter(searchResults =>
    searchResults.title.toLowerCase().includes(searchKey.toLowerCase())
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  return (
    <div className={`nc-PageCategory ${className}`} data-nc-id="PageCategory">
      <Promobar />

      <div className="container py-16 lg:pb-28 lg:pt-12 space-y-16 lg:space-y-28">
        <main>
          <div className="flex flex-col md:flex-row justify-between">
            <h2 className="font-semibold text-2xl">
              สินค้าสำหรับหมวดหมู่:{" "}
              <span className="text-red-500">{searchResults[0]?.cName}</span>{" "}
              {totalProducts > 0 && (
                <span className="text-slate-600 text-lg"> ({totalProducts} สินค้า)</span>
              )}
            </h2>
            <div className="flex flex-col lg:flex-row items-baseline lg:items-center gap-3 mt-4 md:mt-0">
              <div className="relative w-full max-w-[14rem]">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อสินค้า"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="w-full h-10 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchKey && (
                  <button
                    type="button"
                    onClick={() => setSearchKey("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-800"
                  >
                    &#x2715;
                  </button>
                )}
              </div>
              <div className="relative w-48 mt-3 md:mt-0">
                <div
                  className="p-2 border border-neutral-200 rounded-md cursor-pointer bg-white shadow-sm flex justify-between items-center"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>แสดง {itemsPerPage} รายการ</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-caret-down-fill ml-2 transition-transform duration-200 ${isOpen ? '-rotate-180' : ''}`} viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                </div>
                {isOpen && (
                  <div className="absolute left-0 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-md z-50">
                    {itemsPerPageOptions.map((option) => (
                      <div
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(option)}
                      >
                        แสดง {option} รายการ
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="flex-1 mt-8 lg:mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 mt-8 lg:mt-10">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => <ProductCardSkeleton key={index} />)
              ) : error ? (
                <p className="col-span-full">เกิดข้อผิดพลาด: {error}</p>
              ) : searchResults.length > 0 ? (
                searchResults.filter(product =>
                  product.title.toLowerCase().includes(searchKey.toLowerCase())
                ).map(product => (
                  <ProductCardCustom key={product.ID} product={product} />
                ))) : (
                <p className="col-span-full">ไม่มีสินค้าในหมวดหมู่นี้</p>
              )}
            </div>
          </div>

          {/* แสดง Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 lg:mt-10 flex flex-col md:flex-row gap-y-2 justify-between">
              <p className="text-slate-500 order-1 md:order-2">กำลังแสดง {startItem} ถึง {endItem} จาก {totalProducts} รายการ</p>
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

export default PageCategory;