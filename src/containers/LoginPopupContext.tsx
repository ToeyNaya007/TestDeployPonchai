import Cookies from "js-cookie";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { logoutFromLine } from "utils/liff";
import { useCustomer } from "containers/CustomerContext";

interface LoginPopupContextType {
    showLoginPopup: boolean;
    setShowLoginPopup: (show: boolean) => void;
}

const LoginPopupContext = createContext<LoginPopupContextType | undefined>(undefined);

export const LoginPopupProvider = ({ children }: { children: ReactNode }) => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const { setCustomer } = useCustomer();

    useEffect(() => {
        if (showLoginPopup) {
            (async () => {
                await logoutFromLine();
                Cookies.remove("ponchaishop_userID");
                Cookies.remove("ponchaishop_logged");
                Cookies.remove("redirectPath");
                setCustomer(null);
            })();
        }
    }, [showLoginPopup])

    return (
        <LoginPopupContext.Provider value={{ showLoginPopup, setShowLoginPopup }}>
            {children}
        </LoginPopupContext.Provider>
    );
};

// Hook ใช้งาน Context
export const useLoginPopup = () => {
    const context = useContext(LoginPopupContext);
    if (!context) {
        throw new Error("useLoginPopup must be used within a LoginPopupProvider");
    }
    return context;
};
