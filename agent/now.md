# now

## State as of this run (2026-10-01, ~135.5 h to cutoff, `comp4020-final-bada`)

Re-opened still under crit 8's source (`08-its-alive.json`, re-fetched and
byte-identical again). Working tree was clean, app already deployed and
meeting crit 8's bar per the last four runs' checks (empty state, volume,
both viewports, keyboard-only, container restart, ZWSP guard, landmark
containment, concurrent-write integrity).

Re-read README.md's claims against the current schema/server (`db.ts`,
`server.ts`, `render.ts`, `cookies.ts`) line by line --- still accurate, no
drift. Then tried a genuinely new angle instead of repeating a prior check:
traced every uncaught-throw path in the request handler by hand and tested
each one against a locally running server (`DATA_DIR` override, no volume
needed).

Found one real bug: `cookies.ts`'s `parseCookies` called
`decodeURIComponent` on every cookie value with no guard. A cookie value
with a stray `%` not followed by two hex digits (hand-edited in devtools, a
stale value from a past encoding) throws `URIError`, uncaught, 500ing
**every** request from that client --- including a plain `GET /` --- with no
way to recover short of manually clearing cookies, since the crash happens
before the handler ever reaches a `Set-Cookie` that could fix it. This
directly threatens the crit 8 bar itself ("a stranger can visit, do the
core thing") for any client that ever ends up with a malformed cookie.
Fixed by wrapping the per-cookie `decodeURIComponent` call in try/catch and
treating a malformed value as absent (`257c251`), with a regression test
added to `spec/marks.test.ts`. Verified against a restarted local server
(malformed cookie → 200, was 500) and again against production after
deploying (`malformed cookie against prod: 200`).

Checked one other throw path while there, and decided it needs no fix: an
oversized POST body (`MAX_REQUEST_BYTES`, 8192) still 500s, but that's a
one-off failure against an attack-shaped request (legitimate field lengths
never get close to the limit), not a persistent lockout like the cookie bug
was --- the next normal request from the same client works fine.

Deployed (`flyctl deploy --remote-only --ha=false -a comp4020-final-bada`),
pushed to origin (`257c251`), live URL re-confirmed 200 on `/` and
`/readme/`.

## Single most important next action

Crit 8's bar remains fully met, now with three bugs found and fixed across
four deepen runs (ZWSP guard, landmark containment, malformed-cookie crash)
plus checked-clean results (concurrent writes, oversized-body path, README
accuracy). If a future run reopens this repo still under crit 8's source:
most cheap checks are now done --- worth trying a blind source-inaccessible
subagent cold-open pass next (not yet done on this specific repo, per
`MEMORY.md`'s standing technique for crit-4/5/7), or auditing `render.ts`'s
`page()`/`marksList()` output directly in a real browser with axe-core
re-run after any future markup change. If the prompt instead opens crit 9 or
later: that's real-time + one documented multi-user behaviour decision ---
build it as a genuine addition on top of Marks (the schema was deliberately
left small enough for an SSE broadcast without restructuring), not a
rewrite, and fold this run's and the prior runs' fixes into `PROCESS.md`'s
account rather than leaving them implicit in the commit log alone.
Re-fetch whatever course-source URL that prompt names fresh rather than
assuming continuity from crit 8's.
