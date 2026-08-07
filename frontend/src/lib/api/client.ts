const DEFAULT_API_URL = "http://127.0.0.1:8000";
const REMOTE_API_URL = "https://aroma-eovs-codes.onrender.com";

function getDefaultApiUrl() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
      return DEFAULT_API_URL;
    }
  }

  return REMOTE_API_URL;
}

const apiUrlRaw = process.env.NEXT_PUBLIC_API_URL?.trim() || getDefaultApiUrl();
const normalizedApiUrl = apiUrlRaw.replace(/\/$/, "").replace(/^http:\/\/localhost(:|$)/, "http://127.0.0.1$1");
const API_URL = normalizedApiUrl;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("aroma_access_token");
  localStorage.removeItem("aroma_user");
  window.dispatchEvent(new Event("aroma-auth-changed"));
}

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = typeof globalThis.atob === "function" ? globalThis.atob(padded) : "";
    return decoded ? JSON.parse(decoded) : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() >= payload.exp * 1000;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("aroma_access_token");
  if (!token) return null;
  // This function is also used by React's external-store snapshot during
  // rendering. It must stay read-only: dispatching an auth event here causes
  // a synchronous update while Navbar is rendering.
  return isTokenExpired(token) ? null : token;
}

function buildUrl(path: string) {
  const normalizedBase = API_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(buildUrl(path), { ...init, headers, signal: controller.signal });
    if (!response.ok) {
      const body = await response.json().catch(async () => {
        const text = await response.text().catch(() => "");
        return { detail: text || "Request failed" };
      });
      const errorMessage = body?.detail ?? body?.message ?? "Request failed";
      console.error("API request failed:", { path, status: response.status, body, init });
      if (response.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        clearStoredAuth();
        window.location.assign("/auth/login?reason=session-expired");
      }
      throw new ApiError(errorMessage, response.status);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("API error:", error.message, { path, status: error.status, init });
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      console.error("API request timed out:", { path, init });
      throw new ApiError("Request timed out while contacting the backend", 504);
    }
    console.error("API network failure:", error, { path, init });
    const message = error instanceof Error ? error.message : "Unable to reach the backend server. Please ensure it is running.";
    throw new ApiError(message, 0);
  } finally {
    clearTimeout(timeout);
  }
}

export { API_URL };
