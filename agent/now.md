# now

## State as of this run (2026-10-01, ~141.5 h to cutoff, `comp4020-final-bada`)

Re-opened still under crit 8's source (`08-its-alive.json`, re-fetched and
byte-identical to all prior fetches). Working tree was clean, app already
deployed and meeting crit 8's bar per the last three runs' checks (empty
state, volume, both viewports, keyboard-only, container restart, ZWSP
emptiness guard).

Followed the prior hand-off's two suggested fresh angles, both genuinely
checked rather than assumed:

1. **Real-browser axe-core pass** (not yet run on this repo): found one real,
   moderate violation on the home page --- the posting `<form>` sat between
   `<header>` and `<main>`, so its two fields weren't contained by any
   landmark region (`region` rule). `/readme/` was already clean. Fixed by
   moving the form inside `<main>`, next to the wall it posts to
   (`defaffb`) --- one line changed. Re-scanned locally (0 violations) and
   again against production after deploying (0 violations).
2. **Concurrent-POST integrity check**: fired 40 concurrent POSTs at a local
   server with `Promise.all`, then queried the sqlite file directly (not
   just the rendered page) --- all 40 landed, ids contiguous 1--44 with no
   duplicates or gaps. Confirms `node:sqlite`'s synchronous `DatabaseSync`
   with no `await` inside `insertMark` serialises concurrent writes cleanly,
   same reasoning as the `better-sqlite3`/`Promise.all` race lesson in
   `MEMORY.md` adapted to a schema with no capacity/uniqueness constraint to
   race over. No code change --- a genuine checked-clean result.

Deployed (`flyctl deploy --remote-only --ha=false -a comp4020-final-bada`),
pushed to origin (`defaffb`), live URL re-confirmed 200 on `/` and `/readme/`
and 0 axe violations against production itself, not just the local build.

## Single most important next action

Crit 8's bar remains fully met, now with two bugs found and fixed across
three deepen runs (ZWSP guard, landmark containment) plus two genuine
checked-clean results (concurrent writes, and this run's own account). If a
future run reopens this repo still under crit 8's source: the proven cheap
checks (empty, volume, viewports, keyboard, restart, ZWSP, a11y, concurrency)
are now all done --- worth trying something not yet covered, e.g. a
`network route --abort` slow-connection check on the home page (does it
degrade gracefully with JS blocked --- this app has no client JS at all per
README's own "works with JavaScript off" rule, so this check might just
confirm that rather than find anything), or re-reading README.md's claims
against the current schema/server one more time before the next real
milestone. If the prompt instead opens crit 9 or later: that's real-time +
one documented multi-user behaviour decision --- build it as a genuine
addition on top of Marks (the schema was deliberately left small enough for
an SSE broadcast without restructuring), not a rewrite, and fold this run's
and the prior three runs' fixes into `PROCESS.md`'s account rather than
leaving them implicit in the commit log alone. Re-fetch whatever
course-source URL that prompt names fresh rather than assuming continuity
from crit 8's.
