#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
INDEX_FILE="$ROOT_DIR/tasks/index.json"

if [[ ! -f "$INDEX_FILE" ]]; then
  echo "spec-guard: missing tasks/index.json" >&2
  exit 1
fi

SPEC_GUARD_ROOT="$ROOT_DIR" python3 <<'PYTHON'
import json
import sys
import datetime
import re
import os
from pathlib import Path

root_env = os.environ.get("SPEC_GUARD_ROOT")
if root_env:
    root = Path(root_env)
else:
    root = Path(__file__).resolve().parent.parent

index_path = root / "tasks" / "index.json"

try:
    data = json.loads(index_path.read_text())
except Exception as exc:
    print(f"spec-guard: failed to parse {index_path}: {exc}", file=sys.stderr)
    sys.exit(1)

errors = []
if "items" not in data or not isinstance(data["items"], list):
    errors.append("spec-guard: /tasks/index.json must define an 'items' array")
if "specs" not in data or not isinstance(data["specs"], list):
    errors.append("spec-guard: /tasks/index.json must define a 'specs' array")

spec_dir = root / "tasks" / "specs"
if spec_dir.exists():
    today = datetime.date.today()
    for path in sorted(spec_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        match = re.search(r"last_review:\s*(\d{4}-\d{2}-\d{2})", text)
        if not match:
            errors.append(f"spec-guard: {path.relative_to(root)} missing last_review")
            continue
        try:
            reviewed = datetime.date.fromisoformat(match.group(1))
        except ValueError:
            errors.append(f"spec-guard: {path.relative_to(root)} has invalid last_review")
            continue
        if (today - reviewed).days > 30:
            errors.append(
                f"spec-guard: {path.relative_to(root)} last_review {reviewed} is older than 30 days"
            )

if errors:
    for line in errors:
        print(line, file=sys.stderr)
    sys.exit(1)

print("spec-guard: checks passed")
PYTHON
