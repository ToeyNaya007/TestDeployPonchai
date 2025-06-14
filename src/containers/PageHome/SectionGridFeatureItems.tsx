import React, { FC, useEffect, useState } from "react";
import HeaderFilterSection from "components/HeaderFilterSection";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ProductCardCustom from "components/ProductCardCustom";
import { useOptions } from "containers/OptionsContext";

const SectionGridFeatureItems: FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsToShow, setItemsToShow] = useState<number>(12); // จำนวนสินค้าที่จะแสดงเริ่มต้น


  const { getOptionByName } = useOptions();
  const basePathAdmin = getOptionByName('basePathAdmin');
  let limit = 30;

  useEffect(() => {
    if (basePathAdmin) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${basePathAdmin}api/getProduct/frontend/productTest.php`, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ limit: limit.toString() }),
          }
          );
          const data = await response.json();
          setProducts(data.results.product);
          setDisplayedProducts(data.results.product.slice(0, 12)); // เริ่มต้นแสดง 12 รายการ
          setLoading(false);
        } catch (error) {
          console.error("Error fetching products:", error);
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [basePathAdmin]);

  const handleShowMore = () => {
    const nextItemsToShow = itemsToShow + 12;
    setDisplayedProducts(products.slice(0, nextItemsToShow)); // โหลดเพิ่มอีก 12 รายการ
    setItemsToShow(nextItemsToShow); // อัพเดตจำนวนรายการที่จะแสดงผล
  };

  return (
    <div className="nc-SectionGridFeatureItems relative">
      <HeaderFilterSection />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className={`grid gap-8 grid-cols-2 md:grid-cols-4 lg:grid-cols-6`}
        >
          {displayedProducts.map((product, index) => (
            <ProductCardCustom product={product} key={index} />
          ))}
        </div>
      )}
      <div className="flex mt-16 justify-center items-center">
        {!loading && itemsToShow < products.length && (
          <ButtonPrimary onClick={handleShowMore}>
            Show me more
          </ButtonPrimary>
        )}
      </div>
    </div>
  );
};

export default SectionGridFeatureItems;
