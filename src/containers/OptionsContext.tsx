import React, { createContext, useContext, useEffect, useState } from 'react';


// Interface สำหรับข้อมูล API ที่ได้รับ
interface ApiData {
  opName: string;
  opValue: string;
}

// Interface สำหรับ Context Type
interface OptionsContextType {
  options: ApiData[] | null;
  foundSystemValue: string | null;
  getOptionByName: (opName: string) => string | null;  // ฟังก์ชันสำหรับการค้นหาค่าจาก opName
}

// สร้าง Context
const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

// Hook สำหรับการใช้งาน Context
export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within an OptionsProvider");
  }
  return context;
};

// Provider สำหรับการใช้งาน Context
export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<ApiData[] | null>(null);
  const [foundSystemValue, setFoundSystemValue] = useState<string | null>(null);

  // ฟังก์ชันสำหรับดึงข้อมูลค่าโดยใช้ opName
  const getOptionByName = (opName: string): string | null => {
    if (!options) return null;
    const option = options.find((item) => item.opName === opName);
    return option ? option.opValue : null;
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (window.location.hostname === 'localhost') {
          var pathOption = 'https://localhost/ponchaishop/api/options/';
        }else{
          var pathOption = 'https://ponchaishop.com/api/options/';
        }
        const response = await fetch(pathOption, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();
        setOptions(data.results.options);

        // ค้นหาค่า systemName และตั้งค่า foundSystemValue
        const systemNameOption = data.results.options.find((item: ApiData) => item.opName === 'systemName');
        if (systemNameOption) {
          setFoundSystemValue(systemNameOption.opValue);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <OptionsContext.Provider value={{ options, foundSystemValue, getOptionByName }}>
      {children}
    </OptionsContext.Provider>
  );
};
