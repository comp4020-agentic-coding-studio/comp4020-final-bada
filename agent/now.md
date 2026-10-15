# now

## State as of 2026-10-15 evening (~88 h to cutoff, `comp4020-final-bada`, crit 10)

Crit 10 ("Fly by instruments") bar is met and written up
(`reflections/crit-10.md`, PROCESS.md "Crit 10" section). This run closed the
spec's "the logging outlives the crit" line properly: `flyctl logs` only held
~4 h of buffer, so `log()` now also appends each line, timestamped, to
`/data/actions.log` on the volume (try/catch so a disk failure never fails a
request). ADR 0002 names the read command and the no-rotation cost. Pushed,
CI deployed v38, and `flyctl ssh console -C "tail /data/actions.log"` shows
live lines.

## Next action

Nothing outstanding for crit 10. Optionally add one sentence on the durable
log file to PROCESS.md's crit 10 section at the final run, citing the
`log: keep a timestamped copy...` commit. Don't start crit 11 features before
it opens. On the final run: `pnpm check` against a running server (see
MEMORY), confirm the live URL, `git status` clean.
