# now

## State as of this run (2026-09-30, ~159.5 h to cutoff, `comp4020-final-bada`)

Re-opened for crit 8 ("It's alive!") with the deliverable already fully
built, deployed and verified by the previous run --- app, README, PROCESS.md,
`reflections/crit-8.md` all in place, live at
`https://comp4020-final-bada.fly.dev/`, working tree clean. Re-fetched crit
8's source fresh: unchanged from the previous fetch, confirmed every spec
bullet is still met (deployed, one real interaction with a persisting trace,
README's first take on "good" published at `/readme/`, process/reflection
in the repo, cited commits all resolve).

Not a finishing run (159.5h ≈ the full week), so this run's job was the
"deepen" the last hand-off pointed at: exercise the wall with real content
and volume, since every prior check had only ever seen the empty state. Ran
the app locally (`DATA_DIR=/tmp/... PORT=8080 node src/server.ts` ---
never against the real `/data` on this machine, which is an unrelated
shared directory), posted a handful of realistic named marks and
screenshotted both marking viewports, then pushed to volume: 96 marks
(~10,500px of page, no pagination) including one near the 280-char body
limit. Everything held: newest-first ordering, `pre-wrap` body wrapping, the
"yours" badge logic, no layout breaks, no crash --- the README's "reading top
to bottom is the whole interface" bet is holding at real volume, not just in
the empty state. `pnpm check` (typecheck + 5 vitest tests) passed against
the running local instance. No app bug found, so no code change --- a
genuine clean result, not a rubber stamp, since the long-body case
specifically could have broken wrapping and didn't. Cleaned up every local
server, temp DB and screenshot afterwards; confirmed no process still
listening. Working tree is still clean --- nothing to commit this run.

One test-harness gotcha hit and recorded in `MEMORY.md`: a bash-style
`${names[$((RANDOM % ...))]}` array-index loop silently drew empty names in
this zsh sandbox (zsh arrays are 1-indexed), which looked briefly like a
server bug (fewer rows landed than requests sent) until traced to the shell,
not the app.

Live URL re-verified at the end of this run: `/` and `/readme/` both still
200, unchanged (no code touched, nothing to redeploy).

## Single most important next action

Crit 8's bar is still fully met and deployed; there was nothing left to
build for it this run, only to verify. If a future prompt reopens this repo
still under crit 8's own source: there's not much left to deepen --- the
wall's been checked empty and at volume, both viewports, keyboard-only, a
real container restart, and the two philosophical sources are already
argued in README.md. If the prompt instead opens crit 9 ("All at Once" or
similarly named) or a later crit/final-submission prompt: that's real-time
+ one documented multi-user behaviour decision --- build it as a genuine
addition on top of Marks (the schema, one `marks` table with a cookie
`visitor_id`, was deliberately left small enough for an SSE broadcast
without restructuring), not a rewrite. Re-fetch whatever course-source URL
that prompt names fresh rather than assuming continuity from crit 8's.
