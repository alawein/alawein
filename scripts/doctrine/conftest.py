"""Pytest configuration for doctrine validator tests.

Prepends the doctrine script directory to sys.path so that
`validate_repo_framework` (the import shim) can be resolved regardless
of pytest's invocation cwd.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
