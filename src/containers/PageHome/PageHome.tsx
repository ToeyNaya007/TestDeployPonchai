import SectionHowItWork from "components/SectionHowItWork/SectionHowItWork";
import SectionSliderLargeProduct from "components/SectionSliderLargeProduct";
import SectionPromo2 from "components/SectionPromo2";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import Promobar from "components/Promobar";
import DropdownCategory from "components/DropdownCategory";
import PromotionImages from "components/PromotionImages";
import PromotionImageSlider2 from "components/PromotionImageSlider2";
import MultilevelDropdownHorizontal from "components/MultilevelDropdownHorizontal";
import ShopPopup from "components/ShopPopup";
import SectionFirstPage from "./SectionFirstPage";
import SectionPromotionAll from "components/SectionPromotionAll";

function PageHome() {
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Promobar />
      <div className="container relative space-y-4 my-2 lg:space-y-22 lg:my-22">
        <SectionFirstPage />
        <SectionPromotionAll link="/product-list/bestseller" action="bestseller" limit={10} sText="สินค้าขายดี 10 อันดับแรก" color="red" />
        <MultilevelDropdownHorizontal />
        <SectionPromotionAll link="/product-list/buyagain" action="buyagain" limit={100} sText="ซื้ออีกครั้ง" color="blue" />
        {/*
                <PromotionImageSlider2 />

        */}
        <SectionPromotionAll link="/product-list/newproduct" action="newproduct" limit={20} sText="สินค้าใหม่" color="gray" />

        <div className="py-24 lg:py-32 border-t border-b border-slate-200 dark:border-slate-700">
          <SectionHowItWork />
        </div>

        {/*  
        <SectionGridFeatureItems />
        */}
        {/*
        <SectionPromo2 />
        */}

        <SectionSliderLargeProduct cardStyle="style2" />

        {/*
            <SectionSliderCategories />
          */}

        <ShopPopup />
      </div>
    </div>
  );
}

export default PageHome;
