import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync } from "node:fs";
import { marked } from "marked";
import { getCookie, getVisitorId, setCookie } from "./cookies.ts";
import { escapeHtml, markItem, marksList, page } from "./render.ts";
import { getSeen, insertMark, listMarks, markSeen, marksAfter, type Mark } from "./db.ts";

const PORT = Number(process.env.PORT ?? 8080);
const MAX_NAME = 40;
const MAX_BODY = 280;
const MAX_REQUEST_BYTES = 8192;
// Fly's proxy drops a connection that's silent for too long; a comment line
// every so often keeps an idle live connection open.
const HEARTBEAT_MS = 25_000;
const liveScript = readFileSync(new URL("./live.js", import.meta.url), "utf8");

// Every open live connection, on this one machine (fly.toml runs exactly one,
// and deploys pass --ha=false, so an in-process set is the whole audience).
interface Listener {
  res: ServerResponse;
  visitorId: string;
}
const listeners = new Set<Listener>();

// Each listener gets the mark rendered for them, so "yours" is right per
// visitor. The SSE id is the mark's id: a reconnecting browser sends it back
// as Last-Event-ID, and marksAfter() replays whatever it missed meanwhile.
function deliver(listener: Listener, mark: Mark): void {
  const html = markItem(mark, listener.visitorId, true);
  listener.res.write(`id: ${mark.id}\ndata: ${JSON.stringify({ id: mark.id, html })}\n\n`);
  markSeen(listener.visitorId, mark.id);
}

function openStream(req: IncomingMessage, res: ServerResponse, visitorId: string, after: number): void {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 2000\n\n");
  const listener = { res, visitorId };
  if (Number.isSafeInteger(after) && after >= 0) {
    for (const mark of marksAfter(after)) deliver(listener, mark);
  }
  listeners.add(listener);
  req.on("close", () => listeners.delete(listener));
}

setInterval(() => {
  for (const { res } of listeners) res.write(": ping\n\n");
}, HEARTBEAT_MS).unref();

// `.trim()` only strips whitespace (Unicode `Zs`), not zero-width/format
// characters (`Cf`, e.g. U+200B) — a string made of nothing else survives
// `.trim()` non-empty and reads as blank on the wall.
function hasVisibleContent(s: string): boolean {
  return /[^\s\p{Cf}]/u.test(s);
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req as AsyncIterable<Buffer>) {
    size += chunk.length;
    if (size > MAX_REQUEST_BYTES) throw new Error("request body too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function homePage(marks: Mark[], visitorId: string, seenId: number | undefined, lastName: string): string {
  const newest = marks[0]?.id ?? 0;
  return page(
    "Marks",
    `<header>
  <h1>Marks</h1>
  <p>Leave a short mark. It'll still be here when you're back — <a href="/readme/">what this is for</a>.</p>
</header>
<main>
<form method="post" action="/">
  <p>
    <label for="name">Your name</label>
    <input id="name" name="name" required maxlength="${MAX_NAME}" autocomplete="name" value="${escapeHtml(lastName)}">
  </p>
  <p>
    <label for="body">Your mark</label>
    <textarea id="body" name="body" required maxlength="${MAX_BODY}" rows="2"></textarea>
  </p>
  <button type="submit">Leave it</button>
</form>
<p id="live-status" class="live-status" data-after="${newest}" hidden></p>
${marksList(marks, visitorId, seenId)}
</main>
<script src="/live.js" defer></script>`,
  );
}

const server = createServer((req, res) => {
  void (async () => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      const visitorId = getVisitorId(req, res);

      if (req.method === "GET" && url.pathname === "/") {
        const lastName = getCookie(req, "name") ?? "";
        const marks = listMarks();
        const seenId = getSeen(visitorId);
        if (marks.length > 0) markSeen(visitorId, marks[0].id);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(homePage(marks, visitorId, seenId, lastName));
        return;
      }

      if (req.method === "GET" && url.pathname === "/events") {
        // A reconnect's Last-Event-ID wins over the page's own starting point.
        // No starting point at all means live-only, not the whole history.
        const after = Number(req.headers["last-event-id"] ?? url.searchParams.get("after") ?? NaN);
        openStream(req, res, visitorId, after);
        return;
      }

      if (req.method === "GET" && url.pathname === "/live.js") {
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
        res.end(liveScript);
        return;
      }

      if (req.method === "POST" && url.pathname === "/") {
        const raw = await readBody(req);
        const params = new URLSearchParams(raw);
        const name = (params.get("name") ?? "").trim().slice(0, MAX_NAME);
        const body = (params.get("body") ?? "").trim().slice(0, MAX_BODY);
        if (hasVisibleContent(name) && hasVisibleContent(body)) {
          const mark = insertMark(visitorId, name, body);
          setCookie(res, "name", name);
          for (const listener of listeners) deliver(listener, mark);
        }
        res.writeHead(303, { Location: "/" });
        res.end();
        return;
      }

      if (req.method === "GET" && url.pathname === "/readme/") {
        const md = readFileSync("README.md", "utf8");
        const html = await marked.parse(md);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(page("About this app", `<main>${html}</main>`));
        return;
      }

      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("not found");
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      }
      res.end("something went wrong");
    }
  })();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on :${PORT}`);
});
