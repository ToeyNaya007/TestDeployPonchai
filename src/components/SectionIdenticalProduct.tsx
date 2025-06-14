import React, { useEffect, useState, useRef } from "react";
import ProductCardCustom from "./ProductCardCustom";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import { useOptions } from "containers/OptionsContext";


const SectionIdenticalProduct: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const productsPerSlide = 6; // เพิ่มจำนวน products ต่อสไลด์สำหรับหน้าจอใหญ่
    const glideRef = useRef<Glide | null>(null);

    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');

    useEffect(() => {
        if (basePath) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`${basePath}api/getProduct/frontend/productTest.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    });

                    const data = await response.json();
                    setProducts(data.results.product);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };

            fetchProduct();
        }
    }, [basePath]);

    useEffect(() => {
        // Initialize Glide.js once the products are loaded
        if (products.length > 0) {
            glideRef.current = new Glide(".glide", {
                type: "slider",
                startAt: 0,
                perView: Math.min(productsPerSlide, products.length),
                gap: 10, // ลด gap ให้น้อยลงอีก
                bound: true,
                rewind: false,
                breakpoints: {
                    1280: { perView: 6, gap: 10 },
                    1024: { perView: 4, gap: 14 },
                    768: { perView: 4, gap: 6 },
                    640: { perView: 3.5, gap: 6 },
                    480: { perView: 2.5, gap: 4 },
                    360: { perView: 2, gap: 4 },
                },
            });

            // Disable navigation when reaching the end
            glideRef.current.on('run.after', () => {
                // ... (ส่วนนี้คงเดิม)
            });

            glideRef.current.mount();
        }

        // Cleanup function
        return () => {
            if (glideRef.current) {
                glideRef.current.destroy();
            }
        };
    }, [products]);

    const arrowStyles: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '50%',
        color: '#333',
        padding: '6px', // ลดขนาดปุ่มลงอีก
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    };

    const prevArrowStyles: React.CSSProperties = {
        ...arrowStyles,
        left: '-20px', // ปรับตำแหน่งปุ่มให้ใกล้เข้ามาอีก
    };

    const nextArrowStyles: React.CSSProperties = {
        ...arrowStyles,
        right: '-20px', // ปรับตำแหน่งปุ่มให้ใกล้เข้ามาอีก
    };

    return (
        <div className="relative py-4"> {/* ลด padding บนล่างลงอีก */}
            <div className="flex flex-row items-center justify-between border-b-2 border-red-700"> {/* ลดความหนาของเส้นใต้ลงอีก */}
                <p className="text-lg font-bold mb-1 pl-2">สินค้าใกล้เคียง</p> {/* ลดขนาดตัวอักษรและ margin */}
            </div>

            <div className="glide pt-2 relative"> {/* ลด padding ด้านบนลงอีก */}
                <div className="glide__track" data-glide-el="track">
                    <ul className="glide__slides">
                        {products.map((product, index) => (
                            <li key={index} className="glide__slide w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"> {/* ปรับขนาด ProductCard ให้เล็กลงสำหรับทุกขนาดหน้าจอ */}
                                <ProductCardCustom product={product} />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glide__arrows hidden sm:block" data-glide-el="controls"> {/* ซ่อนปุ่มนำทางบนมือถือ */}
                    <button className="glide__arrow glide__arrow--prev" data-glide-dir="<" style={prevArrowStyles}>
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="glide__arrow glide__arrow--next" data-glide-dir=">" style={nextArrowStyles}>
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SectionIdenticalProduct;