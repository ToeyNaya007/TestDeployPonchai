import Logo from "shared/Logo/Logo";
import SocialsList1 from "shared/SocialsList1/SocialsList1";
import { CustomLink } from "data/types";
import React from "react";
import promtpayimg from "images/promt-pay-logo-1110x743.jpg";


export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "5",
    title: "เริ่มต้นใช้งาน",
    menus: [
      { href: "/register-guide", label: "วิธีสมัครสมาชิก" },
      { href: "/order-and-payment", label: "การสั่งซื้อและชำระเงิน" },
      { href: "/delivery-area", label: "พื้นที่สำหรับจัดส่ง" },
    ],
  },
  {
    id: "1",
    title: "ข้อกำหนดและเงื่อนไข",
    menus: [
      { href: "/termsconditions", label: "ข้อกำหนดและเงื่อนไขในการใช้งาน" },
      { href: "/privacy", label: "นโยบายการใช้คุกกี้" },
    ],
  },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
      <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
        {menu.title}
      </h2>    
      <ul className="mt-5 space-y-4">
        {menu.menus.map((item, index) => (
          <li key={index}>
            <a
              className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:scale-110 transition-transform duration-100 inline-block"
              href={item.href}
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
    
    );
  };
  return (
    <div className="nc-Footer relative py-11  border-t border-neutral-200 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-10">
        <div className="grid grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
          <div className="col-span-2 md:col-span-1">
            <Logo />
          </div>
          <div className="col-span-2 flex items-center md:col-span-3">
            <SocialsList1 className="flex items-center space-x-2 lg:space-x-0 lg:flex-col lg:space-y-3 lg:items-start" />
          </div>
        </div>
        {widgetMenus.map(renderWidgetMenuItem)}
        <div className="text-sm">
          <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
            วิธีการชำระเงิน
          </h2>
          <ul className="mt-2 space-y-4">
            <li>
              <a className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white" rel="noopener noreferrer">
                <img src={promtpayimg} width="100" height="100" alt="" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
