import React from "react";

interface AddressOptionsProps {
  selectedOption: string;
  onOptionChange: (value: string) => void;
  isMainAddress: boolean;
}

const addressOptions = [
  {
    value: 'mainAddress',
    label: 'ที่อยู่หลัก',
    description: 'เลือกที่อยู่นี้อัตโนมัติ',
  },
  {
    value: 'addressOther',
    label: 'ที่อยู่อื่นๆ',
    description: 'เพิ่มตัวเลือกที่อยู่นี้',
  }
];

const AddressOptions: React.FC<AddressOptionsProps> = ({ selectedOption, onOptionChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onOptionChange(event.target.value);
  };

  return (
    <div>
      <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">
        ตั้งค่าที่อยู่นี้
      </label>
      <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {addressOptions.map((option) => (
          <div key={option.value} className="flex items-center text-sm sm:text-base">
            <input
              id={`Address-type-${option.value}`}
              name="Address-type"
              type="radio"
              className="text-primary-500 rounded-full border-slate-400 dark:border-slate-700 w-6 h-6 focus:ring-0 focus:ring-offset-0"
              value={option.value}
              checked={selectedOption === option.value}
              onChange={handleChange}
            />
            <label
              htmlFor={`Address-type-${option.value}`}
              className="pl-2.5 sm:pl-3 block text-slate-900 dark:text-slate-100"
            >
              {option.label} <span className="font-light">({option.description})</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressOptions;
