import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useOptions } from "containers/OptionsContext";
import { Product } from "./CartPage";
import Cookies from "js-cookie";
import { checkAuthNow } from "utils/checkAuthNow";
import { useLoginPopup } from "containers/LoginPopupContext";

interface QRPopupProps {
    cartIDs: string[];
    isOpen: boolean;
    onClose: () => void;
    handleCheckout: () => void;
    totalPrice: number;
    fileName: string;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearFile: () => void;
    action: string;
}


const QRPopup: React.FC<QRPopupProps> = ({ isOpen, onClose, totalPrice, handleCheckout, fileName, fileInputRef, handleClearFile, handleFileChange, cartIDs, action }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const [qrCode, setQrCode] = useState("");
    const userID = Cookies.get("ponchaishop_userID") || "";
    const [totalFromAPI, setTotalFromAPI] = useState(0);
    const [error, setError] = useState("");
    const { showLoginPopup, setShowLoginPopup } = useLoginPopup();


    useEffect(() => {
        if (basePath && userID && cartIDs.length > 0 && action) {
            fetchCartItems();
        }
    }, [basePath, userID, cartIDs, action]);


    useEffect(() => {
        if (qrCode && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, qrCode, { width: 256 }, (error) => {
                if (error) {
                    console.error("Error generating QR Code:", error);
                    return;
                }
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext("2d");
                if (!ctx) return;
                if (!ctx) return;

                const logo = new Image();
                logo.crossOrigin = 'anonymous';
                logo.src = "/favicon.png";
                logo.onload = () => {
                    if (!canvas) return;
                    const logoSize = canvas.width * 0.1; // ขนาดโลโก้ 10% ของ QR
                    const centerX = (canvas.width - logoSize) / 2;
                    const centerY = (canvas.height - logoSize) / 2;

                    ctx.fillStyle = "white"; // พื้นหลังขาวเพื่อให้โลโก้ชัดเจน
                    ctx.fillRect(centerX, centerY, logoSize, logoSize);
                    ctx.drawImage(logo, centerX, centerY, logoSize, logoSize);
                };
            });
        }
    }, [qrCode]);

    const fetchCartItems = async () => {
        let selectedEndpoint = '';

        switch (action) {
            case 'save':
                selectedEndpoint = 'genQR.php';
                break;
            case 'edit':
                selectedEndpoint = 'genQREditSlip.php';
                break;
            default:
                setError("ไม่พบ action ที่ระบุ");
                return;
        }
        try {
            if (!basePath) return;
            const isAuthenticated = await checkAuthNow(basePath);
            if (!isAuthenticated) {
                setShowLoginPopup(true);
                return;
            }
            const formData = new FormData();
            formData.append('userID', userID);

            cartIDs.forEach((id) => {
                formData.append('cartIDs[]', id); // ใช้ชื่อแบบ array
            });

            const response = await fetch(`${basePath}api/cart/frontend/${selectedEndpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.status === 200) {
                setTotalFromAPI(data.results.totalPrice);
                setQrCode(data.results.qrCode);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (error: any) {
            setError(error.message || 'Failed to fetch cart items');
        }
    };


    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // ดึงวันเวลาปัจจุบันเพื่อใช้เป็นชื่อไฟล์
        const now = new Date();
        const year = now.getFullYear(); // ค.ศ.
        const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือน (01-12)
        const day = String(now.getDate()).padStart(2, '0'); // วัน (01-31)
        const fileName = `qrcode_${year}${month}${day}.png`; // ตั้งชื่อไฟล์ เช่น "qrcode_20250206.png"
        // สร้างลิงก์สำหรับดาวน์โหลด
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png"); // แปลงเป็นรูปภาพ PNG
        link.download = fileName; // ตั้งชื่อไฟล์
        link.click(); // เรียกใช้การดาวน์โหลด
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 overflow-auto transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="bg-slate-50 dark:bg-slate-800 md:h-full md:max-h-[50rem] lg:max-h-[50rem] overflow-y-scroll custom-scrollbar  xs:mt-[30vh] mt-10 sm:mt-0 px-6 py-7 border border-t-4 border-t-red-500 space-y-4 sm:space-y-6 rounded-lg w-[85%] sm:w-full md:w-4/5 lg:w-full max-w-[56rem] shadow-lg transform transition-all duration-500 ease-out">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <i className="text-2xl mr-2 font-bold las la-shopping-basket"></i>
                        <h2 className="text-xl font-semibold">ชำระเงินค่าสินค้า</h2>
                    </div>
                    <button onClick={() => { handleClearFile(); onClose(); }}>
                        <i className="text-3xl las la-times-circle"></i>
                    </button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                    สแกน QR Code ผ่านแอปธนาคารเพื่อชำระเงินค่าสินค้า
                </p>
                <div className="flex flex-col items-center gap-2">
                    {error && (
                        <p className="text-red">{error}</p>
                    )}
                    <canvas ref={canvasRef}></canvas>
                    <button id="downloadBtn" onClick={handleDownload} className="px-4 py-1 bg-white text-sm text-black border-[1px] border-green-500 hover:bg-green-500 hover:text-white transition-colors rounded">
                        <i className="las la-download mr-[3px]"></i>ดาวน์โหลด QR Code
                    </button>
                    <p className="font-semibold mt-3 tracking-wide">ยอดเงินที่ต้องชำระ : {totalFromAPI.toLocaleString()} บาท</p>
                </div>
                <div>
                    <label htmlFor="uploadFile1" className="bg-white text-gray-500 font-semibold text-base rounded max-w-sm h-40 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-solid mx-auto dark:bg-slate-900 dark:hover:bg-slate-700 hover:bg-slate-100 transition-colors ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
                            <path
                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                data-original="#000000"
                            />
                            <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" data-original="#000000"
                            />
                        </svg>
                        {fileName ? (
                            <div className="text-center mt-3 text-gray-600 text-sm">
                                ชื่อไฟล์ที่เลือก: {fileName}
                            </div>
                        ) : (
                            <div className="">
                                อัพโหลดสลิป
                            </div>
                        )}

                        <input type="file" id="uploadFile1" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                        <p className="text-xs font-medium text-gray-400 mt-2 px-4 text-center">
                            เฉพาะไฟล์รูปแบบ JPG, JPEG, และ PNG เท่านั้นที่อัพโหลดได้
                        </p>
                    </label>
                    {fileName && (
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={handleClearFile}
                                className="py-1 px-3 bg-red-300 hover:bg-red-500 mt-2 text-sm text-white rounded-lg transition-colors"
                            >
                                <i className="las la-times-circle mr-[1px]"></i>
                                เคลียร์ไฟล์
                            </button>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end pt-6 gap-4">
                    <button
                        onClick={onClose}
                        className="nc-Button mt-3 sm:mt-0 sm:ml-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-full py-3 px-6 hover:bg-gray-100"
                    >
                        ยกเลิก
                    </button>
                    <button
                        className={`nc-Button text-slate-50 dark:text-slate-800 rounded-full py-3 px-6  ${fileName ? 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800' : ' bg-slate-300 dark:bg-slate-500'}`}
                        disabled={!fileName}
                        onClick={handleCheckout}
                    >
                        <i className="las la-shopping-basket mr-2 mb-1"></i>
                        ยืนยันการชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRPopup;
