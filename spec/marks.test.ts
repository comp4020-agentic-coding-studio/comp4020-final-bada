import { randomUUID } from "node:crypto";
import { expect, inject, it } from "vitest";

// The core interaction this crit is about: post a mark, it shows up, and it
// distinguishes who left it. Everything here runs against the RUNNING app
// (see spec/global-setup.ts), same as invariants.test.ts.
const baseUrl = inject("baseUrl");

async function postMark(name: string, body: string): Promise<{ setCookie: string }> {
  const res = await fetch(new URL("/", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ name, body }).toString(),
    redirect: "manual",
  });
  expect(res.status).toBe(303);
  return { setCookie: res.headers.get("set-cookie") ?? "" };
}

it("a posted mark shows up on the wall", async () => {
  const marker = `mark-${randomUUID()}`;
  await postMark("Test Visitor", marker);
  const res = await fetch(new URL("/", baseUrl));
  expect(res.status).toBe(200);
  expect(await res.text()).toContain(marker);
});

it("rejects a mark with an empty body without storing it", async () => {
  const marker = `empty-${randomUUID()}`;
  await postMark(marker, "");
  const res = await fetch(new URL("/", baseUrl));
  expect(await res.text()).not.toContain(marker);
});

it("rejects a name made only of zero-width characters", async () => {
  const marker = `zwsp-${randomUUID()}`;
  await postMark("​​​", marker);
  const res = await fetch(new URL("/", baseUrl));
  expect(await res.text()).not.toContain(marker);
});

it("accepts a name that merely contains a zero-width character", async () => {
  const marker = `zwsp-ok-${randomUUID()}`;
  await postMark(`Jo​hn`, marker);
  const res = await fetch(new URL("/", baseUrl));
  expect(await res.text()).toContain(marker);
});

it("still serves the page when a cookie value is malformed percent-encoding", async () => {
  const res = await fetch(new URL("/", baseUrl), {
    headers: { Cookie: "visitor=%" },
  });
  expect(res.status).toBe(200);
});

it("issues a fresh visitor cookie per anonymous request", async () => {
  const a = await postMark("A", `a-${randomUUID()}`);
  const b = await postMark("B", `b-${randomUUID()}`);
  expect(a.setCookie).toMatch(/^visitor=/);
  expect(b.setCookie).toMatch(/^visitor=/);
  expect(a.setCookie).not.toBe(b.setCookie);
});
