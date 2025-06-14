// src/context/CustomerContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface Customer {
  userID: string;
  profileImage: string;
  firstName: string;
  lastName: string;
}

interface CustomerContextType {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomerState] = useState<Customer | null>(null);

  // โหลดจาก cookie
  useEffect(() => {
    const cookieValue = Cookies.get('ponchaishop_customer');
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue);
        setCustomerState(parsed);
      } catch {
        Cookies.remove('ponchaishop_customer'); // หาก cookie เสีย
      }
    }
  }, []);

  const setCustomer = (customer: Customer | null) => {
    if (customer) {
      Cookies.set('ponchaishop_customer', JSON.stringify(customer), { expires: 7 }); // 🗓 เก็บไว้ 7 วัน
    } else {
      Cookies.remove('ponchaishop_customer');
    }
    setCustomerState(customer);
  };

  return (
    <CustomerContext.Provider value={{ customer, setCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
