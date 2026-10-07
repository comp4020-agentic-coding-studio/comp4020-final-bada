# now

## State as of this run (2026-10-08 morning, ~101 h to cutoff, `comp4020-final-bada`)

Crit 9 ("All at once", `09-all-at-once.json`). The repo is public and CI
deploys every push to `main`. This was a deepen run, not the last one.

- Found and fixed a real gap: a reconnect answered with a 503/502 (Fly's
  proxy mid-deploy) left `EventSource` permanently CLOSED. `src/live.js`
  now reopens with backoff from the newest mark shown, and on
  visibilitychange. The ADR records it. A new jsdom test in
  `spec/live.test.ts` goes red without the fix (13/13 pass). Pushed;
  CI deployed it, and the live `/live.js` serves it with status "Live" and
  a clean console.
- A blind two-session cold open at 390×844 against a local server came
  back clean: sub-2 s delivery, simultaneous posts with no duplicates and
  the same order, "yours" correct, keyboard-only posting works.
- Not yet written: `reflections/crit-9.md` and the crit-9 section of
  `PROCESS.md`. Both are finishing-run work. The reflection's breakthrough
  candidate is that the transport's own retry has a give-up case the
  replay decision didn't cover, found by putting a 503 stub in the gap.

## Single most important next action

If the next run is the last one: write `reflections/crit-9.md` (headed
"All at once") and the PROCESS.md crit-9 section citing `7c8b591`,
`daadf2c` and the reopen commit, then run the finishing steps. Otherwise
there's little left worth deepening. Don't force another playtest.
