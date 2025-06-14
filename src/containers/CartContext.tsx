import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContext {
  cartCount: number;
  addressCount : number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  setAddressCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContext | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0); // ตัวเลขที่คุณใช้สำหรับ rerender
  const [addressCount, setAddressCount] = useState(0); // ตัวเลขที่คุณใช้สำหรับ rerender

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, addressCount, setAddressCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
