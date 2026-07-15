import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The original 2016 app is kept for reference only; don't lint it.
    "legacy/**",
    // Hand-rolled service worker runs in a Worker context, not Next.
    "public/sw.js",
  ]),
]);

export default eslintConfig;
