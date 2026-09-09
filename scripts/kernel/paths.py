"""Path resolution for the kernel package.

Layout assumption: this file lives at
``core/alawein/scripts/kernel/paths.py``. ``HUB_ROOT`` is the ``core/alawein``
checkout; ``WORKSPACE_ROOT`` is the container directory that holds every
bucket (``apps``, ``core``, ``lab``, ``sites``, ``work``, ``_archive``).
"""

from __future__ import annotations

from pathlib import Path

KERNEL_PKG_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = KERNEL_PKG_DIR.parent
HUB_ROOT = SCRIPTS_DIR.parent
WORKSPACE_ROOT = HUB_ROOT.parent.parent

CATALOG_DIR = HUB_ROOT / "catalog"
REPOS_JSON = CATALOG_DIR / "repos.json"
KERNEL_YAML = CATALOG_DIR / "kernel.yaml"
TEMPLATES_DIR = HUB_ROOT / "templates" / "kernel"
COMMON_TEMPLATES_DIR = TEMPLATES_DIR / "_common"
GENERATED_DIR = CATALOG_DIR / "generated"


def repo_local_path(local_path: str) -> Path:
    """Resolve a catalog ``local_path`` (e.g. ``lab/adil``) to an absolute path."""
    return WORKSPACE_ROOT / local_path
