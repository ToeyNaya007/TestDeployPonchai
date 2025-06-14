import React from "react";

const SkeletonForm: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl">
      {/* สร้างโครงร่างสำหรับแต่ละฟิลด์ */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="flex">
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-l-2xl"></div>
              <div className="h-10 flex-1 bg-gray-300 dark:bg-gray-700 rounded-r-2xl"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="flex">
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-l-2xl"></div>
              <div className="h-10 flex-1 bg-gray-300 dark:bg-gray-700 rounded-r-2xl"></div>
            </div>
          </div>
        </div>
      ))}

      {/* โครงร่างปุ่ม */}
      <div className="pt-2">
        <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonForm;
