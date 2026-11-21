# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Rollup plugin (`rollup-plugin-strip-banner`) that removes the leading banner comment (e.g. a license header) from JS/JSX/TS/TSX modules before bundling, and emits a sourcemap for the change. Peer-supports Rollup 1 through 4.

## Commands

Package manager is pnpm 11 (CI pins 11.28.12 through `pnpm/setup`; pnpm 11 itself needs Node ≥ 22.13, but CI installs its standalone binary, so the Node 18–21 runners still work). pnpm settings live in `pnpm-workspace.yaml`: pnpm 11 only reads auth/registry settings from `.npmrc`, which is kept for npm (`npm version` in the release task). All npm scripts delegate to Gulp tasks defined in `gulpfile.js` → `scripts/*/index.js`.

- `pnpm test`: clean → lint → build → run Jasmine specs. Lint failures (including warnings) fail the test run.
- `pnpm run lint`: ESLint over root, `src/`, `test/`, `scripts/` (`.js` and `.ts`). Skipped on Node ≤ 14. Restrict it with `--file <path>` (repeatable; file, directory or glob), e.g. `pnpm run lint --file src/index.js`. `--file` only affects the standalone `lint` task; `build`/`test`/`release` always lint everything.
- `pnpm run build`: clean → lint → build into `dist/`.
- `pnpm run tdd`: build once, then re-run specs on changes to `src/` or `test/`.
- `pnpm run test:unit`: run the specs only, skipping clean/lint/build (specs import `src/` directly through Babel, so no build is needed). Narrow it with `--file <path>` (repeatable, relative to the repo root) and `--filter <regex on spec name>`:
  `pnpm run test:unit --file test/index.spec.js --filter "should strip banner"`
  Don't use plain `npx jasmine`: its default ESM loader can't resolve the extensionless imports.

## Dependencies

- All dependencies are pinned to exact versions (no `^`/`~`), except the `rollup` peer range.
- `pnpm-workspace.yaml` enforces supply-chain rules: `minimumReleaseAge: 2880` (pnpm refuses versions published less than 2 days ago), `blockExoticSubdeps`, and `trustPolicy: no-downgrade`. An install failing on a fresh version is expected; pick an older one rather than loosening these settings.
- Dependabot opens daily update PRs. Two majors are deliberately held back (see `.github/dependabot.yml`): `magic-string` (newer majors are ESM-only and need Node ≥ 22) and `eslint` (v9 needs a migration to flat config; the repo still uses `.eslintrc`). Don't upgrade those as part of unrelated work.

## Architecture

- `src/index.js` is the whole plugin: a `transform` hook that applies `@rollup/pluginutils` `createFilter(include, exclude)`, skips non-JS/TS extensions, finds the banner with `extract-banner`, removes it with `magic-string`, trims leading whitespace, and returns `{ code, map }`.
- `src/index.d.ts` holds the hand-written public typings; it is copied as-is into `dist/` (no TS compilation). Keep it in sync with options in `src/index.js`.
- Build (`scripts/build`): `src/**/*.js` → strip banner → Babel (`.babelrc`: preset-env targeting Node 14, CommonJS, `add-module-exports` so `require()` returns the default export) → prepend `LICENSE` as header → Prettier → `dist/`.
- `--file` / `--filter` flags are parsed once in `scripts/cli/index.js` (`readCliOptions`) and shared by the lint and test tasks.
- Gulp itself runs under `@babel/register`, so `scripts/` and specs can use ES module syntax.

## Tests

- Jasmine, spec files matching `test/**/*.spec.js` or `*-spec.js`. `failSpecWithNoExpectations` is on.
- `test/index.spec.js` calls `transform` directly on files in `test/fixtures/`.
- `test/it/it.spec.js` runs a real `rollup.rollup()` bundle against the same fixtures and writes output to a `tmp` directory.
- Expected output is built with `joinLines` (`test/utils/join-lines.js`) to stay line-ending independent; CI runs on Windows, Linux and macOS across Node 18–26.

## Conventions

- Every source file (including `scripts/` and tests) starts with the MIT license header block.
- ESLint: airbnb-base, max line length 140, and `valid-jsdoc` is enforced — functions need JSDoc with `@param`/`@return` descriptions.
- Commit messages follow Conventional Commits (`chore:`, `chore(ci):`, `chore(deps-dev):`, `fix:`, …); `pnpm run changelog` generates `CHANGELOG.md` from them. `release:` prefixes are reserved for the release tasks.
- Code in `src/` ships to users: it is compiled for Node 14 and must work with every Rollup major from 1 to 4, so stick to plugin hooks and Node APIs those support. Newer Node APIs (e.g. `util.parseArgs`, Node ≥ 18.3) are fine in `scripts/` only.
- Every code example in `README.md` must be valid and work as written with the currently supported Rollup version (correct option names, correct import/require of the plugin, runnable config). When changing the plugin's API or options, or touching the README, update the examples and check that they actually run (e.g. build `dist/`, then run `rollup -c` with the example config against it).
- Any new option documented in `README.md` must state the plugin version that introduced it (e.g. "Since 3.2.0"). `package.json` holds the last released version (the release task bumps it at release time), so a new option ships in the *next* version, normally the next minor; ask if unsure which version it will be.
- `dist/` is gitignored; the release tasks (`pnpm run release:{patch,minor,major}`) force-add `dist/`, run `npm version`, then remove `dist/` again in a follow-up commit. Don't commit `dist/` manually.
