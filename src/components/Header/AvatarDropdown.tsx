import { Popover, Transition } from "@headlessui/react";
import { avatarImgs } from "contains/fakeData";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import SwitchDarkMode2 from "shared/SwitchDarkMode/SwitchDarkMode2";
import { useUser } from "containers/UsersContext";
import { logoutFromLine } from "utils/liff";
import { useOptions } from "containers/OptionsContext";
import Cookies from "js-cookie";
import AvatarMenuLogged from "./AvatarMenuLogged";
import AvatarMenuNotLogged from "./AvatarMenuNotLogged";
import { checkAuthNow } from "utils/checkAuthNow";
import { useLoginPopup } from "containers/LoginPopupContext";
import { console } from "inspector";
import { useCustomer } from "containers/CustomerContext";


interface Customer {
  userID: string;
  profileImage: string;
  firstName: string;
  lastName: string;
}

export default function AvatarDropdown() {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับเปลี่ยนหน้า
  const [loading, setLoading] = useState(false);
  const { customer, setCustomer } = useCustomer();

  return (
    <div className="AvatarDropdown ">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
            >
              <svg
                className=" w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] mt-3.5 px-0 -left-[12rem]">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  {customer ? (
                    <AvatarMenuLogged
                      close={close}
                    />
                  ) : (
                    <AvatarMenuNotLogged close={close} />
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
