import { createContext, useContext } from "react";

/**
 * When true, components render their final, motion-free state:
 * scroll reveals are visible, counters show their end value and live tickers pause.
 * Used by the HD screenshot export (`?shot=` pages).
 */
export const StaticModeContext = createContext(false);

export function useStaticMode(): boolean {
  return useContext(StaticModeContext);
}
