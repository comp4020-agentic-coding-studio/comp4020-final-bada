# now

## State as of 2026-10-15 afternoon (~94 h to cutoff, `comp4020-final-bada`, crit 10)

Crit 10 ("Fly by instruments") bar is met and written up
(`reflections/crit-10.md`, PROCESS.md "Crit 10" section). This run closed
the one loose end from last time: an oversized POST used to throw inside
`readBody`, giving a 500 and an `action=error` log line. It now gets a 413 and
`action=post-refused reason="too large"`, so the crit log shows the sender's
doing as a refusal, not as a server fault. A spec covers it (23 tests, green
against a local server). Pushed, and CI deployed it (Fly v36). Checked live:
a 20 KB POST gets 413, and the log shows the `post-refused` line.

## Next action

Nothing outstanding for crit 10. Don't start crit 11 features before it
opens. On the final run: `pnpm check` against a running server (see
MEMORY), confirm the live URL, `git status` clean.
