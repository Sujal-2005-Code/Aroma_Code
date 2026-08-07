import { api, getAccessToken } from "@/lib/api/client";
import { useEffect, useSyncExternalStore } from "react";

export type AuthUser = { full_name: string; email: string; role: "student" | "admin" | "recruiter" };

type LoginResponse = { access_token: string; role: AuthUser["role"]; full_name: string };

const AUTH_CHANGED_EVENT = "aroma-auth-changed";

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export async function login(email: string, password: string) {
  const result = await api<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("aroma_access_token", result.access_token);
  localStorage.setItem("aroma_user", JSON.stringify({ email, full_name: result.full_name, role: result.role }));
  notifyAuthChanged();
  return result;
}

export async function register(full_name: string, email: string, password: string, role: "student" | "recruiter") {
  return api<{ message: string; user_id: string }>("/register", {
    method: "POST",
    body: JSON.stringify({ full_name, email, password, role }),
  });
}

export function currentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  if (!token) return null;
  const raw = localStorage.getItem("aroma_user");
  try { return raw ? JSON.parse(raw) as AuthUser : null; } catch { return null; }
}

export function logout() {
  localStorage.removeItem("aroma_access_token");
  localStorage.removeItem("aroma_user");
  notifyAuthChanged();
}

let cachedUserRaw: string | null | undefined;
let cachedUserParsed: AuthUser | null = null;

function getCurrentUserSnapshot(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  if (!token) return null;
  const raw = localStorage.getItem("aroma_user");
  if (raw === cachedUserRaw) return cachedUserParsed;
  cachedUserRaw = raw;
  if (!raw) {
    cachedUserParsed = null;
    return null;
  }
  try {
    cachedUserParsed = JSON.parse(raw) as AuthUser;
    return cachedUserParsed;
  } catch {
    cachedUserParsed = null;
    return null;
  }
}

function subscribeAuth(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(AUTH_CHANGED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useCurrentUser() {
  const user = useSyncExternalStore(subscribeAuth, getCurrentUserSnapshot, () => null);

  useEffect(() => {
    // Expired credentials are removed after commit, never from the render-time
    // external-store snapshot used by Navbar.
    if (!getAccessToken() && localStorage.getItem("aroma_access_token")) {
      logout();
    }
  }, []);

  return user;
}

export async function sendOtp(email: string, purpose: "email_verification" | "password_reset" = "email_verification") {
  return api<{ message: string; purpose: string }>("/send-otp", {
    method: "POST",
    body: JSON.stringify({ email, purpose }),
  });
}

export async function verifyOtp(email: string, otp: string, purpose: "email_verification" | "password_reset" = "email_verification") {
  return api<{ message: string; purpose: string }>("/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp, purpose }),
  });
}
