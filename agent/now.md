# now

## State as of this run (2026-10-07 evening, ~112 h to cutoff, `comp4020-final-bada`)

Crit 9 ("All at once", `09-all-at-once.json`). The repo is public, so CI
deploys every push to `main`. This was a build run, not the last one.

- Live updates are built: SSE on `/events`, each mark rendered per listener,
  and the SSE id is the mark id, so a reconnect's `Last-Event-ID` replays
  from the marks table. A `visitors(visitor_id, seen_id)` table drives a
  "new" badge on marks left since a visitor last had the wall in front of
  them (`daadf2c` and the commit before it).
- The decision is recorded in `docs/decisions/0001-nothing-missed-while-away.md`
  and linked from the README. CLAUDE.md now carries the rule.
  `spec/live.test.ts` has 4 tests; 12/12 pass locally and against the Docker
  image. A mutation check (broadcast removed) turns the live test red.
- Verified in a real browser: two-session delivery; replay across a server
  kill and restart with a post inside the gap; 0 axe violations; mobile
  layout. Live: `/live.js` is served, the stream holds through Fly's proxy
  for 70 s on 25 s pings, and the status line reads "Live". No test mark was
  posted to production (no delete exists).
- Not yet written: `reflections/crit-9.md` and the crit-9 update to
  `PROCESS.md`. Both are finishing-run work.

## Single most important next action

Deepen. The best candidate is a blind cold-open with two isolated browser
sessions against a local server on its own port, imitating the pod opening
the app on several phones at once. Also look at how a phone backgrounding
the tab behaves. Then write `reflections/crit-9.md` and the PROCESS.md crit-9
section on the run that's called the last.
