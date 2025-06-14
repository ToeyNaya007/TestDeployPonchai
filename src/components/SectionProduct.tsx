import React, { useEffect, useState, useRef } from "react";
import ProductCardCustom from "./ProductCardCustom";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

interface ProductSectionProps {
  sectionType: "buyAgain" | "flashSale";
  apiEndpoint: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ sectionType, apiEndpoint }) => {
  const [products, setProducts] = useState<any[]>([]);
  const productsPerSlide = 4;
  const glideRef = useRef<Glide | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();
        setProducts(data.results.product);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [apiEndpoint]);

  useEffect(() => {
    if (products.length > 0) {
      glideRef.current = new Glide(".glide", {
        type: "slider",
        startAt: 0,
        perView: productsPerSlide,
        gap: 20,
        bound: true,
        breakpoints: {
          1280: { perView: 4 },
          1024: { perView: 3 },
          768: { perView: 2 },
          640: { perView: 2 },
          500: { perView: 1 },
        },
      });

      glideRef.current.mount();
    }

    return () => {
      if (glideRef.current) {
        glideRef.current.destroy();
      }
    };
  }, [products]);

  const sectionConfig = {
    buyAgain: {
      title: "ซื้ออีกครั้ง",
      borderColor: "border-blue-700",
    },
    flashSale: {
      title: "Flash Sales",
      borderColor: "border-red-700",
    },
  };

  const config = sectionConfig[sectionType];

  return (
    <div className="relative py-8">
      <div className={`flex flex-row items-center justify-between border-b-8 ${config.borderColor}`}>
        <p className="text-3xl font-bold mb-2 pl-4">{config.title}</p>
        <a href="#" className="text-gray-500 text-xl text-right mb-2 pr-10">
          ดูเพิ่มเติม...
        </a>
      </div>

      <div className="glide pt-4">
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {products.map((product, index) => (
              <li key={index} className="glide__slide">
                <ProductCardCustom product={product} />
              </li>
            ))}
          </ul>
        </div>
        <div className="glide__arrows hidden lg:flex" data-glide-el="controls">
          <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
            <span className="sr-only">Previous</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="glide__arrow glide__arrow--right" data-glide-dir=">">
            <span className="sr-only">Next</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;