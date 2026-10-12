# Marks

Marks is a shared noticeboard for a small, specific room: my crit group, and
whoever else visits this repo. Type a name and a short line, and it joins
everyone else's on the wall --- visible the moment you post it, and still
there the next time you're back.

## What good means here

Good, for this app, isn't "used by many people." [Robin Sloan's *An App Can
Be a Home-Cooked Meal*](https://www.robinsloan.com/notes/home-cooked-app/)
argues that software doesn't need scale or a business model to be worth
building --- it can be made, like a meal, for people you actually know, and
judged by whether it serves them rather than whether it grows. Marks is built
the same way: for a room of maybe a dozen people at most, not a public feed.
[Ink & Switch's *Malleable
Software*](https://www.inkandswitch.com/essay/malleable-software/) frames the
same idea at a different scale --- a luthier's workshop, tools built and
rearranged for exactly the work in front of them --- and that's the standard
I'm holding the schema to: the smallest shape that carries the one
interaction this crit needs, not a guess at what a later crit might want.

So: no accounts. A visitor is a random id in a cookie, set the first time
they show up --- good enough to tell two people apart, and to know a mark is
"yours" when you're back, but not to verify who anyone is. A name is just a
label someone types; two people can call themselves the same thing, and
that's fine for a room this size. The wall doesn't paginate, filter, or rank
--- it's short enough, for now, that reading top to bottom is the whole
interface.

## Live, and what you missed

The wall is live. A mark someone leaves appears on every other open page
within about a second, with no reload. With JavaScript off it still works
the old way: post, and the page reloads with everything on it.

Being live raises a question a static wall never had: what happens to a mark
left while you weren't quite there, whether your connection dropped for a
few seconds or you closed the tab until tomorrow? The answer here is that
nothing is silently dropped. A reconnecting page is sent whatever it missed,
and marks left since you last had the wall open carry a "new" badge.
[Decision 1](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/blob/main/docs/decisions/0001-nothing-missed-while-away.md)
records the options I weighed and what this choice costs.

## Who can do what

Everyone sees the whole wall. Each person, meaning each browser, can add
marks as themselves, and the server decides whose a mark is from the
cookie, never from anything the page sends. Nobody can change or remove a
mark, its author included. Every action lands in a server log as one line
that starts with a short tag for the visitor, so the log alone can tell two
people apart even when they type the same name.
[Decision 2](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/blob/main/docs/decisions/0002-who-can-do-what.md)
records what each person owns, what the log holds and what it leaves out.

## What's deliberately not here

Any way to edit or delete a mark once it's posted. That is a real
decision, not an oversight: a home-cooked app doesn't need an undo button
its author doesn't want, and a wall where marks are permanent is a simpler,
more honest promise than one that pretends to be moderatable. It also keeps
the live wall honest: the marks table doubles as the replay log for a
reconnecting page, and a delete would need its own event and its own replay
to stay right. Decision 2 says more.

## What I read to get here

- Robin Sloan, [*An App Can Be a Home-Cooked
  Meal*](https://www.robinsloan.com/notes/home-cooked-app/) and its
  [five-year follow-up](https://www.robinsloan.com/lab/five-years-of-home-cooked-apps/)
- Ink & Switch, [*Malleable
  Software*](https://www.inkandswitch.com/essay/malleable-software/)
- the final project brief's own pointers toward the small web and games made
  for a handful of friends, which sent me looking for both of the above
