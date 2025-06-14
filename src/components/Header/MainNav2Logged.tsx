import React, { FC, useState, useEffect, useRef } from "react";
import Logo from "shared/Logo/Logo";
import MenuBar from "shared/MenuBar/MenuBar";
import AvatarDropdown from "./AvatarDropdown";
import Navigation from "shared/Navigation/Navigation";
import CartDropdown from "./CartDropdown";
import { useNavigate } from "react-router-dom";
import ButtonSearch from "shared/Button/ButtonSearch";
import Whitlist from "./whitlist";
import { useOptions } from "containers/OptionsContext";
import LangDropdown from "./LangDropdown";
import NotifyDropdown from "./NotifyDropdown";

export interface MainNav2LoggedProps { }

interface ProductSuggestion {
  ID: number;
  title: string;
}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [showMobileSearchForm, setShowMobileSearchForm] = useState(false); // เพิ่ม state สำหรับมือถือ
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigate = useNavigate();
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');


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
          ID: product.ID,
          title: product.title
        })));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setSuggestions([]);
    }
  };

  const fetchBestSeller = async () => {
    try {
      const response = await fetch(`${basePath}api/getProduct/frontend/bestSellerProduct.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();
      if (data && data.results && data.results.product) {
        setSuggestions(data.results.product.map((product: any) => ({
          ID: product.oipID,
          title: product.oiTitle
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
    if(value.length < 3){
      fetchBestSeller();
    }else{
      fetchProductData(value);
    }
  };

  const handleSuggestionClick = (product: ProductSuggestion) => {
    setSearchTerm(product.title);
    setSuggestions([]);
    navigate(`/page-search?q=${encodeURIComponent(product.title)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    setSuggestions([]);
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/page-search?q=${encodeURIComponent(searchTerm)}`);
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

  const renderSearchForm = () => {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex-1 py-2 text-slate-900 dark:text-slate-100 relative"
      >
        <div className="sm:h-14 bg-slate-200 dark:bg-slate-800 flex items-center space-x-1.5 px-5 lg:h-10 mt-3 rounded placeholder-white::placeholder">
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
          <input
            ref={inputRef}
            type="text"
            placeholder="ค้นหาชื่อสินค้า"
            className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-base"
            autoFocus
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
          <button type="submit" className="hidden">Search</button>
        </div>
        {isInputFocused && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-neutral-900 border border-gray-300 mt-1 max-h-60 overflow-y-auto w-full">
            {searchTerm.length < 3 &&(
            <p className="px-4 py-2 font-semibold">สินค้าขายดี</p>
            )}

            
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.ID}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </form>
    );
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
  const renderSearchForm2 = () => {
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
                key={suggestion.ID}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </form>
    );
  };

  const renderMobileSearchForm = () => {
    if (showMobileSearchForm) {
      return (
        <div className="relative -top-4 left-0 w-full bg-white dark:bg-neutral-900 z-20">
          {renderSearchForm2()}  {/* แสดงฟอร์มค้นหาตรงนี้ */}
        </div>
      );
    }
    return null;
  };



  // เนื้อหาของคอนเทนต์
  const renderContent = () => {
    return (
      <div className="transition-all duration-300">
        <div className="h-20 flex justify-between">
          <div className="flex items-center lg:hidden flex-1">
            <MenuBar />
          </div>
          <div className="lg:flex-1 flex items-center">
            <Logo className="flex-shrink-0" />
          </div>

          <div className="flex-[2] hidden lg:flex justify-center mx-4">
            {showSearchForm ? renderSearchForm() : <Navigation />}
          </div>

          <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
            {!showSearchForm && (
              <button
                className="hidden lg:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center"
                onClick={() => setShowSearchForm(!showSearchForm)}
              >
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
              </button>
            )}
            <div className="block lg:hidden mb-0.5">
              <button
                onClick={() => setShowMobileSearchForm(!showMobileSearchForm)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
              >
                {showMobileSearchForm ? (
                  // ไอคอนกากบาท
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                ) : (
                  // ไอคอนแว่นขยาย
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
                )}
              </button>
            </div>

            <div className="hidden lg:block"><AvatarDropdown /></div>
            <Whitlist />
            <CartDropdown />
            <div className="mr-[0.4rem] md:ml-4">
              <LangDropdown />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-MainNav2Logged z-10 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700 shadow-md  dark:shadow-slate-900 transition-transform duration-300">
      <div className="container">
        {renderContent()}
        {renderMobileSearchForm()}
      </div>
    </div>
  );
};

export default MainNav2Logged;
