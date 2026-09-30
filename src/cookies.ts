import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

const YEAR_SECONDS = 60 * 60 * 24 * 365;

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
  }
  return out;
}

export function getCookie(req: IncomingMessage, name: string): string | undefined {
  return parseCookies(req.headers.cookie)[name];
}

export function setCookie(res: ServerResponse, name: string, value: string): void {
  res.appendHeader(
    "Set-Cookie",
    `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${YEAR_SECONDS}; SameSite=Lax; HttpOnly`,
  );
}

// The one piece of identity this app has: a random id in a first-party
// cookie, issued the first time someone shows up. No accounts, no passwords —
// it only has to tell two visitors apart, not verify who they are.
export function getVisitorId(req: IncomingMessage, res: ServerResponse): string {
  const existing = getCookie(req, "visitor");
  if (existing) return existing;
  const id = randomUUID();
  setCookie(res, "visitor", id);
  return id;
}
