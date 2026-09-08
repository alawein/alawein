"""Kernel renderer: profile + catalog to managed file set.

See docs/governance/kernel-spec.md for the structural contract this package
implements, and docs/internal/plans/2026-09-08-kernel-canonicalization.md
for the phased rollout this belongs to (Phase 1).
"""

from .config import KernelConfig, RepoContext, load_kernel_config, load_repo_context
from .render import ManagedFile, markers_for, render_repo

__all__ = [
    "KernelConfig",
    "RepoContext",
    "load_kernel_config",
    "load_repo_context",
    "ManagedFile",
    "markers_for",
    "render_repo",
]
