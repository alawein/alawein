"""Import shim: tests import this module; CLI uses the hyphenated name."""
import importlib.util as _util
import sys as _sys
from pathlib import Path as _P

_spec = _util.spec_from_file_location(
    "_audit_todo_fixme",
    str(_P(__file__).parent / "audit-todo-fixme.py"),
)
_m = _util.module_from_spec(_spec)
_sys.modules["_audit_todo_fixme"] = _m
_spec.loader.exec_module(_m)
globals().update({k: v for k, v in vars(_m).items() if not k.startswith("_")})
