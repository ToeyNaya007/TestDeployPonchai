import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import { setHours, setMinutes, addDays, set } from "date-fns";

registerLocale("th", th);

const options = [
  { id: 1, label: "รับทันที", value: "now" },
  { id: 2, label: "เลือกเวลาจัดส่ง", value: "schedule" },
];

const DeliveryTimeOptions = ({ onDeliveryDateTimeChange, onOptionSelect, }: { onDeliveryDateTimeChange: (date: Date | null) => void; onOptionSelect: (id: number) => void; }) => {
  const [selectedOption, setSelectedOption] = useState<string>("now");
  const [DeliveryType, setDeliveryType] = useState<number>();
  const [deliveryDateTime, setDeliveryDateTime] = useState<Date | null>(null);

  const handleOptionSelect = (value: string,id: number) => {
    setSelectedOption(value);
    onOptionSelect(id);
    if (value === "now") {
      setDeliveryDateTime(null);
      onDeliveryDateTimeChange(null); // ส่งค่ากลับไปที่แม่
    } else if (value === "schedule") {
      const now = new Date();
      setDeliveryDateTime(now);
      onDeliveryDateTimeChange(now); // ส่งค่ากลับไปที่แม่
    }
  };

  return (
    <div className="mb-8">
      <h3 className="block text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4">ตัวเลือกเวลาจัดส่ง</h3>
      <div className="flex justify-between space-x-3 sm:space-x-4">
        {options.map((option) => (
          <div
            key={option.value}
            className={`flex-1 p-2 rounded-md cursor-pointer shadow-md transition ${selectedOption === option.value ? "border-2 border-green-500 bg-white dark:bg-slate-900" : "bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800"}`}
            onClick={() => handleOptionSelect(option.value, option.id)}
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="deliveryOption"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={() => handleOptionSelect(option.value, option.id)}
                className="form-radio h-4 w-4 text-blue-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className="ml-2 font-normal">{option.label}</span>
            </label>
          </div>
        ))}
      </div>

      {selectedOption === "schedule" && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">เลือกวันที่และเวลาจัดส่ง (24 ชั่วโมง):</label>
          <DatePicker
            selected={deliveryDateTime}
            onChange={(date) => {
              setDeliveryDateTime(date);
              onDeliveryDateTimeChange(date); // ส่งค่ากลับไปที่แม่
            }}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeIntervals={30}
            locale="th"
            minDate={new Date()}
            maxDate={addDays(new Date(), 3)}
            minTime={setHours(setMinutes(new Date(), 0), 8)}
            maxTime={setHours(setMinutes(new Date(), 0), 18)}
            className="w-full p-2 border rounded-md cursor-pointer shadow-md dark:bg-gray-800"
            calendarClassName="rounded-md shadow-lg"
            dayClassName={() => "hover:bg-green-200"}
            timeClassName={() => "hover:bg-green-200"}
          />
        </div>
      )}

      {deliveryDateTime && selectedOption === "schedule" && (
        <p className="mt-4 text-sm text-green-600">
          วันที่และเวลาที่เลือกจัดส่ง: <strong>{deliveryDateTime.toLocaleString("th-TH", { hour12: false })}</strong>
        </p>
      )}
    </div>
  );
};

export default DeliveryTimeOptions;
