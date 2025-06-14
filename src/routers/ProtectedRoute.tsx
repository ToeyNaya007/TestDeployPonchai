import liff from "@line/liff";
import { useOptions } from "containers/OptionsContext";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "utils/liff";
import LoadingContent from "components/LoadingContent";
import LoginNotifyPopup from "components/LoginNotifyPopup";
import { useLoginPopup } from "containers/LoginPopupContext";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const userID = Cookies.get("ponchaishop_userID") || "";
    const token = Cookies.get("ponchaishop_logged") || "";
    const navigate = useNavigate();
    const { showLoginPopup, setShowLoginPopup } = useLoginPopup();

    useEffect(() => {
        if (isAuthenticated === false) {
            const timer = setTimeout(() => {
                window.location.href = "/login";
            }, 7000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!basePath) return;
        const checkAuthentication = async () => {
            try {
                const payload = { userID, token };
                const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

                const response = await fetch(`${basePath}api/auth/frontend/checkAuth.php`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `data=${encodeURIComponent(encodedData)}`,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    setShowLoginPopup(true);
                    if (isLoggedIn()) {
                        liff.logout();
                    }
                }
            } catch (error) {
                console.error("Authentication error:", error);
                setIsAuthenticated(false);
                setShowLoginPopup(true);
            }
        };

        checkAuthentication();
    }, [basePath, userID, token]);

    if (isAuthenticated === null) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated && showLoginPopup) {
        return (
            <div className="container mx-auto">
                <LoadingContent />
                <LoginNotifyPopup />
            </div>
        );
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
