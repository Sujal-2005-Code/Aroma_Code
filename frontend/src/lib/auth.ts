import { api } from "@/lib/api/client";

export type AuthUser = { full_name: string; email: string; role: "student" | "admin" | "recruiter" };

type LoginResponse = { access_token: string; role: AuthUser["role"]; full_name: string };

export async function login(email: string, password: string) {
  const result = await api<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("aroma_access_token", result.access_token);
  localStorage.setItem("aroma_user", JSON.stringify({ email, full_name: result.full_name, role: result.role }));
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
  const raw = localStorage.getItem("aroma_user");
  try { return raw ? JSON.parse(raw) as AuthUser : null; } catch { return null; }
}

export function logout() {
  localStorage.removeItem("aroma_access_token");
  localStorage.removeItem("aroma_user");
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
