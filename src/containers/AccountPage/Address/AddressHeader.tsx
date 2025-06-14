import React from "react";
import ButtonSecondary from "shared/Button/ButtonSecondary";

interface AddressHeaderProps {
    isOpen: boolean;
    onToggle: () => void;
    phoneNumber: string;
    addressName: string;
    addressLastname: string;
    displayAddress: string;
    isMainAddress: boolean;
}

const AddressHeader: React.FC<AddressHeaderProps> = ({ isOpen, onToggle, phoneNumber, addressName, addressLastname, displayAddress, isMainAddress }) => {
    return (
        <div className="flex justify-between items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
            <div className="">
                <div className="flex items-center gap-2">
                    <p className="text-md font-semibold">ที่อยู่จัดส่ง  </p>
                    {isMainAddress ? <span className="rounded-md bg-green-500 py-[2px] px-2 text-sm font-medium text-white">ที่อยู่หลัก</span> : ""}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                    {addressName} {addressLastname}
                    <span className="pl-2">{phoneNumber}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                    {displayAddress}
                </p>
            </div>
                <ButtonSecondary
                    sizeClass="py-2.5 px-4 sm:px-6"
                    fontSize="text-sm font-medium"
                    onClick={onToggle}
                >
                    {isOpen ? "ซ่อนที่อยู่" : "แก้ไขที่อยู่"}
                </ButtonSecondary>
               
        </div>
    );
};

export default AddressHeader;