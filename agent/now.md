# now

## State as of this run (2026-10-02, ~124.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, same content).
Working tree was clean; app already deployed and meeting crit 8's bar per
five prior runs' checks (empty state, volume, both viewports, keyboard-only,
container restart, ZWSP guard, landmark containment, concurrent-write
integrity, malformed-cookie crash fixed last run).

Did the one check flagged as not-yet-done in the last hand-off: a blind,
source-inaccessible cold-open subagent playtest against the live production
URL (same protocol as crit-4/5/7 — see `MEMORY.md`). First time run on this
specific repo. Came back fully clean: purpose obvious unaided, core action
works with the mouse, keyboard-only, and with all JS blocked; empty,
whitespace-only, and ZWSP-only submissions all correctly rejected; HTML/script
injection in both fields correctly escaped (no XSS); both marking viewports
reflow correctly; zero console errors; a real-browser axe-core pass found 0
violations on both `/` and `/readme/`; and every claim in README.md held up
under direct testing. One soft, non-bug note: a 1500-char input silently
truncates to the 280-char `maxlength` with no visible counter or ellipsis —
matches the "short mark" framing, not worth fixing proactively.

Also re-read `server.ts`/`cookies.ts`/`render.ts`/`db.ts` by hand looking for
anything new: cookie value encoding (`encodeURIComponent`/`decodeURIComponent`
pair), escaping, concurrency, and the emptiness/ZWSP guard all still correct.
Checked `fly.toml`, `Dockerfile`, CI workflow, `mise.toml`, `package.json` for
drift — all still consistent with `PROCESS.md`'s account. Confirmed the repo
is still private (GitHub API 404 for the unauthenticated check), which is
correct — crit 8's cutoff hasn't passed yet. No code change this run: a
genuine checked-and-clean outcome, the same calibration as the crit-4/5/7
"clean pass is legitimate evidence, not proof of an inadequate check" lessons
in `MEMORY.md`.

## Single most important next action

Crit 8's bar remains fully met, now with a clean blind cold-open pass added
to the three previously-fixed bugs (ZWSP guard, landmark containment,
malformed-cookie crash) and the checked-clean concurrency/oversized-body/
README-accuracy results. Further deepen runs under crit 8's source are
reaching diminishing returns — most cheap and several expensive checks are
now done. If a future run reopens this repo still under crit 8's source:
consider this close to done; a light re-verify (live URL still 200, `pnpm
check` still green) is probably enough rather than inventing a new angle. If
the prompt instead opens crit 9 or later: that's real-time + one documented
multi-user behaviour decision — build it as a genuine addition on top of
Marks (the schema was deliberately left small enough for an SSE broadcast
without restructuring, per `PROCESS.md`), not a rewrite, and fold this run's
and prior runs' fixes into `PROCESS.md`'s account rather than leaving them
implicit in the commit log alone. Re-fetch whatever course-source URL that
prompt names fresh rather than assuming continuity from crit 8's.
