import js from "@eslint/js";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
import jsdoc from "eslint-plugin-jsdoc";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import promisePlugin from "eslint-plugin-promise";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// Standard ESM import now works with the fixed package v1.2.0
import customReactPlugin from "@mherod/eslint-plugin-custom/react";

const config = [
  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
      "public/sw.js",
    ],
  },

  // Base JavaScript config
  js.configs.recommended,

  // UI components - relaxed rules
  {
    files: ["components/ui/**/*.{ts,tsx}", "components/ui/chart.tsx"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Test files - Jest globals
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Main config for all files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.serviceworker,
        React: "readonly",
        JSX: "readonly",
        NotificationPermission: "readonly",
        NotificationOptions: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@next/next": nextPlugin,
      jsdoc: jsdoc,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      promise: promisePlugin,
      "@mherod/react": customReactPlugin,
    },
    rules: {
      // Next.js recommended rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // TypeScript recommended rules
      ...tseslint.configs.recommended.rules,

      // React recommended rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,

      // React Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,

      // Promise rules
      ...promisePlugin.configs.recommended.rules,

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
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
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
      "promise/no-nesting": "error",
      "promise/no-promise-in-callback": "error",
      "promise/no-callback-in-promise": "error",
      "promise/avoid-new": "off",
      "promise/no-new-statics": "error",
      "promise/no-return-in-finally": "error",
      "promise/valid-params": "error",
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

      // React rules
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",

      // JSDoc rules
      "jsdoc/require-jsdoc": [
        "error",
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
        "error",
        {
          exemptedBy: ["type"],
          checkRestProperty: false,
          checkDestructured: false,
          enableFixer: true,
          contexts: ["TSMethodSignature", "TSPropertySignature"],
        },
      ],
      "jsdoc/require-returns": [
        "error",
        {
          exemptedBy: ["type"],
          checkGetters: false,
          enableFixer: true,
          contexts: ["TSMethodSignature", "TSPropertySignature"],
        },
      ],
      "jsdoc/require-param-type": "off",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-returns-description": "error",
      "jsdoc/valid-types": "error",
      "jsdoc/check-types": "off",
      "jsdoc/no-undefined-types": "off",

      // Custom React rules from @mherod/eslint-plugin-custom
      "@mherod/react/no-dynamic-tailwind-classes": "error",
      "@mherod/react/no-event-handlers-to-client-props": "error",
      "@mherod/react/no-unstable-math-random": "error",
      "@mherod/react/no-use-state-in-async-component": "error",
      "@mherod/react/prefer-link-over-router-push": "error",
      "@mherod/react/prefer-next-navigation": "error",
      "@mherod/react/prefer-react-destructured-imports": "off", // Too noisy
      "@mherod/react/prevent-environment-poisoning": "error",
      "@mherod/react/enforce-server-client-separation": "error",
      "@mherod/react/enforce-component-patterns": "off", // Too strict for this codebase
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
