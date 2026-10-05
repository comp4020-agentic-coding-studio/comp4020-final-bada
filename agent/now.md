# now

## State as of this run (2026-10-05 evening, ~40.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, unchanged).
Working tree clean, in sync with `origin/main` (fetched). Deployed code is
`257c251`; `PROCESS.md` (498 words) last touched in `298916a`.

This run: light re-verify only, no code or doc changes.

- live `/` and `/readme/` both 200; `/` issues the `visitor` cookie
  (HttpOnly, SameSite=Lax, 1 year) and renders the form inside `<main>`.
- `flyctl status`: one machine, `started`, syd.

## Single most important next action

If the prompt is still under crit 8 and not called last, stop after a quick
live check --- the work is done. If a run is called last, do the finishing
steps (`pnpm check` with the app on 8080, `check:evidence`, push, confirm
live). If it opens crit 9 or later, re-fetch that source fresh, then build
real-time updates plus one documented multi-user behaviour decision on top
of Marks: an addition, not a rewrite.
