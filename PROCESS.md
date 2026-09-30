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

What's deliberately not here yet: real-time updates and multi-tab sync are
crit 9's bar, not this one; server-side logging is crit 11's. CLAUDE.md now
says so explicitly, so a later run building ahead of the crit that's open is
a decision to notice, not a default
([`e92e066`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-bada/commit/e92e0663b1770718013c93da0461b4bb1f6d542c)).
