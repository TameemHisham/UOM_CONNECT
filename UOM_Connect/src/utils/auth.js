// src/utils/auth.js
import { getCurrentUser } from "../api/auth";

export const checkAuth = async () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) return false;

  try {
    await getCurrentUser(token);
    return true;
  } catch {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};
export const saveToken = (token) => localStorage.setItem("token", token);

export const clearToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};
