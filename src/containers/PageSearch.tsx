import React, { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

export interface PageSearchProps {
  className?: string;
}

const PageSearch: FC<PageSearchProps> = ({ className = "" }) => {
  const [searchResults, setSearchResults] = useState<ProductProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  const itemsPerPage = 20;
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    if(!searchQuery) return;
    if (searchQuery) {
      if (basePath) {
        fetchSearchResults();
      }
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [searchQuery,basePath]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${basePath}api/getProduct/frontend/searchProduct.php`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `q=${encodeURIComponent(searchQuery)}`,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data && data.results && data.results.product) {
        setSearchResults(data.results.product);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to fetch search results');
      console.error(err);
    } finally {
      setCurrentPage(1);
      setLoading(false);
    }
  };

  const currentProducts = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  return (
    <div className={`nc-PageSearch ${className}`} data-nc-id="PageSearch">
      <Promobar />

      <div className="container py-16 lg:pb-28 lg:pt-12 space-y-16 lg:space-y-28">
        <main>
          <h2 className="font-semibold text-2xl">ผลการค้นหาสำหรับ : <span className="text-red-500">{searchQuery} </span>  {searchResults.length > 0 && (
            <span className="text-slate-600 text-lg"> ({searchResults.length} สินค้า)</span>
          )}</h2>

          <div className="flex-1 mt-8 lg:mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 mt-8 lg:mt-10">
                {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                 <ProductCardSkeleton key={index} />
                ))
                ) : error ? (
                <p className="col-span-full">เกิดข้อผิดพลาด: {error}</p>
                ) : currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCardCustom key={product.ID} product={product} />
                ))
                ) : (
                <p className="col-span-full text-center">ไม่พบสินค้าที่ตรงกับคำค้นหา</p>
                )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex mt-4 justify-end">
              <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} itemsPerPage={20}/>
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

export default PageSearch;