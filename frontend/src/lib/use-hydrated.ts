import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false during SSR and the initial hydration render, then true.
 *
 * This avoids an extra state update solely to detect that a client component
 * has mounted, while keeping server and client markup deterministic.
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
