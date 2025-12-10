#!/usr/bin/env python3
"""
Performance benchmark for Python packages.
Usage: npm run perf:python
"""
import time
import sys
import importlib
from pathlib import Path


def benchmark_import(module: str) -> tuple[float, str]:
    """Benchmark module import time."""
    start = time.perf_counter()
    try:
        importlib.import_module(module)
        elapsed = time.perf_counter() - start
        return elapsed, "ok"
    except ImportError as e:
        return -1, f"not found: {e.name}"
    except Exception as e:
        return -1, f"error: {type(e).__name__}"


def format_time(seconds: float) -> str:
    """Format time in human-readable format."""
    if seconds < 0:
        return "N/A"
    if seconds < 0.001:
        return f"{seconds * 1_000_000:.1f}μs"
    if seconds < 1:
        return f"{seconds * 1000:.1f}ms"
    return f"{seconds:.2f}s"


def main():
    """Run benchmarks on Python packages."""
    print("🐍 Python Performance Benchmark\n")
    print("=" * 50)

    # Core Python packages to benchmark
    modules = [
        # Research packages
        ("equilibria", "QAP Solver"),
        ("mezan", "Balance Engine"),
        ("maglogic", "Magnetic Logic Simulator"),
        ("scicomp", "Scientific Computing"),
        # Common dependencies
        ("numpy", "NumPy"),
        ("pandas", "Pandas"),
        ("scipy", "SciPy"),
        ("matplotlib", "Matplotlib"),
        # Automation
        ("yaml", "PyYAML"),
        ("requests", "Requests"),
    ]

    results = []
    for module, description in modules:
        elapsed, status = benchmark_import(module)
        results.append((module, description, elapsed, status))

    # Print results
    print(f"\n{'Module':<20} {'Description':<25} {'Time':<12} {'Status'}")
    print("-" * 70)

    for module, description, elapsed, status in results:
        time_str = format_time(elapsed) if elapsed >= 0 else "—"
        status_icon = "✓" if status == "ok" else "✗"
        print(f"{module:<20} {description:<25} {time_str:<12} {status_icon} {status}")

    # Summary
    successful = [r for r in results if r[2] >= 0]
    if successful:
        total_time = sum(r[2] for r in successful)
        avg_time = total_time / len(successful)
        print("\n" + "=" * 50)
        print(f"📊 Summary:")
        print(f"   Modules loaded: {len(successful)}/{len(results)}")
        print(f"   Total import time: {format_time(total_time)}")
        print(f"   Average import time: {format_time(avg_time)}")

        # Recommendations
        slow_imports = [r for r in successful if r[2] > 1.0]
        if slow_imports:
            print("\n⚠️  Slow imports (>1s):")
            for module, desc, elapsed, _ in slow_imports:
                print(f"   - {module}: {format_time(elapsed)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
