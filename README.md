# KeyboardArray

A small browser experiment for selecting letters from an A–Z keyboard array.

The original global-JavaScript/inline-handler implementation has been modernized without adding an application framework: the project uses strict TypeScript and Vite with direct semantic DOM APIs.

## Development

Requires Node.js 24 and pnpm 12.5.1.

```sh
corepack enable
corepack prepare pnpm@12.5.1 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Quality gates:

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm e2e
```

The same quality gates run in GitHub Actions for every pull request and for pushes to `master`.

The production build is emitted to `dist/` and is suitable for static hosting such as GitHub Pages.
