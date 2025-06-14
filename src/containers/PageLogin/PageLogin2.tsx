import React, { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import lineSvg from "images/line.svg";
import { initLiff, loginWithLine, logoutFromLine, getUserProfile } from "utils/liff";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useOptions } from "containers/OptionsContext";
import PopupConnectLine from "containers/PageSignUp/PopupConnectLine";
import AlertService from "components/AlertServicce";
import Cookies from "js-cookie";
import { useCustomer } from "containers/CustomerContext";
import { log } from "console";

export interface PageLoginProps {
  className?: string;
}

const loginSocials = [
  {
    name: "เข้าสู่ระบบ / สมัครสมาชิกด้วย Line",
    href: "#",
    icon: lineSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect');
  const [profile, setProfile] = useState<{ name: string; pictureUrl: string; userId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [hasLiffQuery, setHasLiffQuery] = useState(false);
  const { setCustomer } = useCustomer();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (
      params.has('code') &&
      params.has('state') &&
      params.has('liffClientId') &&
      params.has('liffRedirectUri')
    ) {
      setHasLiffQuery(true);
    } else {
      setHasLiffQuery(false);
    }
  }, [location.search]);

  useEffect(() => {
    if (hasLiffQuery && !loading && !profile) {
      window.location.href = "/login";
    }
  }, [hasLiffQuery, loading, profile]);

  useEffect(() => {
    if (redirect) {
      const decodedRedirect = decodeURIComponent(redirect);
      Cookies.set('redirectPath', decodedRedirect, { path: '/', expires: 1 });
    }
  }, [redirect, navigate]);

  const checkUserIdWithApi = async (userId: string) => {
    const urlEncodedData = `userIDLine=${encodeURIComponent(userId)}`;
    try {
      const response = await fetch(`${basePath}api/customer/frontend/validateUser.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      });

      const data = await response.json();
      return data; // คืนค่าเต็มไปจัดการที่ component
    } catch (error) {
      console.error('API request error:', error);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await initLiff();
        const userProfile = await getUserProfile();
        if (userProfile) {
          setProfile({
            name: userProfile.displayName,
            pictureUrl: userProfile.pictureUrl || "",
            userId: userProfile.userId,
          });
          console.log("LIFF initialized successfully", userProfile);
          setIsLoginSuccess(true);
        } else {
          console.warn("⚠️ User not logged in");
          initLiff(); // หรือแสดง popup
        }
      } catch (err) {
        console.error("LIFF init failed", err);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const decodedRedirectPath = Cookies.get('redirectPath') || "/";
    if (basePath && profile) {
      checkUserIdWithApi(profile.userId).then((data) => {
        if (data && data.status === 200) {
          Cookies.set('ponchaishop_logged', data.results.token, { path: '/', expires: 7 });
          Cookies.set('ponchaishop_userID', data.results.userID, { path: '/', expires: 7 });
          setCustomer({
            userID: String(data.results.userID),
            profileImage: data.results.profileImage,
            firstName: data.results.firstName,
            lastName: data.results.lastName
          });
          setIsLoginSuccess(true);
          Cookies.remove("redirectPath");
          AlertService.showSuccess("สำเร็จ", "เข้าสู่ระบบเรียบร้อย", 3000, false, false, `${decodedRedirectPath}`);
        } else if (data && data.status === 201) {
          togglePopup();
        } else {
          AlertService.showError("เกิดข้อผิดพลาด", "ยืนยันตัวต้นล้มเหลว", 3000);
        }
      });
    } else {
      console.log('Profile not found');
    }
  }, [profile, basePath]);

  const handleLogout = async () => {
    await logoutFromLine();
    setLoading(true);
    Cookies.remove("ponchaishop_userID");
    Cookies.remove("ponchaishop_logged");
    Cookies.remove("redirectPath");
    setIsLoginSuccess(false);
    setIsPopupOpen(false);
    window.location.href = "/login";
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <div className="container mb-24 md:mb-[27rem] lg:mb-[22rem]">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          {hasLiffQuery ? "เข้าสู่ระบบ" : "เข้าสู่ระบบ / สมัครสมาชิก"}
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {loading ? (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !profile ? (
            <div>
              <button
                className="flex w-full items-center rounded-lg bg-green-500 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px] mb-5"
                onClick={() => {
                  if (hasLiffQuery) {
                    window.location.reload();
                  } else {
                    // ปกติเรียก loginWithLine
                    setLoading(true);
                    loginWithLine();
                  }
                }}
              >
                {hasLiffQuery ? (
                  <span className="flex items-center justify-center w-8 h-8">
                    <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                  </span>
                ) : (
                  <img
                    className="flex-shrink-0 w-8"
                    src={loginSocials[0].icon}
                    alt={loginSocials[0].name}
                  />
                )}
                <h3 className="flex-grow text-center text-sm md:text-lg font-medium text-white ">
                  {hasLiffQuery ? "กำลังเข้าสู่ระบบ..." : loginSocials[0].name}
                </h3>
              </button>

            </div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <img src={profile.pictureUrl} alt="Profile" width={150} />
              <p>Welcome : {profile.name}</p>
              <p>userID : {profile.userId}</p>
              <button className="flex w-full items-center justify-center bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition-colors mt-3" onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
      <PopupConnectLine togglePopup={togglePopup} isOpen={isPopupOpen} handleLogout={handleLogout} profile={profile} checkUserIdWithApi={checkUserIdWithApi} />
    </div>
  );
};

export default PageLogin;
