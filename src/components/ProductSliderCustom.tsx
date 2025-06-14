import React, { useEffect, useState, useRef } from "react";
import Glide from "@glidejs/glide";
import ProductCardCustom from "./ProductCardCustom";

interface ProductSliderProps {
  title: string;
  borderColor: string;
  fetchUrl: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, borderColor, fetchUrl }) => {
  const [products, setProducts] = useState<any[]>([]);
  const glideRef = useRef<Glide | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(fetchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        setProducts(data.results.product);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [fetchUrl]);

  useEffect(() => {
    if (products.length > 0) {
      // Initialize Glide.js
      glideRef.current = new Glide(".glide", {
        // Glide.js options
      });

      glideRef.current.mount();
    }

    return () => {
      if (glideRef.current) {
        glideRef.current.destroy();
      }
    };
  }, [products]);

  return (
    <div className="relative py-8">
      <div className={`flex flex-row items-center justify-between border-b-8 border-${borderColor}-700`}>
        <p className="text-3xl font-bold mb-2 pl-4">{title}</p>
        <a href="#" className="text-gray-500 text-xl text-right mb-2 pr-10">
          ดูเพิ่มเติม...
        </a>
      </div>
      <div className="glide pt-4 relative">
        {/* Glide.js structure */}
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {products.map((product, index) => (
              <li key={index} className="glide__slide">
                <ProductCardCustom product={product} />
              </li>
            ))}
          </ul>
        </div>
        {/* Glide.js controls */}
      </div>
    </div>
  );
};