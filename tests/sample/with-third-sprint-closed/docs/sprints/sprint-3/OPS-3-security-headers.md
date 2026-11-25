# OPS-3 · Security headers on every page

Parent: [sprint 3](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | the MVP |
| Depends on | — |
| Takes | — |

## Goal

Every page and file Shelf serves carries security headers: a content security policy that loads Shelf from its own origin and Open Library's alone and frames it nowhere, no guessing of types, and a short referrer.

## Scope

**In**
- `static/_headers`, which the build copies to `build/` and Cloudflare Pages reads, with one rule for every path.
- A unit test that reads the file.

**Out**
- A report of the policy's breaches: a later task, once Shelf has a server (P1.2).

## Acceptance criteria

- [x] Every path gets a content security policy that loads Shelf from its own origin, takes Open Library's data and covers, and frames it nowhere. **Shown 2026-11-14:** `src/lib/security-headers.test.ts` reads the rule for every path in `static/_headers`, and finds `default-src 'self'`, Open Library's address and `frame-ancestors 'none'`.
- [x] Every path gets `X-Content-Type-Options: nosniff` and a short referrer. **Shown 2026-11-14:** `src/lib/security-headers.test.ts` finds both, with `strict-origin-when-cross-origin`.

## Questions for the brainstorm

1. **SvelteKit's own policy, which hashes its inline scripts, or Pages' `_headers`?** Proposed: `_headers`, since Pages applies it to every file, static ones included, and the app has no server to set headers.

## Documents to check on close

- [The architecture](../../ARCHITECTURE.md)'s Deployment, for the headers.

## Log

| Date | Event |
|---|---|
| 2026-11-14 | Written by the new sprint step. |
| 2026-11-14 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-14 | `static/_headers` holds one rule for every path: the content security policy, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`. The build copies it to `build/_headers`. Shown by `npm test` (`security-headers.test.ts` failed first on the missing file, then passed), `npm run check` (0 errors), `npm run build`, and `npm run test:e2e` (14 passed). |
| 2026-11-14 | What shows each criterion, for the close: 1. `src/lib/security-headers.test.ts` finds the policy's sources and its frame rule · 2. `src/lib/security-headers.test.ts` finds the type and referrer headers |
| 2026-11-14 | Built by the build task step, on `main`, with no branch of its own. The close is next. |
| 2026-11-14 | Closed by the close task step: `completed`, every criterion shown. Review: no finding. Documents: the architecture's Deployment, by the sync: Pages applies `static/_headers` to every path. |
