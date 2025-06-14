import liff from "@line/liff";

const LIFF_ID = process.env.REACT_APP_LIFF_ID;

export const initLiff = async () => {
  if (!LIFF_ID) {
    console.error("❌ LIFF ID is missing. Check your .env file.");
    return;
  }

  try {
    await liff.init({ liffId: LIFF_ID });
  } catch (err) {
    console.error("❌ LIFF Initialization failed", err);
  }
};

export const isLoggedIn = () => {
  return liff.isLoggedIn();
};

export const getUserProfile = async () => {
  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    return profile;
  }
  return null;
};

export const loginWithLine = () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
};

export const logoutFromLine = () => {
  if (liff.isLoggedIn()) {
    liff.logout();
    window.location.reload(); // รีเฟรชหน้าหลังจากล็อกเอาต์
  }
};


