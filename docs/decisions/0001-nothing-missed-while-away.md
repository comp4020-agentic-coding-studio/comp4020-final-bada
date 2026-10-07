# 1. Nothing you missed while away is silently dropped

Status: accepted (crit 9)

## Context

Crit 9 makes Marks real-time: a mark one person leaves shows up on every
other open page within about a second, with no reload. Server-sent events
carry it (`/events` in `src/server.ts`). The transport is settled. The
decision the crit asks for sits one level up: how the app behaves when
several people use it at once.

The README's promise is that a mark is "still there the next time you're
back." Live updates add a quieter version of the same question: what happens
to a mark left while you *weren't quite there*? There are two ways to be
absent. The short one is a dropped connection. Every Fly redeploy restarts
the one machine and cuts every open stream, so do a phone going to sleep or
a train going into a tunnel. The long one is closing the tab and coming
back tomorrow.

A plain live feed handles neither. The browser's `EventSource` reconnects on
its own after a drop, but it reconnects to *future* marks only. Anything
posted during the gap never arrives, and nothing on the page says so: the
tab looks healthy and is quietly wrong. Coming back the next day, a full
page load shows everything. The wall is short enough to read top to bottom,
but nothing tells you which of those lines you haven't read.

## Options considered

1. **Live-only, reload to catch up.** The least code. The cost is that a
   reconnected tab silently misses whatever was left in the gap. On a wall
   whose whole claim is an honest trace, that's the one failure I'm not
   willing to ship.
2. **Reload the page whenever the connection comes back.** This is always
   correct, and cheap. The cost is that it throws away a half-typed mark and
   jumps the scroll position, and it does so on every redeploy, for every
   open tab, at the moment someone is most likely mid-sentence.
3. **Replay the gap from the database.** Each event's SSE id is the mark's
   own id. A reconnecting browser sends the last one it saw back as
   `Last-Event-ID`, and the server replays every mark after it. The marks
   table is already an ordered, permanent log, because marks can't be edited
   or deleted, so there's no separate backlog to keep in memory or lose on a
   restart.
4. **For the long absence: nothing.** Read the wall top to bottom, as the
   README already says. This costs nothing, but "still there when you're
   back" then means "somewhere in the list."
5. **For the long absence: a "new" badge** on every mark left since this
   visitor last had the wall in front of them, whether on a page load or a
   live delivery.

## Decision

Options 3 and 5. Together they say one thing: whichever way you were away,
the marks left meanwhile reach you, and you can tell which ones they are.
Marks that arrive live carry the same badge, so the page reads the same way
whether you watched them land or came back to them. Your own marks never
do: you've seen those.

The browser's own retry isn't enough to rely on. If a reconnect gets any
answer other than a stream (a 502 from Fly's proxy while the machine
restarts), `EventSource` gives up for good. So `src/live.js` reopens a
closed stream itself, with backoff, from the newest mark already on the
page, and straight away when a phone brings the tab back into view.

## Costs

- A second table. `visitors` maps the cookie id to the newest mark id that
  visitor has seen, which is a little more state than crit 8's "a name is
  just a label" schema. It holds no name and no personal detail, only a
  number.
- "Seen" means *delivered to a page you had open*, not *read*. A tab left
  open in the background all afternoon marks everything seen. Telling the
  two apart would take visibility tracking, and I don't think a room this
  size needs it.
- Identity is a cookie, so "since your last visit" is per browser. A phone
  and a laptop each keep their own count.
- Replay assumes one machine and one ordered table. That holds because
  `fly.toml` runs exactly one machine and every deploy passes `--ha=false`.
  A second machine would split both the live audience and the replay, and
  this decision would need revisiting.

## What I didn't pick, and why the pod might

Presence ("three people are here") is the obvious rival. It's the most
visibly *multi-user* thing an app like this could do, and it would make a
crit's simultaneous open-on-every-phone moment feel alive. I left it out
because the README's standard is the trace, not the company: Marks is about
what's still there after people leave, and presence only describes who
hasn't left yet.

`spec/live.test.ts` checks the decision against the running app: live
delivery inside a second, replay from `Last-Event-ID`, no history for a
connection with no starting point, the "new" badge appearing once and
then clearing, and the page reopening a stream the browser gave up on.
