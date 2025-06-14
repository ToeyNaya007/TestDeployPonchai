import { NoSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "components/NcInputNumber";
import Prices from "components/Prices";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useEffect, useRef, useState } from "react";
import { useOptions } from "containers/OptionsContext";
import AlertService from "components/AlertServicce";
import PaymentMethod from "./PaymentMethod";
import DeliveryOption from "./DeliveryOption";
import { useCartContext } from "containers/CartContext";
import PopupAdd from "containers/AccountPage/PopupAdd";
import QRPopup from "./QRPopup";
import DeliveryTimeOptions from "./DeliveryTimeOptions";
import ShopPopup from "components/ShopPopup";
import Cookies, { set } from "js-cookie";
import toast from "react-hot-toast";
import { checkAuthNow } from "utils/checkAuthNow";
import { useLoginPopup } from "containers/LoginPopupContext";

export interface Product {
  ID: number;
  pID: number;
  customerID: string;
  quantity: number;
  coolingCondition: number;
  price: number;
  image: string;
  title: string;
  oldPrice: number;
  discountPercent: string;
  discountStatus: number;
}

interface Payload {
  customerID: string;
  shippingType: number;
  shippingAddressID: string;
  cartIDs: string[];
  paymentMethod: number | undefined;
  getTimeOrderType: number;
  shippingSpecifyTime: string | null;
  [key: string]: any; // เพิ่ม index signature
}

interface RecommendItem {
  type: string;
  proID: number;
  proName: string;
  currentQty: number;
  missingQty: number;
  minQty: number;
}
interface PromotionItemMixMatch {
  type: "mix_match";
  proID: number;
  proName: string;
  setCount: number;
  setPrice: string;
  discount: number;
  items: {
    pID: number;
    quantity: string;
    priceEach: number;
    discount: number;
  }[];
}

interface PromotionItemIndividual {
  type: "individual_discount";
  proID: number;
  proName: string;
  quantity: string;
  priceEach: number;
  discount: number;
}

interface PromotionItemSum {
  type: "sum";
  proID: number;
  proName: string;
  discount: number;
}
type PromotionItem = PromotionItemMixMatch | PromotionItemIndividual | PromotionItemSum;

const paymentMethods = [
  {
    value: 1,
    label: 'เงินสด',
    description: 'ชำระเงินปลายทาง/ต้นทาง',
  },
  {
    value: 2,
    label: 'QR Promptpay',
    description: 'โอนผ่านธนาคาร',
  }
];

const CartPage = () => {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const { cartCount, setCartCount } = useCartContext();
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [totalPrices, setTotalPrices] = useState<Record<number, number>>({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [Total, setTotal] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [selectedAddressID, setSelectedAddressID] = useState<string>("");
  const [deliveryOptionId, setDeliveryOptionId] = useState<number>(1);
  const [cartIDs, setCartIDs] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<number>();
  const [deliveryDatetime, setDeliveryDateTime] = useState<Date | null>(null);
  const [timeOrder, setTimeOrder] = useState<number>(1);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isOpenQR, setIsOpenQR] = useState(false);
  const [count, setCount] = useState(0);
  const { showLoginPopup, setShowLoginPopup } = useLoginPopup();

  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpenTime, setIsOpenTime] = useState(true);
  const [countdownText, setCountdownText] = useState<string>("");
  const [recommend, setRecommend] = useState<RecommendItem[]>([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [showPromotionTitle, setShowPromotionTitle] = useState(false);

  const [promotions, setPromotions] = useState<PromotionItem[]>([]);



  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight; // ความสูงของเอกสาร
      const windowHeight = window.innerHeight; // ความสูงของ viewport
      const scrollPosition = window.scrollY; // ตำแหน่งการเลื่อนปัจจุบัน

      // ถ้าเลื่อนลงมาเกิน 80% ของความสูงทั้งหมด ให้ซ่อน div
      if (scrollPosition > (scrollHeight - windowHeight) * 0.3) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (basePath) {
      setLoading(true);
      const fetchCartItems = async () => {
        try {
          if (!basePath) return;
          const isAuthenticated = await checkAuthNow(basePath);
          if (!isAuthenticated) {
            setShowLoginPopup(true);
            return;
          }
          const formData = new URLSearchParams();
          formData.append('customerID', userID);

          const response = await fetch(`${basePath}api/cart/frontend/getCartByID.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // เปลี่ยน Content-Type
            },
            body: formData.toString(), // ส่งข้อมูลในรูปแบบ x-www-form-urlencoded
          });
          const result = await response.json();
          if (result.status === 200) {
            setCartItems(result.results.product);

            const initialQuantities: Record<number, number> = {};
            const initialTotalPrices: Record<number, number> = {};
            const initialSelectedItems: Record<number, boolean> = {};

            result.results.product.forEach((item: Product) => {
              initialQuantities[item.ID] = item.quantity;
              initialTotalPrices[item.ID] = item.quantity * item.price;
              initialSelectedItems[item.ID] = true;
              setCartIDs((prevIDs) => [...prevIDs, item.ID]);
            });

            setQuantities(initialQuantities);
            setTotalPrices(initialTotalPrices);
            setSelectedItems(initialSelectedItems);
            setGrandTotal(Object.entries(initialSelectedItems).reduce((total, [id, isSelected]) => {
              return isSelected ? total + initialTotalPrices[parseInt(id)] : total;
            }, 0));
          } else {
            console.error(result.error);
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false)
        }
      };

      fetchCartItems();
    }
  }, [userID, basePath]);

  useEffect(() => {
    if (basePath) {
      calcalatePromotion();
    }
  }, [basePath, selectedItems]);

  const calcalatePromotion = () => {
    setTotalDiscount(0);
    setTotal(0);
    const cIDs = Object.keys(selectedItems).filter((ID) => selectedItems[parseInt(ID)]);
    if (cartIDs.length === 0) return;
    const formData = new FormData();
    cIDs.forEach((id) => {
      formData.append("cIDs[]", id);
    });

    fetch(`${basePath}api/cart/frontend/calAllDiscounts.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setShowPromotionTitle(false);
          setTotalDiscount(data.results.priceDiscountAll);
          setPromotions(data.results.promotions || []);
          setRecommend(data.results.recommend || []);
          setTotal(data.results.priceAll);
          setGrandTotal(data.results.priceAll - data.results.priceDiscountAll)
          if (data.results.recommend.length > 0 || data.results.promotions.length > 0) {
            setShowPromotionTitle(true);
          }
        } else if (data.status === 401) {
          setShowPromotionTitle(false);
        } else {
          console.error("Error calculating promotion:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching promotion:", error);
      });
  };


  const handlePopupStatusChange = (status: boolean) => {
    setIsOpenTime(status);
  };

  const handleQuantityChange = async (id: number, pid: number, newQuantity: number, price: number) => {
    setIsUpdating(true);
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));

    const newItemTotal = newQuantity * price;
    const oldItemTotal = totalPrices[id] || 0;

    setTotalPrices((prev) => ({ ...prev, [id]: newItemTotal }));

    if (selectedItems[id]) {
      setGrandTotal((prev) => prev + (newItemTotal - oldItemTotal));
    }

    try {
      if (!basePath) return;
      const isAuthenticated = await checkAuthNow(basePath);
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      const response = await fetch(`${basePath}/api/cart/frontend/updateQuantityCart.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerID: userID,
          pID: pid,
          quantity: newQuantity,
        }),
      });

      const result = await response.json();
      if (result.status !== 200) {
        console.error("Error updating quantity:", result.error);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      calcalatePromotion();
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = (ID: number, pid: number, totalPrice: number) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ใช่, ลบเลย!",
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          if (!basePath) return;
          const isAuthenticated = await checkAuthNow(basePath);
          if (!isAuthenticated) {
            setShowLoginPopup(true);
            return;
          }
          const response = await fetch(`${basePath}/api/cart/frontend/deleteCart.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerID: userID,
              pID: pid,
            }),
          });

          const data = await response.json();
          if (data.status === 200) {
            setCartCount(cartCount + 1);
            setCartItems((prevItems) => prevItems.filter((item) => item.ID !== ID));
            // Update grand total when removing item
            if (selectedItems[ID]) {
              setGrandTotal((prev) => prev - totalPrice);
            }
            // Remove item from selectedItems
            const newSelectedItems = { ...selectedItems };
            delete newSelectedItems[ID];
            setSelectedItems(newSelectedItems);

            setCartCount(cartCount - 1);
            AlertService.showSuccess("สำเร็จ!", "สินค้าถูกลบออกจากตะกร้าแล้ว");
          } else {
            AlertService.showError("ล้มเหลว!", "ไม่สามารถลบสินค้าได้");
          }
        } catch (error) {
          console.error("Error removing item:", error);
          AlertService.showError("ล้มเหลว!", "เกิดข้อผิดพลาดขณะลบสินค้า");
        }
      }
    });
  };


  const validateCheckout = () => {
    const selectedProductIDs = Object.keys(selectedItems).filter((ID) => selectedItems[parseInt(ID)]);
    if (selectedProductIDs.length === 0) {
      AlertService.showError("เกิดข้อผิดพลาด!", "กรุณาเลือกสินค้าก่อนชำระเงิน");
      return false;
    }

    if (paymentMethod === undefined) {
      AlertService.showError("เกิดข้อผิดพลาด!", "กรุณาเลือกช่องทางการชำระเงิน");
      return false;
    }

    if (deliveryOptionId === 2 && !selectedAddressID) {
      AlertService.showError("เกิดข้อผิดพลาด!", "กรุณาเลือกที่อยู่จัดส่ง");
      return false;
    }

    return true;
  };

  const preparePayload = (): Payload => {
    const formattedDate = deliveryDatetime ? `${deliveryDatetime.getFullYear()}-${String(deliveryDatetime.getMonth() + 1).padStart(2, '0')}-${String(deliveryDatetime.getDate()).padStart(2, '0')} ${String(deliveryDatetime.getHours()).padStart(2, '0')}:${String(deliveryDatetime.getMinutes()).padStart(2, '0')}:${String(deliveryDatetime.getSeconds()).padStart(2, '0')}` : null;
    return {
      customerID: userID,
      shippingType: deliveryOptionId,
      shippingAddressID: selectedAddressID,
      cartIDs: Object.keys(selectedItems).filter((ID) => selectedItems[parseInt(ID)]),
      paymentMethod: paymentMethod,
      getTimeOrderType: timeOrder,
      shippingSpecifyTime: formattedDate,
      file: fileName,
    };
  };

  const handleCheckout = () => {
    const payload = preparePayload();

    const formData = new FormData(); // ใช้ FormData แทน URLSearchParams

    for (const key in payload) {
      if (key === "cartIDs" && Array.isArray(payload[key])) {
        formData.append(key, JSON.stringify(payload[key])); // ถ้าเป็น array ให้แปลงเป็น JSON string
      } else if (key === "file") {
        if (fileInputRef.current?.files?.[0]) {
          formData.append(key, fileInputRef.current.files[0]); // เพิ่มไฟล์เข้า FormData
        }
      } else {
        formData.append(key, payload[key] as string); // แปลงค่าเป็น string ก่อนเพิ่ม
      }
    }

    fetch(`${basePath}/api/cart/frontend/checkout.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((responseText) => {
        try {
          const data = JSON.parse(responseText);
          if (data.status === 201) {
            if (isOpenQR) {
              setIsOpenQR(false);
            }
            AlertService.showSuccess("สำเร็จ!", "เพิ่มออเดอร์สำเร็จ", 3000, true, true);
          } else {
            AlertService.showError("ล้มเหลว!", "เกิดข้อผิดพลาดในการชำระเงิน");
          }
        } catch (err) {
          console.error("Invalid JSON response:", responseText);
          AlertService.showError("ล้มเหลว!", "เกิดข้อผิดพลาดในการชำระเงิน");
        }
      })
      .catch((error) => {
        console.error("Error while sending data:", error);
        AlertService.showError("ล้มเหลว!", "เกิดข้อผิดพลาดในการชำระเงิน");
      });
  };


  const handleCheckForm = async () => {
    if (!validateCheckout()) return;
    if (!basePath) return;
    const isAuthenticated = await checkAuthNow(basePath);
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    switch (paymentMethod) {
      case 1:
        handleCheckout();
        break;
      case 2:
        setIsOpenQR(true);
        break;
      default:
        AlertService.showError("ล้มเหลว", "กรุณาเลือกช่องทางการชำระเงิน");
        break;
    }
  };

  const handleCheckboxChange = (ID: number) => {
    setSelectedItems((prev) => {
      const newSelectedItems = {
        ...prev,
        [ID]: !prev[ID],
      };

      const newTotal = cartItems.reduce((total, item) => {
        if (newSelectedItems[item.ID]) {
          return total + (totalPrices[item.ID] || 0);
        }
        return total;
      }, 0);

      setGrandTotal(newTotal);
      return newSelectedItems;
    });
  };

  const handleSelectAll = () => {
    if (cartItems.length > 0) {
      const allSelected = Object.values(selectedItems).every((isSelected) => isSelected);

      const newSelection: Record<number, boolean> = {};
      cartItems.forEach(item => {
        newSelection[item.ID] = !allSelected;
      });

      setSelectedItems(newSelection);

      const newTotal = !allSelected ? cartItems.reduce((total, item) => {
        return total + (totalPrices[item.ID] || 0);
      }, 0) : 0;

      setGrandTotal(newTotal);
    }
  };

  const handleAddressSelect = (addressID: string) => {
    setSelectedAddressID(addressID);
  };

  const handleDeliveryOptionChange = (id: number) => {
    setDeliveryOptionId(id); // อัปเดต id ที่เลือก
  };

  const handleDeliveryDateTimeChange = (date: Date | null) => {
    setDeliveryDateTime(date);
  };

  const handleOptionSelect = (id: number) => {
    setTimeOrder(id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name); // เก็บชื่อไฟล์ที่เลือกไว้ในตัวแปร
    }
  };

  const handleClearFile = () => {
    setFileName(""); // รีเซ็ตชื่อไฟล์
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // เคลียร์การเลือกไฟล์จาก input
    }
  };

  const renderPopup = () => {
    return (
      <PopupAdd togglePopup={togglePopup} isOpen={isPopupOpen} />
    );
  };
  const renderPopupQR = () => {
    return (
      <QRPopup
        cartIDs={Object.keys(selectedItems).filter((ID) => selectedItems[parseInt(ID)])}
        handleClearFile={handleClearFile}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        fileName={fileName}
        handleCheckout={handleCheckout}
        isOpen={isOpenQR}
        onClose={togglePopupQR}
        totalPrice={parseFloat((grandTotal + deliveryFee).toFixed(2))}
        action="save"
      />
    );
  };
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const togglePopupQR = () => {
    setIsOpenQR(!isOpenQR);
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    toast.success("ยืนยันเรียบร้อยแล้ว!", {
      duration: 3000,
      position: "top-right",
    });
    setShowConfirm(false);
  };



  const skeltonRender = () => {
    return (
      <div className="relative mt-5 flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0">
        {/* Checkbox */}
        <div className="flex items-start mr-4">
          <div className="h-5 w-5 bg-slate-300 rounded animate-pulse"></div>
        </div>

        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <div className="h-full w-full bg-slate-300 animate-pulse"></div>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div className="flex-[1.5]">
                <div className="h-4 bg-slate-300 w-36 mb-2 animate-pulse"></div>
                <div className="h-3 bg-slate-300 w-20 mb-2 animate-pulse"></div>

                {/* mobile quantity change */}
                <div className="block sm:hidden text-center relative text-sm mt-2">
                  <div className="h-8 w-20 bg-slate-300 animate-pulse"></div>
                </div>

                <div className="flex items-center mt-2">
                  <div className="h-4 w-10 bg-green-500 animate-pulse"></div>
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
                <div className="h-8 w-20 bg-slate-300 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="hidden flex-1 lg:flex justify-end">
            <div className="h-4 bg-slate-300 w-24 animate-pulse"></div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-xs md:text-sm">
            <div className="hidden sm:block">
              <div className="h-3 bg-slate-300 w-20 animate-pulse"></div>
            </div>
            <div className="flex flex-1 sm:hidden">
              <div className="h-4 bg-slate-300 w-24 animate-pulse"></div>
            </div>
            <button className="h-8 w-32 bg-slate-300 animate-pulse rounded-lg"></button>
          </div>
        </div>
      </div>

    );
  };

  const renderProduct = (item: Product) => {
    const { ID, pID, image, price, title, coolingCondition, oldPrice, discountStatus, discountPercent } = item;
    const quantity = quantities[ID] || 0;
    const totalPrice = totalPrices[ID] || 0;

    return (
      <div
        key={ID}
        className="relative flex py-8 sm:py-10 first:pt-0 last:pb-0"
      >
        {/* Checkbox */}
        <div className="flex items-start mr-4">
          <input
            type="checkbox"
            className="h-5 w-5 text-slate-900 dark:text-slate-800 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 dark:bg-black"
            checked={selectedItems[ID] || false}
            onChange={() => handleCheckboxChange(ID)}
          />
        </div>
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain object-center"
          />
          <Link to={`/p/${title}/${pID}`} className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div className="flex-[1.5]">
                <h4 className="text-sm font-semibold pr-2 hover:underline w-[14rem] sm:w-[18rem] truncate">
                  <Link to={`/p/${title}/${pID}`}>{title}</Link>
                </h4>
                <div className="flex ">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    รหัสสินค้า: {pID}
                  </p>
                  {discountStatus === 1 && (
                    <div className="nc-shadow-lg rounded-full flex items-center justify-center relative ml-2 sm:ml-3 px-2 py-1 text-xs bg-customRed text-slate-50 ">
                      {/* Discount Icon */}
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.9889 14.6604L2.46891 13.1404C1.84891 12.5204 1.84891 11.5004 2.46891 10.8804L3.9889 9.36039C4.2489 9.10039 4.4589 8.59038 4.4589 8.23038V6.08036C4.4589 5.20036 5.1789 4.48038 6.0589 4.48038H8.2089C8.5689 4.48038 9.0789 4.27041 9.3389 4.01041L10.8589 2.49039C11.4789 1.87039 12.4989 1.87039 13.1189 2.49039L14.6389 4.01041C14.8989 4.27041 15.4089 4.48038 15.7689 4.48038H17.9189C18.7989 4.48038 19.5189 5.20036 19.5189 6.08036V8.23038C19.5189 8.59038 19.7289 9.10039 19.9889 9.36039L21.5089 10.8804C22.1289 11.5004 22.1289 12.5204 21.5089 13.1404L19.9889 14.6604C19.7289 14.9204 19.5189 15.4304 19.5189 15.7904V17.9403C19.5189 18.8203 18.7989 19.5404 17.9189 19.5404H15.7689C15.4089 19.5404 14.8989 19.7504 14.6389 20.0104L13.1189 21.5304C12.4989 22.1504 11.4789 22.1504 10.8589 21.5304L9.3389 20.0104C9.0789 19.7504 8.5689 19.5404 8.2089 19.5404H6.0589C5.1789 19.5404 4.4589 18.8203 4.4589 17.9403V15.7904C4.4589 15.4204 4.2489 14.9104 3.9889 14.6604Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M9 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M14.4945 14.5H14.5035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M9.49451 9.5H9.50349" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <span className="ml-1 leading-none ">ลด {discountPercent}%</span>
                    </div>
                  )}
                </div>


                {/* mobile quantity change */}
                <div className="block sm:hidden text-center relative text-sm mt-2">
                  <NcInputNumber
                    className="relative"
                    defaultValue={quantity}
                    min={1}
                    max={99}
                    onChange={(value) => handleQuantityChange(ID, pID, value, price)}
                  />
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
                <NcInputNumber
                  className="relative"
                  defaultValue={quantity}
                  min={1}
                  max={99}
                  onChange={(value) => handleQuantityChange(ID, pID, value, price)}
                />
              </div>
            </div>
          </div>
          <div className="flex">
            {coolingCondition == 2 && (
              <div className="flex items-center mt-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium ml-1 p-1 px-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg">แช่เย็น</span>
              </div>
            )}
            <div className="hidden flex-1 md:flex justify-end">
              <Prices price={totalPrice} className="mt-0.5" />
            </div>

          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-xs md:text-sm">
            <div className="hidden sm:flex">
              <p className="text-sm text-slate-950 dark:text-slate-400 mt-3">
                ราคาต่อชิ้น: {price} บาท
              </p>
              {discountStatus === 1 && (
                <span className="text-gray-400 line-through decoration-1 mt-3 ml-3">{oldPrice} บาท</span>
              )}
            </div>
            <div className="flex flex-1 sm:hidden">
              <Prices price={totalPrice} className="mt-0.5" />
            </div>
            <button
              onClick={() => handleRemoveItem(ID, pID, totalPrice)}
              className="relative flex items-center gap-1 mr-2 sm:mr-0 mt-3 font-medium text-red-500 text-xs p-2 rounded-lg border border-red-500 hover:bg-red-500 hover:text-white transition-colors 
              duration-300 shadow-sm "
            >
              <i className="las la-trash-alt text-base"></i>
              <span className="hidden md:inline">ลบออกจากตะกร้า</span>
            </button>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CartPage pt-3">
      <Helmet>
        <title>ตะกร้าสินค้า || Ponchaishop</title>
      </Helmet>
      <main className="container py-4 lg:pb-28 lg:pt-4 ">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            ตะกร้าสินค้า
          </h2>
        </div>
        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
            {showPromotionTitle && (
              recommend.length > 0 && (
                <div className="p-2 rounded-md border-2 border-[#ffd75e] bg-[#fef8e7] shadow-sm mb-2">
                  <div className="flex items-center">
                    <div className="">
                      <h2 className="text-lg font-semibold text-yellow-700 mb-2">
                        🛒 โปรโมชันแนะนำ
                      </h2>
                      <ul className="list-disc list-inside text-sm text-yellow-800">
                        {recommend.map((item, index) => (
                          <li key={index}>
                            <strong>{item.proName}</strong><br />
                            คุณซื้อแล้ว {item.currentQty} ชิ้น ขาดอีก {item.missingQty} ชิ้น
                            เพื่อให้ครบ {item.minQty} ชิ้น จะได้โปรนี้!
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
            <div className="flex justify-between items-center">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-950 text-white text-sm rounded-lg shadow  transition-colors"
              >
                {Object.values(selectedItems).every((isSelected) => isSelected) ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
              </button>
              <h3 className="text-lg font-semibold">รายการสินค้าในตะกร้า</h3>

            </div>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div className="space-y-5 mt-5" key={index}>{skeltonRender()}</div>
              ))
            ) : (
              cartItems.length > 0 ?
                cartItems.map(renderProduct)
                : <p className="text-center items-center justify-center flex mt-3"> ไม่มีสินค้าในตะกร้า</p>
            )}
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
          <div className="flex-1 ">
            <div className="sticky top-28">
              <DeliveryOption
                setDeliveryFee={setDeliveryFee}
                togglePopup={togglePopup}
                onAddressSelect={handleAddressSelect}
                onDeliveryOptionChange={handleDeliveryOptionChange}
              />
              <DeliveryTimeOptions onOptionSelect={handleOptionSelect} onDeliveryDateTimeChange={handleDeliveryDateTimeChange} />
              <h3 className="block mt-5 text-lg font-semibold text-gray-700 dark:text-slate-300">
                ช่องทางการชำระเงิน
              </h3>
              <PaymentMethod
                paymentMethods={paymentMethods}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
              <div className="">
                <h3 className="text-lg font-semibold">สรุปการสั่งซื้อ</h3>
                <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
                  <div className="flex justify-between pb-4">
                    <span>ราคารวมของสินค้า</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {Total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
                    </span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span>ค่าจัดส่ง</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {deliveryFee.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
                    </span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span>ส่วนลด</span>
                    <span className="font-semibold text-red-600 dark:text-slate-200">
                      {totalDiscount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
                    </span>
                  </div>
                  {showPromotionTitle && promotions.length > 0 && (
                    <div className="p-2 rounded-sm border-2 border-[#ffd75e] bg-[#f8d7da] shadow-sm mb-2">
                      <div className="flex flex-col">
                        <p className="text-base font-medium text-right text-yellow-700 mb-2">
                          ส่วนลดจากโปรโมชัน
                        </p>
                        <ol className="list-decimal list-inside text-sm text-yellow-800 text-right">
                          {promotions.map((promo, index) => {
                            if (promo.type === "mix_match") {
                              return (
                                <li key={index}>
                                  <strong>{promo.proName}</strong><br />
                                  ซื้อครบ {promo.setCount} ชุด ลด {promo.discount.toLocaleString()} บาท
                                </li>
                              );
                            } else if (promo.type === "individual_discount") {
                              return (
                                <li key={index}>
                                  <strong>{promo.proName}</strong><br />
                                  ส่วนลด {promo.discount.toLocaleString()} บาท
                                </li>
                              );
                            } else if (promo.type === "sum") {
                              return (
                                <li key={index}>
                                  <strong>{promo.proName}</strong><br />
                                  ส่วนลดรวม {promo.discount.toLocaleString()} บาท
                                </li>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </ol>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                    <span>รวมยอดสั่งซื้อ</span>
                    <span>{(grandTotal + deliveryFee).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</span>
                  </div>
                </div>
                {isOpenTime ? (
                  <ButtonPrimary onClick={handleCheckForm} className="mt-8 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash mr-2" viewBox="0 0 16 16">
                      <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                      <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                    </svg>
                    ชำระเงิน
                  </ButtonPrimary>
                ) : (
                  <div>
                    <ButtonPrimary disabled className="mt-8 w-full bg-slate-400 hover:bg-slate-400">
                      ยังไม่ถึงเวลาเปิดร้าน
                    </ButtonPrimary>
                    <p className="mt-3">{countdownText}</p> {/* แสดง countdown ที่ส่งกลับมา */}
                  </div>

                )}

              </div>

              <div
                className={`block lg:hidden fixed bottom-0 left-0 w-full bg-slate-100 border-green-500 border-y-2 shadow-lg p-2 z-40 transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
              >
                <div className="text-sm text-slate-700 dark:text-slate-200 ">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-x-2 ">
                      <input
                        type="checkbox"
                        className="h-6 w-6 text-green-600 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
                        checked={Object.values(selectedItems).every((isSelected) => isSelected)}
                        onChange={handleSelectAll}
                      />
                      เลือกทั้งหมด
                    </div>
                    <div className="">
                      <p>จำนวน {Object.values(selectedItems).filter(Boolean).length} รายการ</p>
                    </div>
                  </div>
                  <p className="flex mt-3">ช่องทางชำระเงิน</p>
                  <div className="flex mb-3 gap-x-2">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.value}
                        className={`flex-1 p-2 rounded-md cursor-pointer shadow-md ${paymentMethod === method.value ? 'border-2 border-green-500 bg-white dark:bg-slate-900 ' : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800'}`}
                        onClick={() => setPaymentMethod(method.value)}
                      >
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={() => setPaymentMethod(method.value)}
                            className="form-radio h-4 w-4 text-blue-600 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className={`ml-2 font-semibold`}>{method.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-2">
                    <span>รวมยอดสั่งซื้อ</span>
                    <span>
                      {(grandTotal + deliveryFee).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
                    </span>
                  </div>
                </div>
                {isOpenTime ? (
                  <ButtonPrimary onClick={() => { handleCheckForm(); }} className="mt-3 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash mr-2" viewBox="0 0 16 16">
                      <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                      <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                    </svg>
                    ชำระเงิน
                  </ButtonPrimary>
                ) : (
                  <ButtonPrimary disabled className="mt-3 w-full bg-slate-400 hover:bg-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash mr-2" viewBox="0 0 16 16">
                      <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                      <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                    </svg>
                    ยังไม่ถึงเวลาเปิดร้าน
                  </ButtonPrimary>
                )}
              </div>

            </div>
          </div>
        </div>
        <ShopPopup isOpenTime={isOpenTime} onStatusChange={handlePopupStatusChange} onCountdownUpdate={(countdown) => setCountdownText(countdown)} />

        {renderPopup()}
        {renderPopupQR()}
      </main>
    </div>
  );
};

export default CartPage;
