import AlertService from 'components/AlertServicce';
import { useCartContext } from 'containers/CartContext';
import { useLoginPopup } from 'containers/LoginPopupContext';
import { useOptions } from 'containers/OptionsContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import Input from 'shared/Input/Input';
import { checkAuthNow } from 'utils/checkAuthNow';

interface PopupAddProps {
    togglePopup: () => void;
    isOpen: boolean;
}
interface Errors {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    phoneNumber2?: string;
    addressNo?: string;
    addressVillage?: string;
    addressSubDistrict?: string;
    addressDistrict?: string;
    addressProvince?: string;
    addressZIPCode?: string;
}

const PopupAdd: React.FC<PopupAddProps> = ({ togglePopup, isOpen }) => {
    const [isVisible, setIsVisible] = useState(false);
    const userID = Cookies.get("ponchaishop_userID") || "";
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const { addressCount, setAddressCount } = useCartContext();

    const [selectedOption, setSelectedOption] = useState("addressOther");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumber2, setPhoneNumber2] = useState("");
    const [addressNo, setAddressNo] = useState("");
    const [addressVillage, setAddressVillage] = useState("");
    const [addressSubDistrict, setAddressSubDistrict] = useState("ตำบลบางพลีใหญ่");
    const [addressDistrict, setAddressDistrict] = useState("บางพลี");
    const [addressProvince, setAddressProvince] = useState("สมุทปราการ");
    const [addressZIPCode, setAddressZIPCode] = useState("10540");
    const [addressNote, setAddressNote] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const { showLoginPopup, setShowLoginPopup } = useLoginPopup();



    const handleValidation = () => {
        const newErrors: Errors = {};  // Use the Errors interface here
        if (!firstName.trim()) {
            newErrors.firstName = "กรุณากรอกชื่อจริง";
        }
        if (!lastName.trim()) {
            newErrors.lastName = "กรุณากรอกนามสกุล";
        }
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
        }
        if (!addressNo.trim()) {
            newErrors.addressNo = "กรุณากรอกบ้านเลขที่";
        }
        if (!addressVillage.trim()) {
            newErrors.addressVillage = "กรุณากรอกตึก/อาคาร/หมู่บ้าน";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (handleValidation()) {
            const formData = new FormData();
            formData.append("customerID", userID);
            formData.append("addressName", firstName.trim());
            formData.append("addressLastname", lastName.trim());
            formData.append("phoneNumber", phoneNumber.toString().trim());
            formData.append("phoneNumber2", phoneNumber2 ? phoneNumber2.toString().trim() : "");
            formData.append("addressNo", (addressNo || "").trim());
            formData.append("addressVillage", (addressVillage || "").trim());
            formData.append("addressSubDistrict", (addressSubDistrict || "").trim());
            formData.append("addressDistrict", (addressDistrict || "").trim());
            formData.append("addressProvince", (addressProvince || "").trim());
            formData.append("addressZIPCode", (addressZIPCode || "").trim());
            formData.append("addressNote", (addressNote || "").trim());

            try {
                if (!basePath) return;
                const isAuthenticated = await checkAuthNow(basePath);
                if (!isAuthenticated) {
                    setShowLoginPopup(true);
                    return;
                }
                // ส่งข้อมูลที่อยู่ไปยัง API เพื่ออัพเดท
                const response = await fetch(`${basePath}api/address/frontend/addAddress.php`, {
                    method: "POST",
                    body: formData,
                });
                const text = await response.text();
                const result = JSON.parse(text);
                if (result.status !== 200) {
                    throw new Error(result.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่");
                }
                const newAddressID = result.addressID;
                // ถ้าเลือกเป็นที่อยู่หลัก อัพเดทที่อยู่หลักต่อ
                if (selectedOption === "mainAddress") {
                    const updateAddress = await fetch(`${basePath}api/address/frontend/updateMainAddress.php`, {
                        method: "POST",
                        body: new URLSearchParams({ userID: userID, addressID: newAddressID, selectOption: selectedOption }),
                    });
                    const updateText = await updateAddress.text();
                    const updateResult = JSON.parse(updateText);
                    if (updateResult.status !== 200) {
                        throw new Error(updateResult.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่หลัก");
                    }
                }
                setAddressCount(addressCount + 1);
                if (selectedOption === "mainAddress") {
                    AlertService.showSuccess("บันทึกข้อมูลสำเร็จ", "ที่อยู่ของคุณได้รับการบันทึกและเป็นที่อยู่หลักแล้ว");
                } else {
                    AlertService.showSuccess("บันทึกข้อมูลสำเร็จ", "ที่อยู่ของคุณได้รับการบันทึกแล้ว");
                }
            } catch (error) {
                AlertService.showError("เกิดข้อผิดพลาด", (error as Error).message);
            } finally {
                togglePopup();
            }
        }
    };

    const addressoption = [
        {
            value: 'mainAddress',
            label: 'ที่อยู่หลัก',
            description: 'เลือกที่อยู่นี้อัตโนมัติ',
        },
        {
            value: 'addressOther',
            label: 'ที่อยู่อื่นๆ',
            description: 'เพิ่มตัวเลือกที่อยู่นี้',
        }
    ]

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 30);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    return (

        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80 pt-[34rem] sm:pt-0 overflow-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-slate-50 dark:bg-slate-800 custom-pt md:h-full md:max-h-[62rem] lg:max-h-[50rem] overflow-y-scroll custom-scrollbar xxs:mt-[21rem] xs:mt-52 mt-10 sm:mt-0 px-6 py-7 border border-t-4 border-t-red-500 space-y-4 sm:space-y-6 rounded-lg w-[85%] sm:w-full md:w-full max-w-[56rem] shadow-lg transform transition-all duration-500 ease-out ${isVisible ? ' opacity-100' : 'opacity-0'}`}>
                <div className='flex items-center justify-between md:pt-2'>
                    <div className='flex items-center'>
                        <i className="text-2xl mr-2 font-bold las la-home"></i>
                        <h2 className='text-xl font-medium'>เพิ่มที่อยู่ใหม่</h2>
                    </div>
                    <button onClick={togglePopup}>
                        <i className="text-3xl las la-times-circle"></i>
                    </button>
                </div>

                {/* Remaining content unchanged */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            ชื่อจริง <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-user"></i>
                            </span>
                            <Input className="!rounded-l-none" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        {errors.firstName ? (
                            <p className="mt-1 text-red-500 text-xs">{errors.firstName}</p>
                        ) : (
                            <div className=""></div>
                        )}

                    </div>
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            นามสกุล <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-user"></i>
                            </span>
                            <Input className="!rounded-l-none" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        {errors.lastName ? (
                            <p className="mt-1 text-red-500 text-xs">{errors.lastName}</p>
                        ) : (
                            <div className=""></div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            เบอร์โทรศัพท์ <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex ">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-phone"></i>
                            </span>
                            <Input className="!rounded-l-none" value={phoneNumber}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,10}$/.test(value)) {  // ตรวจสอบให้เป็นตัวเลขและไม่เกิน 10 ตัว
                                        setPhoneNumber(value);
                                    }
                                }}
                                inputMode="numeric"  // แสดงแป้นพิมพ์ตัวเลข
                                maxLength={10}  // จำกัดความยาวที่ 10 ตัวอักษร
                            />
                        </div>
                        {errors.phoneNumber ? (
                            <p className="mt-1 text-red-500 text-xs">{errors.phoneNumber}</p>
                        ) : (
                            <div className=""></div>
                        )}
                    </div>
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            เบอร์โทรศัพท์ สำรอง
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-phone"></i>
                            </span>
                            <Input className="!rounded-l-none" value={phoneNumber2}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,10}$/.test(value)) {  // ตรวจสอบให้เป็นตัวเลขและไม่เกิน 10 ตัว
                                        setPhoneNumber2(value);
                                    }
                                }}
                                inputMode="numeric"  // แสดงแป้นพิมพ์ตัวเลข
                                maxLength={10}  // จำกัดความยาวที่ 10 ตัวอักษร
                            />
                        </div>
                    </div>
                </div>

                <div className="sm:flex justify-between space-y-4 sm:space-y-0 sm:space-x-3">
                    <div className="sm:w-1/3">
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            บ้านเลขที่ <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-map-marked-alt"></i>
                            </span>
                            <Input className="!rounded-l-none" value={addressNo} onChange={(e) => setAddressNo(e.target.value)} />
                        </div>
                        {errors.addressNo ? (
                            <p className="mt-1 text-red-500 text-xs">{errors.addressNo}</p>
                        ) : (
                            <div className=""></div>
                        )}

                    </div>
                    <div className="sm:w-3/5">
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            ตึก/อาคาร/หมู่บ้าน <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-building"></i>
                            </span>
                            <Input className="!rounded-l-none" value={addressVillage} onChange={(e) => setAddressVillage(e.target.value)} />
                        </div>
                        {errors.addressVillage ? (
                            <p className="mt-1 text-red-500 text-xs">{errors.addressVillage}</p>
                        ) : (
                            <div className=""></div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            ตำบล
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-hotel"></i>
                            </span>
                            <select
                                className="h-11 px-4 py-3 text-sm font-normal block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800"
                                defaultValue={addressSubDistrict} onChange={(e) => setAddressSubDistrict(e.target.value)}
                            >
                                <option value="ตำบลบางพลีใหญ่">ตำบลบางพลีใหญ่</option>
                                <option value="ตำบลบางแก้ว">ตำบลบางแก้ว</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            อำเภอ
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-hotel"></i>
                            </span>
                            <Input className="!rounded-l-none" value={"บางพลี"} disabled />
                        </div>
                    </div>

                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            จังหวัด
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-city"></i>
                            </span>
                            <Input className="!rounded-l-none" value={"สมุทปราการ"} disabled />
                        </div>
                    </div>
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            รหัสไปรษณีย์
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-map-signs"></i>
                            </span>
                            <Input className="!rounded-l-none" value={10540} disabled />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            โน๊ตเพิ่มเติม
                        </label>
                        <div className="mt-1.5 flex">
                            <textarea value={addressNote} onChange={(e) => setAddressNote(e.target.value)} className="rounded-2xl w-full h-24 text-sm bg-white border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 p-2.5 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                        ตั้งค่าที่อยู่นี้
                    </label>
                    <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {addressoption.map((option) => (
                            <div key={option.value} className="flex items-center text-sm sm:text-base">
                                <input
                                    id={`Address-type-${option.value}`}
                                    name="Address-type"
                                    type="radio"
                                    className="text-primary-500 rounded-full border-slate-400 dark:border-slate-700 w-6 h-6 focus:ring-0 focus:ring-offset-0"
                                    value={`Address-type-${option.value}`}
                                    defaultChecked={option.value === 'addressOther'} // เลือกที่อยู่อื่นๆ เริ่มต้น
                                    onChange={() => setSelectedOption(option.value)}
                                />
                                <label
                                    htmlFor={`Address-type-${option.value}`}
                                    className="pl-2.5 sm:pl-3 block text-slate-900 dark:text-slate-100"
                                >
                                    {option.label} <span className="font-light">({option.description})</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row pt-6 gap-4">
                    <button onClick={togglePopup} className="nc-Button mt-3 sm:mt-0 sm:ml-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-full py-3 px-6 hover:bg-gray-100">
                        ยกเลิก
                    </button>
                    <button onClick={handleSubmit} className="nc-Button bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-800 rounded-full py-3 px-6 hover:bg-slate-800">
                        <i className="las la-plus-circle mr-2 mb-1"></i>
                        เพิ่มที่อยู่
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupAdd;
