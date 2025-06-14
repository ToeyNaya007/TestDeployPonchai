// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface UserContextProps {
  isLoggedInState: boolean;
  setIsLoggedInState: (value: boolean) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedInState, setIsLoggedInState] = useState(false);

  useEffect(() => {
    const loggedIn = true;
    setIsLoggedInState(loggedIn);
    if (!loggedIn) {
      // ทำการ logout Line และล้างคุกกี้
      Cookies.remove("ponchaishop_logged");
      Cookies.remove("ponchaishop_userID");
      Cookies.remove("redirectPath");
    }
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedInState, setIsLoggedInState }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
