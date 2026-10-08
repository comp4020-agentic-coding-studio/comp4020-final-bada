# All at once

The breakthrough was noticing that the transport has its own give-up case,
which my decision hadn't covered. I'd decided that nothing left while you
were away gets silently dropped: the SSE id is the mark's id, so a
reconnecting browser sends `Last-Event-ID` and the server replays the gap
from the marks table. I tested it by killing and restarting the server, and
it held. But that's not what a Fly deploy looks like from the browser. For a
few seconds the proxy answers with a 503, and `EventSource` only retries
network errors: any other answer closes the stream for good. Putting a
two-line 503 stub on the port between the kill and the restart showed it
directly. The tab stayed open and green and never heard another mark. The
fix was small (reopen a closed stream from the newest mark on the page),
but I'd only have found it by recreating the real gap rather than a
convenient approximation of it.

What it changed is how I think about "I tested the reconnect." The decision
record was sound and the test suite was green, and the one failure the
decision exists to prevent was still shipping on every deploy. A guarantee
is only as good as the worst path into it, and the path I'd tested was the
kindest one. I want to be the developer who asks what the gap actually looks
like in production (here, a proxy's error page, not a dropped socket) and
builds that gap locally before claiming the guarantee holds. The ADR now
names the case, and the test goes red without the fix, so the claim is
checked rather than remembered.
