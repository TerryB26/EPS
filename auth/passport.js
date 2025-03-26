import { getToken, getUser, clearSession } from "@/auth/session";
import jwtDecode from "jwt-decode";

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      clearSession();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    clearSession();
    return false;
  }
};

export const getCurrentUser = () => {
  return getUser();
};

export const logout = () => {
  clearSession();
};
