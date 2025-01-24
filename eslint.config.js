import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": ["warn"],
      "react/no-unescaped-entities": "off",
    },
  },
  {
    plugins: {
      next: nextPlugin,
    },
  },
];

export default config;
