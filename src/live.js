// Progressive enhancement: the wall works with this script off (post, reload,
// see everything). With it, marks other people leave arrive here as they're
// posted. The server replays anything missed across a reconnect (see
// /events in server.ts), so a dropped connection never silently loses one.
const list = document.querySelector("ol.marks");
const status = document.getElementById("live-status");
const LIVE = "Live: marks appear here as they're left.";
const FIRST_RETRY_MS = 2000;
const MAX_RETRY_MS = 60_000;

if (list && status && "EventSource" in window) {
  const shown = new Set([...list.children].map((li) => li.dataset.id));
  let newest = Number(status.dataset.after);
  let source;
  let retryMs = FIRST_RETRY_MS;
  let retryTimer;

  // The browser retries a dropped connection by itself, but gives up for good
  // if a retry gets any answer other than a stream: a 502 from Fly's proxy
  // while the one machine restarts on a deploy does it. So a closed source is
  // reopened here, from the newest mark already on the page.
  function connect() {
    clearTimeout(retryTimer);
    source = new EventSource(`/events?after=${newest}`);
    source.addEventListener("open", () => {
      retryMs = FIRST_RETRY_MS;
      status.textContent = LIVE;
    });
    source.addEventListener("error", () => {
      if (source.readyState === EventSource.CLOSED) {
        retryTimer = setTimeout(connect, retryMs);
        retryMs = Math.min(retryMs * 2, MAX_RETRY_MS);
      }
      status.textContent = "Reconnecting. Anything left meanwhile will still arrive.";
    });
    source.addEventListener("message", (event) => {
      const { id, html } = JSON.parse(event.data);
      newest = Math.max(newest, id);
      if (shown.has(String(id))) return;
      shown.add(String(id));
      list.insertAdjacentHTML("afterbegin", html);
      document.querySelector(".empty")?.remove();
    });
  }

  // A phone coming back to the tab shouldn't wait out a long backoff.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && source.readyState === EventSource.CLOSED) connect();
  });

  status.hidden = false;
  status.textContent = "Connecting…";
  connect();
}
