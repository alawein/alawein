"""
Quantum Performance Benchmarks
Compare quantum vs classical optimization performance.
"""
import numpy as np
import time
from typing import Dict, List, Tuple
from dataclasses import dataclass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from optilibria.optilibria import QAOAOptimizer, VQEOptimizer, HybridOptimizer, create_h2_hamiltonian
from optilibria.optilibria.quantum.grover import GroverSearch, create_search_oracle


@dataclass
class BenchmarkResult:
    """Result of a benchmark run."""
    name: str
    quantum_time: float
    classical_time: float
    quantum_result: float
    classical_result: float
    speedup: float
    accuracy: float


def benchmark_maxcut(n_nodes: int = 6, p: int = 2) -> BenchmarkResult:
    """Benchmark QAOA vs classical for MaxCut."""
    # Create random graph
    np.random.seed(42)
    edges = []
    for i in range(n_nodes):
        for j in range(i+1, n_nodes):
            if np.random.random() < 0.5:
                edges.append((i, j))

    def maxcut_cost(x):
        return -sum(x[i] != x[j] for i, j in edges)

    # QAOA
    start = time.time()
    qaoa = QAOAOptimizer(p=p)
    qaoa_result = qaoa.optimize(maxcut_cost, n_vars=n_nodes)
    quantum_time = time.time() - start

    # Classical brute force
    start = time.time()
    best_cost = float('inf')
    for i in range(2**n_nodes):
        x = np.array([int(b) for b in format(i, f'0{n_nodes}b')])
        cost = maxcut_cost(x)
        if cost < best_cost:
            best_cost = cost
    classical_time = time.time() - start

    return BenchmarkResult(
        name=f"MaxCut (n={n_nodes})",
        quantum_time=quantum_time,
        classical_time=classical_time,
        quantum_result=qaoa_result['fun'],
        classical_result=best_cost,
        speedup=classical_time / quantum_time if quantum_time > 0 else 1,
        accuracy=1.0 if qaoa_result['fun'] == best_cost else qaoa_result['fun'] / best_cost
    )


def benchmark_vqe(bond_lengths: List[float] = None) -> BenchmarkResult:
    """Benchmark VQE vs exact diagonalization for H2."""
    if bond_lengths is None:
        bond_lengths = [0.5, 0.74, 1.0, 1.5]

    vqe_errors = []

    # VQE
    start = time.time()
    vqe = VQEOptimizer(depth=2)
    for r in bond_lengths:
        H, n_qubits = create_h2_hamiltonian(r)
        result = vqe.optimize(H, n_qubits)
        exact = np.min(np.linalg.eigvalsh(H))
        vqe_errors.append(abs(result['energy'] - exact))
    quantum_time = time.time() - start

    # Classical (exact diagonalization)
    start = time.time()
    for r in bond_lengths:
        H, _ = create_h2_hamiltonian(r)
        _ = np.linalg.eigvalsh(H)
    classical_time = time.time() - start

    avg_error = np.mean(vqe_errors)

    return BenchmarkResult(
        name=f"VQE H2 ({len(bond_lengths)} points)",
        quantum_time=quantum_time,
        classical_time=classical_time,
        quantum_result=avg_error,
        classical_result=0.0,
        speedup=classical_time / quantum_time if quantum_time > 0 else 1,
        accuracy=1.0 - avg_error
    )


def benchmark_grover(n_qubits: int = 8, n_targets: int = 4) -> BenchmarkResult:
    """Benchmark Grover's search vs classical search."""
    N = 2**n_qubits
    targets = list(np.random.choice(N, n_targets, replace=False))
    oracle = create_search_oracle(targets, n_qubits)

    # Grover's search
    start = time.time()
    grover = GroverSearch(n_qubits)
    result = grover.search(oracle, num_solutions=n_targets)
    quantum_time = time.time() - start

    # Classical linear search
    start = time.time()
    found = []
    for i in range(N):
        if oracle(i):
            found.append(i)
            if len(found) >= n_targets:
                break
    classical_time = time.time() - start

    # Count correct solutions found
    quantum_found = [s['index'] for s in result['solutions']]
    correct = len(set(quantum_found) & set(targets))

    return BenchmarkResult(
        name=f"Grover (N={N}, k={n_targets})",
        quantum_time=quantum_time,
        classical_time=classical_time,
        quantum_result=correct,
        classical_result=n_targets,
        speedup=result['quantum_speedup'],
        accuracy=correct / n_targets
    )


def benchmark_hybrid(dim: int = 5) -> BenchmarkResult:
    """Benchmark hybrid optimizer vs pure classical."""
    def rastrigin(x):
        A = 10
        return A * len(x) + sum(xi**2 - A * np.cos(2 * np.pi * xi) for xi in x)

    x0 = np.random.uniform(-5, 5, dim)

    # Hybrid
    start = time.time()
    hybrid = HybridOptimizer()
    hybrid_result = hybrid.minimize(rastrigin, x0)
    quantum_time = time.time() - start

    # Pure classical (scipy)
    from scipy.optimize import minimize
    start = time.time()
    classical_result = minimize(rastrigin, x0, method='L-BFGS-B')
    classical_time = time.time() - start

    return BenchmarkResult(
        name=f"Rastrigin (d={dim})",
        quantum_time=quantum_time,
        classical_time=classical_time,
        quantum_result=hybrid_result.fun,
        classical_result=classical_result.fun,
        speedup=classical_time / quantum_time if quantum_time > 0 else 1,
        accuracy=min(1.0, classical_result.fun / hybrid_result.fun) if hybrid_result.fun > 0 else 1.0
    )


def run_all_benchmarks() -> List[BenchmarkResult]:
    """Run all benchmarks and return results."""
    print("=" * 70)
    print("QUANTUM-CLASSICAL PERFORMANCE BENCHMARKS")
    print("=" * 70)

    results = []

    # MaxCut benchmarks
    print("\n📊 MaxCut Optimization (QAOA)")
    for n in [4, 6, 8]:
        result = benchmark_maxcut(n_nodes=n)
        results.append(result)
        print(f"  {result.name}: Speedup={result.speedup:.2f}x, Accuracy={result.accuracy:.2%}")

    # VQE benchmarks
    print("\n📊 Quantum Chemistry (VQE)")
    result = benchmark_vqe()
    results.append(result)
    print(f"  {result.name}: Avg Error={result.quantum_result:.2e}, Accuracy={result.accuracy:.2%}")

    # Grover benchmarks
    print("\n📊 Quantum Search (Grover)")
    for n in [6, 8, 10]:
        result = benchmark_grover(n_qubits=n)
        results.append(result)
        print(f"  {result.name}: Speedup={result.speedup:.1f}x, Accuracy={result.accuracy:.2%}")

    # Hybrid benchmarks
    print("\n📊 Hybrid Optimization")
    for d in [3, 5, 10]:
        result = benchmark_hybrid(dim=d)
        results.append(result)
        print(f"  {result.name}: Speedup={result.speedup:.2f}x, Quantum={result.quantum_result:.4f}")

    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    avg_speedup = np.mean([r.speedup for r in results])
    avg_accuracy = np.mean([r.accuracy for r in results])

    print(f"  Average Speedup: {avg_speedup:.2f}x")
    print(f"  Average Accuracy: {avg_accuracy:.2%}")
    print(f"  Total Benchmarks: {len(results)}")

    return results


def generate_benchmark_report(results: List[BenchmarkResult]) -> str:
    """Generate markdown benchmark report."""
    report = """# Quantum-Classical Benchmark Report

## Summary

| Benchmark | Quantum Time | Classical Time | Speedup | Accuracy |
|-----------|-------------|----------------|---------|----------|
"""

    for r in results:
        report += f"| {r.name} | {r.quantum_time:.4f}s | {r.classical_time:.4f}s | {r.speedup:.2f}x | {r.accuracy:.2%} |\n"

    avg_speedup = np.mean([r.speedup for r in results])
    avg_accuracy = np.mean([r.accuracy for r in results])

    report += f"""
## Key Findings

- **Average Speedup**: {avg_speedup:.2f}x
- **Average Accuracy**: {avg_accuracy:.2%}
- **Best Speedup**: {max(r.speedup for r in results):.2f}x ({max(results, key=lambda r: r.speedup).name})

## Methodology

- QAOA: p=2 layers, COBYLA optimizer
- VQE: depth=2 hardware-efficient ansatz, L-BFGS-B optimizer
- Grover: Optimal iteration count π/4 * √(N/k)
- Hybrid: Automatic quantum advantage detection

## Hardware

- Simulation: Statevector (exact quantum simulation)
- Classical: NumPy/SciPy on CPU
"""

    return report


if __name__ == "__main__":
    results = run_all_benchmarks()

    # Save report
    report = generate_benchmark_report(results)
    report_path = Path(__file__).parent / "BENCHMARK_REPORT.md"
    report_path.write_text(report, encoding='utf-8')
    print(f"\n📄 Report saved to: {report_path}")
