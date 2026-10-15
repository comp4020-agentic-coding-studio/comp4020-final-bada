import { createHash } from "node:crypto";
import { appendFileSync } from "node:fs";

// One line per thing a person does, to stdout, which is what `flyctl logs`
// tails. Each line leads with who did it, so two people using the app at once
// can be told apart by reading the log alone.
//
// Fly keeps only a few hours of stdout, so every line also goes, timestamped,
// to a file on the volume, which outlives restarts and redeploys. Read it with
// `flyctl ssh console -a <app> -C "tail -n 100 /data/actions.log"`.
const LOG_FILE = `${process.env.DATA_DIR ?? "/data"}/actions.log`;

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
  const line = logLine(visitorId, action, fields);
  console.log(line);
  // A full or missing volume loses the durable copy, never the request.
  try {
    appendFileSync(LOG_FILE, `${new Date().toISOString()} ${line}\n`);
  } catch (err) {
    console.error(`couldn't append to ${LOG_FILE}: ${String(err)}`);
  }
}

// A coarse label for the User-Agent on someone's first request, so the log
// can tell a pod member's browser from a probe (uptime checks, link previews
// that do a GET). Coarse on purpose: the browser family is enough to narrate
// from, and the full string is a fingerprint the log doesn't need.
export function agentLabel(userAgent: string | undefined): string {
  const ua = userAgent ?? "";
  if (!ua) return "none";
  if (/bot|crawl|spider|preview|monitor|uptime|check/i.test(ua)) return "bot";
  if (/^(curl|wget|python|node|undici|go-http|axios)/i.test(ua)) return "script";
  if (/Edg\//.test(ua)) return "edge";
  if (/Firefox\//.test(ua)) return "firefox";
  if (/HeadlessChrome\//.test(ua)) return "headless";
  if (/Chrome\//.test(ua)) return "chrome";
  if (/Safari\//.test(ua)) return "safari";
  return "other";
}
