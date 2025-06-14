import React from "react";

const SkeletonDropdown = () => {
  return (
    <div
      className="m-1 relative inline-flex flex-col border border-gray-200 bg-white dark:bg-slate-800 shadow-sm rounded-lg overflow-y-scroll custom-scrollbar animate-pulse"
      style={{ maxHeight: "520px", minHeight: "575px" }}
    >
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index} className="relative group customScrollBar">
          <div>
            <div className="py-3 px-4 flex items-center gap-x-2 min-w-72 w-full bg-gray-200 dark:bg-slate-700 rounded">
              <div className="h-4 w-32 bg-gray-300 dark:bg-slate-600 rounded"></div>
              <div className="ml-auto h-4 w-4 bg-gray-300 dark:bg-slate-600 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonDropdown;
