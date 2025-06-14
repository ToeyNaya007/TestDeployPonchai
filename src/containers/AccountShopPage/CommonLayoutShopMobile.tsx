import { useOptions } from 'containers/OptionsContext';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom';

const CommonLayoutShopMobile = () => {
  const userID = Cookies.get("ponchaishop_userID") || "";
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    waitingPay: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0
  });

  useEffect(() => {
    if (basePath) {
      fetchStatusCounts();
    }
  }, [basePath]);

  const fetchStatusCounts = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("userID", userID);  // Sending userID in the request

      const response = await fetch(`${basePath}api/getProduct/frontend/getOrderStatusByID.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",  // Setting the content type
        },
        body: formData.toString()  // Sending the data as x-www-form-urlencoded
      });

      const data = await response.json();

      if (data.status === 200) {
        const statusData = data.results.product.reduce((acc: any, item: any) => {
          acc[item.order_status] = item.total_orders;
          return acc;
        }, {});

        setStatusCounts({
          all: statusData['รอรับออเดอร์'] || 0,
          waitingPay: statusData['รอชำระค่าสินค้า'] || 0,
          preparing: statusData['จัดเตรียมสินค้า'] || 0,
          shipping: statusData['กำลังจัดส่ง'] || 0,
          delivered: statusData['รับสินค้าแล้ว'] || 0,
        });
      } else {
        console.error('Failed to fetch data:', data.error);
      }
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navItems = [

    {
      name: "รอชำระเงิน",
      count: statusCounts.waitingPay,
      link: "/accountshop/4",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-wallet2 pb-1" viewBox="0 0 16 16">
        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
      </svg>
    },
    {
      name: "เตรียมสินค้า",
      count: statusCounts.preparing,
      link: "/accountshop/3",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-basket2 pb-1" viewBox="0 0 16 16">
        <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0z" />
        <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6z" />
      </svg>
    },
    {
      name: "กำลังจัดส่ง",
      count: statusCounts.shipping,
      link: "/accountshop/5",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-truck pb-1" viewBox="0 0 16 16">
        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
      </svg>,
    },
    {
      name: "จัดส่งสำเร็จ",
      count: statusCounts.delivered,
      link: "/accountshop/6",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bag-check pb-1" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
      </svg>
    },
  ];

  return (
    <>
      <div className=" py-4 text-sm overflow-x-hidden">
        <div className='flex justify-between px-4 pb-7'>
          <span className='font-semibold text-slate-800 dark:text-slate-500'>การซื้อของฉัน</span>
          <a href="/accountshop/all" className='text-slate-800 dark:text-slate-500' style={{ display: 'inline-flex', alignItems: 'center' }}>
            ดูรายการทั้งหมด
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-right-fill"
              viewBox="0 0 16 16"
              style={{ marginLeft: '2px' }} // ระยะห่างระหว่างข้อความกับไอคอน
            >
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
          </a>
        </div>
        <div className='text-center flex justify-center md:justify-evenly space-x-4 text-slate-950 dark:text-slate-50'>
          {navItems.map((item, index) => (
            <NavLink
              ref={el => (navRefs.current[index] = el)}
              key={item.name}
              to={item.link}
              className={`nav-item nav-link `} // Removed condition for isActive
            >
              {item.count > 0 && (
                <div className='absolute top-[23rem] ml-[2.7rem] rounded-full text-slate-50 bg-red-600 text-center w-5 h-auto text-sm flex justify-center'>
                  <span>{item.count}</span>
                </div>
              )}

              <div className='flex flex-col justify-center items-center text-xs px-1'>
                {item.icon}
                {item.name}
              </div>

            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommonLayoutShopMobile;
