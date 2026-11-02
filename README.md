# Marks

Marks is a shared noticeboard for one small room: my crit group, and whoever
is standing at the showcase screen. Type a name and a short line, and it
joins everyone else's on the wall, on every open page within a second, and
it's still there when you come back.

## What good means here

Good, for Marks, is an honest trace kept for a room you could name. Robin
Sloan's [*An App Can Be a Home-Cooked
Meal*](https://www.robinsloan.com/notes/home-cooked-app/) argues that
software made for people you know is judged by whether it serves them, not
whether it grows. Clay Shirky's [*Situated
Software*](https://gwern.net/doc/technology/2004-03-30-shirky-situatedsoftware.html)
makes the same point from the other side: software for "dozens of users, an
absurd target population," can lean on the group instead of building
machinery to stand in for it. [Ink & Switch's *Malleable
Software*](https://www.inkandswitch.com/essay/malleable-software/) sets the
standard for the code: the smallest shape that does the job in front of it.

Three things follow. First, a person is a browser. A random id in a cookie
tells two people apart, and a short tag beside each name lets you tell two
people called Ana apart; a room this size doesn't need accounts to know who
it's talking to. Second, a mark is permanent. Nobody can edit or delete one,
its author included, because a wall that lets the past be quietly rewritten
isn't a trace. Third, being live must never cost you a mark. A page that
drops its connection is sent whatever it missed, and a mark left since your
last visit carries a "new" badge.

## Enforced, and judged

These are checked by `pnpm check` against the running app, in `spec/`:

- a mark belongs to the cookie that posted it, whatever the form says, and
  no page ever shows anyone's visitor id
- every attempt to change or delete a mark is refused, its author's too
- a name or mark is shown as text, never as markup, and a blank one (even
  one made of invisible characters) is refused
- another person's mark reaches an open page within a second, a dropped
  connection is replayed what it missed, and the "new" badge appears once
- the tag beside a name is the one the server log leads with, and the log
  can't be forged by a name with a newline in it

These are judged, not tested: whether the wall reads well at a phone's
width and a projector's, and whether a stranger can post without being told
how. I judge them by playing two-person sessions in separate browser
profiles at both sizes, then having someone with only the server log say
who did what. That rehearsal found a real bug no test had: a page Chrome
cached away kept receiving marks, so they were never badged new.

## What's deliberately not here

No edit or delete, as above. No presence list, because the wall is about
what stays after people leave, not who is here now. No rooms, likes,
replies or ranking: the wall is short enough to read top to bottom, and
that's the whole interface. Without JavaScript it still works, post and
reload.

## Decisions and sources

- [Decision 1: nothing missed while
  away](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/blob/main/docs/decisions/0001-nothing-missed-while-away.md)
- [Decision 2: who can see and do
  what](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/blob/main/docs/decisions/0002-who-can-do-what.md)
- Robin Sloan, [*An App Can Be a Home-Cooked
  Meal*](https://www.robinsloan.com/notes/home-cooked-app/) and [*Five years
  of home-cooked apps*](https://www.robinsloan.com/lab/five-years-of-home-cooked-apps/)
- Clay Shirky, [*Situated
  Software*](https://gwern.net/doc/technology/2004-03-30-shirky-situatedsoftware.html)
  (2004)
- Ink & Switch, [*Malleable
  Software*](https://www.inkandswitch.com/essay/malleable-software/)
