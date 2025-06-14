import { avatarImgs } from 'contains/fakeData';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'shared/Avatar/Avatar';
import SwitchDarkMode2 from 'shared/SwitchDarkMode/SwitchDarkMode2';
import { initLiff, logoutFromLine } from 'utils/liff';
import { useCustomer } from "containers/CustomerContext";
import AlertService from 'components/AlertServicce';

const menuItems = [
    { to: "/account", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.16 10.87c-.1-.01-.22-.01-.33 0-2.38-.08-4.27-2.04-4.27-4.43C7.56 3.99 9.54 2 12 2s4.44 1.99 4.44 4.44c-.01 2.4-1.9 4.35-4.28 4.43Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ), label: "โปรไฟล์" },
    { to: "/accountshop/all", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 12.2h7M8 16.2h4.38M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4c-1 0-2 0-2 2 0 2 1 2 2 2Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 4.02C19.33 4.2 21 5.43 21 10v6c0 4-1 6-6 6H9c-5 0-6-2-6-6V10c0-4.56 1.67-5.8 5-5.98" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ), label: "รายการสั่งซื้อ" },
    { to: "/accountshop/4", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z"/></svg>
        ), label: "รายการรอชำระเงิน" },
    { to: "/account-savelists", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69c0-3.09 2.49-5.59 5.56-5.59 1.82 0 3.43.88 4.44 2.24C13.01 3.98 14.63 3.1 16.44 3.1c3.07 0 5.56 2.5 5.56 5.59 0 7-6.48 11.13-9.38 12.12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ), label: "สินค้าที่ถูกใจ" },
    { to: "/#", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11.97 22C17.49 22 21.97 17.52 21.97 12S17.49 2 11.97 2 1.97 6.48 1.97 12 6.45 22 11.97 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 16.5A4.5 4.5 0 1 0 12 7.5a4.5 4.5 0 0 0 0 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="m4.9 4.93 3.54 3.53M4.9 19.07l3.54-3.53M19.05 19.07l-3.54-3.53M19.05 4.93l-3.54 3.53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ), label: "ช่วยเหลือ" },
];

const AvatarMenuLogged: React.FC<{ close: () => void }> = ({ close }) => {
    const { customer, setCustomer } = useCustomer();
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        await logoutFromLine();
        Cookies.remove("ponchaishop_userID");
        Cookies.remove("ponchaishop_logged");
        Cookies.remove("redirectPath");
        setCustomer(null);
        AlertService.showSuccess('ออกจากระบบสำเร็จ!', 'คุณได้ออกจากระบบเรียบร้อยแล้ว', 1500, false, false, '/');
        setLoading(false);
    };

    useEffect(() => { initLiff().catch(console.error); }, []);

    return (
        <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 dark:text-slate-50 py-7 px-6">
            <div className="flex items-center space-x-3">
                <Avatar imgUrl={customer?.profileImage || avatarImgs[7]} sizeClass="w-12 h-12" />
                <div className="flex-grow">
                    <h4 className="font-semibold">{customer ? `${customer.firstName} ${customer.lastName}` : "Guest"}</h4>
                    <p className="text-xs mt-0.5">{customer ? `#${customer.userID}` : "Los Angeles, CA"}</p>
                </div>
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
            {menuItems.map(({ to, icon, label }) => (
                <Link key={to} to={to} className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={close}>
                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">{icon}</div>
                    <div className="ml-4"><p className="text-sm font-medium ">{label}</p></div>
                </Link>
            ))}
            <div className="flex items-center justify-between p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                <div className="flex items-center">
                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 7.89 10.93 9.75c-.24.41-.04.75.43.75h1.27c.48 0 .69.34.45.75L12 13.11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.3 18.04v-1.16C6 15.49 4.11 12.78 4.11 9.9c0-4.95 4.55-8.83 9.69-7.71 2.26.5 4.24 2 5.26 4.07 2.09 4.2-.11 8.66-3.34 10.62v1.16c0 .29.11.96-1 .96H9.26c-1.1.01-.96-.43-.96-.97Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 22c2.29-.65 4.71-.65 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="ml-4"><p className="text-sm font-medium ">โหมดกลางคืน</p></div>
                </div>
                <SwitchDarkMode2 />
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
            <button onClick={() => { close(); logout(); }} className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12H3.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="m5.85 8.65-3.35 3.35 3.35 3.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="ml-4"><p className="text-sm font-medium ">ออกจากระบบ</p></div>
            </button>
        </div>
    );
};

export default AvatarMenuLogged;
