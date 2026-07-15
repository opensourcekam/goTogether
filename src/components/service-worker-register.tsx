"use client";

import { useEffect } from "react";

/**
 * Registers the hand-rolled service worker (`/public/sw.js`) that provides the
 * offline app shell. Registration only runs in production so `pnpm dev` isn't
 * disrupted by aggressive caching.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    };

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
