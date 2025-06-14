import Cookies from 'js-cookie';
import React, { useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { initLiff, logoutFromLine } from 'utils/liff';
import { useCustomer } from 'containers/CustomerContext';
import AlertService from 'components/AlertServicce';

const CommonLayoutAccountMobile = () => {
    const navRefs = useRef<(HTMLDivElement | null)[]>([]);
    const navigate = useNavigate();
    const { customer, setCustomer } = useCustomer();
    const [loading, setLoading] = React.useState(false);
    const navItems = [
        {
            name: "ที่อยู่จัดส่ง",
            link: "/account-address",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-geo-alt pb-1" viewBox="0 0 16 16">
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
        },
        {
            name: "สินค้าที่ถูกใจ",
            link: "/account-savelists",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-heart pb-1" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
            </svg>
        },

        {
            name: "สินค้าในตะกร้า",
            link: "/cart",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart pb-1" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
        },

        {
            name: "ออกจากระบบ",
            link: "/login",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg>
        },
    ];

    const logout = async () => {
        setLoading(true); // set loading true when logout starts
        await logoutFromLine();
        Cookies.remove("ponchaishop_userID");
        Cookies.remove("ponchaishop_logged");
        Cookies.remove("redirectPath");
        setCustomer(null);
        AlertService.showSuccess('ออกจากระบบสำเร็จ!', 'คุณได้ออกจากระบบเรียบร้อยแล้ว', 1500, false, false, '/');
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

    const handleClick = (item: { name: string; link: string }) => {
        if (item.name === "ออกจากระบบ") {
            logout();
        }
    };

    return (
        <>
            <div className="py-4 text-sm">
                <div className='flex justify-between px-4 pb-7'>
                    <span className='font-semibold text-slate-800 dark:text-slate-400'>โปรไฟล์ของฉัน</span>
                    <a href="/account" className='text-slate-800 dark:text-slate-400 flex items-center'>
                        ตั้งค่าโปรไฟล์
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-gear-fill ml-[4px]" viewBox="0 0 16 16">
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                        </svg>
                    </a>
                </div>
                <div className='text-center flex overflow-y-hidden overflow-x-auto hiddenScrollbar text-slate-950 dark:text-slate-50 md:px-2'>
                    {navItems.map((item, index) => (
                        <div
                            key={item.name}
                            ref={el => (navRefs.current[index] = el)}
                            onClick={() => handleClick(item)}
                            className="cursor-pointer"
                        >
                            <div className='flex flex-col justify-center items-center text-xs px-1 min-w-24 w-auto'>
                                {item.icon}
                                {item.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CommonLayoutAccountMobile;
