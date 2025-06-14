import Label from "components/Label/Label";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";
import CommonLayout from "./CommonLayout";
import { Helmet } from "react-helmet-async";
import { avatarImgs } from "contains/fakeData";
import DatePicker from "react-datepicker";
import { useOptions } from "containers/OptionsContext";
import SkeletonForm from "./SkeletonForm";
import AlertService from "components/AlertServicce";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { checkAuthNow } from "utils/checkAuthNow";
import { useLoginPopup } from "containers/LoginPopupContext";

export interface AccountPageProps {
  className?: string;
}

interface Customer {
  userID: string;
  profileImage: string;
  lineID: string;
  nickName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: number;
  birthDate: string;
  email: string;
  customerNote: string
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const navigate = useNavigate();
  const { showLoginPopup, setShowLoginPopup } = useLoginPopup();

  useEffect(() => {
    if (!basePath) return;
    if (basePath && userID) {
      fetchAccount();
    }
  }, [userID, basePath]);

  const fetchAccount = async () => {
    if (!basePath) return;
    const isAuthenticated = await checkAuthNow(basePath);
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${basePath}api/customer/frontend/getCustomerData.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // ใช้ Content-Type ที่เป็น simple request
        },
        body: new URLSearchParams({ customerID: userID }).toString(), // ส่งข้อมูลในรูปแบบ URL-encoded
      });

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = await response.json();
      // ตรวจสอบและดึงค่าตามโครงสร้าง results.addresses[0]
      const customerData = data.results?.customer?.[0] || null; // ดึงตัวแรก หรือให้เป็น null ถ้าไม่มีข้อมูล
      setCustomer(customerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
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

  const validateForm = () => {
    const errors: any = {};

    if (!userID.trim()) {
      errors.userID = "กรุณากรอกชื่อจริง";
    }
    if (!customer?.firstName?.trim()) {
      errors.firstName = "กรุณากรอกชื่อ";
    }
    if (!customer?.lastName?.trim()) {
      errors.lastName = "กรุณากรอกนามสกุล";
    }
    if (!customer?.phoneNumber?.toString().trim()) {
      errors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    }
    if (!customer?.nickName?.trim()) {
      errors.nickName = "กรุณากรอกชื่อเล่น";
    }
    if (!customer?.gender?.toString().trim()) {
      errors.gender = "กรุณาเลือกเพศ";
    }
    if (!customer?.birthDate?.toString().trim()) {
      errors.birthDate = "กรุณากรอกวันเกิด";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // เก็บ errors ไว้ใน state
      return false;
    }
    return true;
  };


  const handleSubmit = async () => {
    const confirmResult = await Swal.fire({
      title: 'ยืนยันการแก้ไข?',
      text: "คุณแน่ใจหรือไม่ที่จะแก้ไขข้อมูล่วนตัวนี้?",
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
    if (!validateForm()) {
      return;
    }
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("firstName", customer?.firstName?.trim() || "");
    formData.append("lastName", customer?.lastName?.trim() || "");
    formData.append("phoneNumber", customer?.phoneNumber?.toString().trim() || "");
    formData.append("nickName", customer?.nickName?.trim() || "");
    formData.append("gender", customer?.gender?.toString().trim() || "");
    formData.append("birthDate", customer?.birthDate?.toString().trim() || "");
    formData.append("email", customer?.email?.trim() || "");
    formData.append("customerNote", customer?.customerNote?.trim() || "");
    formData.append("lineID", customer?.lineID?.trim() || "");

    if (!basePath) return;
    const isAuthenticated = await checkAuthNow(basePath);
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    try {
      setIsUpdating(true);
      // ส่งข้อมูลที่อยู่ไปยัง API เพื่ออัพเดท
      const response = await fetch(`${basePath}api/customer/frontend/updateCustomer.php`, {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      const result = JSON.parse(text);
      if (result.status !== 200) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์");
        AlertService.showError("เกิดข้อผิดพลาด", result.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่");
      }
      fetchAccount();
      AlertService.showSuccess("บันทึกข้อมูลสำเร็จ", "ข้อมูลโปรไฟล์ได้รับการอัปเดทเรียบร้อยแล้ว");
    } catch (error) {
      AlertService.showError("เกิดข้อผิดพลาด", (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (

    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">

      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">
            ข้อมูลส่วนตัว
          </h2>

          <div className="flex flex-col md:flex-row">

            {loading ? <SkeletonForm /> :
              <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label>ชื่อ</Label>
                    <div className="mt-1.5 flex flex-col">
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                          <i className="text-2xl las la-user"></i>
                        </span>
                        <Input className="!rounded-l-none shadow-md" value={customer ? customer.firstName : ""} onChange={(e) => setCustomer((prev) => prev ? { ...prev, firstName: e.target.value } : null)} />
                      </div>
                      {formErrors.firstName && <p className="mt-2 text-red-500 text-sm">{formErrors.firstName}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>นามสกุล</Label>
                    <div className="mt-1.5 flex flex-col">
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                          <i className="text-2xl las la-user"></i>
                        </span>
                        <Input className="!rounded-l-none shadow-md" value={customer ? customer.lastName : ""} onChange={(e) => setCustomer((prev) => prev ? { ...prev, lastName: e.target.value } : null)} />
                      </div>
                      {formErrors.lastName && <p className="mt-2 text-red-500 text-sm">{formErrors.lastName}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label>ชื่อเล่น</Label>
                    <div className="mt-1.5 flex flex-col">
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                          <i className="text-2xl las la-user"></i>
                        </span>
                        <Input className="!rounded-l-none shadow-md" value={customer ? customer.nickName : ""} onChange={(e) => setCustomer((prev) => prev ? { ...prev, nickName: e.target.value } : null)} />
                      </div>
                      {formErrors.nickName && <p className="mt-2 text-red-500 text-sm">{formErrors.nickName}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>ID Line</Label>
                    <div className="mt-1.5 flex flex-col">
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                          <i className="text-2xl las la-id-badge"></i>
                        </span>
                        <Input className="!rounded-l-none shadow-md" value={customer ? customer.lineID : ""} onChange={(e) => setCustomer((prev) => prev ? { ...prev, lineID: e.target.value } : null)} />
                      </div>
                      {formErrors.lineID && <p className="mt-2 text-red-500 text-sm">{formErrors.lineID}</p>}
                    </div>
                  </div>
                </div>


                {/* ---- */}

                {/* ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label>เบอร์โทรศัพท์</Label>
                    <div className="mt-1.5 flex flex-col">
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                          <i className="text-2xl las la-phone-volume"></i>
                        </span>
                        <Input
                          className="!rounded-l-none shadow-md"
                          value={customer ? customer.phoneNumber : ""} onChange={(e) => setCustomer((prev) => prev ? { ...prev, phoneNumber: e.target.value } : null)}
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
                          value={customer ? customer.email : ""} onChange={(e) => setCustomer((prev) => prev ? { ...prev, email: e.target.value } : null)}
                        />
                      </div>
                      {formErrors.email && <p className="mt-2 text-red-500 text-sm">{formErrors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="max-w-lg">
                    <Label>วันเกิด</Label>
                    <div className="mt-1.5 flex flex-col">
                        <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                          <i className="text-2xl las la-calendar"></i>
                        </span>
                        <DatePicker
                          selected={customer?.birthDate ? new Date(customer.birthDate) : null}
                          onChange={(date: Date | null) => setCustomer((prev) => prev ? { ...prev, birthDate: date ? date.toISOString().split('T')[0] : "" } : null)}
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
                  <div>
                    <Label>เพศ</Label>
                    <div className="mt-1.5 flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm shadow-md">
                        <i className="text-2xl las la-genderless"></i>
                      </span>
                      <Select
                        className="!rounded-l-none shadow-md"
                        value={customer ? customer.gender : ""}
                        onChange={(e) => setCustomer((prev) => prev ? { ...prev, gender: parseInt(e.target.value) } : null)}
                      >
                        <option value="1">เพศชาย</option>
                        <option value="2">เพศหญิง</option>
                        <option value="3">LGBTQ</option>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>เกี่ยวกับฉัน</Label>
                  <Textarea className="mt-1.5 shadow-md"
                    value={customer?.customerNote}
                    onChange={(e) => setCustomer((prev) => prev ? { ...prev, customerNote: e.target.value } : null)}
                  />
                </div>
                <div className="pt-2">
                  {isUpdating ? (
                    <ButtonPrimary disabled>
                      <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังอัพเดทข้อมูล</ButtonPrimary>
                  ) :
                    (
                      <ButtonPrimary onClick={handleSubmit}>
                        <i className="las la-edit mr-2 mb-1"></i>
                        อัปเดทการเปลี่ยนแปลงบัญชี</ButtonPrimary>
                    )}
                </div>
              </div>
            }
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPage;
