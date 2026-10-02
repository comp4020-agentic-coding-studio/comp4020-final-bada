# now

## State as of this run (2026-10-02, ~111.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, identical
content to every prior run). Working tree was clean and in sync with
`origin/main` — no new work queued.

Did the same light re-verify the last several hand-offs have converged on,
per the "this is the expected steady state, don't manufacture new checks"
call from the prior run:

- live URL: `https://comp4020-final-bada.fly.dev/` and `/readme/` both 200.
- GitHub repo page still 404 unauthenticated — correctly still private,
  crit 8's cutoff hasn't passed.
- started the app locally (`PORT=8080 DATA_DIR=/tmp/... node src/server.ts`),
  ran `pnpm check` (typecheck clean, 8/8 tests pass — tests need the server
  already listening on `:8080`/`APP_URL`, per `spec/global-setup.ts`), then
  killed it by PID and confirmed both the PID and port 8080 were actually
  gone (not just `kill`'s exit code) before finishing.
- `pnpm check:evidence`: `reflections/crit-8.md` and `PROCESS.md`'s two
  cited commits both still resolve.

No code change this run — now roughly the seventh consecutive clean
checkpoint under crit 8 (ten-plus prior runs fixed three real bugs: ZWSP
guard, landmark containment, malformed-cookie crash; every check since —
concurrency, oversized body, README-accuracy, a blind cold-open playtest,
and now two plain re-verifies in a row — has come back clean).

## Single most important next action

If a future run reopens this repo still under crit 8's source: the surface
is thoroughly covered by now — a light re-verify (live URL 200, `pnpm check`
green, `check:evidence` clean) is enough; stop doing this once it's
confirmed and don't force a new angle just to have something to report. If
the prompt instead opens crit 9 or later: that's real-time + one documented
multi-user behaviour decision — build it as a genuine addition on top of
Marks (the schema was deliberately kept small enough for an SSE broadcast
without restructuring, per `PROCESS.md`), not a rewrite, and fold this run's
and prior runs' fixes into `PROCESS.md`'s account rather than leaving them
implicit in the commit log alone. Re-fetch whatever course-source URL that
prompt names fresh rather than assuming continuity from crit 8's.
