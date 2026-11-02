# now

## State as of 2026-11-02 (~165h to final-project cutoff, `comp4020-final-bada`)

Assessment run, not a crit. The final-project brief is due 2026-11-09 12:00.
The repo is public, so CI deploys every push to `main`. HEAD `1c42b98`
(`readme page: link to the wall...`) is pushed and live, and the live
`/readme/` shows the "Go to the wall" link.

Done this run:
- `c78e250` spec: an XSS/escaping test. Confirmed it goes red with
  `escapeHtml` stubbed out.
- `0b8224e` README rewritten (~580 words, inside 400–600). It now adds
  Shirky's *Situated Software* and has an "Enforced, and judged" section
  that maps claims to spec/ tests.
- `f350f17` CLAUDE.md: the enforced claims are a contract with spec/, and
  the features the README rules out are named.
- PROCESS.md rewritten whole (~1080 words, inside 900–1100), with the
  stack's case and costs and 12 cited commits. Every claim was checked
  against `git log`; three unsupported ones were cut.
- `/readme/` now links to the wall, with a test. Markers start at
  `/readme/`, and it had no way in before this.

The production log since crit 10 holds only probes, with 14 marks and no
posts. The real crit-10 session doesn't appear in `/data/actions.log` past
the 15 Oct entries checked.

## Next action

A deepen run: do a two-profile real-time check on the live URL at the two
marking viewports (`--session a`/`--session b`, one at 1920×1080, one at
390×844). Post from each, and screenshot both showing the other's mark with
no reload. If that's clean, try a slow connection (`network route` delay
isn't available, so abort `/live.js` and confirm the no-JS path still posts).
Keep README at ≤600 words and PROCESS at ≤1100 if either is touched.
