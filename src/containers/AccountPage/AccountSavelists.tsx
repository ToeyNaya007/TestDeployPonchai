import ProductCard from "components/ProductCard";
import { PRODUCTS } from "data/data";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import CommonLayout from "./CommonLayout";
import { useOptions } from "containers/OptionsContext";
import { useEffect, useState } from "react";
import ProductCardCustom from "components/ProductCardCustomNew";
import { ProductProp } from "data/productTypes";
import ProductCardSkeleton from "components/ProductCardSkeleton";
import Pagination from "shared/Pagination/Pagination";
import Cookies from "js-cookie";
import { checkAuthNow } from "utils/checkAuthNow";
import { useLoginPopup } from "containers/LoginPopupContext";


const AccountSavelists: React.FC<{ products: ProductProp[] }> = () => {

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');

  const userID = Cookies.get("ponchaishop_userID") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductProp[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // เพิ่ม state สำหรับเก็บหน้าปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(10); // State สำหรับเก็บจำนวนรายการต่อหน้า
  const [isOpen, setIsOpen] = useState(false);
  const itemsPerPageOptions = [10, 20, 50, 100];
  const [totalProducts, setTotalProducts] = useState(0);
  const { showLoginPopup, setShowLoginPopup } = useLoginPopup();



  useEffect(() => {
    if (!basePath) return;
    if (basePath && userID) {
      fetchProductSavelist();
    } else {
      window.location.href = "/login";
    }
  }, [userID, basePath, currentPage, itemsPerPage, userID]);

  const fetchProductSavelist = async () => {
    try {
      if (!basePath) return;
      const isAuthenticated = await checkAuthNow(basePath);
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      setLoading(true);
      const response = await fetch(`${basePath}api/getProduct/frontend/getSavelistProduct.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // ใช้ Content-Type ที่เป็น simple request
        },
        body: new URLSearchParams({
          customerID: String(userID),
          page: String(currentPage), // ส่งค่า currentPage ไปยัง API
          limit: String(itemsPerPage), // ส่งค่า itemsPerPage ไปยัง API
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Product");
      }

      const data = await response.json();

      // ตรวจสอบและดึงค่าตามโครงสร้าง results.addresses[0]
      const productData = data.results?.product || []; // ดึงที่อยู่จาก API
      setProducts(Array.isArray(productData) ? productData : []);
      setTotalProducts(data.results.pagination.total_items || 0);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  const renderSection1 = () => {
    return (
      <div className="space-y-10 sm:space-y-12">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              รายการสินค้าที่ถูกใจ
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

        {loading ? (
          <div className="grid gap-6 md:gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {products.map((product, index) => (
              <ProductCardCustom key={index} product={product} fetchProductSavelist={fetchProductSavelist} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-8 lg:mt-10 flex justify-between">
            <p className="text-slate-500">กำลังแสดง {startItem} ถึง {endItem} จาก {totalProducts} รายการ</p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

      </div>
    );
  };

  return (
    <div>
      <CommonLayout>{renderSection1()}</CommonLayout>
    </div>
  );
};

export default AccountSavelists;
