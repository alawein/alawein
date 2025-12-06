# Rebuild Instructions - AlaweinOS/Benchmarks

**Project:** AlaweinOS/Benchmarks
**Archive Date:** 2025-01-29
**Status:** Fully Preserved

## Quick Rebuild

To restore the exact original implementation:

```bash
cd /mnt/c/Users/mesha/Desktop/GitHub

# Copy archived files back to project
cp -r .archive/benchmarks-consolidation/original-src/* \
      organizations/AlaweinOS/Benchmarks/

# Verify restoration
cd organizations/AlaweinOS/Benchmarks
ls -la
```

The original code will work independently as it did before consolidation.

## Original Structure

```
organizations/AlaweinOS/Benchmarks/
├── run_benchmarks.py          # Main benchmark runner
├── visualize_benchmarks.py    # Chart generation
├── README.md                  # Project documentation
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
├── pyproject.toml
├── .meta/
│   └── repo.yaml
├── tests/
│   ├── __init__.py
│   └── test_placeholder.py
└── results/
    └── benchmark_results_*.json
```

## Running Original Code

### Prerequisites

```bash
# Install dependencies (from original pyproject.toml)
cd organizations/AlaweinOS/Benchmarks
pip install numpy matplotlib seaborn pyyaml

# Ensure MEZAN is available (required by original implementation)
# The original code imports from ../MEZAN/core
```

### Run Benchmarks

```bash
# Run the original benchmark suite
python run_benchmarks.py

# Output: results/benchmark_results_<timestamp>.json
```

### Generate Visualizations

```bash
# Create charts from results
python visualize_benchmarks.py

# Output:
# - results/performance_chart.png
# - results/summary_table.png
# - results/solver_comparison.png
# - results/BENCHMARK_REPORT.md
```

## File Details

### run_benchmarks.py (336 lines)

**Purpose:** MEZAN V4.1.0 benchmark suite
**Dependencies:**
- numpy
- MEZAN.core (from parent directory)

**Key Classes:**
- `BenchmarkRunner` - Main benchmark orchestrator
- Methods: `run_qap_benchmarks()`, `run_flow_benchmarks()`, `run_allocation_benchmarks()`

**Usage:**
```python
python run_benchmarks.py
# Runs all MEZAN Libria solver benchmarks
# Outputs JSON results to results/
```

### visualize_benchmarks.py (263 lines)

**Purpose:** Generate charts and reports from benchmark results
**Dependencies:**
- numpy
- matplotlib
- seaborn

**Functions:**
- `create_performance_chart()` - Line plots of performance
- `create_summary_table()` - Statistics table
- `create_solver_comparison()` - Bar charts
- `generate_markdown_report()` - Markdown report

**Usage:**
```python
python visualize_benchmarks.py
# Loads latest results/benchmark_results_*.json
# Generates charts and markdown report
```

## Differences from Hub Version

### Original (MEZAN-specific)

```python
# run_benchmarks.py (original)
class BenchmarkRunner:
    def run_qap_benchmarks(self):
        """Run QAP benchmarks with varying problem sizes"""
        # Hardcoded MEZAN-specific logic
        from MEZAN.core import OptimizationProblem, ProblemType

        problem = OptimizationProblem(
            problem_type=ProblemType.QAP,
            data={...}
        )
        # MEZAN-specific implementation
```

### Hub Version (Universal)

```python
# .metaHub/libs/benchmarking/core.py (generalized)
def run_benchmark(target: Callable, iterations: int = 100, **kwargs):
    """Universal benchmark runner for ANY callable"""
    # Generic implementation
    # Works with MEZAN, QMatSim, or any Python function

    for _ in range(iterations):
        start = time.perf_counter()
        target(**kwargs)
        end = time.perf_counter()
        times.append(end - start)
```

**Key Difference:** Hub version is generic, original is MEZAN-specific.

## Why Original Was Preserved

While the hub version is better for the ecosystem:

1. **Historical Reference** - See original MEZAN benchmark implementation
2. **Validation** - Compare hub results against original
3. **Rollback** - Can revert if hub version has issues
4. **Documentation** - Shows evolution of the codebase
5. **Nothing Lost** - 100% preservation of work

## Rebuilding from Archive

### Full Restoration

```bash
# 1. Navigate to archive
cd .archive/benchmarks-consolidation/original-src

# 2. Verify all files present
ls -la
# Should show 11 files

# 3. Copy to desired location
cp -r * /path/to/new/location/

# 4. Done! Original code ready to use
```

### Partial Restoration

Extract specific files:

```bash
# Just the main runner
cp .archive/benchmarks-consolidation/original-src/run_benchmarks.py \
   /path/to/destination/

# Just the visualizer
cp .archive/benchmarks-consolidation/original-src/visualize_benchmarks.py \
   /path/to/destination/
```

## Git History

Git commit history for the original Benchmarks project:

```bash
# View archived git history
cat .archive/benchmarks-consolidation/git-history.txt

# Note: If empty, project may be newly created
# Full git history still available in main repository
git log --follow -- organizations/AlaweinOS/Benchmarks/
```

## Integration Points

The original code expected:

### MEZAN Integration
```python
# Line 15-16 of run_benchmarks.py
sys.path.insert(0, str(Path(__file__).parent.parent))
from MEZAN.core import OptimizationProblem, ...
```

**Requirement:** MEZAN must be in `../MEZAN/` relative to Benchmarks

### File Paths
```python
# Line 314 of run_benchmarks.py
output_dir = Path(__file__).parent / "results"
```

**Requirement:** Results go to `Benchmarks/results/`

## Testing Original

```bash
cd organizations/AlaweinOS/Benchmarks

# Test 1: Check MEZAN import works
python -c "import sys; from pathlib import Path; \
sys.path.insert(0, str(Path('..').absolute())); \
from MEZAN.core import OptimizationProblem; \
print('✅ MEZAN import successful')"

# Test 2: Run benchmark suite
python run_benchmarks.py

# Test 3: Generate visualizations
python visualize_benchmarks.py

# Expected output:
# - results/benchmark_results_*.json
# - results/performance_chart.png
# - results/summary_table.png
# - results/BENCHMARK_REPORT.md
```

## Comparison: Original vs Hub

| Aspect | Original | Hub Version |
|--------|----------|-------------|
| **Lines of Code** | ~600 | ~400 (generalized) |
| **Scope** | MEZAN only | All projects |
| **Interface** | `python script.py` | `bench` CLI |
| **Reusability** | No | Yes |
| **Dependencies** | MEZAN.core | Generic (any callable) |
| **Location** | Project-specific | Centralized hub |
| **Maintainability** | Scattered | Single source |

## Questions?

**Q: Can I use the original code?**
A: Yes! It's fully preserved and functional.

**Q: Will it still work with MEZAN?**
A: Yes, if MEZAN is in the expected location (`../MEZAN/`)

**Q: Should I use original or hub version?**
A: Hub version recommended (universal, maintained). Original for reference.

**Q: Is the original deprecated?**
A: It's archived, not deprecated. Use hub for new work.

**Q: Can I modify the archived version?**
A: Yes, but modifications should go to hub. Archive is read-only reference.

## Support

- **Archive Location:** `.archive/benchmarks-consolidation/`
- **Migration Guide:** `MIGRATION.md`
- **Manifest:** `MANIFEST.json`
- **Hub Documentation:** `../../docs/HUB_SPOKE_ARCHITECTURE.md`

---

**Original implementation fully preserved and rebuildable.**
