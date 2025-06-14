import Glide from "@glidejs/glide";
import { useEffect, useRef, useState } from "react";
import ProductCardCustom from "./ProductCardCustomNew";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import Cookies from "js-cookie";
import { useOptions } from "containers/OptionsContext";

const PromotionSlider = ({ products }: { products: any[] }) => {
    const { getOptionByName } = useOptions();

    const glideRef = useRef<Glide | null>(null);
    const productsPerSlide = 8; // เหมือน SectionPromotionAll
    const [product, setProduct] = useState<any>(null);  // State to hold the product data
    const [loading, setLoading] = useState<boolean>(true);  // State to manage loading state
    const [error, setError] = useState<string | null>(null);  // State to manage error
    const basePath = getOptionByName('basePathAdmin');
    const userID = Cookies.get("ponchaishop_userID") || "";
    const [promotion, setPromotion] = useState<any>(null);
    const pID = '10825';


    useEffect(() => {
        if (basePath && pID) {
            const fetchProductData = async () => {
                try {
                    setPromotion(null); // Reset promotion state before fetching new data
                    setLoading(true);
                    const response = await fetch(`${basePath}api/getProduct/frontend/getProductDetail.php`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({ pID: pID, userID: userID }), // ส่งข้อมูลในรูปแบบ URL-encoded
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const data = await response.json();

                    if (data.results?.product?.length > 0) {
                        setProduct(data.results.product[0]); // เซ็ตค่าผลลัพธ์ตัวแรกให้ state
                        if (data.results?.promotion) {
                            setPromotion(data.results?.promotion);
                        }
                    } else {
                        setProduct(null); // หากไม่มีข้อมูล ให้เซ็ตเป็น null
                    }

                } catch (error) {
                    setError("Failed to fetch product data");
                } finally {
                    setLoading(false);
                }
            };

            fetchProductData();
        }
    }, [pID, basePath]);
    useEffect(() => {
        if (products.length > 0) {
            glideRef.current = new Glide(".glide-promo", {
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
            glideRef.current?.destroy();
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

    return (
        <div className="relative">
            <div className="glide-promo pt-4 relative">
                <div className="glide__track" data-glide-el="track">
                    <ul className="glide__slides flex">
                        {products.map((product, index) => (
                            <li
                                key={index}
                                className="glide__slide flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6"
                            >
                                <ProductCardCustom product={product} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glide__arrows hidden lg:block" data-glide-el="controls">
                    <button
                        className="glide__arrow glide__arrow--prev"
                        data-glide-dir="<"
                        style={{ ...arrowStyles, left: "-50px" }}
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        className="glide__arrow glide__arrow--next"
                        data-glide-dir=">"
                        style={{ ...arrowStyles, right: "-50px" }}
                    >
                        <span className="sr-only">Next</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromotionSlider;
