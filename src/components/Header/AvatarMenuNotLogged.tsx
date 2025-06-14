import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SwitchDarkMode2 from 'shared/SwitchDarkMode/SwitchDarkMode2';

interface AvatarMenuNotLoggedProps {
    close: () => void;
}

const menuItems = [
    {
        label: 'เข้าสู่ระบบ',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg>
        ),
        action: 'navigate',
        to: '/login',
    },
    {
        label: 'สมัครสมาชิก',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.16 10.87c-.1-.01-.22-.01-.33 0-2.38-.08-4.27-2.04-4.27-4.43C7.56 3.99 9.54 2 12 2c2.45 0 4.44 1.99 4.44 4.44-.01 2.4-1.9 4.35-4.28 4.43z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        action: 'link',
        to: '/login',
    },
    {
        label: 'ช่วยเหลือ',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.97 22C17.4928 22 21.97 17.5228 21.97 12C21.97 6.47715 17.4928 2 11.97 2C6.44715 2 1.97 6.47715 1.97 12C1.97 17.5228 6.44715 22 11.97 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.9 4.93l3.54 3.53M4.9 19.07l3.54-3.53M19.05 19.07l-3.54-3.53M19.05 4.93l-3.54 3.53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        action: 'link',
        to: '/#',
    },
];

const AvatarMenuNotLogged: React.FC<AvatarMenuNotLoggedProps> = ({ close }) => {
    const navigate = useNavigate();

    return (
        <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 dark:text-slate-50 py-7 px-6">
            {menuItems.map((item, idx) =>
                item.action === 'navigate' ? (
                    <button
                        key={item.label}
                        onClick={() => {
                            close();
                            navigate(item.to);
                        }}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">{item.icon}</div>
                        <div className="ml-4">
                            <p className="text-sm font-medium">{item.label}</p>
                        </div>
                    </button>
                ) : (
                    <Link
                        key={item.label}
                        to={item.to}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        onClick={close}
                    >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">{item.icon}</div>
                        <div className="ml-4">
                            <p className="text-sm font-medium">{item.label}</p>
                        </div>
                    </Link>
                )
            )}

            <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

            <div className="flex items-center justify-between p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                <div className="flex items-center">
                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 7.89L10.93 9.75c-.24.41-.04.75.43.75h1.27c.48 0 .67.34.43.75L12 13.11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.3 18.04V16.88C6 15.49 4.11 12.78 4.11 9.9 4.11 4.95 8.66 1.07 13.8 2.19c2.26.5 4.24 2 5.27 4.07 2.09 4.2-.11 8.66-3.34 10.62v1.16c0 .29.11.96-1 .96H9.26c-1.1.01-.96-.42-.96-.96z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.5 22c2.29-.65 4.71-.65 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium">โหมดกลางคืน</p>
                    </div>
                </div>
                <SwitchDarkMode2 />
            </div>
        </div>
    );
};

export default AvatarMenuNotLogged;
