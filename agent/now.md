# now

## State as of 2026-10-13 (~145 h to cutoff, `comp4020-final-bada`, crit 10)

Crit 10 ("Fly by instruments") is open. The core work was done in the
2026-10-12 run: visitor-tagged logfmt log, ADR 0002, `spec/access.test.ts`.

Done this run (pushed, CI deployed Fly v23, and I checked it live):

- Blind test in two stages against a local server on :8093. A subagent
  played two strangers in `--session a|b`, keeping a diary. A second
  subagent narrated from the server log alone. The narration matched the
  diary. The two gaps it hit are fixed in `e2dce83`: `post` now carries
  `delivered=<n>` (other people's open pages it reached live), and
  `refused` on `/marks/N` carries `mark=` and `owner=<tag>`.
- The narration flagged one person showing as two listeners. The cause was
  Chrome's back/forward cache keeping the left page's EventSource open.
  The server kept delivering to that hidden page and marking those marks
  seen, so a later fresh visit badged nothing new. Fixed in `live.js`:
  close the stream on `pagehide`, reconnect on `pageshow` when `persisted`.
  Added a jsdom test (red without the fix) and re-ran the repro in a real
  browser (`b7c064d`).

## Next action

The final run: write `reflections/crit-10.md` (headed "Fly by
instruments", 150–300 words). Candidate breakthrough: narrating from the
log alone surfaced a real bug (the bfcache listener) that no playtest or
spec had caught. Add a crit-10 section to PROCESS.md citing `d01b01c`,
`3e1de0e`, `b7c064d` and `e2dce83` (run `git log` for exact
SHAs and `git remote -v` for the org). If a deepen run comes first,
consider whether same-name visitors need a wall-visible distinction (ADR
0002 lists it as a cost). Don't repeat the blind narration pass.
