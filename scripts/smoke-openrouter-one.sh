#!/usr/bin/env bash
# smoke-openrouter-one.sh -- one cheap OpenRouter ping (freeze smoke)
# Reads OPENROUTER_API_KEY from the environment only. Never prints the key
# or completion text. Prints HTTP status and truncated content length.
# Exit 0 on HTTP 200. Key stays out of process argv (Python urllib).
set -euo pipefail

if [[ "${MAIOS_PANEL_KILL:-}" == "1" ]]; then
  echo "BLOCK: MAIOS_PANEL_KILL=1" >&2
  exit 1
fi

if [[ -z "${OPENROUTER_API_KEY:-}" ]]; then
  echo "BLOCK: OPENROUTER_API_KEY missing" >&2
  exit 1
fi

MODEL="${OPENROUTER_MODEL:-google/gemini-3.8-flash}"
BASE="${OPENROUTER_BASE_URL:-https://openrouter.ai/api/v1}"

OPENROUTER_MODEL="$MODEL" OPENROUTER_BASE_URL="$BASE" python3 -c '
import http.client
import json
import os
import sys
import urllib.error
import urllib.request

model = os.environ["OPENROUTER_MODEL"]
base = os.environ["OPENROUTER_BASE_URL"].rstrip("/")
if base.endswith("/chat/completions"):
    url = base
else:
    url = base + "/chat/completions"

key = os.environ["OPENROUTER_API_KEY"]
body = {
    "model": model,
    "messages": [{"role": "user", "content": "ping"}],
    "max_tokens": 64,
}
req = urllib.request.Request(
    url,
    data=json.dumps(body).encode("utf-8"),
    headers={
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/alawein/alawein",
        "X-Title": "alawein-smoke-openrouter-one",
    },
    method="POST",
)


def _load_json(raw):
    try:
        return json.loads(raw.decode("utf-8", errors="replace"))
    except (json.JSONDecodeError, UnicodeDecodeError, AttributeError, TypeError):
        return {}


status = 0
payload = {}
try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        status = int(resp.status)
        payload = _load_json(resp.read())
except urllib.error.HTTPError as exc:
    status = int(exc.code)
    payload = _load_json(exc.read())
except (
    OSError,
    TimeoutError,
    ValueError,
    urllib.error.URLError,
    http.client.HTTPException,
):
    status = 0
    payload = {}

content = ""
if isinstance(payload, dict):
    choices = payload.get("choices") or []
    first = choices[0] if isinstance(choices, list) and choices else None
    message = first.get("message") if isinstance(first, dict) else None
    if isinstance(message, dict):
        content = str(message.get("content") or "")
print("status=%s" % status)
print("content_len=%s" % len(content[:256]))
sys.exit(0 if status == 200 else 1)
'
