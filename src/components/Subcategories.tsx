import React, { useEffect } from 'react';

interface Subcategory {
  title: string; // ชื่อของหมวดหมู่ย่อย
  slug: string;  // ลิงค์ของหมวดหมู่ย่อย
}

interface SubcategoriesProps {
  subcategories: Subcategory[]; // รายการย่อยของหมวดหมู่
  images: string; // รับ images
  onMouseLeave: () => void; // ฟังก์ชันที่จะถูกเรียกเมื่อเมาส์ออก
  cID: number;
}

const Subcategories: React.FC<SubcategoriesProps> = ({ subcategories, images, onMouseLeave,cID }) => {
  const handleSubcategoryClick = (event: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.stopPropagation(); // หยุดการกระจายเหตุการณ์เพื่อไม่ให้ dropdown ปิด
    window.location.href = slug; // ไปที่ลิงก์ในแท็บเดียวกัน
  };

  return (
    <div
      className="absolute top-0 z-10 w-1/3 h-96 bg-white dark:bg-slate-800 border border-gray-200 shadow-lg mt-2 overflow-y-scroll custom-scrollbar"
      style={{ left: "28.5%", height: "520px" }}
      onMouseLeave={onMouseLeave} // เรียกใช้งานเมื่อเมาส์ออก
    >
      <div className='flex'>
        <div className='flex-col w-full whitespace-nowrap '>
          {subcategories.map((subcategory, index) => (
            <a
              key={index}
              className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 dark:text-slate-50 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:bg-gray-100 transition-colors duration-200 w-72"
              href={subcategory.slug} // ใช้ slug เป็นลิงค์
              onClick={(event) => handleSubcategoryClick(event, subcategory.slug)} // เรียกใช้ฟังก์ชันเมื่อคลิก
            >
              <p className='overflow-hidden truncate'> {subcategory.title}</p>
            </a>
          ))}
        </div>

        <div className='flex-col w-96 h-auto'>
          <div className='flex items-center gap-x-3.5 py-2 px-3 hover:shadow-lg w-auto'>
            <a href={`category/${cID}`}>
              {images && <img src={images} alt="Subcategory" className="h-auto w-full" />} {/* แสดงรูปภาพถ้ามี */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subcategories;
