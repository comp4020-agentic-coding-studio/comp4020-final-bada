// Progressive enhancement: the wall works with this script off (post, reload,
// see everything). With it, marks other people leave arrive here as they're
// posted. The server replays anything missed across a reconnect (see
// /events in server.ts), so a dropped connection never silently loses one.
const list = document.querySelector("ol.marks");
const status = document.getElementById("live-status");

if (list && status && "EventSource" in window) {
  const shown = new Set([...list.children].map((li) => li.dataset.id));
  const source = new EventSource(`/events?after=${status.dataset.after}`);
  status.hidden = false;
  status.textContent = "Connecting…";

  source.addEventListener("open", () => {
    status.textContent = "Live: marks appear here as they're left.";
  });
  source.addEventListener("error", () => {
    status.textContent =
      source.readyState === EventSource.CLOSED
        ? "Not live any more. Reload to see new marks."
        : "Reconnecting. Anything left meanwhile will still arrive.";
  });
  source.addEventListener("message", (event) => {
    const { id, html } = JSON.parse(event.data);
    if (shown.has(String(id))) return;
    shown.add(String(id));
    list.insertAdjacentHTML("afterbegin", html);
    document.querySelector(".empty")?.remove();
  });
}
