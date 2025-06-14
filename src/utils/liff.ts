import liff from "@line/liff";

const LIFF_ID = '2007509370-8pEo7OzK';

let liffReady = false;

export const initLiff = async () => {
  if (!LIFF_ID) {
    console.error("❌ LIFF ID is missing. Check your .env file.");
    return;
  }

  if (!liffReady) {
    try {
      await liff.init({ liffId: LIFF_ID });
      liffReady = true;
    } catch (err) {
      //console.error("❌ LIFF Initialization failed", err);
      liffReady = false;
    }
  }
};

export const isLoggedIn = () => {
  return liffReady && liff.isLoggedIn();
};

export const getUserProfile = async () => {
  if (liffReady && liff.isLoggedIn()) {
    return await liff.getProfile();
  }
  return null;
};

export const loginWithLine = async () => {
  if (!liffReady) {
    await initLiff();
  }
  if (!liff.isLoggedIn()) {
    liff.login();
  }
};

export const logoutFromLine = () => {
  if (liffReady && liff.isLoggedIn()) {
    liff.logout();
  } else {
    console.warn("❌ LIFF SDK not initialized or not logged in yet.");
  }
};
