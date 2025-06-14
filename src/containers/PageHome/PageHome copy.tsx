import React, { useEffect, useState } from "react";
import SectionHowItWork from "components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionPromo1 from "components/SectionPromo1";
import SectionHero2 from "components/SectionHero/SectionHero2";
import SectionSliderLargeProduct from "components/SectionSliderLargeProduct";
import SectionSliderProductCard from "components/SectionSliderProductCard";
import DiscoverMoreSlider from "components/DiscoverMoreSlider";
import SectionGridMoreExplore from "components/SectionGridMoreExplore/SectionGridMoreExplore";
import SectionPromo2 from "components/SectionPromo2";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import SectionGridFeatureItems from "./SectionGridFeatureItems";
import SectionPromo3 from "components/SectionPromo3";
import SectionClientSay from "components/SectionClientSay/SectionClientSay";
import SectionMagazine5 from "containers/BlogPage/SectionMagazine5";
import Heading from "components/Heading/Heading";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Category from "components/Custom-Category/category";

import { Product } from "data/data";
import MultiLevelDropdown from "components/MultiLevelDropdown";
import Promobar from "components/Promobar";
import PromotionImageSlider from "components/PromotionImageSlider";
import PromotionImages2Mini from "components/PromotionImages2Mini";
import DropdownCategory from "components/DropdownCategory";
import PromotionImages from "components/PromotionImages";
import ProductCardCustom from "components/ProductCardCustom";
import SectionFlashSale from "components/SectionFlashSale";
import SectionSaleCustom from "components/SectionSaleCustom";
import SectionSliderProductCardCustom from "components/SectionSliderProductCardCustom";
import SectionSliderLargeProduct2 from "components/SectionSliderLargeProduct2";
import PromotionImageSlider2 from "components/PromotionImageSlider2";

function PageHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // เพิ่มสถานะการโหลด
  const [error, setError] = useState<string | null>(null); // เพิ่มสถานะข้อผิดพลาด

  useEffect(() => {
    fetch('data/dataAPI.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data.data || []); // สมมติว่า data.data เป็น array ของผลิตภัณฑ์
        setLoading(false); // ตั้งค่าสถานะโหลดเสร็จแล้ว
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load data'); // ตั้งค่าสถานะข้อผิดพลาด
        setLoading(false); // ตั้งค่าสถานะโหลดเสร็จแล้วแม้จะมีข้อผิดพลาด
      });
  }, []);

  if (loading) return <div>Loading...</div>; // แสดงข้อความขณะโหลดข้อมูล
  if (error) return <div>{error}</div>; // แสดงข้อความเมื่อเกิดข้อผิดพลาด

  return (
    <div className="nc-PageHome relative mt-20 overflow-hidden">
      <Promobar />
      <div className="container relative space-y-4 my-2 lg:space-y-22 lg:my-22">
        <div className="flex flex-col lg:flex-row" >
          <DropdownCategory />
          <PromotionImages />
        </div>
        <SectionFlashSale />
        {/* SECTION */}
        <SectionSliderProductCard
          data={products.slice(0, 6)} // ส่งข้อมูลที่ดึงจาก JSON ไปยัง SectionSliderProductCard
        />
        <PromotionImageSlider2/>

        <div className="py-24 lg:py-32 border-t border-b border-slate-200 dark:border-slate-700">
          <SectionHowItWork />
        </div>

        {/* SECTION */}
        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <SectionGridMoreExplore />
        </div>

        {/* SECTION */}
        <SectionGridFeatureItems />

        {/*  */}
        <SectionPromo2 />

        {/* SECTION 3 */}
        <SectionSliderLargeProduct cardStyle="style2" />

        {/*  */}
        <SectionSliderCategories />

        {/* SECTION */}
        <SectionPromo3 />

        <SectionSliderProductCard
          heading="Best Sellers"
          subHeading="Best selling of the month"
          data={products.slice(5, 10)} // ใช้ช่วงข้อมูลที่แตกต่างกัน
        />

        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <div>
            <Heading rightDescText="From the Ciseco blog">
              The latest news
            </Heading>
            <SectionMagazine5 />
            <div className="flex mt-16 justify-center">
              <ButtonSecondary>Show all blog articles</ButtonSecondary>
            </div>
          </div>
        </div>

        {/*  */}
        <SectionClientSay />
      </div>
    </div>
  );
}

export default PageHome;
