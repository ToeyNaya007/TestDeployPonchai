import React, { FC, useState } from "react";
import lineSvg from "images/line.svg";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link, useNavigate } from "react-router-dom";
import { useOptions } from "containers/OptionsContext";
import Logo from "shared/Logo/Logo";
import PopupConnectLine from "containers/PageSignUp/PopupConnectLine copy";
import AlertService from "components/AlertServicce";

export interface PageSignUpProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Line",
    href: "#",
    icon: lineSvg,
  },
];

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMessage('ชื่อผู้ใช้และรหัสผ่านไม่สามารถเป็นค่าว่างได้');
      return;
    }
    try {
      const response = await fetch(`${basePath}api/TestAPI/register.php/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        //เข้าสู่ระบบเมื่อสมัครสำเร็จ
        const loginResponse = await fetch(`${basePath}api/TestAPI/register.php/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginResponse.json();

        if (loginData.success) {
          AlertService.showSuccess('สมัครสมาชิกสำเร็จ!', 'กำลังเข้าสู่ระบบ', 2000);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          AlertService.showError('เกิดข้อผิดพลาด!', loginData.error, 2000);
        }
      } else if (response.status === 409) {
        AlertService.showError('เกิดข้อผิดพลาด!', 'ชื่อผู้ใช้นี้มีอยู่แล้ว', 2000);
      } else {
        AlertService.showError('เกิดข้อผิดพลาดในการสมัครสมาชิก!', data.error, 2000);
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };


  return (
    <div className={`nc-PageSignUp ${className}`} data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          สมัครสมาชิก
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <button
                key={index}
                onClick={togglePopup}
                className="flex w-full items-center rounded-lg bg-green-500 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <img
                  className="flex-shrink-0 w-8"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm md:text-lg font-medium text-white ">
                  {item.name}
                </h3>
              </button>
            ))}
          </div>
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleRegister}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">Email address</span>
              <Input
                type="text"
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">Password</span>
              <Input type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {message && <p className="text-red-600">{message}</p>}
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account?{" "}
            <Link className="text-green-600" to="/login">
              Sign in
            </Link>
          </span>
        </div>
      </div>
      <PopupConnectLine togglePopup={togglePopup} isOpen={isPopupOpen} />
    </div>
  );
};

export default PageSignUp;
