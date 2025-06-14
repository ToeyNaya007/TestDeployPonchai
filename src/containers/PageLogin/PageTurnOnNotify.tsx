import React, { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import lineSvg from "images/line.svg";
import { initLiff, loginWithLine, getUserProfile, isLoggedIn } from "utils/liff";
import AlertService from "components/AlertServicce";
import Cookies, { set } from "js-cookie";
import { useOptions } from "containers/OptionsContext";

export interface PageTurnOnNotifyProps {
  className?: string;
}
const loginSocials = [
  {
    name: "รับการแจ้งเตือนผ่าน Line",
    href: "#",
    icon: lineSvg,
  },
];

const PageTurnOnNotify: FC<PageTurnOnNotifyProps> = ({ className = "" }) => {
  const { userIDFromMessageAPI } = useParams(); // ✅ เรียก hook ที่ระดับบนสุดของ component
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ name: string; pictureUrl: string; userId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const userID = Cookies.get("ponchaishop_userID") || "";

  useEffect(() => {
    if (!userIDFromMessageAPI) {
      setMessage("ไม่พบข้อมูลผู้ใช้จากพารามิเตอร์");
      setLoading(false);
      return;
    }
    setLoading(false);
    setMessage("userIDFromMessageAPI: " + userIDFromMessageAPI);
  }, [userIDFromMessageAPI]);

  const saveUserIdForNotify = async (userId: string) => {
    const urlEncodedData = `TokenMessageAPI=${encodeURIComponent(userId)}&userID=${encodeURIComponent(userID)}`;
    try {
      const response = await fetch(`${basePath}api/customer/frontend/updateMessageAPIToken.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      });
      const data = await response.json();
      if (data.status === 200) {
        setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
        AlertService.showSuccess("สำเร็จ", "บันทึกข้อมูลเรียบร้อย", 3000, false, false);
        setSuccess(true);
      } else {
        setMessage("ไม่สามารถบันทึกข้อมูลได้");
        AlertService.showError("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", 3000);
      }
    } catch (error) {
      console.error("Save API error:", error);
      return null;
    }
  };


  return (
    <div className={`nc-PageTurnOnNotify ${className}`} data-nc-id="PageTurnOnNotify">
      <div className="container mb-24 md:mb-[28rem]">
        <h2 className="my-20 text-center text-3xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100">
          รับการแจ้งเตือนผ่าน LINE OFFICIAL ACCOUNT
        </h2>
        <div className="max-w-md mx-auto text-center">
          {loading ? (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-5 mb-5">
                <img className="" src={lineSvg} alt="Line Logo" width={100} height={100} />
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-bell-fill text-green-500" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                </svg>
              </div>
              <div className="mt-6">
                <div>
                  <button
                    className="flex w-full justify-center gap-8 items-center rounded-lg bg-green-500 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px] mb-5"
                    onClick={() => { if (userIDFromMessageAPI) saveUserIdForNotify(userIDFromMessageAPI); }}
                  >
                    <h3 className="flex justify-center items-center gap-3 text-center text-sm md:text-lg font-medium text-white ">
                      {loginSocials[0].name}
                      <img className="flex-shrink-0 w-8" src={loginSocials[0].icon} alt={loginSocials[0].name} />
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                      </svg>
                    </h3>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTurnOnNotify;
