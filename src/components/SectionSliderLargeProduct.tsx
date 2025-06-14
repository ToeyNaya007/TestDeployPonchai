import React, { FC, useEffect, useId, useState } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import CollectionCard from "./CollectionCard";
import CollectionCard2 from "./CollectionCard2";
import { Link } from "react-router-dom";
import { useOptions } from "containers/OptionsContext";
import Cookies from "js-cookie";

export interface SectionSliderLargeProductProps {
  className?: string;
  itemClassName?: string;
  cardStyle?: "style1" | "style2";
}

const SectionSliderLargeProduct: FC<SectionSliderLargeProductProps> = ({
  className = "",
  cardStyle = "style2",
}) => {
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userID = Cookies.get("ponchaishop_userID") || "";
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');



  useEffect(() => {
    if (!basePath) return;
    fetchSearchResults();
  }, [basePath, userID]);

  const fetchSearchResults = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${basePath}api/category/frontend/getRecomendCategory.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userID: String(userID),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data && data.results && data.results.categories) {
        setCategories(data.results.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;

    // @ts-ignore
    const OPTIONS: Glide.Options = {
      perView: 3,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: { gap: 28, perView: 2.5 },
        1024: { gap: 20, perView: 2.15 },
        768: { gap: 20, perView: 1.5 },
        500: { gap: 20, perView: 1 },
      },
    };

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    return () => {
      slider.destroy();
    };
  }, [categories, UNIQUE_CLASS]);


  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className={`nc-SectionSliderLargeProduct pt-8 ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`}>
        <Heading isCenter={false} hasNextPrev>
          หมวดหมู่ที่น่าสนใจ
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {categories.map((category, index) => (
              <li className="glide__slide" key={index}>
                <CollectionCard
                  name={category.name}
                  price={category.products?.[0]?.price || "N/A"}
                  imgs={category.products?.map((product: any) => product.image) || []}
                  description={category.products?.[0]?.description || ""}
                  total_sold={category.total_sold || 0}
                  cID={category.ID}
                  slug={category.products?.map((product: any) => product.slug) || []}
                  pID={category.products?.map((product: any) => product.oipID) || []}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderLargeProduct;