# Marks

Rules for working on this app, derived from what README.md argues "good"
means for it. If a change would break one of these, the README needs to
change first --- not the other way around.

- No accounts. Identity is a random id in a first-party cookie, issued on
  first visit. Never add passwords, email, or OAuth --- this app only needs
  to tell two visitors apart, not verify who they are.
- Marks are permanent once posted: no edit, no delete. That's a deliberate
  scope decision (README explains why), not a gap to quietly fill in.
- Escape every piece of user-submitted text before it reaches HTML
  (`escapeHtml` in `src/render.ts`). Never string-interpolate a name or a
  mark's body straight into a template.
- Server-rendered HTML is the interface. The core interaction (post a mark,
  see the wall) has to work with JavaScript off; anything JS adds is
  enhancement, never a requirement.
- One SQLite file on the Fly volume (`node:sqlite`, no native dependency,
  no separate database service) is the only storage. Don't reach for a
  second store or an ORM for a schema this small.
- Build to the crit that's currently open, not ahead of it: server-side
  logging is crit 11's bar. Land it when that crit opens, not preemptively
  --- a feature built early is one more thing to keep correct while the next
  crit's actual bar goes unaddressed.
- Live updates must never silently drop a mark. A reconnect replays from the
  marks table via `Last-Event-ID`, and the server runs as one machine
  (`--ha=false`) because the listener set is in-process.
  `docs/decisions/0001-nothing-missed-while-away.md` is the decision; change
  it before changing this behaviour.
- Keep dependencies to what's load-bearing. `marked` renders README.md at
  `/readme/`, correctly, without hand-rolling markdown parsing; anything
  else new needs the same justification.
