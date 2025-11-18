import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // 1) Define ignored files first
  {
    ignores: [
      // Adjust path as needed; for example if it's "components/ui/*.tsx":
      "components/ui/*.tsx",
      // Ignore Prisma generated files
      "app/generated/**",
      ".next/**",
      "node_modules/**",
    ],
  },
  // 2) Spread in core Next.js + TypeScript configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // 3) Optionally override or add rules after
  {
    rules: {
      // custom rules or overrides here
    },
  },
];
