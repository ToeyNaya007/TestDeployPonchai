import React, { useEffect, useState, useRef } from "react";
import ProductCardCustom from "./ProductCardCustom";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import { useOptions } from "containers/OptionsContext";
import { Link } from "react-router-dom";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useCategories } from "containers/CategoryContext";


const MultilevelDropdownHorizontal = () => {
    const productsPerSlide = 5.5;  // แสดง 6 รายการบนจอใหญ่
    const glideRef = useRef<Glide | null>(null);
    const { categories, loading } = useCategories();

    useEffect(() => {
        if (categories.length > 0) {
            glideRef.current = new Glide(".glide-category", {
                type: "slider",
                startAt: 0,
                perView: Math.min(productsPerSlide, categories.length),
                gap: 20,
                bound: true,
                rewind: false,
                breakpoints: {
                    1280: { perView: 6, gap: 10 },
                    1024: { perView: 5.5, gap: 10 },
                    480: { perView: 3.3, gap: 8 },
                    320: { perView: 2.2, gap: 8 },
                },
            });

            glideRef.current.on('run.after', () => {
                const glide = glideRef.current;
                if (!glide) return;

                const totalSlides = glide.settings.perView as number;
                const currentIndex = glide.index;
                const lastPossibleIndex = categories.length - totalSlides;

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
    }, [categories]);

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
            <div className="glide-category pt-4 relative">
                <div className="glide__track" data-glide-el="track">
                    {loading ? (
                        <ul className="glide__slides">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <li key={index} className="glide__slide w-full sm:w-1/2 md:w-1/3 lg:w-1/6">
                                    <ProductCardSkeleton />
                                </li>
                            ))}
                        </ul>

                    ) : (
                        <ul className="glide__slides">
                            {categories.map((category, index) => (
                                <li key={category.id} className="glide__slide w-full sm:w-1/2 md:w-1/3 lg:w-1/6">
                                    <Link to={`category/${category.id}`} className="flex-shrink-0 flex flex-col items-center text-center">
                                        <img
                                            src={category.images}
                                            alt={category.name}
                                            className="w-24 lg:w-44 h-24 lg:h-44 object-cover rounded-lg"
                                        />
                                        <p className="mt-2 text-sm font-medium truncate w-24 lg:w-44">
                                            {category.name}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

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

export default MultilevelDropdownHorizontal;
