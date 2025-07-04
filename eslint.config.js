import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import jsdoc from "eslint-plugin-jsdoc";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import promisePlugin from "eslint-plugin-promise";

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
  {
    files: ["components/ui/**/*.{ts,tsx}", "components/ui/chart.tsx"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:promise/recommended",
  ),
  ...compat.config({
    root: true,
    extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:promise/recommended",
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
      promise: promisePlugin,
    },
    rules: {
      // Stricter TypeScript rules for explicit types
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/typedef": [
        "error",
        {
          arrayDestructuring: false,
          arrowParameter: false,
          memberVariableDeclaration: false,
          objectDestructuring: false,
          parameter: false,
          propertyDeclaration: false,
          variableDeclaration: false,
          variableDeclarationIgnoreFunction: true,
        },
      ],
      "@typescript-eslint/no-inferrable-types": "off",

      // Promise-related rules
      "promise/always-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-native": "off",
      "promise/no-nesting": "warn",
      "promise/no-promise-in-callback": "warn",
      "promise/no-callback-in-promise": "warn",
      "promise/avoid-new": "off",
      "promise/no-new-statics": "error",
      "promise/no-return-in-finally": "warn",
      "promise/valid-params": "warn",
      "promise/prefer-await-to-then": "warn",
      "promise/prefer-await-to-callbacks": "warn",

      // Stricter unused declarations
      "no-unused-expressions": "error",
      "no-unused-labels": "error",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
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
