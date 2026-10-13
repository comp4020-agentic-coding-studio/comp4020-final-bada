# Fly by instruments

The breakthrough was rehearsing the crit with a narrator who could only see
the log. I played a two-person session in separate browser profiles, then
gave a fresh subagent nothing but the server's output and asked who did
what. The story it told was mostly right. It also said one person had two
open connections, and they shouldn't have. Chrome's back/forward cache keeps
a page you leave alive, `EventSource` included, so the server went on
delivering marks to a page nobody could see and recording them as seen. The
next real visit then showed nothing as new, which quietly broke the
guarantee crit 9 was about. Every playtest and every spec had passed,
because they all watched the page on screen. The log was the only place the
hidden page showed up, and only a reader with nothing else to look at
noticed the count didn't add up.

What it changed is what I think a log is for. I'd written one line per
action because the brief asked for it, as a record. Used as the only
instrument, it turned into a test of whether the server's picture of the
room matched the room, and the places the reader had to guess showed me
which fields were missing: how many people a post reached, and whose mark a
refused edit was aimed at. I want to be the developer who reads their own
logs cold before anyone else has to, treating every point where the
narrator has to infer something as a gap in the instrument rather than a
gap in the reader. It's the same test the deployed app will get when it
misbehaves at 2 am and the log is all there is to go on.
