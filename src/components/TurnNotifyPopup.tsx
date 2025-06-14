import { useOptions } from 'containers/OptionsContext';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';

const TurnNotifyPopup = () => {
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [token, setToken] = React.useState<string | null>(null);
    const [turnOnNotifyPopup, setShowTurnOnNotifyPopup] = React.useState(false);

    const userID = Cookies.get("ponchaishop_userID") || "";

    const handleClose = () => {
        const oneHourLater = new Date().getTime() + 60 * 60 * 1000;
        Cookies.set("popupClosedUntil", oneHourLater.toString(), { expires: 1 / 24 }); // 1 hour
        setShowTurnOnNotifyPopup(false);
    };

    const checkToken = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${basePath}api/notify/frontend/CheckTokenNotify.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ userID }).toString(),
            });

            const data = await response.json();
            if (data.status === 200 && data.results.token) {
                setToken(data.results.token);
                setShowTurnOnNotifyPopup(false); // ไม่ต้องโชว์ popup เพราะมี token แล้ว
            } else {
                if (data.status === 201) {
                    const popupClosedUntil = Cookies.get("popupClosedUntil");
                    const now = new Date().getTime();
                    if (!popupClosedUntil || now > parseInt(popupClosedUntil, 10)) {
                        setShowTurnOnNotifyPopup(true); // โชว์ popup ถ้าไม่เคยปิด หรือครบ 1 ชั่วโมงแล้ว
                    }
                    setToken(null);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    if (!turnOnNotifyPopup) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[40] transition-opacity duration-300 opacity-100">
            <div className="flex flex-col bg-white dark:bg-slate-700 rounded-xl mx-5 sm:mx-0 p-6 shadow-xl text-center w-96 border-y-[4px] border-red-500 transform transition-transform duration-300 scale-100">
                <div className="flex justify-end">
                    <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                        onClick={handleClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex justify-center mb-4">
                    <a href="https://lin.ee/2j0vX8x" target="_blank" rel="noopener noreferrer">
                        <img src="https://img.freepik.com/free-vector/messages-concept-illustration_114360-524.jpg?t=st=1745399723~exp=1745403323~hmac=dc14d6cd74513324cf226e6b635af4153c91c92bc5c672554b242b835f013db9&w=740" alt="" />
                    </a>
                </div>
                <h2 className="text-xl font-semibold mb-4">รับการแจ้งเตือนผ่าน LINE OA ของเรา</h2>
                <button className="rounded-xl bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 mb-2">
                    <a href="https://lin.ee/2j0vX8x" target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center justify-center">
                            <span className="text-lg mr-2">เปิดใช้งานการแจ้งเตือน</span>
                            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.133 12.632v-1.8a5.407 5.407 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.933.933 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175Zm-13.267-.8a1 1 0 0 1-1-1 9.424 9.424 0 0 1 2.517-6.391A1.001 1.001 0 1 1 6.854 5.8a7.43 7.43 0 0 0-1.988 5.037 1 1 0 0 1-1 .995Zm16.268 0a1 1 0 0 1-1-1A7.431 7.431 0 0 0 17.146 5.8a1 1 0 0 1 1.471-1.354 9.424 9.424 0 0 1 2.517 6.391 1 1 0 0 1-1 .995ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                            </svg>
                        </div>
                    </a>
                </button>
                <button
                    className="mt-2 text-sm font-medium px-4 py-2 bg-slate-200/30 text-gray-600 dark:text-gray-300 hover:bg-slate-200 transition-colors rounded-xl"
                    onClick={handleClose}
                >
                    ปิดหน้าต่าง
                </button>
            </div>
        </div>
    );
};

export default TurnNotifyPopup;
