import React, { useEffect, useState, useRef } from "react";
import ProductCardCustom from "./ProductCardCustomNew";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import { useOptions } from "containers/OptionsContext";

const SectionFlashSale = () => {
    const [products, setProducts] = useState<any[]>([]);
    const productsPerSlide = 5.5;  // แสดง 6 รายการบนจอใหญ่
    const glideRef = useRef<Glide | null>(null);

    const { getOptionByName } = useOptions();
    const basePathAdmin = getOptionByName('basePathAdmin');
    let page = 'bestseller';
    let limit = 10;

    useEffect(() => {
        if (basePathAdmin) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`${basePathAdmin}api/getProduct/frontend/promotionProducts.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ page, limit: limit.toString() }),
                    });
                    const data = await response.json();
                    setProducts(data.results.product);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };
            fetchProduct();
        }
    }, [basePathAdmin, limit]);

    useEffect(() => {
        if (products.length > 0) {
            glideRef.current = new Glide(".glide-flash-sale", {
                type: "slider",
                startAt: 0,
                perView: Math.min(productsPerSlide, products.length),
                gap: 20,
                bound: true,
                rewind: false,
                breakpoints: {
                    1280: { perView: 6, gap: 20 },
                    1024: { perView: 3.5, gap: 15 },
                    768: { perView: 3, gap: 10 },
                    640: { perView: 2.5, gap: 10 },
                    480: { perView: 2.2, gap: 8 },
                    320: { perView: 1.8, gap: 8 },
                },
            });

            glideRef.current.on('run.after', () => {
                const glide = glideRef.current;
                if (!glide) return;

                const totalSlides = glide.settings.perView as number;
                const currentIndex = glide.index;
                const lastPossibleIndex = products.length - totalSlides;

                const nextButton = document.querySelector('.glide__arrow--next');
                const prevButton = document.querySelector('.glide__arrow--prev');

                if (nextButton instanceof HTMLElement) {
                    if (currentIndex >= lastPossibleIndex) {
                        nextButton.classList.add('glide__arrow--disabled');
                    } else {
                        nextButton.classList.remove('glide__arrow--disabled');
                    }
                }

                if (prevButton instanceof HTMLElement) {
                    if (currentIndex === 0) {
                        prevButton.classList.add('glide__arrow--disabled');
                    } else {
                        prevButton.classList.remove('glide__arrow--disabled');
                    }
                }
            });

            glideRef.current.mount();
        }

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
        padding: '10px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    };

    const prevArrowStyles: React.CSSProperties = {
        ...arrowStyles,
        left: '-50px',
    };

    const nextArrowStyles: React.CSSProperties = {
        ...arrowStyles,
        right: '-50px',
    };

    return (
        <div className="relative py-8">
            <div className="flex flex-row items-center justify-between border-b-8 border-red-700">
                <p className="text-xl md:text-3xl font-bold mb-2 pl-4">สินค้าขายดี 10 อันดับแรก</p>
                <a href="#" className="text-gray-500 text-lg text-right mb-2 pr-10">
                    ดูเพิ่มเติม...
                </a>
            </div>

            <div className="glide-flash-sale pt-4 relative">
                <div className="glide__track" data-glide-el="track">
                    <ul className="glide__slides">
                        {products.map((product, index) => (
                            <li key={index} className="glide__slide w-full sm:w-1/2 md:w-1/3 lg:w-1/6">
                                <ProductCardCustom product={product} />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glide__arrows hidden lg:block" data-glide-el="controls">
                    <button className="glide__arrow glide__arrow--prev" data-glide-dir="<" style={prevArrowStyles}>
                        <span className="sr-only">Previous</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="glide__arrow glide__arrow--next" data-glide-dir=">" style={nextArrowStyles}>
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

export default SectionFlashSale;
