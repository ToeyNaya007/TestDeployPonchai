import React, { useState, useEffect } from 'react';
import Input from 'shared/Input/Input';
import lineSvg from 'images/line.svg';
import { useNavigate } from 'react-router-dom';
import AlertService from 'components/AlertServicce';
import { useOptions } from 'containers/OptionsContext';
import Select from 'shared/Select/Select';
import Label from 'components/Label/Label';
import Textarea from 'shared/Textarea/Textarea';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import DatePicker from 'react-datepicker';
import { getUserProfile, initLiff } from 'utils/liff';
import IconEyeSlash from 'components/IconEyeSlash';
import IconEye from 'components/IconEye';
import Cookies from "js-cookie";
import Logo from "shared/Logo/Logo";

interface Profile {
    name: string;
    pictureUrl: string;
    userId: string;
}

interface PopupConnectLineProps {
    togglePopup: () => void;
    handleLogout: () => void;
    isOpen: boolean;
    profile: Profile | null;
    checkUserIdWithApi?: (userId: string) => Promise<any>;
}

interface Customer {
    userID: string;
    profileImage: string;
    lineID: string;
    userLine: string;
    lineName: string;
    nickName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: number;
    birthDate: string;
    email: string;
    customerNote: string;

}

const PopupConnectLine: React.FC<PopupConnectLineProps> = ({ togglePopup, isOpen, handleLogout, profile, checkUserIdWithApi }) => {
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const shopnName = getOptionByName('systemName');
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [customer, setCustomer] = useState<Customer>({
        userID: '',
        profileImage: '',
        lineID: '',
        lineName: '',
        nickName: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: 1,
        birthDate: '',
        email: '',
        customerNote: '',
        userLine: '',

    });
    const [formErrors, setFormErrors] = useState<any>({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        confirm: false,
    });
    const togglePassword = (field: "current" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setStep(1);
            setErrorMessage('');
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const validateForm = () => {
        const fields: Record<string, string> = {
            firstName: "กรุณากรอกชื่อ",
            lastName: "กรุณากรอกนามสกุล",
            phoneNumber: "กรุณากรอกเบอร์โทรศัพท์",
            birthDate: "กรุณากรอกวันเกิด",
        };

        const errors: Record<string, string> = {};

        Object.entries(fields).forEach(([key, message]) => {
            if (!(customer as Record<string, any>)[key]?.trim()) {
                errors[key] = message;
            }
        });
        if (customer.gender == null) {
            errors.gender = "กรุณาเลือกเพศ";
        }
        if (!accepted) {
            errors.accepted = "กรุณายอมรับเงื่อนไขการใช้บริการ";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleAddCustomer = async () => {
        if (!validateForm()) return;
        setIsUpdating(true);
        // สร้างข้อมูลที่ต้องการส่ง
        const customerData = {
            profileImage: profile?.pictureUrl,
            lineName: profile?.name,
            lineID: customer.lineID,
            nickName: customer.nickName,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phoneNumber: customer.phoneNumber,
            gender: customer.gender,
            birthDate: customer.birthDate,
            email: customer.email,
            customerNote: customer.customerNote,
            userLine: profile?.userId,
        };
        // แปลงเป็น JSON แล้วเข้ารหัส Base64
        const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(customerData))));
        if (basePath) {
            // ส่งค่าไปยัง API
            try {
                const response = await fetch(`${basePath}api/customer/frontend/addCustomer.php`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `data=${encodeURIComponent(encodedData)}`,
                });

                const data = await response.json();
                if (data.status === 200) {
                    if (profile?.userId) {
                        checkUserIdWithApi?.(profile?.userId).then((data) => {
                            if (data && data.status === 200) {
                                Cookies.set('ponchaishop_logged', data.results.token, { path: '/', expires: 7 });
                                Cookies.set('ponchaishop_userID', data.results.userID, { path: '/', expires: 7 });
                                window.location.reload();
                                navigate("/");
                            }
                        }
                        );
                    }
                    togglePopup();
                    AlertService.showSuccess("สมัครสมาชิกสำเร็จ", "สมัครสมาชิกด้วย LINE สำเร็จ");
                    window.location.reload();
                } else {
                    setErrorMessage(data.message);
                }
            } catch (error) {
                console.error('API request error:', error);
            }
            setIsUpdating(false);
        }
    };


    const calculateAge = (birthDate: Date | null): string => {
        if (!birthDate) return "";
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        const months = monthDifference >= 0 ? monthDifference : 12 + monthDifference;
        if (age < 1) {
            return `${months} เดือน`;
        } else {
            return `${age} ปี ${months} เดือน`;
        }
    };

    const [age, setAge] = useState<string>(calculateAge(customer?.birthDate ? new Date(customer.birthDate) : null));
    useEffect(() => {
        setAge(calculateAge(customer?.birthDate ? new Date(customer.birthDate) : null));
    }, [customer?.birthDate]);



    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80 pt-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`h-full max-h-[40rem] md:max-h-[50rem] overflow-y-scroll bg-slate-50 dark:bg-slate-800 px-6 py-7 border border-t-4 border-t-red-500 space-y-4 sm:space-y-6 rounded-lg w-full max-w-[56rem] shadow-lg transform transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} `}>
                <div className="flex items-center justify-between border-b-2 border-neutral-200 dark:border-neutral-700 pb-3">
                    <div className='flex gap-3'>
                        <img className="w-7" src={lineSvg} alt="สมัครสมาชิกด้วย line" />
                        <h2 className="text-xl font-semibold">สมัครสมาชิกด้วย LINE</h2>
                    </div>
                    <div className="ml-10">
                        <button onClick={handleLogout}>
                            <i className="text-3xl las la-times-circle"></i>
                        </button>
                    </div>
                </div>
                {step === 1 && (
                    <div className=" mt-10 md:mt-0 space-y-6">
                        <div className="flex flex-col gap-6">
                            <Logo className="flex-shrink-0 pointer-events-none " />
                            <div className='flex flex-col gap-y-3 sm:flex-row justify-between'>
                                <div className="flex items-center sm:w-1/3 bg-green-600 p-2 rounded-lg text-white">
                                    <h2 className="text-xl font-semibold">ข้อมูลที่ได้จากระบบ LINE</h2>
                                    <img className="w-8 ml-2" src={lineSvg} alt="สมัครสมาชิกด้วย line" />
                                </div>
                                <div className="sm:w-1/3 flex items-center space-x-2 bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white px-2 py-2 rounded-full border border-gray-300 shadow-lg">
                                    {profile?.pictureUrl ? (
                                        <img
                                            src={profile.pictureUrl}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover mr-2"
                                        />
                                    ) : (
                                        <div>No profile image available</div>
                                    )}
                                    <p className="text-lg font-medium tracking-wide">{profile?.name}</p>
                                </div>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label>ชื่อ <span className='text-red-500'>*</span></Label>
                                <div className="mt-1.5 flex flex-col">
                                    <div className="flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                                            <i className="text-2xl las la-user"></i>
                                        </span>
                                        <Input
                                            className="!rounded-l-none shadow-md"
                                            value={customer.firstName ?? ""}
                                            onChange={(e) => setCustomer((prev) => ({ ...prev, firstName: e.target.value }))}
                                        />
                                    </div>
                                    {formErrors.firstName && <p className="mt-2 text-red-500 text-sm">{formErrors.firstName}</p>}
                                </div>
                            </div>
                            <div>
                                <Label>นามสกุล <span className='text-red-500'>*</span></Label>
                                <div className="mt-1.5 flex flex-col">
                                    <div className="flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                                            <i className="text-2xl las la-user"></i>
                                        </span>
                                        <Input className="!rounded-l-none shadow-md"
                                            value={customer.lastName ?? ""}
                                            onChange={(e) => setCustomer((prev) => ({ ...prev, lastName: e.target.value }))}
                                        />
                                    </div>
                                    {formErrors.lastName && <p className="mt-2 text-red-500 text-sm">{formErrors.lastName}</p>}
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

                            <div>
                                <Label>เบอร์โทรศัพท์<span className='text-red-500'> *</span></Label>
                                <div className="mt-1.5 flex flex-col">
                                    <div className="flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                                            <i className="text-2xl las la-phone-volume"></i>
                                        </span>
                                        <Input
                                            className="!rounded-l-none shadow-md"
                                            value={customer.phoneNumber ?? ""}
                                            onChange={(e) => setCustomer((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                                            inputMode="numeric"
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            maxLength={10}
                                        />
                                    </div>
                                    {formErrors.phoneNumber && <p className="mt-2 text-red-500 text-sm">{formErrors.phoneNumber}</p>}
                                </div>
                            </div>
                            <div className=''>
                                <Label>เพศ<span className='text-red-500'> *</span></Label>
                                <div className="mt-1.5 flex">
                                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                                        <i className="text-2xl las la-genderless"></i>
                                    </span>
                                    <Select
                                        className="!rounded-l-none shadow-md"
                                        value={customer ? customer.gender : 1}
                                        onChange={(e) => setCustomer((prev) => ({ ...prev, gender: parseInt(e.target.value) }))}
                                    >
                                        <option value="1">เพศชาย</option>
                                        <option value="2">เพศหญิง</option>
                                        <option value="3">LGBTQ</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="">
                                <Label>วันเกิด<span className='text-red-500'> *</span></Label>
                                <div className="mt-1.5 flex flex-col">
                                    <div className="flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                                            <i className="text-2xl las la-calendar"></i>
                                        </span>
                                        <DatePicker
                                            selected={customer?.birthDate ? new Date(customer.birthDate) : null}
                                            onChange={(date: Date | null) => setCustomer((prev) => ({ ...prev, birthDate: date ? date.toISOString().split('T')[0] : "" }))}
                                            dateFormat="yyyy-MM-dd"
                                            className="w-full p-2 rounded-md rounded-l-none border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 cursor-pointer dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 shadow-md"
                                            calendarClassName="rounded-md"
                                            dayClassName={() => "hover:bg-green-200"}
                                            showYearDropdown
                                            yearDropdownItemNumber={100}
                                            scrollableYearDropdown
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    {formErrors.birthDate && <p className="mt-2 text-red-500 text-sm">{formErrors.birthDate}</p>}
                                </div>
                                <div className="mt-1.5">
                                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">ปัจจุบันอายุ {age}</span>
                                </div>
                            </div>
                        </div>

                        {/* ---- */}
                        <div className="flex flex-col sm:flex-row gap-6 w-full">
                            <div className=''>
                                <Label>ชื่อเล่น</Label>
                                <div className="mt-1.5 flex flex-col">
                                    <div className="flex ">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                                            <i className="text-2xl las la-user"></i>
                                        </span>
                                        <Input className="!rounded-l-none shadow-md"
                                            value={customer.nickName ?? ""}
                                            onChange={(e) => setCustomer((prev) => ({ ...prev, nickName: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>อีเมล</Label>
                                <div className="mt-1.5 flex flex-col">
                                    <div className="flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                                            <i className="text-2xl las la-envelope"></i>
                                        </span>
                                        <Input
                                            className="!rounded-l-none shadow-md"
                                            placeholder="example@email.com"
                                            type="email"
                                            value={customer.email ?? ""}
                                            onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2 text-black">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-200 mt-1"
                                checked={accepted}
                                onChange={() => setAccepted(!accepted)}
                            />
                            <label htmlFor="terms" className="flex flex-col">
                                <span className='mt-1 dark:text-white'>ฉันยอมรับ เงื่อนไขการใช้บริการ และ นโยบายความเป็นส่วนตัว</span>
                                <span className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                    หากดำเนินการต่อ LINE จะแชร์ชื่อ รหัสผู้ใช้ และรูปโปรไฟล์ของคุณกับ {shopnName}
                                    <br />
                                    ดู{" "}
                                    <a href="/privacy" className="text-blue-400 hover:underline">
                                        นโยบายความเป็นส่วนตัว
                                    </a>{" "}
                                    และ{" "}
                                    <a href="/terms" className="text-blue-400 hover:underline">
                                        เงื่อนไขการใช้บริการ {shopnName}
                                    </a>
                                </span>
                            </label>
                        </div>
                        {formErrors && <p className="mt-2 text-red-500 text-sm">{formErrors.accepted}</p>}


                        <div className="flex justify-end pt-2">
                            {isUpdating ? (
                                <ButtonPrimary disabled>
                                    <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังอัพเดทข้อมูล</ButtonPrimary>
                            ) :
                                (
                                    <ButtonPrimary onClick={handleAddCustomer}>
                                        <i className="las la-edit mr-2 mb-1"></i>
                                        สมัครสมาชิกด้วย LINE</ButtonPrimary>
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopupConnectLine;
