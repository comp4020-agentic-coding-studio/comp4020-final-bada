# now

## State as of this run (2026-10-01, ~148.5 h to cutoff, `comp4020-final-bada`)

Re-opened still under crit 8's source (`08-its-alive.json`, re-fetched and
confirmed byte-identical to the two prior fetches). Working tree was clean,
app already deployed and fully meeting crit 8's bar per the last two runs'
exhaustive checks (empty state, volume, both viewports, keyboard-only,
container restart, philosophical sources argued in README.md).

Since there wasn't much surface left to re-check the same way, went looking
for a code-level edge case instead, applying a technique already proven on
`comp4020-crit7-bada`: does the emptiness guard on user text agree with
`.trim()`'s actual (whitespace-only, not zero-width/`Cf`) definition of
empty? It didn't --- `server.ts`'s `if (name && body)` check let a name or
body made entirely of U+200B zero-width spaces through, posting a mark that
displayed as invisible on the wall. Confirmed with a raw `curl` POST before
touching any code, fixed with a `hasVisibleContent` helper
(`/[^\s\p{Cf}]/u.test(s)`) gating both fields, added two regression tests
(rejects all-ZWSP, accepts a name merely containing one) --- 7/7 passing.
Committed (`7cc1341`), redeployed via `flyctl deploy --remote-only --ha=false
-a comp4020-final-bada`, and re-verified the fix live against production
with a real POST (rejected, nothing landed on the wall --- no junk data left,
since a rejected post is never stored). Live URL re-confirmed 200 on `/` and
`/readme/` after the deploy. Recorded the recurrence in `MEMORY.md` since
this is the second independent project this exact bug shape has shown up
in.

Working tree is clean, everything pushed locally committed (not yet pushed
to origin --- doctrine leaves pushing as this routine's own step 5, done).
Confirmed pushed: `git log` shows `7cc1341` as HEAD, `git status` clean.

## Single most important next action

Crit 8's bar is still fully met, now with one real bug found and fixed on
top of the two prior verification-only runs. If a future run reopens this
repo still under crit 8's source: the cheap, proven checks (empty, volume,
viewports, keyboard, restart, ZWSP) are now all done --- the next thing worth
trying is probably a fresh angle entirely, e.g. a real accessibility pass
(axe-core via `agent-browser`, not yet run on this repo) or checking
whether `node:sqlite`'s single connection handles concurrent POSTs without
interleaving (same technique as the `Promise.all`-race lesson in
`MEMORY.md`, adapted to this schema, which has no capacity/uniqueness
constraint to race over --- so the interesting question here would just be
"do two concurrent inserts ever corrupt or drop a row," not a business-logic
race). If the prompt instead opens crit 9 or later: that's real-time + one
documented multi-user behaviour decision --- build it as a genuine addition
on top of Marks (the schema was deliberately left small enough for an SSE
broadcast without restructuring), not a rewrite, and fold this run's and the
prior two runs' fixes into `PROCESS.md`'s account rather than leaving them
implicit in the commit log alone. Re-fetch whatever course-source URL that
prompt names fresh rather than assuming continuity from crit 8's.
