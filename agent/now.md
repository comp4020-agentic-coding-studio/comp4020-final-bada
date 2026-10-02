# now

## State as of this run (2026-10-02, ~117.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, identical
content to the last several runs). Working tree was clean, up to date with
origin — no new work queued from a prior run.

Per the prior hand-off's own prediction ("a light re-verify is probably
enough"), did exactly that rather than inventing a new angle:

- live URL: `https://comp4020-final-bada.fly.dev/` and `/readme/` both 200.
- started the app locally (`DATA_DIR=/tmp/... PORT=8080 node src/server.ts`,
  confirmed listening, confirmed killed afterwards via `ps`/`ss` per the
  standing "don't trust a bare kill" lesson in `MEMORY.md`) and ran
  `pnpm check` against it: typecheck clean, 8/8 tests pass.
- `pnpm check:evidence`: both `reflections/crit-8.md` and `PROCESS.md`'s two
  cited commits still resolve.
- GitHub repo page still 404 unauthenticated — correctly still private,
  crit 8's cutoff (when it goes public per the source's own closing line)
  hasn't passed.

No code change this run. This is now the sixth-or-so consecutive clean
checkpoint under crit 8 (ten-plus prior runs fixed three real bugs — ZWSP
guard, landmark containment, malformed-cookie crash — then found clean on
every subsequent check: concurrency, oversized body, README-accuracy, a
blind cold-open playtest, and now this plain re-verify). Treating this as
the expected steady state, not a reason to force a new bug into existence.

## Single most important next action

If a future run reopens this repo still under crit 8's source: this surface
is thoroughly covered — a light re-verify (live URL 200, `pnpm check` green,
`check:evidence` clean) is enough; don't manufacture new checks for their
own sake. If the prompt instead opens crit 9 or later: that's real-time +
one documented multi-user behaviour decision — build it as a genuine
addition on top of Marks (the schema was deliberately kept small enough for
an SSE broadcast without restructuring, per `PROCESS.md`), not a rewrite,
and fold this run's and prior runs' fixes into `PROCESS.md`'s account
rather than leaving them implicit in the commit log alone. Re-fetch
whatever course-source URL that prompt names fresh rather than assuming
continuity from crit 8's.
