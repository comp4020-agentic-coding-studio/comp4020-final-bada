import type { Mark } from "./db.ts";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

const timeFormat = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Sydney",
  dateStyle: "medium",
  timeStyle: "short",
});

export function page(title: string, body: string): string {
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font: 1rem/1.5 system-ui, sans-serif;
    max-width: 38rem;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  header p { color: color-mix(in srgb, currentColor 65%, transparent); }
  form { display: grid; gap: 0.75rem; margin: 1.5rem 0 2rem; }
  label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
  input, textarea {
    width: 100%;
    font: inherit;
    padding: 0.5rem;
    box-sizing: border-box;
  }
  button {
    font: inherit;
    padding: 0.5rem 1rem;
    width: fit-content;
    cursor: pointer;
  }
  ol.marks { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }
  .mark {
    padding: 0.75rem 1rem;
    border-left: 3px solid color-mix(in srgb, currentColor 25%, transparent);
  }
  .mark.mine { border-left-color: currentColor; }
  .mark.new { border-left-color: Highlight; }
  .mark-body { margin: 0 0 0.35rem; white-space: pre-wrap; }
  .mark-meta {
    margin: 0;
    font-size: 0.85rem;
    color: color-mix(in srgb, currentColor 65%, transparent);
  }
  .badge {
    display: inline-block;
    font-size: 0.75rem;
    border: 1px solid currentColor;
    border-radius: 1em;
    padding: 0 0.5em;
    margin-left: 0.25em;
  }
  .live-status {
    font-size: 0.85rem;
    margin: 0 0 1rem;
    color: color-mix(in srgb, currentColor 65%, transparent);
  }
  .empty { color: color-mix(in srgb, currentColor 65%, transparent); }
  footer { margin-top: 3rem; font-size: 0.85rem; }
</style>
</head>
<body>
${body}
</body>
</html>
`;
}

export function markItem(mark: Mark, visitorId: string, isNew: boolean): string {
  const mine = mark.visitor_id === visitorId;
  const fresh = isNew && !mine;
  const classes = ["mark", mine && "mine", fresh && "new"].filter(Boolean).join(" ");
  return `<li class="${classes}" data-id="${mark.id}">
  <p class="mark-body">${escapeHtml(mark.body)}</p>
  <p class="mark-meta">${escapeHtml(mark.name)} · <time datetime="${mark.created_at}">${timeFormat.format(new Date(mark.created_at))}</time>${
    mine ? ' <span class="badge">yours</span>' : ""
  }${fresh ? ' <span class="badge">new</span>' : ""}</p>
</li>`;
}

// `seenId` is the newest mark this visitor had already seen before this page
// load; anything newer that isn't theirs is badged "new". Undefined on a first
// visit, where everything is new and so nothing is worth singling out.
export function marksList(marks: Mark[], visitorId: string, seenId: number | undefined): string {
  const items = marks
    .map((mark) => markItem(mark, visitorId, seenId !== undefined && mark.id > seenId))
    .join("\n");
  // The list is always there, even empty, so a live mark has somewhere to go.
  const empty = marks.length === 0 ? `<p class="empty">No marks yet — be the first.</p>\n` : "";
  return `${empty}<ol class="marks" aria-live="polite">\n${items}\n</ol>`;
}
