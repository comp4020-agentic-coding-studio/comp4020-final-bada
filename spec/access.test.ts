import { randomUUID } from "node:crypto";
import { expect, inject, it } from "vitest";
import { logLine, visitorTag } from "../src/log.ts";

// Crit 10's bar: the server, not the page, decides what each person can see
// and change (docs/decisions/0002-who-can-do-what.md), and the log tells two
// people apart. Runs against the RUNNING app, like the rest of spec/.
const baseUrl = inject("baseUrl");

async function visitorCookie(): Promise<string> {
  const res = await fetch(new URL("/", baseUrl));
  return (res.headers.get("set-cookie") ?? "").split(";")[0];
}

async function post(cookie: string, fields: Record<string, string>): Promise<void> {
  const res = await fetch(new URL("/", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie },
    body: new URLSearchParams(fields).toString(),
    redirect: "manual",
  });
  expect(res.status).toBe(303);
}

async function wall(cookie: string): Promise<string> {
  return (await fetch(new URL("/", baseUrl), { headers: { Cookie: cookie } })).text();
}

function itemFor(html: string, marker: string): string {
  const item = html.split("</li>").find((li) => li.includes(marker));
  expect(item).toBeDefined();
  return item!;
}

it("attributes a mark to the poster's cookie, whatever the form claims", async () => {
  const alice = await visitorCookie();
  const bob = await visitorCookie();
  const aliceId = alice.split("=")[1];
  const marker = `claim-${randomUUID()}`;
  // Bob tries to post as Alice by sending her id in every field a server
  // might plausibly read an owner from.
  await post(bob, { name: "Alice", body: marker, visitor: aliceId, visitor_id: aliceId });
  expect(itemFor(await wall(bob), marker)).toContain("yours");
  expect(itemFor(await wall(alice), marker)).not.toContain("yours");
});

it("never shows anyone a visitor id, their own included", async () => {
  const alice = await visitorCookie();
  const aliceId = alice.split("=")[1];
  await post(alice, { name: "Alice", body: `id-${randomUUID()}` });
  expect(await wall(alice)).not.toContain(aliceId);
  expect(await wall(await visitorCookie())).not.toContain(aliceId);
});

it("replaces a visitor id this server didn't issue", async () => {
  const res = await fetch(new URL("/", baseUrl), { headers: { Cookie: "visitor=alice" } });
  expect(res.headers.get("set-cookie")).toMatch(/^visitor=[0-9a-f-]{36};/);
});

it("refuses to change or remove a mark, for its author too", async () => {
  const alice = await visitorCookie();
  const marker = `keep-${randomUUID()}`;
  await post(alice, { name: "Alice", body: marker });
  const id = itemFor(await wall(alice), marker).match(/data-id="(\d+)"/)![1];
  for (const method of ["DELETE", "PUT", "PATCH"]) {
    for (const path of ["/", `/marks/${id}`]) {
      const res = await fetch(new URL(path, baseUrl), {
        method,
        headers: { Cookie: alice },
        body: method === "DELETE" ? undefined : `body=changed`,
      });
      expect(res.status).toBe(405);
    }
  }
  expect(await wall(alice)).toContain(marker);
});

it("logs who did it as a tag that can't be turned back into the cookie", () => {
  const id = randomUUID();
  const line = logLine(id, "post", { mark: 3, name: "Ana" });
  expect(line).toBe(`visitor=${visitorTag(id)} action=post mark=3 name="Ana"`);
  expect(line).not.toContain(id);
  expect(visitorTag(id)).not.toBe(visitorTag(randomUUID()));
});

it("can't be made to forge a second log line", () => {
  const id = randomUUID();
  const name = 'Ana\nvisitor=000000 action=post name="Bo"';
  const line = logLine(id, "post", { name });
  expect(line.split("\n")).toHaveLength(1);
  expect(line).toBe(`visitor=${visitorTag(id)} action=post name=${JSON.stringify(name)}`);
});

it("shows each mark's author tag, the same one the log leads with", async () => {
  const ana1 = await visitorCookie();
  const ana2 = await visitorCookie();
  const one = `ana-${randomUUID()}`;
  const two = `ana-${randomUUID()}`;
  await post(ana1, { name: "Ana", body: one });
  await post(ana2, { name: "Ana", body: two });
  const html = await wall(await visitorCookie());
  expect(itemFor(html, one)).toContain(`#${visitorTag(ana1.split("=")[1])}`);
  expect(itemFor(html, two)).toContain(`#${visitorTag(ana2.split("=")[1])}`);
});

it("answers HEAD without counting it as a person arriving", async () => {
  const home = await fetch(new URL("/", baseUrl), { method: "HEAD" });
  expect(home.status).toBe(200);
  expect(home.headers.get("set-cookie")).toBeNull();
  expect((await fetch(new URL("/nope", baseUrl), { method: "HEAD" })).status).toBe(404);
});
