import React, { FC, useState } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet-async";
import lineSvg from "images/line.svg";
import Input from "shared/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useOptions } from "containers/OptionsContext";
import AlertService from "components/AlertServicce";
import PopupConnectLine from "containers/PageSignUp/PopupConnectLine copy";

export interface PageLoginProps {
  className?: string;
}
const loginSocials = [
  {
    name: "Continue with Line",
    href: "#",
    icon: lineSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMessage('ชื่อผู้ใช้และรหัสผ่านไม่สามารถเป็นค่าว่างได้');
      return;
    }
    try {
      const response = await fetch(`${basePath}api/TestAPI/register.php/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        AlertService.showSuccess('เข้าสู่ระบบสำเร็จ!', 'กำลังพาคุณไปหน้าใหม่', 2000);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        AlertService.showError('ไม่สามารถเข้าสู่ระบบได้!', data.error, 2000);
        setTimeout(() => {
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Login failed. Please try again.');
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
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
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                เบอร์โทรศัพท์ หรือ อีเมล
              </span>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link to="/forgot-pass" className="text-sm text-green-600">
                  Forgot password?
                </Link>
              </span>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </label>
            {message && <p className="text-red-600">{message}</p>}
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-green-600" to="/signup">
              Create an account
            </Link>
          </span>
        </div>
      </div>
      <PopupConnectLine togglePopup={togglePopup} isOpen={isPopupOpen} />
    </div>
  );
};

export default PageLogin;
