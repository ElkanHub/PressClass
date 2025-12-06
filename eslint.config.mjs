import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["**/dist/**", "**/.next/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      next: nextPlugin,
    },

    // ✔ Use extends, not rules — this avoids circular errors
    extends: [
      nextPlugin.configs.recommended,
      nextPlugin.configs["core-web-vitals"],
    ],

    // Optional: Add custom rules here if needed
    rules: {},
  },
];
