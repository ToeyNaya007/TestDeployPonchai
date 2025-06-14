import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import facebook from "images/socials/facebook.svg";
import twitter from "images/socials/twitter.svg";
import telegram from "images/socials/telegram.svg";
import youtube from "images/socials/youtube.svg";
import tiktok from "images/socials/tiktok.svg";
import line from "images/socials/line.svg";
import { useOptions } from "containers/OptionsContext";

export interface SocialsList1Props {
  className?: string;
}

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const { getOptionByName } = useOptions();

  const socials: SocialType[] = [
    {
      name: "Facebook",
      icon: facebook,
      href: getOptionByName("systemContactUsFacebook") || "",
    },
    {
      name: "Line",
      icon: line,
      href: getOptionByName("systemContactUsLineOA") || "",
    },
    {
      name: "Youtube",
      icon: youtube,
      href: getOptionByName("systemContactUsYouTube") || "",
    },
    {
      name: "Tiktok",
      icon: tiktok,
      href: getOptionByName("systemContactUsTiktok") || "",
    },
  ];

  const renderItem = (item: SocialType, index: number) => (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
      key={index}
    >
      <div className="flex-shrink-0 w-5">
        <img src={item.icon} alt={item.name} />
      </div>
      <span className="hidden lg:block text-sm">{item.name}</span>
    </a>
  );

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials
        .filter((item) => !!item.href) // ✅ กรองเฉพาะอันที่มี href
        .map(renderItem)}
    </div>
  );
};

export default SocialsList1;
