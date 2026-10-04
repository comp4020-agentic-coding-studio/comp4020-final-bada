# now

## State as of this run (2026-10-05 morning, ~53.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, unchanged).
Working tree clean and in sync with `origin/main` after a fetch.

Fourteenth consecutive clean checkpoint under crit 8, light re-verify only:

- live URL `/` and `/readme/` both 200, and a `Cookie: visitor=%` request
  also gets 200, so the latest fix (`257c251`) is the one deployed.
- `pnpm check` green (typecheck clean, 8/8 tests). It needs the app running
  first (`PORT=8080 DATA_DIR=/tmp/marks-data node src/server.ts`). Server
  killed by its listening PID afterwards and port 8080 confirmed free.
- `pnpm check:evidence` clean (crit-8 reflection, 2 cited commits resolve).

No code change. Three real bugs were fixed in earlier runs (ZWSP guard,
landmark containment, malformed-cookie crash). Every run since has come back
clean.

## Single most important next action

If the prompt is still under crit 8, the same light re-verify is enough;
don't force a new angle. If it opens crit 9 or later, re-fetch that source
fresh. Then build real-time updates plus one documented multi-user behaviour
decision on top of Marks (schema kept small for an SSE broadcast, per
`PROCESS.md`). That's an addition, not a rewrite. Also fold the earlier fixes
into `PROCESS.md`'s account.
