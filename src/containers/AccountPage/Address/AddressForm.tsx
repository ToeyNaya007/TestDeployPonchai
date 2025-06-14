// components/AddressForm.tsx
import React, { useEffect, useState } from "react";
import Input from "shared/Input/Input";
import AddressOptions from "./AddressOptions";
import AlertService from "components/AlertServicce";
import { useCartContext } from "containers/CartContext";
import { useOptions } from "containers/OptionsContext";
import { set } from "react-datepicker/dist/date_utils";
import { reverse } from "dns";
import { text } from "stream/consumers";
import Cookies from "js-cookie";
import { useLoginPopup } from "containers/LoginPopupContext";
import { checkAuthNow } from "utils/checkAuthNow";


interface AddressFormProps {
    onToggle: () => void;
    addressID: string;
    addressName: string;
    addressLastname: string;
    phoneNumber: number;
    phoneNumber2: number;
    addressNo: string;
    addressVillage: string;
    addressSubDistrict: string;
    addressDistrict: string;
    addressProvince: string;
    addressZIPCode: string;
    addressNote: string;
    isMainAddress: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
    onToggle,
    addressID,
    isMainAddress,
    addressName,
    addressLastname,
    phoneNumber,
    phoneNumber2,
    addressNo,
    addressVillage,
    addressSubDistrict,
    addressDistrict,
    addressProvince,
    addressZIPCode,
    addressNote,
}
) => {
    const userID = Cookies.get("ponchaishop_userID") || "";
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const { addressCount, setAddressCount } = useCartContext();
    const [isUpdating, setIsUpdating] = useState(false);

    const [selectedOption, setSelectedOption] = useState(isMainAddress ? "mainAddress" : "addressOther");
    const [phoneValue, setPhoneValue] = useState(phoneNumber?.toString() || '');
    const [phone2Value, setPhone2Value] = useState(phoneNumber2?.toString() || '');
    const [addressNameValue, setNameValue] = useState(addressName || '');
    const [addressLastnameValue, setLastnameValue] = useState(addressLastname || '');
    const [addressNoValue, setAddressNoValue] = useState(addressNo || '');
    const [addressVillageValue, setAddressVillageValue] = useState(addressVillage || '');
    const [addressSubDistrictValue, setAddressSubDistrictValue] = useState(addressSubDistrict || '');
    const [addressDistrictValue, setAddressDistrictValue] = useState(addressDistrict || '');
    const [addressProvinceValue, setAddressProvinceValue] = useState(addressProvince || '');
    const [addressZIPCodeValue, setAddressZIPCodeValue] = useState(addressZIPCode || '');
    const [addressNoteValue, setAddressNoteValue] = useState(addressNote || '');
    const { showLoginPopup, setShowLoginPopup } = useLoginPopup();

    const validate = () => {
        const errors: any = {};
        if (!addressNameValue.trim()) {
            errors.addressName = "กรุณากรอกชื่อจริง";
        }
        if (!addressLastnameValue.trim()) {
            errors.addressLastname = "กรุณากรอกนามสกุล";
        }
        if (!phoneValue.trim()) {
            errors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
        }
        if (!addressNoValue.trim()) {
            errors.addressNo = "กรุณากรอกบ้านเลขที่";
        }
        if (!addressVillageValue.trim()) {
            errors.addressVillage = "กรุณากรอกตึก/อาคาร/หมู่บ้าน";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const [errors, setErrors] = useState({
        addressName: "",
        addressLastname: "",
        phoneNumber: "",
        addressNo: "",
        addressVillage: "",
    });

    useEffect(() => {
        setSelectedOption(isMainAddress ? "mainAddress" : "addressOther");
    }, [isMainAddress]);

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("addressID", addressID);
        formData.append("addressName", addressNameValue.trim());
        formData.append("addressLastname", addressLastnameValue.trim());
        formData.append("phoneNumber", phoneValue.toString().trim());
        formData.append("phoneNumber2", phone2Value ? phone2Value.toString().trim() : "");
        formData.append("addressNo", (addressNoValue || "").trim());
        formData.append("addressVillage", (addressVillageValue || "").trim());
        formData.append("addressSubDistrict", (addressSubDistrictValue || "").trim());
        formData.append("addressDistrict", (addressDistrict || "").trim());
        formData.append("addressProvince", (addressProvince || "").trim());
        formData.append("addressZIPCode", (addressZIPCode || "").trim());
        formData.append("addressNote", (addressNoteValue || "").trim());
        formData.append("selectedOption", selectedOption.trim());
        if (!validate()) {
            return;
        }
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการแก้ไข?',
            text: "คุณแน่ใจหรือไม่ที่จะแก้ไขที่อยู่นี้?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ยืนยัน!',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        });
        if (!confirmResult.isConfirmed) {
            return;
        }
        try {
            setIsUpdating(true);
            if (!basePath) return;
            const isAuthenticated = await checkAuthNow(basePath);
            if (!isAuthenticated) {
                setShowLoginPopup(true);
                return;
            }
            const response = await fetch(`${basePath}api/address/frontend/updateAddress.php`, {
                method: "POST",
                body: formData,
            });
            const text = await response.text();
            const result = JSON.parse(text);
            if (result.status !== 200) {
                throw new Error(result.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่");
                AlertService.showError("เกิดข้อผิดพลาด", result.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่");
            }
            const updateAddress = await fetch(`${basePath}api/address/frontend/updateMainAddress.php`, {
                method: "POST",
                body: new URLSearchParams({ userID: userID, addressID: addressID, selectOption: selectedOption })
            });
            const updateText = await updateAddress.text();
            const updateResult = JSON.parse(updateText);
            if (updateResult.status !== 200) {
                throw new Error(updateResult.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่หลัก");
            }
            setAddressCount(addressCount + 1);
            AlertService.showSuccess("บันทึกข้อมูลสำเร็จ", "ที่อยู่ของคุณได้รับการอัพเดทแล้ว");
            onToggle();
        } catch (error) {
            AlertService.showError("เกิดข้อผิดพลาด", (error as Error).message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        const confirmResult = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณต้องการลบที่อยู่นี้หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            if (!basePath) return;
            const isAuthenticated = await checkAuthNow(basePath);
            if (!isAuthenticated) {
                setShowLoginPopup(true);
                return;
            }
            const response = await fetch(`${basePath}api/address/frontend/deleteAddress.php`, {
                method: "POST",
                body: new URLSearchParams({ addressID: addressID, userID: userID }),
            });
            const text = await response.text();
            const result = JSON.parse(text);
            if (result.status !== 200) {
                throw new Error(result.message || "เกิดข้อผิดพลาดในการลบที่อยู่");
            }
            setAddressCount(addressCount + 1);
            AlertService.showSuccess("ลบที่อยู่สำเร็จ", "ที่อยู่ของคุณได้ถูกลบแล้ว");
        } catch (error) {
            AlertService.showError("เกิดข้อผิดพลาด", (error as Error).message);
        }
    };


    return (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
            {/* ชื่อจริง และ นามสกุล */}
            <div className="px-6 space-y-4 sm:space-y-6">
                <p className=" font-semibold">ข้อมูลการติดต่อ</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            ชื่อจริง <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-user"></i>
                            </span>
                            <Input
                                className="!rounded-l-none"
                                key={addressName} // เพิ่ม key
                                value={addressNameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                            />
                        </div>
                        {errors.addressName && <p className="mt-1 text-red-500 text-xs">{errors.addressName}</p>}
                    </div>
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            นามสกุล <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-user"></i>
                            </span>
                            <Input className="!rounded-l-none" value={addressLastnameValue} onChange={(e) => setLastnameValue(e.target.value)} />
                        </div>
                        {errors.addressLastname && <p className="mt-1 text-red-500 text-xs">{errors.addressLastname}</p>}
                    </div>
                </div>

                {/* เบอร์โทรศัพท์ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            เบอร์โทรศัพท์ <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-phone"></i>
                            </span>
                            <Input
                                className="!rounded-l-none"
                                type="text"
                                inputMode="numeric"
                                value={phoneValue}
                                onChange={(e) => setPhoneValue(e.target.value)}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                maxLength={10}
                            />
                        </div>
                        {errors.phoneNumber && <p className="mt-1 text-red-500 text-xs">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            เบอร์โทรศัพท์ สำรอง
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-phone"></i>
                            </span>
                            <Input
                                className="!rounded-l-none"
                                type="text"
                                inputMode="numeric"
                                value={phone2Value}
                                onChange={(e) => setPhone2Value(e.target.value)}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                maxLength={10}
                            />
                        </div>

                    </div>
                </div>
                <hr className="border-slate-200 dark:border-slate-700" />
                <p className="font-semibold">ข้อมูลที่อยู่การจัดส่ง</p>
                {/* ที่อยู่ */}
                <div className="sm:flex justify-between space-y-4 sm:space-y-0 sm:space-x-3">
                    <div className="sm:w-1/3">
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            บ้านเลขที่ <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-map-marked-alt"></i>
                            </span>
                            <Input className="!rounded-l-none" value={addressNoValue} onChange={(e) => setAddressNoValue(e.target.value)} />
                        </div>
                        {errors.addressNo && <p className="mt-1 text-red-500 text-xs">{errors.addressNo}</p>}
                    </div>
                    <div className="sm:w-3/5">
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            ตึก/อาคาร/หมู่บ้าน <span className='text-red-500'>*</span>
                        </label>
                        <div className="mt-1.5 flex">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-building"></i>
                            </span>
                            <Input className="!rounded-l-none" value={addressVillageValue} onChange={(e) => setAddressVillageValue(e.target.value)} />
                        </div>
                        {errors.addressVillage && <p className="mt-1 text-red-500 text-xs">{errors.addressVillage}</p>}
                    </div>
                </div>

                {/* ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์ */}
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
                                value={addressSubDistrictValue} onChange={(e) => setAddressSubDistrictValue(e.target.value)}
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

                {/* โน๊ตเพิ่มเติม */}
                <div className="grid grid-cols-1">
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
                            โน๊ตเพิ่มเติม
                        </label>
                        <div className="mt-1.5 flex">
                            <textarea
                                className="rounded-2xl w-full h-24 text-sm bg-white border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 p-2.5 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                value={addressNoteValue}
                                onChange={(e) => setAddressNoteValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ตัวเลือกที่อยู่ */}
                <hr className="border-slate-200 dark:border-slate-700" />
                <p className="font-semibold">ตัวเลือกที่อยู่</p>
                <AddressOptions selectedOption={selectedOption} onOptionChange={handleOptionChange} isMainAddress={isMainAddress} />

                {/* ปุ่มบันทึก */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                        onClick={!isUpdating ? handleDelete : undefined}
                        disabled={isUpdating}
                        className={`nc-Button text-slate-50 dark:text-slate-50 rounded-full py-3 px-6 
                    ${(isUpdating) ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 dark:bg-red-700 hover:bg-red-500'}`}
                    >
                        <i className="las la-trash mr-1 mb-1"></i>
                        ลบที่อยู่
                    </button>

                    {isUpdating ? (
                        <button disabled className="nc-Button bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-800 rounded-full py-3 px-6 hover:bg-slate-800 flex items-center justify-center">
                            กำลังอัพเดทข้อมูล
                            <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="nc-Button bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-800 rounded-full py-3 px-6 hover:bg-slate-800">
                            <i className="las la-edit mr-2 mb-1"></i>
                            บันทึกการแก้ไข
                        </button>
                    )}

                </div>
            </div>
            <div className="pt-4">
                <button
                    onClick={onToggle}
                    type="button"
                    className="flex items-center justify-center w-full p-4 bg-gray-100 text-slate-800 h-2 text-sm font-medium "
                >
                    ซ่อนรายละเอียด
                </button>
            </div>
        </div>
    );
};

export default AddressForm;