import React, { useState, useEffect, useRef } from 'react';
import Subcategories from './Subcategories'; // นำเข้า Subcategories
import { Link } from 'react-router-dom';
import { useOptions } from 'containers/OptionsContext';
import SkeletonDropdown from './SkeletonDropdown';
import { useCategories } from 'containers/CategoryContext';

const MultiLevelDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [showBranner, setShowBranner] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subcategoryRef = useRef<HTMLDivElement>(null);
  const { categories, loading } = useCategories();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        subcategoryRef.current && !subcategoryRef.current.contains(event.target as Node)) {
        setIsOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <SkeletonDropdown />
      ) : (
        <div ref={dropdownRef} className="m-1 relative inline-flex flex-col border border-gray-200 bg-white dark:bg-slate-800 dark:text-slate-50 shadow-sm rounded-lg overflow-y-scroll custom-scrollbar" style={{ maxHeight: '520px', minHeight: '575px' }}>
          {categories.map((category) => (
            <div key={category.id} className="relative group customScrollBar">
              <div>
                <a
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:hover:text-slate-50 focus:outline-none dark:text-slate-50 focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none min-w-72 w-full transition-colors duration-300"
                  onMouseEnter={() => setIsOpen(category.id)}
                  onClick={(e) => {
                    e.preventDefault(); // ป้องกันการกระโดดไปยังลิงค์
                    setIsOpen(isOpen === category.id ? null : category.id); // สลับการเปิด/ปิด
                  }}
                  aria-haspopup="menu"
                  aria-expanded={isOpen === category.id}
                  aria-label="Dropdown"
                >
                  {category.name}
                  <svg
                    className={`ml-auto size-4 transition-transform duration-300 ${isOpen === category.id ? '-rotate-90' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* แสดง Subcategories นอก dropdownRef */}
      {isOpen !== null && categories.length > 0 && (
        <div ref={subcategoryRef}>
          <Subcategories
            subcategories={categories.find(category => category.id === isOpen)?.subcategories || []}
            images={categories.find(category => category.id === isOpen)?.images || ''} // ส่ง images ไปด้วย
            onMouseLeave={() => setIsOpen(null)} // ค้างไว้เมื่อเมาส์ออก
            cID={isOpen} // ส่ง category.id ที่กำลังเปิดอยู่ไป
          />
        </div>
      )}
    </div>
  );
};

export default MultiLevelDropdown;
