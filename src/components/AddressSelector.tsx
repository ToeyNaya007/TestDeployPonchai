import Cookies from 'js-cookie';
import { useOptions } from '../containers/OptionsContext';
import React, { useEffect, useState } from 'react';

interface AddressSelectorProps {
  togglePopup: () => void;
  onAddressSelect: (addressID: string) => void;
}

type Address = {
  addressID: string;
  display_address: string;
  isMainAddress: boolean;
  display_name: string;
  phoneNumber: string;
};

const AddressSelector: React.FC<AddressSelectorProps> = ({ togglePopup, onAddressSelect }) => {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userID = Cookies.get("ponchaishop_userID") || "";
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (basePath) {
      const fetchAddresses = async () => {
        try {
          const response = await fetch(`${basePath}api/address/frontend/getAddressByID.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // ใช้ Content-Type ที่เป็น simple request
            },
            body: `customerID=${userID}`, // ส่งข้อมูลในรูปแบบ URL-encoded
          });
          const result = await response.json();
          if (result.status === 200 && result.results && Array.isArray(result.results.addresses)) {
            setAddresses(result.results.addresses);
            const mainAddress = result.results.addresses.find((addr: Address) => addr.isMainAddress);
            if (mainAddress) {
              setSelectedAddress(mainAddress.display_address);
              onAddressSelect(mainAddress.addressID);
            }
          } else {
            console.error("Invalid data format:", result);
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      };

      fetchAddresses();
    }
  }, [userID, basePath]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setDropdownOpen(false);
    // ส่ง addressID กลับไปยัง parent component
    const addressID = addresses.find(addr => addr.display_address === address)?.addressID || "";
    onAddressSelect(addressID);
  };

  return (
    <div className="w-full mx-auto relative mb-3">
      <div className='flex justify-between mb-2'>
        <h3 className="block text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
          เลือกที่อยู่
        </h3>
        <button onClick={togglePopup} className='flex text-base font-normal items-center gap-2 p-1 px-2 text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors duration-300'>เพิ่มที่อยู่ใหม่
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill text-lg" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
          </svg>
        </button>

      </div>

      <div
        className="flex justify-between items-center border border-gray-300 rounded-md shadow-sm p-3 cursor-pointer bg-white dark:bg-slate-800"
        onClick={toggleDropdown}
      >
        <span className='lg:w-[85%]'>{selectedAddress || "กรุณาเลือกที่อยู่"}</span>
        {dropdownOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill text-gray-500 text-lg" viewBox="0 0 16 16">
            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill text-gray-500 text-lg" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        )}
      </div>
      {dropdownOpen && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-600 border border-gray-300 rounded-md shadow-lg z-10">
          {addresses.length === 0 && (
            <div className="p-2 text-sm text-gray-500">ไม่มีที่อยู่ให้เลือก</div>
          )}
          {addresses.map((address) => (
            <div
              key={address.addressID}
              className={`p-3 py-3 my-1 cursor-pointer text-sm text-gray-600 dark:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 ${address.isMainAddress ? "font-semibold" : ""} ${selectedAddress === address.display_address ? "bg-gray-200 dark:bg-gray-700" : "dark:bg-gray-600"}`}
              onClick={() => handleAddressSelect(address.display_address)}
            >
              {address.isMainAddress ? "(ที่อยู่หลัก) " : ""}
              {address.display_address}
            </div>
          ))}
        </div>
      )}
      {selectedAddress && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-600 shadow-md">
          <div className="mt-2 ">
            <p className="text-sm font-medium text-gray-900 mb-2 dark:text-gray-200">ที่อยู่ที่เลือก:</p>
            <p className="text-sm text-gray-700 mb-2 dark:text-gray-200">{addresses.find(addr => addr.display_address === selectedAddress)?.display_name || ""}  {addresses.find(addr => addr.display_address === selectedAddress)?.phoneNumber || ""}</p>
            <p className="text-sm text-gray-700 dark:text-gray-200">{selectedAddress}</p>
            <p className="text-sm text-gray-700 dark:text-gray-200"></p>
          </div>
        </div>
      )}
    </div>

  );
};

export default AddressSelector;
