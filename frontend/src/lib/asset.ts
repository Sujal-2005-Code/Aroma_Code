export default function asset(path: string) {
  // NEXT_PUBLIC_BASE_PATH can be set for deployments hosted at a sub-path.
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  // The original raster logo lived in an untracked public directory. Use the
  // App Router's tracked icon asset so it is always present in deployments.
  const resolvedPath = path === "/assets/aroma-logo.png" ? "/icon.svg" : path;
  // Ensure we don't double-up slashes
  if (!path) return base;
  if (base.endsWith("/") && resolvedPath.startsWith("/")) return base + resolvedPath.slice(1);
  return base + resolvedPath;
}
