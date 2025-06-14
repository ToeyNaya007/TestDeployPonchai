import AddressSelector from 'components/AddressSelector';
import React from 'react';

const options = [
  { id: 1, label: 'รับที่ร้าน', value: 'pickup' },
  { id: 2, label: 'จัดส่งตามที่อยู่', value: 'delivery' },
];

interface DeliveryOptionProps {
  setDeliveryFee: React.Dispatch<React.SetStateAction<number>>;
  togglePopup: () => void;
  onAddressSelect: (addressID: string) => void;
  onDeliveryOptionChange: (id: number) => void; // ส่ง id แทน value
}

const DeliveryOption: React.FC<DeliveryOptionProps> = ({ setDeliveryFee, togglePopup, onAddressSelect, onDeliveryOptionChange }) => {
  const [selectOptionsDelivery, setSelectOptionsDelivery] = React.useState<number>(1); // ใช้ id เป็นค่าเริ่มต้นแทน value

  const handlePaymentSelect = (id: number, value: string) => {
    setSelectOptionsDelivery(id);
    onDeliveryOptionChange(id); // ส่ง id กลับไปยัง CartPage
    if (value === 'pickup') {
      setDeliveryFee(0);
      onAddressSelect(''); // ล้าง addressID
    } else {
      setDeliveryFee(100);
    }
  };

  return (
    <div>
      <h3 className="block text-lg font-semibold text-gray-700 mb-2 dark:text-slate-300">
        ตัวเลือกการจัดส่ง
      </h3>
      <div className="flex justify-between mt-2 mb-10 space-x-3 sm:space-x-4">
        {options.map((method) => (
          <div
            key={method.id}
            className={`flex-1 p-2 rounded-md cursor-pointer shadow-md ${
              selectOptionsDelivery === method.id
                ? 'border-2 border-green-500 bg-white dark:bg-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800'
            }`}
            onClick={() => handlePaymentSelect(method.id, method.value)} // ส่ง id และ value
          >
            <label className="flex items-center">
              <input
                type="radio"
                name="optionsDelivery"
                value={method.value}
                checked={selectOptionsDelivery === method.id}
                onChange={() => handlePaymentSelect(method.id, method.value)} // ส่ง id และ value
                className="form-radio h-4 w-4 text-blue-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className="ml-2 font-normal">{method.label}</span>
            </label>
          </div>
        ))}
      </div>
      {selectOptionsDelivery === 2 && <AddressSelector togglePopup={togglePopup} onAddressSelect={onAddressSelect} />}
    </div>
  );
};

export default DeliveryOption;
