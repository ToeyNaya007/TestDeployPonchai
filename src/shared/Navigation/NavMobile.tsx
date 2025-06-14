import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Logo from "shared/Logo/Logo";
import { Disclosure } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { NavItemType } from "./NavigationItem";
import { NAVIGATION_DEMO_2 } from "data/navigation";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import SocialsList from "shared/SocialsList/SocialsList";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import ButtonToLine from "shared/Button/ButtonToLine";
import PromobarMobile from "components/PromobarMobile";
import ButtonSearch from "shared/Button/ButtonSearch";
import AvatarDropdown from "components/Header/AvatarDropdown";
import MultilevelDropdownVertical from "components/MultilevelDropdownVertical";
import CommonLayoutShopMobile from "containers/AccountShopPage/CommonLayoutShopMobile";
import CommonLayoutAccountMobile from "containers/AccountPage/CommonLayoutAccountMobile";
import { useOptions } from "containers/OptionsContext";
import Cookies from "js-cookie";
import Auth from "utils/Auth";
import CommonLayoutAccountMobileNotLogged from "containers/AccountPage/CommonLayoutAccountMobileNotLogged";
import { useCustomer } from "containers/CustomerContext";

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

interface ProductSuggestion {
  id: number;
  name: string;
}

const NavMobile: React.FC<NavMobileProps> = ({
  data = NAVIGATION_DEMO_2,
  onClickClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const { customer } = useCustomer();


  const fetchProductData = async (query: string) => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`${basePath}api/getProduct/frontend/searchProduct.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `q=${encodeURIComponent(query)}`,
      });

      const data = await response.json();
      if (data && data.results && data.results.product) {
        setSuggestions(data.results.product.map((product: any) => ({
          id: product.ID,
          name: product.title
        })));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProductData(value);
  };

  const handleSuggestionClick = (product: ProductSuggestion) => {
    setSearchTerm(product.name);
    setSuggestions([]);
    navigate(`/page-search?q=${encodeURIComponent(product.name)}`);
    if (onClickClose) onClickClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]);
    if (searchTerm.trim()) {
      navigate(`/page-search?q=${encodeURIComponent(searchTerm)}`);
      if (onClickClose) onClickClose();
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  const renderMagnifyingGlassIcon = () => {
    return (
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const _renderMenuChild = (
    item: NavItemType,
    itemClass = " pl-3 text-neutral-900 dark:text-neutral-200 font-medium "
  ) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={i.href + index} as="li">
            <NavLink
              to={{
                pathname: i.href || undefined,
              }}
              className={({ isActive }) =>
                `flex text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-0.5 pr-4 ${itemClass} ${isActive ? "text-secondary" : ""
                }`
              }
            >
              <span
                className={`py-2.5 ${!i.children ? "block w-full" : ""}`}
                onClick={onClickClose}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="flex items-center flex-grow"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex justify-end flex-grow"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-slate-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </NavLink>
            {i.children && (
              <Disclosure.Panel>
                {_renderMenuChild(
                  i,
                  "pl-3 text-slate-600 dark:text-slate-400 "
                )}
              </Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const renderSearchForm = () => {
    return (
      <form
        onSubmit={handleSubmit}
        className="relative flex-1 text-slate-900 dark:text-slate-200"
      >
        <div className="bg-slate-200 dark:bg-slate-800 flex items-center space-x-1 py-2 px-4 rounded-xl h-full">
          {renderMagnifyingGlassIcon()}
          <input
            ref={inputRef}
            type="search"
            placeholder="พิมชื่อสินค้าเพื่อค้นหา"
            className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-sm"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <ButtonSearch>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </ButtonSearch>
        </div>
        {isInputFocused && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 mt-1 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    );
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden w-80 md:w-full h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800 hiddenScrollbar">
      <div className="py-6 px-5">

        <div className="flex justify-between mt-3">
          <div className="select-none [-webkit-tap-highlight-color:transparent] [-moz-tap-highlight-color:transparent]">
            <Logo />
          </div>
          <div className="flex gap-2">
            <AvatarDropdown />
            <SwitchDarkMode className="!w-11 !h-11 bg-neutral-100 dark:bg-neutral-800 mb-4" />
          </div>
        </div>
        <span className="absolute right-2 top-2 p-1 ">
          <ButtonClose onClick={onClickClose} />
        </span>
        <div className="">{renderSearchForm()}</div>
      </div>
      {customer ? (
        <div>
          <CommonLayoutAccountMobile />
          <CommonLayoutShopMobile />
        </div>
      ) : (
        <CommonLayoutAccountMobileNotLogged />
      )}

      <PromobarMobile />
      <MultilevelDropdownVertical />


      <div className="flex items-center justify-between px-5 space-x-2 pt-5 pb-[11rem]">
        <ButtonToLine href={"/"} className="!px-10">
          ไปที่แอปพลิเคชั่น LINE
        </ButtonToLine>
      </div>
    </div>
  );
};

export default NavMobile;