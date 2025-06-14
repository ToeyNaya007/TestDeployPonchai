import React, { useEffect, useRef, useState } from "react";
import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import profileimg from "images/avatars/Image-1.png";
import { useOptions } from "containers/OptionsContext";
import Cookies from "js-cookie";
import { useCustomer } from "containers/CustomerContext";
export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { customer, setCustomer } = useCustomer();


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
      name: "ข้อมูลส่วนตัว",
      link: "/account",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person pb-1" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
      </svg>
    },
    {
      name: "ที่อยู่สำหรับจัดส่ง",
      link: "/account-address",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-geo-alt pb-1" viewBox="0 0 16 16">
        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
      </svg>
    },
    {
      name: "สินค้าที่ถูกใจ",
      link: "/account-savelists",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-heart pb-1" viewBox="0 0 16 16">
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
      </svg>
    },
    {/*

    {
      name: "เปลี่ยนรหัสผ่าน",
      link: "/account-change-password",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-key pb-1" viewBox="0 0 16 16">
        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
      </svg>
    },
    */}

  ];
  return (
    <div className="pt-9 nc-CommonLayoutProps container">
      <div className="mt-3 lg:mt-7">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-row justify-between">
            <div className="flex-row">
                <img className="rounded-full" src={customer?.profileImage} alt="Profile" style={{ width: '5rem' }} />
                <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  คุณ {customer?.firstName} {customer?.lastName}
                </span>{" "}
                #{customer?.userID}
                </span>
                <hr className="mt-2 border-slate-200 dark:border-slate-700"></hr>
            </div>
            <div className="flex-row">
              <div className="max-w-3xl">
                <h2 className="text-3xl xl:text-4xl font-semibold flex items-center justify-end w-40 lg:w-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle mr-3" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>
                  บัญชีผู้ใช้
                </h2>
              </div>
            </div>
          </div>

          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>
          <div className="flex space-x-8 md:space-x-14 overflow-x-auto  hiddenScrollbar">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.link || ""}
                ref={(el) => navRefs.current[index] = el}
                className={({ isActive }) =>
                  `block py-5 md:py-8 border-b-2 border-transparent flex-shrink-0 text-sm sm:text-base ${isActive
                    ? "border-primary-500 font-semibold text-red-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`
                }
              >
                <div className="flex flex-col items-center justify-center">
                  {item.icon}
                  <p>{item.name}</p>
                </div>
              </NavLink>
            ))}
          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        {children}
      </div>
    </div>
  );
};

export default CommonLayout;
