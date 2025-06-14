import { useOptions } from "containers/OptionsContext";
import Cookies, { set } from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { initLiff, isLoggedIn, loginWithLine, getUserProfile } from "utils/liff";

export interface CommonLayoutShopProps {
  children?: React.ReactNode;
}
interface Customer {
  userID: string;
  profileImage: string;
  firstName: string;
  lastName: string;
}

const CommonLayoutShop: FC<CommonLayoutShopProps> = ({ children }) => {
  const location = useLocation();
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const userID = Cookies.get("ponchaishop_userID") || "";
  const { getOptionByName } = useOptions();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const basePath = getOptionByName('basePathAdmin');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    waitingPay: 0,
    waitingReOrder: 0,
    acceptOrder: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
    cancel: 0
  });

  useEffect(() => {
    const initialize = async () => {
      await initLiff();
      setLoggedIn(isLoggedIn());
      if (isLoggedIn()) {
        setProfile(await getUserProfile());
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if(!basePath) return;
    if (basePath && userID) {
      fetchStatusCounts();
      fetchAccount();
    }else{
      window.location.href = "/login";
    }
  }, [basePath, userID]);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${basePath}api/customer/frontend/getCustomerData.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ customerID: userID }).toString(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = await response.json();
      const customerData = data.results?.customer?.[0] || null; // ดึงตัวแรก หรือให้เป็น null ถ้าไม่มีข้อมูล
      setCustomer(customerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("userID", userID);

      const response = await fetch(`${basePath}api/getProduct/frontend/getOrderStatusByID.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString()
      });

      const data = await response.json();

      if (data.status === 200) {
        const statusData = data.results.product.reduce((acc: any, item: any) => {
          acc[item.order_status] = item.total_orders;
          return acc;
        }, {});

        setStatusCounts({
          all: statusData['รายการทั้งหมด'] || 0,
          waitingReOrder: statusData['รอรับออเดอร์'] || 0,
          acceptOrder: statusData['รับออเดอร์แล้ว'] || 0,
          waitingPay: statusData['รอชำระค่าสินค้า'] || 0,
          preparing: statusData['จัดเตรียมสินค้า'] || 0,
          shipping: statusData['กำลังจัดส่ง'] || 0,
          delivered: statusData['รับสินค้าแล้ว'] || 0,
          cancel: statusData['ยกเลิกออเดอร์'] || 0,
        });
      } else {
        console.error('Failed to fetch data:', data.error);
      }
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };

  useEffect(() => {
    const currentNavItem = navRefs.current.find(
      (ref) => ref?.getAttribute('href') === location.pathname
    );
    if (currentNavItem) {
      currentNavItem.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [location]);

  const navItems = [
    {
      name: "รายการทั้งหมด",
      link: "/accountshop/all",
      count: statusCounts.all,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-card-list pb-1" viewBox="0 0 16 16">
        <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
        <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
    {
      name: "รอรับออเดอร์",
      count: statusCounts.waitingReOrder,
      link: "/accountshop/1",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-clock pb-1" viewBox="0 0 16 16">
        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
    {
      name: "รับออเดอร์แล้ว",
      count: statusCounts.acceptOrder,
      link: "/accountshop/2",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-check-circle pb-1" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
    {
      name: "รอชำระเงิน",
      count: statusCounts.waitingPay,
      link: "/accountshop/4",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-wallet2 pb-1" viewBox="0 0 16 16">
        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
    {
      name: "กำลังเตรียมสินค้า",
      count: statusCounts.preparing,
      link: "/accountshop/3",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-basket2 pb-1" viewBox="0 0 16 16">
        <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0z" />
        <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6z" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
    {
      name: "กำลังจัดส่ง",
      count: statusCounts.shipping,
      link: "/accountshop/5",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-truck pb-1" viewBox="0 0 16 16">
        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
    {
      name: "จัดส่งสำเร็จ",
      count: statusCounts.delivered,
      link: "/accountshop/6",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-bag-check pb-1" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
    {
      name: "ยกเลิกออเดอร์",
      count: statusCounts.cancel,
      link: "/accountshop/7",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-bag-x pb-1" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M6.146 8.146a.5.5 0 0 1 .708 0L8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 0 1 0-.708" />
        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
      </svg>,
      color: 'bg-customLghtPrimary text-[#7366FF]'
    },
  ];
  return (
    <div className="pt-9 nc-CommonLayoutShopProps container">
      <div className="mt-3 lg:mt-7">
        <div className="max-w-4xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bag-check mr-3" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
              </svg>
              รายการสั่งซื้อ
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
              {customer?.firstName && customer.lastName ? (
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  คุณ{customer.firstName} {customer.lastName}
                </span>
              ) : (
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  GUEST
                </span>
              )}
              {" "}
              #{customer?.userID || ""}
            </span>
          </div>
        </div>
        <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>
        <div className="flex space-x-8 md:space-x-14 overflow-x-auto lg:justify-center hiddenScrollbar">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              ref={(el) => navRefs.current[index] = el}
              className={({ isActive }) =>
                `block pt-5 md:pt-8 border-b-2 border-transparent flex-shrink-0 text-sm sm:text-base ${isActive
                  ? " text-red-700 dark:text-slate-200 border-b-2 border-customRed"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`
              }
            >
              <div className="flex flex-col items-center justify-start">
                <div className="relative left-[1.5rem]">
                  <p className={`rounded-full text-sm w-5 flex justify-center items-center text-center text-white ${item.count < 1 ? 'bg-transparent' : 'bg-red-600'}`}>{item.count}</p>
                </div>
                {item.icon}
                <p>{item.name}</p>
              </div>
            </NavLink>
          ))}

        </div>
        <hr className="mt-[1rem] border-slate-200 dark:border-slate-700"></hr>
        <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
          {children}
        </div>
      </div>

    </div >
  );
};

export default CommonLayoutShop;
