# Process overview

Marks is a shared wall for one small room. Each mark is a name and a short
line, it's permanent, and it appears on every open page within a second. This
account covers how I got from the brief to that app, the stack and workflow
behind it, and the corrections that changed the harness rather than just the
code.

## From the brief to a definition of good

The brief leaves "good" open. The first commit was a bare working wall, but
the argument came straight after it and changed what the wall was allowed to
become
([`e92e066`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/e92e0663b1770718013c93da0461b4bb1f6d542c)).
Sloan's home-cooked meal essay and Shirky's *Situated Software* both say the
same thing: software for a room you could name can lean on the room, and
doesn't need machinery built for strangers at scale. That ruled out accounts
from the start. Malleable Software set the standard for the schema: the
smallest shape that carries the job. The median answer to this brief, a chat
room with the nouns swapped, is about the conversation happening now. Marks
is about the trace that stays after everyone has gone, and that one choice
settled most of the others. Marks are permanent, there's no presence list,
and a live page must never silently miss a mark.

The final README splits its claims into enforced and judged
([`0b8224e`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/0b8224e9ff4dd9140954d0b8c541df303c37ce69)),
and CLAUDE.md now treats that split as a contract. Every enforced claim needs a
`spec/` check that goes red when the claim breaks
([`f350f17`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/f350f17b5f979e7d9f14c7ebe549485b1fce6163)).
Writing the split showed one gap straight away. CLAUDE.md had said "escape
every piece of user-submitted text" since crit 8, but nothing in `spec/`
checked it. A test now posts markup as a name and a mark and asserts it comes
back as text. I removed the escaping, watched the test fail, then restored it
([`c78e250`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/c78e250989374c07e79a8a3615fb5aa50ad873e6)).

## The stack, and what it costs

The server is Node 24 with no framework. It uses `node:http`, `node:sqlite`,
and TypeScript run directly through Node's type stripping
([`5c9221a`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/5c9221ac21c123760282a470fbc8f29222ecf9a5)).
Three things decided this. The brief fixes one small machine and one volume,
and a SQLite file on that volume is exactly the persistence it describes.
`node:sqlite` needs no native addon, so the Dockerfile has no build stage and
no per-platform binary to go wrong. And server-rendered HTML with a form keeps
the core interaction working with JavaScript off, which CLAUDE.md makes a
rule. The only runtime dependency is `marked`, which renders the README at
`/readme/`.

The costs are real. With no framework, things like cookie parsing and
request-size limits had to be written by hand, and each one hid a bug. A
malformed cookie locked a visitor out of every page
([`257c251`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/257c25121b58818e0b19f6b221230d4ba88c69c8)).
SQLite on a volume also means one machine. That suits a room of a dozen, but
it rules out scaling out, and ADR 0001 records that as a cost.

For real-time I chose server-sent events over WebSockets
([`7c8b591`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/7c8b5910f0c5da9defb37f24a091e93c346eaded)).
A wall only needs to push, the server already renders each mark as HTML, and
`EventSource` reconnects by itself and sends `Last-Event-ID`. That last
point became the design. Each event's id is the mark's own row id, and
because marks are never edited or deleted, the marks table doubles as the
replay log. Permanence came from the README's argument, and it then made the
live layer simpler. Polling would have met the one-second bar too, but it
gives a reconnect gap nothing to replay from.

Before the first deploy I built the real Dockerfile, posted a mark, restarted
the container and checked the mark survived. It was cheaper to test the
volume's promise directly than to trust `fly.toml`.

## Workflow

Each run follows the same loop. Read the open crit's bar, build the smallest
thing that meets it, then attack the result from an angle no previous run
had tried. Run `pnpm check` against a throwaway local server, and deploy only
when it's green. Through the crits, CLAUDE.md carried a "build to the crit
that's open" rule, because an agent left alone builds the next crit's
feature before this one's bar is met. Once the crits were done, the
enforced-claims contract replaced it. Decisions that affect how
several people experience the app go into ADRs (`docs/decisions/`), and
CLAUDE.md requires changing the ADR before changing that behaviour. That
keeps a later run from quietly reversing one.

The verification techniques are the part of the workflow I'd keep.
Subagents got only the live URL or only the log, never the source, so they
couldn't guess at what the code meant. Every new test was checked by
breaking the code it protects. And the production log on the volume was read
before the crit, not a local one.

## Corrections that landed in the harness

Three failures changed the harness, not just the code.

First, my reconnect tests killed and restarted the server, which the browser
recovers from by itself. A Fly deploy is different. For a few seconds the
proxy answers 502, `EventSource` treats that as final, and the tab stays dead
while looking healthy. A two-line 503 stub on the port reproduced it. The fix
reopens a closed stream from the newest mark on the page, and a `spec/live`
test fails without it
([`1d9d157`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/1d9d157ed5275231ac9e2bfa925425e2f0b4145c)).

Second, for crit 10 I played a two-person session and gave a fresh subagent
only the server log. It counted one person as two listeners. Chrome's
back/forward cache was keeping a page alive with its stream still open, so
marks were being marked seen on a page nobody could see. No playtest had
caught this, because every playtest only watched the page on screen
([`b7c064d`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/b7c064ddf368c54a5ecfe1d93c4868b0cff83173)).
The same reading showed where the log made its reader guess, so a post now
says how many others saw it live and a refused change names whose mark it
targeted
([`e2dce83`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/e2dce83e9e98c74a1ec8044aabe2e54331098d3a)).

Third, the production log on the volume
([`5539dd2`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/5539dd2b9c633027bed76cec616d3522189c3dfa))
was almost all an hourly probe, each visit arriving as a new person. A
narrator would have read that as a stream of strangers. Arrivals now carry a
coarse browser label
([`064de47`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/064de479fdd4523d4192855bbc5a8d58ff092481)).

## Where I stand

The writing on small software is easy to agree with and hard to act on. What
acting on it meant here was mostly refusal. There's no delete, though it's
the first permission anyone would expect, because it would break both the trace and the replay. And
there's no presence, though it would make the showcase screen look busier.
The README's definition is narrow enough that the app either meets it or
doesn't, and the parts that can be tested are in `spec/`.
