import { useEffect, useState } from "react";
import SectionSliderProductCard from "./SectionSliderProductCard";

const SectionSaleCustom = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch('${basePath}api/AddToCart/index.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
        
                console.log('Response status:', response.status);
                const data = await response.json();
        
                console.log('Fetched data:', data);
        
                if (data.results && data.results.product) {
                    setProducts(data.results.product);
                } else {
                    console.error('Unexpected data structure:', data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        
        fetchProduct();
    }, []);

    return (
            <SectionSliderProductCard
                data={products.slice(0,6)}
            />
    );
}

export default SectionSaleCustom;
