import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import jsdoc from "eslint-plugin-jsdoc";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  {
    ignores: ["out/**/*", ".next/**/*"],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ),
  ...compat.config({
    root: true,
    extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      next: nextPlugin,
      jsdoc: jsdoc,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": ["warn"],
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      ...nextPlugin.configs["recommended"].rules,
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: false,
            MethodDefinition: false,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: [
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "TSMethodSignature",
            "TSPropertySignature",
          ],
          exemptEmptyFunctions: true,
          checkConstructors: false,
          enableFixer: true,
          checkGetters: false,
          checkSetters: false,
          exemptEmptyConstructors: true,
          minLineCount: 15,
        },
      ],
      "jsdoc/require-param": [
        "warn",
        {
          exemptedBy: ["type"],
          checkRestProperty: false,
          checkDestructured: false,
          enableFixer: true,
          contexts: ["TSMethodSignature", "TSPropertySignature"],
        },
      ],
      "jsdoc/require-returns": [
        "warn",
        {
          exemptedBy: ["type"],
          checkGetters: false,
          enableFixer: true,
          contexts: ["TSMethodSignature", "TSPropertySignature"],
        },
      ],
      "jsdoc/require-param-type": "off",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-returns-description": "warn",
      "jsdoc/valid-types": "warn",
      "jsdoc/check-types": "off",
      "jsdoc/no-undefined-types": "off",
    },
    settings: {
      jsdoc: {
        mode: "typescript",
        tagNamePreference: {
          returns: "returns",
          augments: "extends",
        },
      },
      react: {
        version: "detect",
      },
    },
  },
];

export default config;
