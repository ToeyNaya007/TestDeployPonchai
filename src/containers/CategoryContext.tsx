// src/contexts/CategoryContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useOptions } from "./OptionsContext";

interface Subcategory {
    title: string;
    slug: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    images: string;
    subcategories: Subcategory[];
}

interface CategoryContextType {
    categories: Category[];
    loading: boolean;
    refetch: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('siteurl');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${basePath}api/categoryHome`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (data.results?.category) {
                setCategories(data.results.category);
            } else {
                console.warn("No categories found");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (basePath && categories.length === 0) {
            fetchCategories();
        }
    }, [basePath]);

    return (
        <CategoryContext.Provider value={{ categories, loading, refetch: fetchCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategories must be used within a CategoryProvider");
    }
    return context;
};
