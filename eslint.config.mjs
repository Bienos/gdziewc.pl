import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", ".next-*/**", "db/migrations/**/*.js", "next-env.d.ts", "node_modules/**", "playwright-report/**", "public/maplibre/**", "test-results/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextPlugin.flatConfig.coreWebVitals,
);
