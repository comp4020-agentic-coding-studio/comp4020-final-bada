import { randomUUID } from "node:crypto";
import { expect, inject, it } from "vitest";

// Crit 9's bar: one person's mark reaches every other open session within
// about a second, with no reload. And the decision in docs/decisions/: a
// visitor who drops off (a reconnect, or a whole day away) never silently
// misses a mark. Runs against the RUNNING app, like the rest of spec/.
const baseUrl = inject("baseUrl");

async function postMark(name: string, body: string, cookie = ""): Promise<void> {
  const res = await fetch(new URL("/", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie },
    body: new URLSearchParams({ name, body }).toString(),
    redirect: "manual",
  });
  expect(res.status).toBe(303);
}

// Opens /events and resolves with the raw stream text once `marker` shows up,
// or rejects after `ms`.
async function waitForEvent(
  headers: Record<string, string>,
  query: string,
  marker: string,
  ms: number,
  onOpen: () => Promise<void> = async () => {},
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(new URL(`/events${query}`, baseUrl), { headers, signal: controller.signal });
    expect(res.headers.get("content-type")).toMatch(/^text\/event-stream/);
    const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
    await onOpen();
    let text = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      text += value;
      if (text.includes(marker)) return text;
    }
    throw new Error("stream ended before the mark arrived");
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}

async function visitorCookie(): Promise<string> {
  const res = await fetch(new URL("/", baseUrl));
  return (res.headers.get("set-cookie") ?? "").split(";")[0];
}

async function newestId(cookie: string): Promise<number> {
  const html = await (await fetch(new URL("/", baseUrl), { headers: { Cookie: cookie } })).text();
  return Number(html.match(/data-after="(\d+)"/)![1]);
}

it("delivers someone else's mark to an open session within a second", async () => {
  const marker = `live-${randomUUID()}`;
  const started = performance.now();
  const text = await waitForEvent({}, "", marker, 1000, () => postMark("Other", marker));
  expect(performance.now() - started).toBeLessThan(1000);
  // the html travels JSON-encoded, so its quotes arrive escaped
  expect(text).toContain('class=\\"mark new\\"');
});

it("replays marks left while a connection was down, from Last-Event-ID", async () => {
  const cookie = await visitorCookie();
  const lastSeen = await newestId(cookie);
  const marker = `missed-${randomUUID()}`;
  await postMark("Other", marker);
  const text = await waitForEvent({ Cookie: cookie, "Last-Event-ID": String(lastSeen) }, "", marker, 1000);
  expect(text).toMatch(/^id: \d+$/m);
});

it("sends no history to a connection with no starting point", async () => {
  const marker = `old-${randomUUID()}`;
  await postMark("Other", marker);
  await expect(waitForEvent({}, "", marker, 500)).rejects.toThrow();
});

it("badges marks left since a visitor's last page load as new, but not their own", async () => {
  const cookie = await visitorCookie();
  await newestId(cookie);
  const theirs = `away-${randomUUID()}`;
  const mine = `mine-${randomUUID()}`;
  await postMark("Other", theirs);
  await postMark("Me", mine, cookie);
  const page = async () => (await fetch(new URL("/", baseUrl), { headers: { Cookie: cookie } })).text();
  const item = (html: string, marker: string) =>
    html.slice(html.lastIndexOf("<li", html.indexOf(marker)), html.indexOf("</li>", html.indexOf(marker)));

  const first = await page();
  expect(item(first, theirs)).toContain('class="mark new"');
  expect(item(first, mine)).not.toContain(" new");
  // seen once, it isn't new on the next load
  expect(item(await page(), theirs)).not.toContain(" new");
});
