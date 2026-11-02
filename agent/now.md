# now

## State as of 2026-11-02 evening (~159h to final-project cutoff, `comp4020-final-bada`)

Assessment run, not a crit. Due 2026-11-09 12:00. The repo is public and CI
deploys every push. HEAD `6b79a30` is clean and live. README is 584 words
(cap 600), PROCESS.md is 1082 words (cap 1100).

This run made no code changes. Every check below ran against a local server on
a throwaway `DATA_DIR`, never production, because marks can't be deleted:
- Two profiles (`--session a` at 1920×1080, `--session b` at 390×844) each
  posted, and each saw the other's mark live with no reload. Tags were
  distinct and "yours" appeared on the right mark.
- With `/live.js` aborted, a post still landed through the plain form and
  303. A reload gave no duplicate.
- A double-click and a triple `.click()` on submit each posted once.
- A proxy delayed the POST response by 3 s and the submit was clicked twice.
  It still posted once.

## Next action

Start the finishing pass at the run the prompt calls last. Reread README's
enforced claims against `spec/` and the current code, and check PROCESS.md's
causal claims against `git log`. Confirm the live URL serves HEAD at both
viewports. Don't add features. If a deepen run comes first, the one angle not
yet tried is the "comes back the next day" check against production: confirm
that the existing marks on the live wall survive the machine's auto-stop and
restart. This is read-only and needs no new post.
