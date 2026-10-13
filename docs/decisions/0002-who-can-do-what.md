# 2. Who can see and do what, and how the log tells people apart

Status: accepted (crit 10)

## Context

Crit 10 asks the app to tell two people apart, to have the server enforce
what each of them can see and change, and to keep a server-side log of who
did what, good enough to narrate the crit from without touching the app.

Marks already tells people apart: crit 8 gave every visitor a random id in
a cookie. What it hadn't written down was what that id is *for*: which
things on the wall belong to whom, and who gets to change them. The
answer is short, because the wall is small, but it has to come from the
server. A rule the page enforces is only advice to whoever is holding the
browser.

## Decision

A person is a browser: the `visitor` cookie, issued on first visit. That
matches the README's "no accounts" stance, and it's what the crit tests,
with separate Chrome profiles that share no cookies.

**What each person owns.** Their marks, and the record of which marks
they've already seen (the `visitors` table from decision 1). That's all.

**What each person can see.** Every mark, with the name its author typed
and its author's visitor tag (below). The wall is public to the room by
design. Two things are per-person, and
both are worked out on the server from the cookie: which marks are
"yours", and which are "new" since your last visit. Nobody is ever sent a
visitor id, theirs included. The id is the only credential this app has,
and anyone holding it *is* that visitor.

**What each person can change.**

- Anyone can add a mark. The server attributes it to the cookie on the
  request, never to anything in the form. There's no field that names an
  owner, and one sent anyway is ignored.
- Nobody can edit or delete a mark, its author included. The README
  argues for this, and it's the simplest rule a server can enforce
  completely: there's no route to get wrong. Any `PUT`, `PATCH` or
  `DELETE` gets a 405, and the log records the attempt.
- Your "seen" pointer moves only on your own page loads and live
  deliveries.
- Only an id this server could have issued counts. A hand-set cookie like
  `visitor=alice` gets replaced with a fresh random one, so nobody can pick
  a guessable id and nobody can guess someone else's.

**The log.** One line per thing a person does, to stdout, which is what
`flyctl logs` tails. Each line leads with `visitor=<tag>`, where the tag is
the first six hex digits of a SHA-256 of the id: stable, so one person's
lines group together, and one-way, so a log on a projector can't be used to
take over someone's marks. Values are JSON-quoted, so a name with a newline
in it can't forge a second line. The actions are `arrive` (a new cookie),
`view`, `post`, `post-refused`, `live-open`/`live-close`, `readme`,
`refused`, `not-found` and `error` (a request that
threw, with its message). A pod member typing someone else's name shows up
as the same `name=` under a different `visitor=`, which is the whole point.
Two fields answer the questions a narrator otherwise has to work out by
cross-referencing: a `post` carries `delivered=<n>`, the number of other
people's open pages it reached live, and a `refused` aimed at an existing
mark carries `mark=` and `owner=<tag>`, so an attempt on someone else's
mark reads as one.

The logging stays after the crit. It's what I, or an agent, read first
when the deployed app misbehaves.

## Costs

- A name is still just a label, so every mark also shows its author's tag,
  the same one the log leads with. Two people who both type "Ana" read as
  "Ana #3fa9c1" and "Ana #b07e22", and someone narrating from the log can
  point at the wall and be understood. The price is linkability: anyone
  can see that two marks under different names came from one browser. For
  a room of a dozen that is the honest trace, not a leak, but it would
  need rethinking for a public feed.
- The log carries mark text (the first 60 characters). It's public on the
  wall anyway, and it makes the log readable aloud, but it means the log
  holds as much personal detail as the wall does.
- A browser is a person only until it isn't. Clear cookies or switch
  device and you're someone new, with no way back to your old marks'
  "yours" badges. Accounts would fix this, and the README says why I don't
  want them.
- Tags are six hex digits. Two of a dozen visitors sharing one is about a
  one-in-250,000 chance, and the cost is a confusing log, not a security
  hole.

## What I didn't pick

Letting authors delete their own marks is the obvious per-person
permission, and the one a pod is most likely to ask for. It would also
break decision 1. The marks table is the replay log for reconnecting
pages, and a delete would need its own event and its own replay, or a tab
that was offline would keep showing a mark that's gone. Permanent marks
keep the trace and the live feed honest with one rule.

`spec/access.test.ts` checks the decision against the running app: a
mark belongs to the cookie that posted it whatever the form says, no page
ever shows a visitor id, the tag on the wall matches the log's, a made-up id is replaced, every change or delete
gets a 405 and leaves the mark in place, and log lines can't be forged.
