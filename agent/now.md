# now

## State as of this run (2026-09-30, ~165.5 h to cutoff, `comp4020-final-bada`) --- FIRST run of a new deliverable

This is the final project's opening crit, "It's alive!" (crit 8, week 9),
in a fresh repo that will carry the whole final project across crits 8, 9,
10 and the final submission itself (due 2026-11-09) --- not a single-crit
throwaway like every prior deliverable in this file. `memory/now.md`'s
previous content was `comp4020-crit7-bada`'s finishing hand-off, unrelated
to this repo; ignore it from here on, it's fully superseded.

Read crit 8's source fresh (unchanged from the fetch this run) and the final
project brief in full (via WebFetch summary, since the tool wouldn't quote
verbatim). Crit 8's bar is narrow: deployed, one real interaction, a trace
that persists, and a first version of what good means in README.md ---
real-time (crit 9) and logging (crit 11) are explicitly out of scope this
week.

Built **Marks**: a shared noticeboard (name + short line, posted, visible
immediately, still there on return). No accounts --- a random id in a
cookie distinguishes visitors and marks a post "yours." Marks are permanent
(no edit/delete), a deliberate call, not a gap. README.md argues this from
two real sources read this run: Robin Sloan's home-cooked-app essay and Ink
& Switch's malleable-software essay, both genuinely fetched and checked
against the brief's own "small web / games for friends / tools for one
workshop" pointer, not assumed. CLAUDE.md turns that argument into rules
(no auth, escape user text, don't build ahead of the open crit, keep deps
minimal).

Stack: Node 24's native TypeScript execution (no build step) +
`node:sqlite` (built into Node 24, no native addon --- see MEMORY.md).
Verified for real before deploying: `pnpm check` (5/5) against a locally
run instance; a real `docker build` + `docker run` + `docker restart`
proving a mark survives a container restart (the actual guarantee the Fly
volume is meant to provide); a real-browser keyboard-only walk of the whole
form (Tab through link → name → mark → submit, Enter submits) at desktop
and 390×844; `/readme/`'s headings render correctly in order.

Committed in three logical pieces (app, docs, process/reflection --- see
`git log`), pushed, and deployed
(`flyctl deploy --remote-only --ha=false -a comp4020-final-bada`). Verified
the *live* URL after deploying: `https://comp4020-final-bada.fly.dev/` and
`/readme/` both 200, a live screenshot matches the local one, and (since
this app has no delete) deliberately left zero test marks on the live
instance --- it reads "No marks yet" on the real deployment, same
discipline as prior no-delete apps in this file.

Wrote `reflections/crit-8.md` (headed "It's alive!", the source's title,
280 words) and a first-draft `PROCESS.md` (~380 words, citing the app and
docs commits) --- both intentionally not at their final-submission length
yet (README's final target is 400--600 words, already at 426; PROCESS.md's
final target is 900--1100, this is a first pass, to be rewritten not
appended as the project grows, per doctrine).

## Single most important next action

This was NOT called a finishing run (165.5h ≈ the full week), so the
finishing-steps checklist doesn't fully apply yet --- but everything crit
8's own spec asks for is already in place and deployed ahead of its
cutoff. If a future prompt reopens this repo before crit 8's cutoff:
deepen or leave as-is (it already satisfies every crit-8 spec bullet); the
obvious next layer, if there's a reason to touch it again before crit 8
closes, is exercising the wall with a few real posts to see if the "reading
top to bottom is the whole interface" bet in README still holds once
there's real content, not just an empty state. If the prompt instead opens
crit 9 ("All at Once" or similarly named) or a later crit/final-submission
prompt: that's real-time + one documented multi-user behaviour decision ---
build it as a genuine addition on top of Marks, not a rewrite; the schema
(one `marks` table, cookie-based `visitor_id`) was deliberately left small
enough to add an SSE broadcast to without restructuring it. Re-fetch
whatever course-source URL that prompt names fresh rather than assuming
continuity from crit 8's.
