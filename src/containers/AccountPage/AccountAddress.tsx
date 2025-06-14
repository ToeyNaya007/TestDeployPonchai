import React, { useState, useEffect } from "react";
import CommonLayout from "./CommonLayout";
import PopupAdd from "./PopupAdd";
import { useOptions } from "containers/OptionsContext";
import AddressHeader from "./Address/AddressHeader";
import AddressForm from "./Address/AddressForm";
import AddressOptions from "./Address/AddressOptions";
import { useCartContext } from "containers/CartContext";
import Cookies from "js-cookie";
import { checkAuthNow } from "utils/checkAuthNow";
import { useLoginPopup } from "containers/LoginPopupContext";

interface Address {
  addressID: string;
  addressName: string;
  addressLastname: string;
  phoneNumber: number;
  phoneNumber2: number;
  addressNo: string;
  addressVillage: string;
  addressSubDistrict: string;
  addressDistrict: string;
  addressProvince: string;
  addressZIPCode: string;
  addressNote: string;
  isMainAddress: boolean;
  display_address: string;
}

const AccountAddress = () => {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const { addressCount, setAddressCount } = useCartContext();

  const userID = Cookies.get("ponchaishop_userID") || "";
  const orderby = "isMainAddress";

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAddressId, setExpandedAddressId] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { showLoginPopup, setShowLoginPopup } = useLoginPopup();


  useEffect(() => {
    if (!basePath) return;
    if (basePath && userID) {
      fetchAddresses();
    } else {
      window.location.href = "/login";
    }
  }, [userID, basePath, addressCount]);

  const fetchAddresses = async () => {
    try {
      if (!basePath) return;
      const isAuthenticated = await checkAuthNow(basePath);
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      setLoading(true);
      const response = await fetch(`${basePath}api/address/frontend/getAddressByID.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // ใช้ Content-Type ที่เป็น simple request
        },
        body: new URLSearchParams({ customerID: userID, orderby: orderby }).toString(), // ส่งข้อมูลในรูปแบบ URL-encoded
      });

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();

      // ตรวจสอบและดึงค่าตามโครงสร้าง results.addresses[0]
      const addressData = data.results?.addresses || []; // ดึงที่อยู่จาก API
      setAddresses(Array.isArray(addressData) ? addressData : []);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };



  const toggleAddressDetails = (addressId: string) => {
    setExpandedAddressId(expandedAddressId === addressId ? null : addressId);
  };

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading addresses: {error}</p>
        <button
          onClick={fetchAddresses}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          <div className="flex justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold">ที่อยู่สำหรับจัดส่ง</h2>
            <button
              className="flex gap-2 items-center"
              onClick={togglePopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg>
              เพิ่มที่อยู่ใหม่
            </button>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse space-y-5">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.addressID}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-md"
                >
                  <AddressHeader
                    isOpen={expandedAddressId === address.addressID}
                    onToggle={() => toggleAddressDetails(address.addressID)}
                    phoneNumber={address.phoneNumber.toString()}
                    addressName={address.addressName}
                    addressLastname={address.addressLastname}
                    displayAddress={address.display_address}
                    isMainAddress={address.isMainAddress}
                  />

                  {expandedAddressId === address.addressID && (
                    <AddressForm
                      {...address}
                      onToggle={() => toggleAddressDetails(address.addressID)}
                      isMainAddress={address.isMainAddress}
                      addressID={address.addressID}
                      addressName={address.addressName}
                      addressLastname={address.addressLastname}
                      phoneNumber={address.phoneNumber}
                      phoneNumber2={address.phoneNumber2}
                      addressNo={address.addressNo}
                      addressVillage={address.addressVillage}
                      addressSubDistrict={address.addressSubDistrict}
                      addressDistrict={address.addressDistrict}
                      addressProvince={address.addressProvince}
                      addressZIPCode={address.addressZIPCode}
                      addressNote={address.addressNote}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {isPopupOpen && (
          <PopupAdd
            togglePopup={togglePopup}
            isOpen={isPopupOpen}
          />
        )}
      </CommonLayout>
    </div>
  );
};

export default AccountAddress;