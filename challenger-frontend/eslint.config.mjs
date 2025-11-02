import { defineConfig, globalIgnores } from "eslint/config";
import nextBase from "eslint-config-next";
import nextVitals from "eslint-config-next/core-web-vitals";
import js from "@eslint/js"; 

const eslintConfig = defineConfig([
  js.configs.recommended,

  nextBase,
  ...nextVitals,

  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;