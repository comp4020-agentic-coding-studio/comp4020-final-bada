# Process overview

Crit 8's bar is proof of life: something deployed, doing one real thing for a
stranger, with a trace that's still there when they come back. Before writing
any code I read the final project brief's own pointers toward the small web
and games made for a handful of friends, which led to Robin Sloan's
home-cooked-app essay and Ink & Switch's malleable-software piece -- both
cited in README.md, which is the actual first deliverable this week: a stance
on what good means before a feature list.

The app itself, Marks, is a shared noticeboard: a name, a short line, posted
and visible immediately, still there on return. Two decisions came straight
out of the README's argument rather than habit. First, no accounts -- a
random id in a cookie is enough to tell two visitors apart and to mark a
post as "yours," which is all a room this size needs
([`5c9221a`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/5c9221ac21c123760282a470fbc8f29222ecf9a5)).
Second, marks are permanent: no edit, no delete route exists at all, because
a wall that pretends to be moderatable is a worse promise than one that
plainly isn't.

The stack choice was more pragmatic than philosophical: Node 24 strips
TypeScript's erasable syntax natively, so `src/*.ts` runs straight, no build
step; and `node:sqlite` is built into the same runtime, so the Fly image
needs no native addon and no separate database service, just the one file
Fly already mounts at `/data`. Before ever touching Fly I built the actual
Dockerfile locally, ran the image, posted a mark, restarted the container,
and confirmed the mark was still there -- the same guarantee the volume is
meant to provide, checked directly rather than assumed from reading the
config.

Before deploying, I opened the running app in a real browser at both marking
viewports and walked the whole form with the keyboard alone (Tab to the name
field, to the mark field, to the submit button, Enter to send) rather than
just reading the markup and assuming it would work.

The corrections after the first deploy came from asking where the app's
own promises could quietly fail, not from another playtest. A name or mark
made only of zero-width characters passed `.trim()` and posted a blank
trace onto a wall whose point is an honest one; a real-browser axe run (the
build's own checks can't see layout) found the posting form sat outside
every landmark. The sharpest was a cookie: reading every client-controlled
value the server decodes before routing, a raw `Cookie: visitor=%` made
`decodeURIComponent` throw on every request, `GET /` included, and since the
crash came before any `Set-Cookie` could replace the bad value, that visitor
would have been locked out until they cleared cookies by hand
([`257c251`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/257c25121b58818e0b19f6b221230d4ba88c69c8)).

Server-side logging is crit 11's bar, not one of the first two. CLAUDE.md
says so explicitly, so a later run building ahead of the crit that's open is
a decision to notice, not a default
([`e92e066`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/e92e0663b1770718013c93da0461b4bb1f6d542c)).

## Crit 9: all at once

Crit 9 asks for real-time and then for one decision about how the app
behaves when several people use it at once. The transport took one commit:
server-sent events, because the server already renders every mark and a
one-way push is all a wall needs
([`7c8b591`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/7c8b5910f0c5da9defb37f24a091e93c346eaded)).
The decision I chose came from the README's promise rather than from the
brief's list of examples. Marks says a trace is "still there the next time
you're back," and a live feed quietly breaks that: a tab that drops its
connection for a redeploy reconnects to future marks only, looks healthy,
and is wrong. So the SSE id is the mark's own id, a reconnect replays from
the marks table via `Last-Event-ID`, and a returning visitor sees a "new"
badge on whatever was left since. The ADR records the options and their
costs, including presence, the rival a pod is most likely to argue for
([`daadf2c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/daadf2cf41d95c6f35366e3544ca0cd5e631f44d)).

The correction that mattered came a run later. I'd tested reconnects by
killing and restarting the server, which the browser's own retry handles.
A Fly deploy is a different gap: for a few seconds the proxy answers with a
502 or 503 instead of a stream, and `EventSource` treats any such answer as
final and goes `CLOSED` for good. I reproduced it locally by binding a
two-line 503 stub to the port between kill and restart. The tab then stayed
dead after the real server came back. `src/live.js` now reopens a closed
stream itself, with backoff, from the newest mark on the page, and a jsdom
test against the served page goes red without the fix
([`1d9d157`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/1d9d157ed5275231ac9e2bfa925425e2f0b4145c)).

## Crit 10: fly by instruments

Crit 10 asks the app to tell two people apart, enforce on the server what
each can see and change, and log well enough that I can narrate a two-person
session without touching the app. Marks already had a person: a random id
in a cookie. The work was deciding what that id is for, and making the log
say it. Every action writes one logfmt line led by `visitor=<tag>`, the first
six hex digits of a SHA-256 of the id. The tag is stable enough to group one
person's lines and one-way, so a log on a projector can't be used to take
over anyone's marks. The same commit refuses hand-set ids like
`visitor=alice` and answers every `PUT`/`PATCH`/`DELETE` with a 405 that gets
logged
([`d01b01c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/d01b01c13f9d6cf631ff91ec1f9b2b032c64d848)).
ADR 0002 records the rule and its costs
([`3e1de0e`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/3e1de0e6baa18b55e77e8635f7662a40aaf5c0e5)).

Most of what came after that came from rehearsing the crit itself. I played a scripted
two-person session in separate browser profiles, then gave a fresh subagent
only the server log and asked it to say who did what. Its account was right
in outline, and it counted one person as two listeners. Chrome's
back/forward cache keeps a page you leave via a link alive with its
`EventSource` still open, so the server kept delivering to a hidden page and
marking those marks as seen. That person's next real visit then badged
nothing as new. No playtest or spec had caught it, because both only ever looked at the
page that was showing. The page now closes its stream on `pagehide` and
catches up from the newest mark on `pageshow`
([`b7c064d`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/b7c064ddf368c54a5ecfe1d93c4868b0cff83173)).
The same narration showed where the log made the reader work. To tell an
attempt on someone else's mark from one on your own, it had to cross-reference
mark ids, and it couldn't say whether the second person saw a post arrive. A
`post` line now carries `delivered=<n>`, and a refused change carries the
target mark's `owner=` tag
([`e2dce83`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/e2dce83e9e98c74a1ec8044aabe2e54331098d3a)).
Last, the wall shows each mark's tag beside its name, so two people who
both type "Ana" are distinguishable there too, and the narrator can point
from a log line to the mark on screen
([`3ebd943`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/3ebd943e4b9fb9d373a4c6aee36e182ecc52f7c0)).
The brief wants the logging to outlast the crit, and `flyctl logs` only
holds a few hours, so every line is also appended to a file on the volume
([`5539dd2`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/5539dd2b9c633027bed76cec616d3522189c3dfa)).
Reading that file before the crit, rather than a local one, showed it was
almost all an hourly probe arriving as a new visitor each time, which a
narrator would have read as a stream of strangers. An `arrive` line now
carries a coarse `agent=` label such as `chrome` or `script`
([`064de47`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/064de479fdd4523d4192855bbc5a8d58ff092481)).
