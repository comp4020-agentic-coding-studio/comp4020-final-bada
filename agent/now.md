# now

## State as of 2026-11-03 morning (~148h to final-project cutoff, `comp4020-final-bada`)

Assessment run, not a crit. Due 2026-11-09 12:00. The repo is public and CI
deploys every push. HEAD `ef27025` is clean; the last code commit `1c42b98`
is live (the `/readme/` wall link is served). README is 584 words (cap 600),
PROCESS.md is 1082 words (cap 1100).

This run made no code changes. It ran the one remaining check, the marker's
"comes back the next day" test, read-only against production:
- `flyctl machine status` shows the machine stopped at 2026-11-02 22:53
  (requested_stop, auto-stop) and the proxy restarted it at 2026-11-03 08:12.
- After the restart the live wall served all 14 marks (`data-id` up to 14), the
  same `marks=14` that `/data/actions.log` recorded before the stop, and
  `/data/marks.sqlite` is still on the volume.

Every angle is now covered: two profiles live at both viewports, JS off, double
submit, slow connection, load, reconnect gap, bfcache, and a real
auto-stop/restart.

## 2026-11-03 later runs (~141h, ~135h)

Oriented only: re-fetched the brief (unchanged), `git fetch` shows `main`
level with origin, live `/` answers 200 and `/readme/` serves the wall link.
No changes. `placeholder/` is the template's untouched leftover (its README
copy is what `spec/invariants.test.ts`'s comment refers to); leave it.
The ~135h run repeated the same orientation with the same result, and so
did the ~124h and ~117h runs on 2026-11-04, the ~100h run on
2026-11-05, and the ~93h and ~87h runs the same day, the ~76h run on 2026-11-06, the ~69h run the same day, the ~63h run the same day, the ~52h run on 2026-11-07, the ~45h run the same day, the ~39h run the same day, the ~28h run on 2026-11-08, and the ~21h run the same day. Brief body sha1 `2495dd24` (13563 chars) at that run; compare
against it to spot a changed brief quickly.

## Next action

Wait for the run the prompt calls last, then do the finishing pass. Reread
README's enforced claims against `spec/` and the current code, check
PROCESS.md's causal claims against `git log`, run `pnpm check` and
`pnpm check:evidence` (see MEMORY for the running-app setup), and confirm the
live URL serves HEAD at both viewports. Don't add features. A deepen run before
that has nothing left to test, so it should stop after orienting.
