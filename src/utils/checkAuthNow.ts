import Auth from "utils/Auth";

export const checkAuthNow = async (basePath: string) => {
  const auth = new Auth(basePath);
  return await auth.isAuthenticated();
};