const ProductCardSkeleton = () => {
    return (
      <div className="nc-ProductCard relative flex flex-col bg-slate-100 rounded-3xl animate-pulse">
        {/* รูปภาพ */}
        <div className="relative flex-shrink-0 bg-slate-200 rounded-t-3xl overflow-hidden h-48 w-full"></div>
  
        {/* เนื้อหาด้านใน */}
        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          {/* ชื่อสินค้า */}
          <div className="h-4 bg-slate-300 rounded w-3/4"></div>
  
          {/* ราคา */}
          <div className="flex flex-col pt-4 space-y-2">
            <div className="h-6 bg-slate-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductCardSkeleton;
  