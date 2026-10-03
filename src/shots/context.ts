import { createContext, useContext, useEffect, useRef } from "react";

/** Optional lifecycle hooks a screen can register before it is captured. */
export type ShotHooks = {
  /** Resolve once everything inside the screen has finished loading. */
  ready?: () => Promise<void>;
  /** Called right before capture with the requested export scale. */
  prepare?: (scale: number) => Promise<void>;
};

type Registry = { register: (hooks: ShotHooks) => () => void };

export const ShotHooksContext = createContext<Registry | null>(null);

export function useShotHooks(hooks: ShotHooks) {
  const registry = useContext(ShotHooksContext);
  const latest = useRef(hooks);

  useEffect(() => {
    latest.current = hooks;
  });

  useEffect(() => {
    if (!registry) return;
    return registry.register({
      ready: () => latest.current.ready?.() ?? Promise.resolve(),
      prepare: (scale) => latest.current.prepare?.(scale) ?? Promise.resolve(),
    });
  }, [registry]);
}
