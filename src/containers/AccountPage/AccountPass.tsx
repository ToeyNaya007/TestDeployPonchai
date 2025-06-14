import Label from "components/Label/Label";
import React, { useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import CommonLayout from "./CommonLayout";
import IconEye from "components/IconEye";
import IconEyeSlash from "components/IconEyeSlash";
import AlertService from "components/AlertServicce";
import { useOptions } from "containers/OptionsContext";

const AccountPass = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userID = "1013";
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const validateForm = () => {
    const errors: any = {};

    if (!currentPassword.trim()) {
      errors.currentPassword = "กรุณากรอกรหัสผ่านปัจจุบัน";
    }
    if (!newPassword.trim()) {
      errors.newPassword = "กรุณากรอกรหัสผ่านใหม่";
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "กรุณากรอกรหัสผ่านใหม่อีกครั้ง";
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      errors.confirmPassword = "รหัสผ่านที่กรอกไม่ตรงกัน";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // เก็บ errors ไว้ใน state
      return false;
    }

    return true;
  };

  const handlesubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("currentPassword", currentPassword.trim());
    formData.append("newPassword", newPassword.trim());

    try {
      setIsUpdating(true);
      // ส่งข้อมูลที่อยู่ไปยัง API เพื่ออัพเดท
      const response = await fetch(`${basePath}api/customer/frontend/changePassword.php`, {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      const result = JSON.parse(text);
      if (result.status === 401) {
        setFormErrors((prevErrors: any) => ({ ...prevErrors, currentPassword: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }));
      }
      else if (result.status !== 200) {
        throw new Error(result.message);
        AlertService.showError("เกิดข้อผิดพลาด", result.message || "เกิดข้อผิดพลาดในการอัพเดทที่อยู่");
      }
      AlertService.showSuccess("บันทึกข้อมูลสำเร็จ", "อัพเดทรหัสผ่านเรียบร้อยแล้ว", 2000, true);
    } catch (error) {
      AlertService.showError("เกิดข้อผิดพลาด", (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  }



  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">
            เปลี่ยนรหัสผ่าน
          </h2>
          <div className="max-w-xl space-y-6">
            {/* Current Password */}
            <div className="relative">
              <Label>รหัสผ่านปัจจุบัน</Label>
              <Input
                type={showPassword.current ? "text" : "password"}
                className="mt-1.5 pr-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => togglePassword("current")}
              >
                {showPassword.current ? <IconEyeSlash /> : <IconEye />}
              </button>
              {formErrors.currentPassword && <p className="mt-2 text-red-500 text-sm">{formErrors.currentPassword}</p>}
            </div>


            {/* New Password */}
            <div className="relative">
              <Label>รหัสผ่านใหม่</Label>
              <Input
                type={showPassword.new ? "text" : "password"}
                className="mt-1.5 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => togglePassword("new")}
              >
                {showPassword.new ? <IconEyeSlash /> : <IconEye />}
              </button>
              {formErrors.newPassword && <p className="mt-2 text-red-500 text-sm">{formErrors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Label>ยืนยันรหัสผ่าน</Label>
              <Input
                type={showPassword.confirm ? "text" : "password"}
                className="mt-1.5 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => togglePassword("confirm")}
              >
                {showPassword.confirm ? <IconEyeSlash /> : <IconEye />}
              </button>
              {formErrors.confirmPassword && <p className="mt-2 text-red-500 text-sm">{formErrors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <ButtonPrimary onClick={handlesubmit}>
                <i className="las la-edit mr-2 mb-1"></i>
                เปลี่ยนรหัสผ่าน
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPass;
