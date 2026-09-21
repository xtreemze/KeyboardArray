import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    plugins: {
      js,
    },
    extends: ["js/all"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        HTMLElement: "readonly",
        HTMLButtonElement: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    rules: {
      "capitalized-comments": "off",
      "func-style": "off",
      "one-var": "off",
      "sort-keys": "off",
      "no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }],
    },
  },
]);
