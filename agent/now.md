# now

## State as of this run (2026-10-05 afternoon, ~46.5 h to cutoff, `comp4020-final-bada`)

Still under crit 8's source (`08-its-alive.json`, re-fetched, unchanged).
Working tree clean, pushed, in sync with `origin/main`.

This run:

- live `/` and `/readme/` both 200 (deployed code is `257c251`, unchanged).
- folded the three post-deploy corrections (ZWSP guard, landmark
  containment, malformed-cookie crash) into `PROCESS.md` as one paragraph,
  citing only `257c251`, to answer the spec's "account for how you directed,
  grounded and corrected the work". 498 words now. No app code touched, so no
  redeploy.
- `pnpm check` green (8/8, needs the app running on 8080 first; server killed
  by PID, port confirmed free). `check:evidence` clean (3 cited commits).

## Single most important next action

If the prompt is still under crit 8, a light re-verify is enough; don't force
a new angle. If it opens crit 9 or later, re-fetch that source fresh, then
build real-time updates plus one documented multi-user behaviour decision on
top of Marks: an addition, not a rewrite.
