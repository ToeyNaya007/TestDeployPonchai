import { useOptions } from "containers/OptionsContext";
import { useEffect, useState } from "react";

interface NotifyPopup {
    ID: number;
    startDate: string;
    endDate: string;
    message: string;
    closedDays: string;
    isHoliday: boolean;
    typeHoliday: number;
}

type ShopPopupProps = {
    isOpenTime?: boolean;
    onStatusChange?: (status: boolean) => void;
    onCountdownUpdate?: (countdown: string) => void; // เพิ่ม prop นี้
};

const ShopPopup: React.FC<ShopPopupProps> = ({ isOpenTime, onStatusChange, onCountdownUpdate }) => {
    const [popupData, setPopupData] = useState<NotifyPopup | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const [time, setTime] = useState<string>("");
    const [countdown, setCountdown] = useState<string>("");

    useEffect(() => {
        if (onCountdownUpdate) {
            onCountdownUpdate(countdown);
        }
    }, [countdown]);

    useEffect(() => {
        const updateTime = () => {
            setTime(
                new Date().toLocaleTimeString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                })
            );
        };

        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!basePath) return;
        fetchPopupData();
        const interval = setInterval(fetchPopupData, 60000);
        return () => clearInterval(interval);
    }, [basePath]);

    useEffect(() => {
        if (!showPopup || !popupData) return;
        const updateCountdown = () => {
            const now = new Date();
            const [startHour, startMinute, startSecond] = popupData.startDate.split(":").map(Number);
            const startTime = new Date(now);
            startTime.setHours(startHour, startMinute, startSecond, 0);

            setCountdown(calculateCountdown(startTime));
        };

        const intervalId = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalId);
    }, [showPopup, popupData]);

    const fetchPopupData = async () => {
        try {
            const response = await fetch(`${basePath}api/notify/frontend/getNotify.php`);
            const json = await response.json();

            if (json.data.length > 0) {
                const popup = json.data[0];

                if (!popup.startDate || !popup.endDate) {
                    console.error("Missing startDate or endDate in API response");
                    return;
                }

                const now = new Date();

                // แยกชั่วโมง นาที วินาที
                const [startHour, startMinute, startSecond] = popup.startDate.split(":").map(Number);
                const [endHour, endMinute, endSecond] = popup.endDate.split(":").map(Number);

                // กำหนดเวลาเปิดร้านและปิดร้าน
                const startTime = new Date(now);
                startTime.setHours(startHour, startMinute, startSecond, 0);

                const endTime = new Date(now);
                endTime.setHours(endHour, endMinute, endSecond, 0);

                // เวลา ณ ปัจจุบัน
                const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
                const startSeconds = startHour * 3600 + startMinute * 60 + startSecond;
                const endSeconds = endHour * 3600 + endMinute * 60 + endSecond;

                if (popup.isHoliday) {
                    setPopupData(popup);
                    setShowPopup(true);
                    setCountdown(calculateCountdown(startTime));
                    onStatusChange && onStatusChange(false);
                }
            }
        } catch (error) {
            console.error("Error fetching popup data:", error);
        }
    };

    const calculateCountdown = (startTime: Date) => {
        const now = new Date();
        let diff = (startTime.getTime() - now.getTime()) / 1000; // คำนวณต่างเป็นวินาที

        if (diff < 0) {
            diff += 24 * 3600; // ถ้าเลยเวลาแล้ว ให้ไปเริ่มที่วันถัดไป
        }

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = Math.floor(diff % 60);

        return `ร้านจะเปิดอีก ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return "Invalid Time";

        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        const now = new Date();
        now.setHours(hours, minutes, seconds, 0);

        return now.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const dayTranslations: Record<string, string> = {
        sunday: "อาทิตย์",
        monday: "จันทร์",
        tuesday: "อังคาร",
        wednesday: "พุธ",
        thursday: "พฤหัสบดี",
        friday: "ศุกร์",
        saturday: "เสาร์",
      };

    return (
        <div>
            {showPopup && popupData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-lg">
                    <div className="p-2 rounded-lg bg-red-700 shadow-lg w-full md:w-3/4 lg:w-1/2 mx-2">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white animate-bounce">การแจ้งเตือน</h2>
                            <button className="text-white" onClick={() => setShowPopup(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-2 bg-white flex flex-col items-center justify-center rounded-lg">
                            <p className="text-red-500 font-semibold text-lg">{popupData.message}</p>
                            {popupData.typeHoliday === 1 && Array.isArray(popupData.closedDays) && (
                                <p>วันหยุด : {popupData.closedDays.map((day) => dayTranslations[day] || day).join(", ")}</p>
                            )}
                            {popupData.typeHoliday === 2 && <p>เวลาเปิดทำการ: {formatTime(popupData.startDate)} - {formatTime(popupData.endDate)} น.</p>}
                            <p className="mt-2 text-sm">ลูกค้าสามารถดูและเพิ่มสินค้าเข้าตะกร้าได้ แต่ไม่สามารถสั่งซื้อได้ในขณะนี้</p>
                            <p className="mt-4 text-lg text-green-600"> {countdown}</p>
                            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopPopup;