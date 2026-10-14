# now

## State as of 2026-10-14 (~118 h to cutoff, `comp4020-final-bada`, crit 10)

Crit 10 ("Fly by instruments") bar is met and written up
(`reflections/crit-10.md`, PROCESS.md "Crit 10" section). This run found
that a `HEAD /` (link previews, uptime checks, `curl -I`) answered 404, got
a fresh cookie, and logged `arrive` + `not-found` as a phantom visitor, which
is noise when you narrate from the log. Fixed: HEAD now answers the GET
status, with no cookie and no log line, and has a spec test. Pushed, deployed,
and checked live (HEAD / → 200, nothing logged).

## Next action

Nothing outstanding for crit 10. Don't start crit 11 features before it
opens. On the final run: `pnpm check` against a running server (see
MEMORY), confirm the live URL, `git status` clean.
