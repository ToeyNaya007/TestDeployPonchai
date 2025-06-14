import Label from "components/Label/Label";
import React, { FC, useEffect, useRef, useState } from "react";
import CommonLayout from "./CommonLayoutShop";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Prices from "components/Prices";
import { useOptions } from "containers/OptionsContext";
import { Link, useLocation, useParams } from "react-router-dom";
import AlertService from "components/AlertServicce";
import Cookies from "js-cookie";
import QRPopup from "containers/ProductDetailPage/QRPopup";
import { useLoginPopup } from "containers/LoginPopupContext";
import { checkAuthNow } from "utils/checkAuthNow";

export interface AccountShopPageProps {
  className?: string;
}
type Order = {
  oNo: string;
  oDate: string;
  oTotalPrice: number;
  oTotalDiscount: number;
  oItemCount: number;
  oStatus: string;
  items: ProductItem[];
};

type ProductItem = {
  oipID: string;
  oiTitle: string;
  oiPrice: number;
  oiQuantity: number;
  oiCoolingCondition: number;
  image: string;
  slug: string;
};

const AccountShopPage: FC<AccountShopPageProps> = ({ className = "" }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderID = params.get('order');
  const { status } = useParams<{ status: string }>();  // Capture status from the URL
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openOrders, setOpenOrders] = useState<Set<string>>(new Set());
  const [headerText, setHeaderText] = useState("");
  const [searchOrderNo, setSearchOrderNo] = useState("");
  const [isQRPopupOpen, setQRPopupOpen] = useState(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedOrderTotalPrice, setSelectedOrderTotalPrice] = useState<number>(0);
  const { showLoginPopup, setShowLoginPopup } = useLoginPopup();

  useEffect(() => {
    if (!status) return;  // ตรวจสอบว่า status มีค่าหรือไม่
    let conditionWhere = '';
    setOrders([]);
    switch (status) {
      case "all":
        conditionWhere = ' 1';
        setHeaderText("รายการสั่งซื้อทั้งหมด");
        break;
      case "1":
        conditionWhere = ' oStatus = 1';
        setHeaderText("รอรับออเดอร์");
        break;
      case "2":
        conditionWhere = ' oStatus = 2';
        setHeaderText("รับออเดอร์แล้ว");
        break;
      case "3":
        conditionWhere = ' oStatus = 3';
        setHeaderText("กำลังเตรียมสินค้า");
        break;
      case "4":
        conditionWhere = ' oStatus = 4';
        setHeaderText("รายการรอชำระเงิน");
        break;
      case "5":
        conditionWhere = ' oStatus = 5';
        setHeaderText("กำลังจัดส่งสินค้า");
        break;
      case "6":
        conditionWhere = ' oStatus = 6';
        setHeaderText("จัดส่งสำเร็จ");
        break;
      case "7":
        conditionWhere = ' oStatus = 7';
        setHeaderText("ยกเลิกออเดอร์");
        break;
      default:
        conditionWhere = ' 1';
        setHeaderText("รายการสั่งซื้อทั้งหมด");
        break;
    }
    if (basePath && userID) {
      fetchOrders(conditionWhere);
    } else {
      window.location.href = "/login";
    }
    if (orderID) {
      setSearchOrderNo(orderID);
    }
  }, [status, basePath, userID]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileName("");
  };

  const handleUpdateSlip = async (orderID: string | null) => {
    if (!orderID) return;
    const formData = new FormData();
    formData.append('orderID', orderID); // เปลี่ยนจาก oNo เป็น orderID ตาม API
    if (fileInputRef.current?.files?.[0]) {
      formData.append('file', fileInputRef.current.files[0]); // เปลี่ยนจาก slipFile เป็น file ตาม API
    } else {
      AlertService.showError("กรุณาเลือกไฟล์สลิป", "คุณยังไม่ได้เลือกไฟล์ที่ต้องการอัปโหลด");
      return;
    }

    try {
      if (!basePath) return;
      const isAuthenticated = await checkAuthNow(basePath);
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      const response = await fetch(`${basePath}api/cart/frontend/updateSlip.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.status === 200) {
        AlertService.showSuccess("อัปโหลดสลิปสำเร็จ", "สลิปของคุณถูกอัปเดตเรียบร้อยแล้ว", 2000, true, true);
        setQRPopupOpen(false);
      } else {
        throw new Error(data.error?.[0] || 'เกิดข้อผิดพลาดในการอัปโหลดสลิป');
      }
    } catch (error: any) {
      AlertService.showError("เกิดข้อผิดพลาด", error.message || 'ไม่สามารถอัปโหลดสลิปได้');
    }
  };


  const fetchOrders = async (conditionWhere: string) => {
    try {
      if (!basePath) return;
      const isAuthenticated = await checkAuthNow(basePath);
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      setLoading(true);
      const now = new Date().getMilliseconds();
      const response = await fetch(`${basePath}api/getProduct/frontend/getOrderDetail.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ userID, conditionWhere }).toString(),
      });

      const data = await response.json();

      if (data.status !== 200) {  // ตรวจสอบค่า status ที่ API ส่งมา
        throw new Error(data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
      setOrders(data.results?.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const fetchCancelOrder = async (oNo: string) => {
    try {
      if (!basePath) return;
      const isAuthenticated = await checkAuthNow(basePath);
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      setLoading(true);
      const response = await fetch(`${basePath}api/getProduct/frontend/cancelOrder.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ oNo, userID }).toString(),
      });

      const text = await response.text();
      const result = JSON.parse(text);
      if (result.status !== 200) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการยกเลิกออเดอร์");
      }
      AlertService.showSuccess("ยกเลิกเออเดอร์สำเร็จ", "ออเดอร์ของคุณได้รับการยกเลิกแล้ว", 2000, true, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (oNo: string) => {
    const confirmResult = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      html: `คุณต้องการยกเลิกออเดอร์นี้หรือไม่? <br>เลขที่ออเดอร์ ${oNo} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ยกเลิก!',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (!confirmResult.isConfirmed) {
      return;
    }
    fetchCancelOrder(oNo);
  }

  const toggleOrderDetails = (oNo: string) => {
    setOpenOrders((prev) => {
      const newSet = new Set(prev);
      newSet.has(oNo) ? newSet.delete(oNo) : newSet.add(oNo);
      return newSet;
    });
  };

  const ConvertStatusText = (oStatus: string) => {
    let statusText = '';
    let statusColor = '';
    let statusTextColor = '';

    switch (oStatus) {
      case '1':
        statusText = 'รอรับออเดอร์';
        statusColor = 'bg-customLghtWarning';
        statusTextColor = '!text-[#FFAA05]';
        break;
      case '2':
        statusText = 'รับออเดอร์แล้ว';
        statusColor = 'bg-customLghtWarning';
        statusTextColor = '!text-[#FFAA05]';
        break;
      case '3':
        statusText = 'กำลังเตรียมสินค้า';
        statusColor = 'bg-customLghtPrimary';
        statusTextColor = '!text-[#7366FF]';
        break;
      case '4':
        statusText = 'รอชำระเงิน';
        statusColor = 'bg-[#fd020217]';
        statusTextColor = '!text-[#FC4438]';
        break;
      case '5':
        statusText = 'กำลังจัดส่ง';
        statusColor = 'bg-customLghtInfo';
        statusTextColor = '!text-[#16C7F9]';
        break;
      case '6':
        statusText = 'จัดส่งสำเร็จ';
        statusColor = 'bg-customLghtSuccess';
        statusTextColor = '!text-[#54BA4A]';
        break;
      case '7':
        statusText = 'ยกเลิกออเดอร์';
        statusColor = 'bg-customLghtDanger';
        statusTextColor = '!text-[#FC4438]';
        break;
    }
    return { statusText, statusColor, statusTextColor };
  };

  const filteredOrders = orders.filter(order =>
    order.oNo.toLowerCase().includes(searchOrderNo.toLowerCase())
  );


  const renderOrder = (order: Order) => {
    const isOpen = openOrders.has(order.oNo);
    const { statusText, statusColor, statusTextColor } = ConvertStatusText(order.oStatus);
    return (
      <div key={order.oNo} id={`order-${order.oNo}`} className="border rounded-lg overflow-hidden ">
        <div className="flex justify-between items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div className="flex flex-col gap-y-2">
            <p className="text-lg font-semibold">เลขที่สั่งซื้อ: {order.oNo}</p>
            <div className="flex items-center gap-x-2">
              <Label className={`sm:text-sm font-semibold p-1 px-3 ${statusColor} ${statusTextColor} rounded-lg`}>{statusText}</Label>
            </div>
            <p className="sm:text-sm text-gray-500">วันที่: {order.oDate}</p>
            <p className="sm:text-sm text-gray-500">จำนวน {order.oItemCount} รายการ</p>
            <div className="flex-col sm:flex-row gap-x-2 ">
              {order.oTotalDiscount > 0 ? (
                <>
                  <p className="sm:text-sm text-gray-600 font-semibold">ยอดรวม: {(order.oTotalPrice - order.oTotalDiscount).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</p>
                  <p className="sm:text-sm text-gray-400 font-semibold line-through">{order.oTotalPrice.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</p>
                </>
              ) : (
                <p className="sm:text-sm text-gray-600 font-semibold">ยอดรวม: {order.oTotalPrice.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</p>
              )}
            </div>
            {['1'].includes(order.oStatus) && (
              <button className="flex gap-x-2 items-center text-sm bg-red-500 text-white font-medium px-3 py-1 rounded-lg hover:bg-red-600 transition-colors w-[80%] sm:w-[60%]"
                onClick={() => {
                  setSelectedOrderNo([order.oNo]);
                  setSelectedOrderTotalPrice(order.oTotalPrice);
                  setQRPopupOpen(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square mb-1" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg>
                แก้ไขสลิป
              </button>
            )}
          </div>
          <div className="flex flex-col justify-between gap-y-[12rem] md:gap-y-[8rem]">
            <ButtonSecondary
              sizeClass="flex items-center gap-x-2 py-2 px-4 rounded-xl"
              fontSize="text-sm font-medium"
              onClick={() => toggleOrderDetails(order.oNo)}>
              {isOpen ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}

            </ButtonSecondary>
            {['1', '2', '4'].includes(order.oStatus) && (
              <button
                className="flex items-center gap-x-2 w-[10rem] text-sm text-slate-700 font-medium bg-white hover:bg-customRed transition-colors hover:text-white border border-slate-300 p-2 px-4 rounded-xl"
                type="button"
                onClick={() => cancelOrder(order.oNo)}
              >
                ยกเลิกออเดอร์
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {isOpen && (
          <div>
            <div className="p-4 border-t">
              {order.items.map(renderProductItem)}
            </div>
            <button
              onClick={() => toggleOrderDetails(order.oNo)}
              type="button"
              className="flex items-center justify-center w-full p-4 bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-white h-2 text-sm font-medium "
            >
              ซ่อนรายละเอียด
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProductItem = (item: ProductItem) => {
    return (
      <div key={item.oipID} className="flex py-4 sm:py-7 last:pb-0 first:pt-0 first:border-t-0 border-t border-slate-200 dark:border-slate-700">
        <div className="h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={item.image}
            alt={item.oiTitle}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="">
                <h3 className="text-sm font-medium line-clamp-1 md:max-w-[30rem] lg:max-w-full">{item.oiTitle}</h3>
                <div className="flex justify-between">

                  <Prices className="mt-2 flex sm:hidden" price={item.oiQuantity * item.oiPrice} />
                  {item.oiCoolingCondition == 2 && (
                    <span className="text-sm font-medium inline-block mt-2 p-1 px-3 bg-green-500 text-white rounded-lg">แช่เย็น</span>
                  )}

                </div>
              </div>
              <Prices className="h-7 mt-0.5 ml-2 hidden sm:flex" price={item.oiQuantity * item.oiPrice} />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">จำนวน</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">{item.oiQuantity}</span>
            </p>
            <div className="flex">
              <Link to={`/p/${item.slug}/${item.oipID}`}
                type="button"
                className="font-medium text-indigo-600 dark:text-primary-500"
              >
                ไปที่รายการสินค้า
              </Link>
            </div>
          </div>
        </div>
      </div>

    );
  };

  return (
    <div className={`nc-AccountShopPage ${className}`}>
      <CommonLayout>
        <div className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold">{headerText}</h2>
            <input
              type="text"
              placeholder="ค้นหาเลขออเดอร์"
              value={searchOrderNo}
              onChange={(e) => setSearchOrderNo(e.target.value)}
              className="h-9 px-3 py-2 mr-auto sm:mr-0 border border-gray-300 dark:bg-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {loading &&
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="animate-pulse space-y-5">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          }
          {error && <p className="text-red-500">{error}</p>}
          {!loading && orders.length === 0 && <p>ไม่มีรายการสั่งซื้อ</p>}
          {filteredOrders.map(renderOrder)}
        </div>
      </CommonLayout>
      <QRPopup
        isOpen={isQRPopupOpen}
        onClose={() => setQRPopupOpen(false)}
        handleCheckout={() => handleUpdateSlip(selectedOrderNo[0] || null)}
        cartIDs={selectedOrderNo || undefined}
        totalPrice={selectedOrderTotalPrice}
        fileName={fileName}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleClearFile={handleClearFile}
        action="edit"
      />
    </div>

  );
};

export default AccountShopPage;