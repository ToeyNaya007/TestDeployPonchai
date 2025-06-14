import React, { FC } from "react";

export interface PaginationProps {
  className?: string;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, itemsPerPage, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // จำนวนหน้าสูงสุดที่แสดง
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // ปรับ startPage และ endPage หากเกินขอบเขต
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // ปุ่มหน้าแรก
    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          onClick={() => onPageChange(1)}
          className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white dark:text-white hover:bg-neutral-100 dark:bg-slate-700 border border-neutral-200 text-neutral-6000"
        >
          {1}
        </button>
      );
    }

    // ปุ่มหน้าก่อนหน้า
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white hover:bg-primary-6000 border-neutral-200 "
        >
          {<i className="las la-arrow-left"></i>}
        </button>
      );
    }

    // หน้าปัจจุบันและหน้าอื่นๆ
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`inline-flex w-11 h-11 items-center justify-center rounded-full ${currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-neutral-100 dark:bg-slate-700 border border-neutral-200 text-neutral-6000 dark:text-white"
            }`}
        >
          {i}
        </button>
      );
    }

    // ปุ่มหน้าถัดไป
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white hover:bg-primary-6000 border-neutral-200 "
        >
          {<i className="las la-arrow-right"></i>}
        </button>
      );
    }

    // ปุ่มหน้าสุดท้าย
    if (endPage < totalPages) {
      pages.push(
        <button
          key="last"
          onClick={() => onPageChange(totalPages)}
          className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 dark:bg-slate-700 dark:text-white border border-neutral-200 text-neutral-6000"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <nav className="nc-Pagination inline-flex space-x-3 text-base font-medium order-1 md:order-2">
      {renderPageNumbers()}
    </nav>
  );
};

export default Pagination;