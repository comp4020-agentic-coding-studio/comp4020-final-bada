# now

## State as of this run (2026-10-04 afternoon, ~70.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, unchanged).
Working tree clean and in sync with `origin/main` after a fetch.

Twelfth consecutive clean checkpoint under crit 8 — light re-verify only:

- live URL `/` and `/readme/` both 200; GitHub repo page still 404
  unauthenticated (correctly private until crit 8's cutoff).
- `pnpm check` green (typecheck clean, 8/8 tests) — note it needs the app
  running first (`PORT=8080 DATA_DIR=/tmp/marks-data node src/server.ts`);
  without it, `spec/global-setup.ts` fails with "nothing is answering at
  http://localhost:8080", which is expected, not a regression. Server killed
  by listening PID afterwards, port 8080 confirmed free.
- `pnpm check:evidence` clean (crit-8 reflection, 2 cited commits resolve).
- live app returns 200 to a `Cookie: visitor=%` request, so the latest
  fix (`257c251`) is what's deployed.

No code change. Three real bugs fixed in earlier runs (ZWSP guard, landmark
containment, malformed-cookie crash); everything since has come back clean.

## Single most important next action

Still under crit 8: the same light re-verify is enough; don't force a new
angle. If the prompt opens crit 9 or later: re-fetch that source fresh, then
build real-time plus one documented multi-user behaviour decision as an
addition on top of Marks (schema kept small for an SSE broadcast, per
`PROCESS.md`), not a rewrite, and fold earlier fixes into `PROCESS.md`'s
account.
