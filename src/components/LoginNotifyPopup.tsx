import { useEffect, useState } from 'react';
import { useLoginPopup } from 'containers/LoginPopupContext';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import { useLocation } from 'react-router-dom';

const LoginNotifyPopup = () => {
    const { showLoginPopup, setShowLoginPopup } = useLoginPopup();
    const [timer, setTimer] = useState(5);
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        if (showLoginPopup) {
            setIsVisible(true); // เริ่ม transition
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            const timeout = setTimeout(() => {
                setIsVisible(false); // เริ่ม fade out
                setTimeout(() => {
                    setShowLoginPopup(false);
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`; // ส่งพารามิเตอร์ redirect ไปยังหน้าเข้าสู่ระบบ
                }, 300); // รอให้ effect fade out ทำงานเสร็จ
            }, 5000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [showLoginPopup, setShowLoginPopup]);

    if (!showLoginPopup) return null;

    const handleLoginRedirect = () => {
        setIsVisible(false); // เริ่ม fade out
        setTimeout(() => {
            setShowLoginPopup(false);
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`; // ส่งพารามิเตอร์ redirect ไปยังหน้าเข้าสู่ระบบ
        }, 300);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className={`flex flex-col bg-white dark:bg-slate-700 rounded-xl p-6 shadow-xl text-center w-96 border-t-4 border-red-500 transform transition-transform duration-300 ${isVisible ? "scale-100" : "scale-95"}`}>
                <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-person-exclamation text-slate-600 dark:text-slate-400 mt-8" viewBox="0 0 16 16">
                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 1 0V11a.5.5 0 0 0-.5-.5m0 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold mb-4">คุณยังไม่ได้เข้าสู่ระบบ</h2>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">กรุณาเข้าสู่ระบบก่อนใช้งานหน้านี้</p>
                <ButtonPrimary className="rounded-2xl" onClick={handleLoginRedirect}>
                    ไปหน้าเข้าสู่ระบบ / สมัครสมาชิก
                </ButtonPrimary>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">จะเปลี่ยนเส้นทางอัตโนมัติใน {timer} วินาที...</p>
            </div>
        </div>
    );
};

export default LoginNotifyPopup;
