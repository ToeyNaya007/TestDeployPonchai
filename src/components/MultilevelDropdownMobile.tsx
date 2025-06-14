import React, { useState, useEffect } from 'react';
import { useOptions } from 'containers/OptionsContext';
import { useCategories } from 'containers/CategoryContext';

const MultilevelDropdownMobile: React.FC = () => {
    
    const { categories, loading } = useCategories();

    return (
        <div className="">
            {loading ? (
            <div className="flex overflow-x-auto gap-3 md:gap-4 lg:gap-3 customScrollBar">
                {[...Array(5)].map((_, idx) => (
                <div
                    key={idx}
                    className="flex-shrink-0 flex flex-col items-center text-center animate-pulse"
                >
                    <div className="w-24 lg:w-44 h-24 lg:h-44 bg-gray-200 rounded-lg mb-2" />
                    <div className="w-20 lg:w-36 h-4 bg-gray-200 rounded" />
                </div>
                ))}
            </div>
            ) : (
            <div className="flex overflow-x-auto gap-3 md:gap-4 lg:gap-3 customScrollBar">
                {categories.map((category) => (
                <a
                    href={`category/${category.id}`}
                    key={category.id}
                    className="flex-shrink-0 flex flex-col items-center text-center"
                >
                    <img
                    src={category.images}
                    alt={category.name}
                    className="w-24 lg:w-44 h-24 lg:h-44 object-cover rounded-lg"
                    />
                    <p className="mt-2 text-sm font-medium truncate w-24 lg:w-44">
                    {category.name}
                    </p>
                </a>
                ))}
            </div>
            )}
        </div>
    );
}

export default MultilevelDropdownMobile;
