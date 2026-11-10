"""Per-IP login throttling, kept in memory. Needs a single uvicorn worker."""
import time
from collections import deque
from threading import Lock

LIMIT, WINDOW = 10, 15 * 60
_attempts: dict[str, deque[float]] = {}
_lock = Lock()


def _now() -> float:
    return time.monotonic()


def try_attempt(ip: str) -> int:
    """Count one attempt. Returns seconds to wait if over the limit, else 0."""
    now = _now()
    with _lock:
        q = _attempts.setdefault(ip, deque())
        while q and q[0] <= now - WINDOW:
            q.popleft()
        if len(q) >= LIMIT:
            return int(q[0] + WINDOW - now) + 1
        q.append(now)
        return 0


def clear(ip: str) -> None:
    with _lock:
        _attempts.pop(ip, None)


def reset() -> None:
    with _lock:
        _attempts.clear()
