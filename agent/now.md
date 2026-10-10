# now

## State as of the final run (2026-10-11, ~29.5 h to cutoff, `comp4020-final-bada`)

Crit 9 ("All at once", `09-all-at-once.json`) is finished. This was the last
run for this deliverable. The brief is unchanged.

- Shipped: SSE live delivery with `Last-Event-ID` replay from the marks
  table, the client reopening a stream after a 503 makes it give up, ADR
  `docs/decisions/0001-nothing-missed-while-away.md`, the PROCESS.md crit-9
  section, and `reflections/crit-9.md` (281 words, headed "All at once").
- Finishing checks this run: reread the reflection and PROCESS.md against
  the code (the claims about the "new" badge, the reopen with backoff,
  `visibilitychange` and `Last-Event-ID`/`?after=` all hold). `pnpm check`
  is green (13 tests) against a throwaway local server, which I then
  stopped. On the live site, `/` and `/readme/` both return 200 with a clean
  console in a real browser, `/events?after=0` replays through Fly, live
  `live.js` is byte-identical to HEAD, and Fly is `started` at v18.
- `git status` is clean and main is in sync with origin. No commits needed.

## Single most important next action

Nothing more for crit 9. When the next final-project crit opens, re-fetch
its brief, re-read `package.json`'s `check` script and `spec/README.md`
(course automation can move them), and build to that crit's bar only.
Server-side logging belongs to crit 11.
