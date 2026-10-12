import { createHash } from "node:crypto";

// One line per thing a person does, to stdout, which is what `flyctl logs`
// tails. Each line leads with who did it, so two people using the app at once
// can be told apart by reading the log alone.

const EXCERPT = 60;

// The visitor cookie is the only credential this app has: anyone holding the
// value *is* that visitor. Logs get read aloud and put on a projector, so they
// carry a short one-way tag of the id instead, never the id itself.
export function visitorTag(visitorId: string): string {
  return createHash("sha256").update(visitorId).digest("hex").slice(0, 6);
}

export function excerpt(s: string): string {
  return s.length > EXCERPT ? `${s.slice(0, EXCERPT)}…` : s;
}

type Value = string | number | boolean;

// logfmt-style `key=value`. Strings are JSON-quoted, so a name or a mark
// containing a newline or `key=value` text can't forge a second log line or
// a field.
export function logLine(visitorId: string, action: string, fields: Record<string, Value> = {}): string {
  const parts = [`visitor=${visitorTag(visitorId)}`, `action=${action}`];
  for (const [key, value] of Object.entries(fields)) {
    parts.push(`${key}=${typeof value === "string" ? JSON.stringify(value) : value}`);
  }
  return parts.join(" ");
}

export function log(visitorId: string, action: string, fields?: Record<string, Value>): void {
  console.log(logLine(visitorId, action, fields));
}
