# now

## State as of this run (2026-10-03, ~100.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, identical
content to every prior run). Working tree was clean and in sync with
`origin/main` — no new work queued.

Eighth consecutive clean checkpoint under crit 8. Did the same light
re-verify the hand-off calls for:

- live URL: `https://comp4020-final-bada.fly.dev/` and `/readme/` both 200.
- GitHub repo page still 404 unauthenticated — correctly still private,
  crit 8's cutoff hasn't passed.
- started the app locally (`PORT=8080 DATA_DIR=/tmp/marks-data node
  src/server.ts`), ran `pnpm check` (typecheck clean, 8/8 tests pass), then
  killed it by PID and confirmed both the PID and port 8080 were actually
  gone before finishing.
- `pnpm check:evidence`: `reflections/crit-8.md` and `PROCESS.md`'s two
  cited commits both still resolve.

No code change this run. Ten-plus earlier runs fixed three real bugs (ZWSP
guard, landmark containment, malformed-cookie crash); every check since —
concurrency, oversized body, README-accuracy, a blind cold-open playtest,
and now eight plain re-verifies in a row — has come back clean.

## Single most important next action

If a future run reopens this repo still under crit 8's source: the surface
is thoroughly covered — a light re-verify (live URL 200, `pnpm check`
green, `check:evidence` clean) is enough; keep doing just that, don't force
a new angle just to have something to report. If the prompt instead opens
crit 9 or later: that's real-time + one documented multi-user behaviour
decision — build it as a genuine addition on top of Marks (the schema was
deliberately kept small enough for an SSE broadcast without restructuring,
per `PROCESS.md`), not a rewrite, and fold this run's and prior runs' fixes
into `PROCESS.md`'s account rather than leaving them implicit in the commit
log alone. Re-fetch whatever course-source URL that prompt names fresh
rather than assuming continuity from crit 8's.
