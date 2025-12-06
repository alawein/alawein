#!/usr/bin/env python3
"""
MEZAN V4.1.0 - Benchmark Visualization

Creates performance charts from benchmark results.
"""

import sys
import json
from pathlib import Path
from typing import Dict, List, Any

# Add MEZAN to path
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import numpy as np
    import matplotlib
    matplotlib.use('Agg')  # Non-interactive backend
    import matplotlib.pyplot as plt
    import seaborn as sns
    print("✅ Visualization imports successful")
except ImportError as e:
    print(f"⚠️  Matplotlib not available: {e}")
    print("Continuing without visualizations...")
    sys.exit(0)


def load_latest_results(results_dir: Path) -> Dict[str, Any]:
    """Load the most recent benchmark results"""
    result_files = list(results_dir.glob("benchmark_results_*.json"))
    if not result_files:
        raise FileNotFoundError("No benchmark results found")

    latest = max(result_files, key=lambda p: p.stat().st_mtime)
    print(f"📂 Loading results from: {latest.name}")

    with open(latest) as f:
        return json.load(f)


def create_performance_chart(data: Dict[str, Any], output_dir: Path):
    """Create performance comparison chart"""
    results = data["results"]

    if not results:
        print("No results to visualize")
        return

    # Group by problem type
    problem_types = {}
    for r in results:
        ptype = r["problem_type"]
        if ptype not in problem_types:
            problem_types[ptype] = {"sizes": [], "times": [], "solver": r["solver"]}
        problem_types[ptype]["sizes"].append(r["size"])
        problem_types[ptype]["times"].append(r["time"])

    # Create figure
    fig, axes = plt.subplots(1, len(problem_types), figsize=(15, 5))
    if len(problem_types) == 1:
        axes = [axes]

    for idx, (ptype, pdata) in enumerate(problem_types.items()):
        ax = axes[idx]

        sizes = pdata["sizes"]
        times = pdata["times"]
        solver = pdata["solver"]

        ax.plot(sizes, times, 'o-', linewidth=2, markersize=8, label=solver)
        ax.set_xlabel("Problem Size", fontsize=12, fontweight='bold')
        ax.set_ylabel("Time (seconds)", fontsize=12, fontweight='bold')
        ax.set_title(f"{ptype} Performance", fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.legend()

    plt.tight_layout()
    output_file = output_dir / "performance_chart.png"
    fig.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"✅ Performance chart saved: {output_file}")
    plt.close()


def create_summary_table(data: Dict[str, Any], output_dir: Path):
    """Create summary table image"""
    summary = data.get("summary", {})
    if not summary:
        return

    # Create text summary
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.axis('tight')
    ax.axis('off')

    # Table data
    table_data = []
    table_data.append(["Problem Type", "Avg Time (s)", "Std (s)", "Min (s)", "Max (s)"])

    for ptype, stats in summary.get("avg_time_by_type", {}).items():
        table_data.append([
            ptype,
            f"{stats['mean']:.6f}",
            f"{stats['std']:.6f}",
            f"{stats['min']:.6f}",
            f"{stats['max']:.6f}",
        ])

    table = ax.table(cellText=table_data, cellLoc='center', loc='center',
                    colWidths=[0.25, 0.15, 0.15, 0.15, 0.15])
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1, 2)

    # Style header row
    for i in range(5):
        table[(0, i)].set_facecolor('#4CAF50')
        table[(0, i)].set_text_props(weight='bold', color='white')

    # Alternate row colors
    for i in range(1, len(table_data)):
        for j in range(5):
            if i % 2 == 0:
                table[(i, j)].set_facecolor('#f0f0f0')

    plt.title("MEZAN V4.1.0 - Benchmark Summary", fontsize=16, fontweight='bold', pad=20)

    output_file = output_dir / "summary_table.png"
    fig.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"✅ Summary table saved: {output_file}")
    plt.close()


def create_solver_comparison(data: Dict[str, Any], output_dir: Path):
    """Create solver comparison bar chart"""
    summary = data.get("summary", {})
    solver_data = summary.get("by_solver", {})

    if not solver_data:
        return

    solvers = []
    run_counts = []
    avg_times = []

    for solver, results in solver_data.items():
        solvers.append(solver)
        run_counts.append(len(results))
        avg_times.append(np.mean([r["time"] for r in results]))

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    # Run counts
    ax1.bar(range(len(solvers)), run_counts, color='steelblue', alpha=0.7)
    ax1.set_xticks(range(len(solvers)))
    ax1.set_xticklabels(solvers, rotation=45, ha='right')
    ax1.set_ylabel("Number of Runs", fontsize=12, fontweight='bold')
    ax1.set_title("Benchmark Coverage by Solver", fontsize=14, fontweight='bold')
    ax1.grid(axis='y', alpha=0.3)

    # Average times
    ax2.bar(range(len(solvers)), avg_times, color='coral', alpha=0.7)
    ax2.set_xticks(range(len(solvers)))
    ax2.set_xticklabels(solvers, rotation=45, ha='right')
    ax2.set_ylabel("Average Time (s)", fontsize=12, fontweight='bold')
    ax2.set_title("Average Execution Time", fontsize=14, fontweight='bold')
    ax2.grid(axis='y', alpha=0.3)

    plt.tight_layout()
    output_file = output_dir / "solver_comparison.png"
    fig.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"✅ Solver comparison saved: {output_file}")
    plt.close()


def generate_markdown_report(data: Dict[str, Any], output_dir: Path):
    """Generate markdown benchmark report"""
    report = []
    report.append("# MEZAN V4.1.0 - Benchmark Report\n")
    report.append(f"**Version:** {data.get('mezan_version', 'Unknown')}\n")
    report.append(f"**Timestamp:** {data.get('timestamp', 'Unknown')}\n")
    report.append("\n---\n")

    summary = data.get("summary", {})

    report.append("\n## Summary Statistics\n")
    report.append(f"- **Total Benchmarks:** {summary.get('total_benchmarks', 0)}\n")

    report.append("\n### Performance by Problem Type\n")
    report.append("\n| Problem Type | Avg Time (s) | Std Dev | Min | Max |\n")
    report.append("|--------------|--------------|---------|-----|-----|\n")

    for ptype, stats in summary.get("avg_time_by_type", {}).items():
        report.append(
            f"| {ptype} | {stats['mean']:.6f} | {stats['std']:.6f} | "
            f"{stats['min']:.6f} | {stats['max']:.6f} |\n"
        )

    report.append("\n### Solver Coverage\n")
    report.append("\n| Solver | Runs | Avg Time (s) |\n")
    report.append("|--------|------|-------------|\n")

    for solver, results in summary.get("by_solver", {}).items():
        avg_time = np.mean([r["time"] for r in results])
        report.append(f"| {solver} | {len(results)} | {avg_time:.6f} |\n")

    report.append("\n---\n")
    report.append("\n## Visualizations\n")
    report.append("\n### Performance Chart\n")
    report.append("![Performance Chart](performance_chart.png)\n")
    report.append("\n### Summary Table\n")
    report.append("![Summary Table](summary_table.png)\n")
    report.append("\n### Solver Comparison\n")
    report.append("![Solver Comparison](solver_comparison.png)\n")

    report.append("\n---\n")
    report.append("\n*Generated by MEZAN Benchmark Suite*\n")

    output_file = output_dir / "BENCHMARK_REPORT.md"
    with open(output_file, "w") as f:
        f.writelines(report)

    print(f"✅ Markdown report saved: {output_file}")


def main():
    """Main entry point"""
    results_dir = Path(__file__).parent / "results"

    print("=" * 70)
    print("📊 MEZAN V4.1.0 - Benchmark Visualization")
    print("=" * 70)

    try:
        # Load results
        data = load_latest_results(results_dir)
        print(f"✅ Loaded {len(data.get('results', []))} benchmark results\n")

        # Create visualizations
        print("🎨 Creating visualizations...")
        create_performance_chart(data, results_dir)
        create_summary_table(data, results_dir)
        create_solver_comparison(data, results_dir)

        # Generate markdown report
        print("\n📝 Generating markdown report...")
        generate_markdown_report(data, results_dir)

        print("\n✅ All visualizations created successfully!")
        print(f"📁 Output directory: {results_dir}")

        return 0

    except Exception as e:
        print(f"\n❌ Visualization failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
