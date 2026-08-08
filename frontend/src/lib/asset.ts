export default function asset(path: string) {
  // NEXT_PUBLIC_BASE_PATH can be set for deployments hosted at a sub-path.
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  // Ensure we don't double-up slashes
  if (!path) return base;
  if (base.endsWith("/") && path.startsWith("/")) return base + path.slice(1);
  return base + path;
}
