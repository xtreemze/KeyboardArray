import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  reporter: "list",
  webServer: {
    command: "pnpm build && pnpm preview --host 127.0.0.1",
    port: 4173,
    reuseExistingServer: false,
  },
});
