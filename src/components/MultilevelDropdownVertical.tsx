import React, { useState, useEffect } from 'react';
import { useOptions } from 'containers/OptionsContext';
import { useCategories } from 'containers/CategoryContext';

const MultilevelDropdownVertical: React.FC = () => {
    const { categories, loading } = useCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const handleCategoryClick = (categoryId: number) => {
        if (selectedCategoryId === categoryId) {
            setSelectedCategoryId(null);
        } else {
            setSelectedCategoryId(categoryId);
        }
    };

    return (
        <div className="container pt-2 pb-2 h-[12.8rem] overflow-y-auto hiddenScrollbar">
            <div className="flex flex-col justify-center space-y-2 text-slate-700 dark:text-slate-50 text-sm font-semibold">
                {categories.map((category) => (
                    <div key={category.id}>
                        <div
                            className={`flex justify-between cursor-pointer p-2 ${selectedCategoryId === category.id ? 'bg-gray-200 dark:bg-slate-600 rounded-md' : ''}`}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <a href="#" className="flex items-center space-x-2">
                                <p className="text-sm font-semibold">{category.name}</p>
                            </a>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className={`bi bi-caret-right-fill mr-4 transition-transform duration-300 ${selectedCategoryId === category.id ? 'rotate-90' : ''}`}
                                viewBox="0 0 16 16"
                            >
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                            </svg>
                        </div>
                        {selectedCategoryId === category.id && (
                            <div className="p-1 space-y-4 bg-slate-100 rounded-sm dark:bg-slate-800">
                                {category.subcategories.map((subcategory, index) => (
                                    <a
                                        href={subcategory.slug}
                                        key={index}
                                        className="block mt-2 ml-4 text-sm text-slate-500 dark:text-gray-300 overflow-hidden truncate"
                                    >
                                        {subcategory.title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultilevelDropdownVertical;
