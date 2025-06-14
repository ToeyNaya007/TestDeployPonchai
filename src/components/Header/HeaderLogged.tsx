import React, { FC, useEffect, useState } from "react";
import MainNav2Logged from "./MainNav2Logged";
import { useOptions } from "containers/OptionsContext";
import { useUser } from "containers/UsersContext";
import { useNavigate, Link } from "react-router-dom";
import AlertService from "components/AlertServicce";
import Cookies from "js-cookie";
import { initLiff, logoutFromLine } from "utils/liff";
import { useCustomer } from "containers/CustomerContext";

export interface HeaderLoggedProps { }

const HeaderLogged: FC<HeaderLoggedProps> = () => {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const systemContactUsTell = getOptionByName("systemContactUsTell");
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับเปลี่ยนหน้า
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [loading, setLoading] = useState(false);
  const { customer,setCustomer  } = useCustomer();
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [isNavSticky, setIsNavSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsTopBarVisible(false);
    } else {
      setIsTopBarVisible(true);
    }

    if (window.scrollY > 100) {
      setIsNavSticky(true);
    } else {
      setIsNavSticky(false);
    }
  };

  const logout = async () => {
    setLoading(true); // set loading true when logout starts
    await logoutFromLine();
    Cookies.remove("ponchaishop_userID");
    Cookies.remove("ponchaishop_logged");
    Cookies.remove("redirectPath");
    setCustomer(null);
    AlertService.showSuccess('ออกจากระบบสำเร็จ!', 'คุณได้ออกจากระบบเรียบร้อยแล้ว', 1500, false, false,'/');
    setLoading(false); // set loading false after logout
  };

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await initLiff();
        setLoading(false);
      } catch (error) {
        console.error("Error initializing LIFF:", error);
        setLoading(false);
      }
    };

    initializeLiff();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Top bar */}
      <div
        className={`fixed top-0 nc-HeaderLogged w-full z-40 ${isTopBarVisible ? "static opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
      >
        <div className="pt-1 px-2 bg-[#f5f7f8] dark:bg-slate-800 hidden lg:flex top-0 w-full z-40">
          <div className="container flex justify-between items-center ">
            <p className="text-xs font-medium text-black dark:text-white">
              <i className="las la-phone-volume mr-2 text-base"></i>
              ติดต่อสอบถาม {systemContactUsTell}
            </p>
            <div className="flex items-center gap-10 font-medium text-black dark:text-white">
              <Link
                to={"/accountshop/all"}
                className="cursor-pointer text-xs"
              >
                ติดตามสถานะการซื้อ
              </Link>
              <div className=" flex gap-2">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 dark:bg-slate-900 rounded-md p-1 px-2 flex items-center justify-center min-w-[80px] min-h-[32px]">
                      <i className="las la-spinner animate-spin text-xl mr-2"></i>
                      <span className="text-xs">กำลังดำเนินการ...</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-900 rounded-md p-1 px-2 flex items-center justify-center min-w-[80px] min-h-[32px]">
                      <i className="las la-spinner animate-spin text-xl mr-2"></i>
                    </div>
                  </div>
                ) : customer ? (
                  <>
                    <div className="bg-slate-200 dark:bg-slate-900 rounded-md p-1 px-2 dark:hover:bg-slate-500 duration-300">
                      <button className="text-xs flex items-center cursor-default" disabled={loading}>
                        <i className="las la-user text-xl mr-2"></i>คุณ {customer.firstName} {customer.lastName}
                      </button>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-900 rounded-md p-1 px-2 cursor-pointer hover:bg-red-600 hover:text-white dark:hover:bg-red-500 duration-300">
                      <button
                        className="text-xs flex items-center"
                        onClick={logout}
                        disabled={loading}
                      >
                        {loading ? (
                          <i className="las la-spinner animate-spin text-xl mr-2"></i>
                        ) : (
                          <i className="las la-sign-out-alt text-xl mr-2"></i>
                        )}
                        ออกจากระบบ
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-slate-200 dark:bg-slate-900 rounded-md p-1 px-2 cursor-pointer hover:bg-slate-600 hover:text-white dark:hover:bg-slate-500 duration-300">
                      <a
                        className="text-xs flex items-center"
                        href="/login"
                        style={loading ? { pointerEvents: "none", opacity: 0.6 } : {}}
                        tabIndex={loading ? -1 : undefined}
                      >
                        {loading ? (
                          <i className="las la-spinner animate-spin text-xl mr-2"></i>
                        ) : (
                          <i className="las la-user text-xl mr-2"></i>
                        )}
                        เข้าสู่ระบบ
                      </a>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-900 rounded-md p-1 px-2 cursor-pointer hover:bg-slate-600 hover:text-white dark:hover:bg-slate-500 duration-300">
                      <a
                        className="text-xs flex items-center"
                        href="/login"
                        style={loading ? { pointerEvents: "none", opacity: 0.6 } : {}}
                        tabIndex={loading ? -1 : undefined}
                      >
                        {loading ? (
                          <i className="las la-spinner animate-spin text-xl mr-2"></i>
                        ) : (
                          <i className="las la-user text-xl mr-2"></i>
                        )}
                        สมัครสมาชิก
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sticky MainNav2Logged */}
      <div
        className={`nc-MainNav2Logged z-40 w-full ${isNavSticky ? "fixed top-0 shadow-lg lg:mt-0" : "relative lg:mt-8"
          }`}
      >
        <MainNav2Logged />
      </div>

    </div >
  );
};

export default HeaderLogged;
