#!/usr/bin/env bash
# smoke-openrouter-one.sh -- one cheap OpenRouter ping (freeze smoke)
# Reads OPENROUTER_API_KEY from the environment only. Never prints the key
# or completion text. Prints HTTP status and truncated content length.
# Exit 0 on HTTP 200.
set -euo pipefail

if [[ -z "${OPENROUTER_API_KEY:-}" ]]; then
  echo "BLOCK: OPENROUTER_API_KEY missing" >&2
  exit 1
fi

MODEL="${OPENROUTER_MODEL:-google/gemini-3.8-flash}"
URL="${OPENROUTER_BASE_URL:-https://openrouter.ai/api/v1/chat/completions}"
BODY="$(mktemp)"
trap 'rm -f "$BODY"' EXIT

PAYLOAD="$(
  OPENROUTER_MODEL="$MODEL" python3 -c '
import json, os
print(json.dumps({
    "model": os.environ["OPENROUTER_MODEL"],
    "messages": [{"role": "user", "content": "ping"}],
    "max_tokens": 64,
}))
'
)"

STATUS="$(
  curl -sS -o "$BODY" -w "%{http_code}" --max-time 60 \
    -X POST "$URL" \
    -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
    -H "Content-Type: application/json" \
    -H "HTTP-Referer: https://github.com/alawein/alawein" \
    -H "X-Title: alawein-smoke-openrouter-one" \
    --data "$PAYLOAD"
)"

CONTENT_LEN="$(
  python3 -c '
import json, sys
from pathlib import Path
content = ""
try:
    payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    choices = payload.get("choices") or []
    if choices:
        content = str((choices[0].get("message") or {}).get("content") or "")
except (OSError, UnicodeDecodeError, json.JSONDecodeError, TypeError, KeyError, IndexError):
    content = ""
print(len(content[:256]))
' "$BODY"
)"

printf 'status=%s\ncontent_len=%s\n' "$STATUS" "$CONTENT_LEN"

if [[ "$STATUS" == "200" ]]; then
  exit 0
fi
exit 1
