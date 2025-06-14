import Cookies from "js-cookie";

class Auth {
    private basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }
    async isAuthenticated(): Promise<boolean> {
        const userID = Cookies.get("ponchaishop_userID") || "";
        const token = Cookies.get("ponchaishop_logged") || "";

        if (!userID || !token) return false;

        try {
            const payload = { userID, token };
            const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

            const response = await fetch(`${this.basePath}api/auth/frontend/checkAuth.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `data=${encodeURIComponent(encodedData)}`
            });

            const data = await response.json();
            if (data.status !== 200) {
                Cookies.remove("ponchaishop_userID");
                Cookies.remove("ponchaishop_logged");
                window.location.href = `/login`;
                return false;
            }
            return data.status === 200;
        } catch (error) {
            console.error("❌ Authentication error:", error);
            return false;
        }
    }
}

export default Auth;
