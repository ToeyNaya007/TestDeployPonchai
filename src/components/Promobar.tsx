import React from 'react'
import { Link } from 'react-router-dom'

const Promobar = () => {
    return (
        <div className="bg-red-700 py-2 hidden md:block">
            <div className="container mx-auto">
                <div className="flex justify-start lg:space-x-20 md:space-x-10 text-white font-semibold">
                    <Link className='group' to={'/product-list/bestseller'}>สินค้าขายดี
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-300"></div>
                    </Link>
                    <Link className='group' to={'/product-list/newproduct'}>สินค้ามาใหม่
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-300"></div>
                    </Link>
                    <Link className='group' to={'/product-list/productsale'}>สินค้าลดราคา
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-300"></div>
                    </Link>
                    <Link className='group' to={'/product-list/promotionmixmatch'}>โปรโมชันจับคู่
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-300"></div>
                    </Link>
                    <Link className='group' to={'/product-list/promotionsum'}>โปรโมชันรวมชิ้น
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-300"></div>
                    </Link>
                    <Link className='group' to={'/product-list/buyagain'}>ซื้ออีกครั้ง
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-300"></div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default Promobar