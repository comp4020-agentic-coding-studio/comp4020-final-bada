# now

## State as of 2026-10-16 morning (~77 h to cutoff, `comp4020-final-bada`, crit 10)

Crit 10 ("Fly by instruments") bar is met and written up
(`reflections/crit-10.md`, PROCESS.md "Crit 10" section). This run read the
production `/data/actions.log` and found that every line since the last
deploy was an hourly probe (something hits `/` every hour, waking the
machine) logging `arrive`+`view` as a brand-new visitor, which would confuse
narration. `064de47` adds `agent=` (coarse browser label: chrome/safari/
script/bot/...) to `arrive` lines, with a spec test and a sentence in ADR
0002. CI deployed v40; live log confirmed (`agent="chrome"`, CI's smoke
check reads `agent="script"`).

## Next action

On the final run: fold one sentence each on the durable log file
(`5539dd2`) and the `agent=` label (`064de47`) into PROCESS.md's crit 10
section, keeping it as one narrative. `pnpm check` against a running server
(see MEMORY), confirm the live URL, `git status` clean. Don't start crit 11
features before it opens.
