#!/usr/bin/env python3
"""OpenRouter task router — pick a model from config/model-routing.yaml and complete a prompt.

Reads OPENROUTER_API_KEY from gitignored env files (never from argv). Use for local
background workflows: voice passes, catalog audits, codegen batches.

Usage:
    python scripts/ops/openrouter_route.py --route fast --prompt "Summarize diff"
    python scripts/ops/openrouter_route.py --workflow pr-ready --stdin
    python scripts/ops/openrouter_route.py --list-routes
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore[assignment]


REPO_ROOT = Path(__file__).resolve().parents[2]
ROUTING_PATH = REPO_ROOT / "config" / "model-routing.yaml"


def _expand(path: str) -> Path:
    return Path(os.path.expanduser(path))


def load_api_key(routing: dict[str, Any]) -> str:
    for spec in routing.get("env_files", []):
        path = _expand(spec)
        if not path.is_file():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("OPENROUTER_API_KEY="):
                value = line.split("=", 1)[1].strip().strip('"').strip("'")
                if value:
                    return value
    env = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if env:
        return env
    raise SystemExit(
        "OPENROUTER_API_KEY not set. Add it to ~/.openrouter.env or workspace .env.local "
        "(gitignored)."
    )


def load_routing(path: Path = ROUTING_PATH) -> dict[str, Any]:
    if yaml is None:
        raise SystemExit("PyYAML required: pip install pyyaml")
    if not path.is_file():
        raise SystemExit(f"routing config missing: {path}")
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise SystemExit(f"invalid routing config: {path}")
    return data


def resolve_model(routing: dict[str, Any], route: str) -> str:
    routes = routing.get("routes") or {}
    if route not in routes:
        known = ", ".join(sorted(routes))
        raise SystemExit(f"unknown route {route!r}; known: {known}")
    entry = routes[route]
    if isinstance(entry, dict) and entry.get("model"):
        return str(entry["model"])
    raise SystemExit(f"route {route!r} has no model")


def chat_complete(
    *,
    api_key: str,
    base_url: str,
    model: str,
    prompt: str,
    temperature: float,
    max_tokens: int,
) -> str:
    url = base_url.rstrip("/") + "/chat/completions"
    body = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/alawein/alawein",
            "X-Title": "alawein-control-plane",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"OpenRouter HTTP {e.code}: {detail}") from e
    choices = payload.get("choices") or []
    if not choices:
        raise SystemExit(f"OpenRouter empty response: {payload!r}")
    message = choices[0].get("message") or {}
    content = message.get("content")
    if not content:
        raise SystemExit(f"OpenRouter no content: {payload!r}")
    return str(content)


def list_routes(routing: dict[str, Any]) -> None:
    routes = routing.get("routes") or {}
    workflows = routing.get("workflows") or {}
    print("routes:")
    for name in sorted(routes):
        entry = routes[name]
        model = entry.get("model") if isinstance(entry, dict) else "?"
        use = entry.get("use") if isinstance(entry, dict) else ""
        print(f"  {name:12} {model}")
        if use:
            print(f"               {use}")
    print("\nworkflows:")
    for name in sorted(workflows):
        steps = workflows[name].get("steps") if isinstance(workflows[name], dict) else []
        chain = " -> ".join(
            s.get("route", "?") for s in steps if isinstance(s, dict)
        )
        print(f"  {name:16} {chain}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="OpenRouter task router")
    parser.add_argument("--route", help="Named route from model-routing.yaml")
    parser.add_argument("--workflow", help="Run each workflow step (prints plan only unless --execute-all)")
    parser.add_argument("--model", help="Override model id")
    parser.add_argument("--prompt", help="User prompt text")
    parser.add_argument("--stdin", action="store_true", help="Read prompt from stdin")
    parser.add_argument("--list-routes", action="store_true")
    parser.add_argument(
        "--execute-all",
        action="store_true",
        help="With --workflow, run each step sequentially (same prompt)",
    )
    parser.add_argument("--config", type=Path, default=ROUTING_PATH)
    args = parser.parse_args(argv)

    routing = load_routing(args.config)

    if args.list_routes:
        list_routes(routing)
        return 0

    prompt = args.prompt
    if args.stdin:
        prompt = sys.stdin.read()
    if not prompt and not args.workflow:
        parser.error("provide --prompt or --stdin")

    defaults = routing.get("defaults") or {}
    temperature = float(defaults.get("temperature", 0.2))
    max_tokens = int(defaults.get("max_tokens", 8192))
    base_url = str(routing.get("base_url", "https://openrouter.ai/api/v1"))

    if args.workflow:
        wf = (routing.get("workflows") or {}).get(args.workflow)
        if not wf:
            raise SystemExit(f"unknown workflow {args.workflow!r}")
        steps = wf.get("steps") or []
        if not args.execute_all:
            print(f"workflow {args.workflow}:")
            for i, step in enumerate(steps, 1):
                route = step.get("route", "?")
                task = step.get("task", "")
                model = resolve_model(routing, route)
                print(f"  {i}. [{route}] {model} — {task}")
            print("\nRe-run with --execute-all to call OpenRouter for each step.")
            return 0
        api_key = load_api_key(routing)
        out_parts: list[str] = []
        current = prompt or ""
        for step in steps:
            route = str(step.get("route", "fast"))
            task = str(step.get("task", ""))
            model = args.model or resolve_model(routing, route)
            step_prompt = f"{task}\n\n---\n\n{current}".strip()
            chunk = chat_complete(
                api_key=api_key,
                base_url=base_url,
                model=model,
                prompt=step_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            out_parts.append(chunk)
            current = chunk
        sys.stdout.write(out_parts[-1])
        if not out_parts[-1].endswith("\n"):
            sys.stdout.write("\n")
        return 0

    route = args.route or "fast"
    model = args.model or resolve_model(routing, route)
    api_key = load_api_key(routing)
    assert prompt is not None
    text = chat_complete(
        api_key=api_key,
        base_url=base_url,
        model=model,
        prompt=prompt,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    sys.stdout.write(text)
    if not text.endswith("\n"):
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
