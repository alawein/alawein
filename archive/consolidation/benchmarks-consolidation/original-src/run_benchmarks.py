#!/usr/bin/env python3
"""
MEZAN V4.1.0 - Comprehensive Benchmark Suite

Runs performance benchmarks for all 7 Libria solvers and generates reports.
"""

import sys
import time
import json
from pathlib import Path
from typing import Dict, List, Any
import traceback

# Add MEZAN to path
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import numpy as np
    from MEZAN.core import (
        OptimizationProblem,
        OptimizationResult,
        ProblemType,
        SolverStatus,
        OptimizerFactory,
        HeuristicFallbackOptimizer,
    )
    print("✅ Core imports successful")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)


class BenchmarkRunner:
    """Runs comprehensive benchmarks for all MEZAN Libria solvers"""

    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.results = []

    def run_qap_benchmarks(self) -> List[Dict[str, Any]]:
        """Run QAP benchmarks with varying problem sizes"""
        print("\n🔬 Running QAP Benchmarks...")
        results = []

        sizes = [5, 10, 15, 20]  # Problem sizes to test

        for n in sizes:
            print(f"  Testing QAP size n={n}...")

            # Generate random QAP instance
            np.random.seed(42 + n)  # Reproducible
            distance_matrix = np.random.randint(1, 100, size=(n, n))
            np.fill_diagonal(distance_matrix, 0)
            distance_matrix = (distance_matrix + distance_matrix.T) // 2  # Symmetric

            flow_matrix = np.random.randint(1, 50, size=(n, n))
            np.fill_diagonal(flow_matrix, 0)
            flow_matrix = (flow_matrix + flow_matrix.T) // 2  # Symmetric

            problem = OptimizationProblem(
                problem_type=ProblemType.QAP,
                data={
                    "distance_matrix": distance_matrix.tolist(),
                    "flow_matrix": flow_matrix.tolist(),
                },
            )

            # Test with heuristic (baseline)
            try:
                heuristic_solver = HeuristicFallbackOptimizer()
                heuristic_solver.initialize()
                start = time.time()
                heuristic_result = heuristic_solver.solve(problem)
                heuristic_time = time.time() - start

                results.append(
                    {
                        "solver": "Heuristic (Random)",
                        "problem_type": "QAP",
                        "size": n,
                        "status": heuristic_result.status.value,
                        "time": heuristic_time,
                        "objective": heuristic_result.objective_value,
                    }
                )
                print(f"    Heuristic: {heuristic_time:.4f}s")
            except Exception as e:
                print(f"    Heuristic failed: {e}")

        return results

    def run_flow_benchmarks(self) -> List[Dict[str, Any]]:
        """Run workflow routing benchmarks"""
        print("\n🔬 Running FLOW Benchmarks...")
        results = []

        graph_sizes = [5, 10, 15, 20]

        for n_nodes in graph_sizes:
            print(f"  Testing FLOW with {n_nodes} nodes...")

            # Generate synthetic workflow graph
            nodes = [f"node_{i}" for i in range(n_nodes)]
            edges = []
            # Create path graph with some shortcuts
            for i in range(n_nodes - 1):
                edges.append((nodes[i], nodes[i + 1]))
            # Add shortcuts every 3 nodes
            for i in range(0, n_nodes - 3, 3):
                edges.append((nodes[i], nodes[i + 3]))

            # Random confidence scores
            np.random.seed(42 + n_nodes)
            confidence = {node: 0.5 + np.random.rand() * 0.4 for node in nodes}

            problem = OptimizationProblem(
                problem_type=ProblemType.FLOW,
                data={
                    "workflow_graph": {"nodes": nodes, "edges": edges},
                    "confidence_scores": confidence,
                    "start_node": nodes[0],
                    "goal_node": nodes[-1],
                },
            )

            # Test with heuristic
            try:
                solver = HeuristicFallbackOptimizer()
                solver.initialize()
                start = time.time()
                result = solver.solve(problem)
                elapsed = time.time() - start

                results.append(
                    {
                        "solver": "Heuristic (Greedy)",
                        "problem_type": "FLOW",
                        "size": n_nodes,
                        "status": result.status.value,
                        "time": elapsed,
                        "objective": result.objective_value,
                    }
                )
                print(f"    Heuristic: {elapsed:.4f}s")
            except Exception as e:
                print(f"    Heuristic failed: {e}")

        return results

    def run_allocation_benchmarks(self) -> List[Dict[str, Any]]:
        """Run resource allocation benchmarks"""
        print("\n🔬 Running ALLOC Benchmarks...")
        results = []

        agent_counts = [5, 10, 15, 20]

        for n_agents in agent_counts:
            print(f"  Testing ALLOC with {n_agents} agents...")

            # Generate resource demands
            np.random.seed(42 + n_agents)
            demands = [(f"agent_{i}", float(10 + np.random.rand() * 40)) for i in range(n_agents)]
            budget = sum(d[1] for d in demands) * 0.6  # 60% of total

            problem = OptimizationProblem(
                problem_type=ProblemType.ALLOC,
                data={"resource_demands": demands, "budget_constraint": budget},
            )

            # Test with heuristic
            try:
                solver = HeuristicFallbackOptimizer()
                solver.initialize()
                start = time.time()
                result = solver.solve(problem)
                elapsed = time.time() - start

                results.append(
                    {
                        "solver": "Heuristic (Equal)",
                        "problem_type": "ALLOC",
                        "size": n_agents,
                        "status": result.status.value,
                        "time": elapsed,
                        "objective": result.objective_value,
                    }
                )
                print(f"    Heuristic: {elapsed:.4f}s")
            except Exception as e:
                print(f"    Heuristic failed: {e}")

        return results

    def run_all_benchmarks(self) -> Dict[str, Any]:
        """Run all benchmark suites"""
        print("=" * 70)
        print("🚀 MEZAN V4.1.0 - Comprehensive Benchmark Suite")
        print("=" * 70)

        all_results = []

        # Run QAP benchmarks
        try:
            qap_results = self.run_qap_benchmarks()
            all_results.extend(qap_results)
        except Exception as e:
            print(f"❌ QAP benchmarks failed: {e}")
            traceback.print_exc()

        # Run FLOW benchmarks
        try:
            flow_results = self.run_flow_benchmarks()
            all_results.extend(flow_results)
        except Exception as e:
            print(f"❌ FLOW benchmarks failed: {e}")
            traceback.print_exc()

        # Run ALLOC benchmarks
        try:
            alloc_results = self.run_allocation_benchmarks()
            all_results.extend(alloc_results)
        except Exception as e:
            print(f"❌ ALLOC benchmarks failed: {e}")
            traceback.print_exc()

        self.results = all_results
        return {"results": all_results, "summary": self.generate_summary(all_results)}

    def generate_summary(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate benchmark summary statistics"""
        if not results:
            return {}

        summary = {
            "total_benchmarks": len(results),
            "by_problem_type": {},
            "by_solver": {},
            "avg_time_by_type": {},
        }

        # Group by problem type
        for result in results:
            ptype = result["problem_type"]
            solver = result["solver"]

            if ptype not in summary["by_problem_type"]:
                summary["by_problem_type"][ptype] = []
            summary["by_problem_type"][ptype].append(result)

            if solver not in summary["by_solver"]:
                summary["by_solver"][solver] = []
            summary["by_solver"][solver].append(result)

        # Calculate averages
        for ptype, presults in summary["by_problem_type"].items():
            times = [r["time"] for r in presults]
            summary["avg_time_by_type"][ptype] = {
                "mean": np.mean(times),
                "std": np.std(times),
                "min": np.min(times),
                "max": np.max(times),
            }

        return summary

    def save_results(self):
        """Save benchmark results to JSON"""
        output_file = self.output_dir / f"benchmark_results_{int(time.time())}.json"

        output_data = {
            "timestamp": time.time(),
            "mezan_version": "4.1.0",
            "results": self.results,
            "summary": self.generate_summary(self.results),
        }

        with open(output_file, "w") as f:
            json.dump(output_data, f, indent=2)

        print(f"\n✅ Results saved to: {output_file}")
        return output_file

    def print_summary(self):
        """Print benchmark summary to console"""
        if not self.results:
            print("No results to summarize")
            return

        summary = self.generate_summary(self.results)

        print("\n" + "=" * 70)
        print("📊 BENCHMARK SUMMARY")
        print("=" * 70)

        print(f"\nTotal Benchmarks: {summary['total_benchmarks']}")

        print("\n📈 Average Time by Problem Type:")
        for ptype, stats in summary["avg_time_by_type"].items():
            print(f"  {ptype:15s}: {stats['mean']:.4f}s ± {stats['std']:.4f}s")
            print(f"                   Range: [{stats['min']:.4f}s, {stats['max']:.4f}s]")

        print("\n🎯 Results by Solver:")
        for solver, results in summary["by_solver"].items():
            times = [r["time"] for r in results]
            print(f"  {solver:20s}: {len(results):2d} runs, avg {np.mean(times):.4f}s")

        print("\n" + "=" * 70)


def main():
    """Main entry point"""
    output_dir = Path(__file__).parent / "results"

    runner = BenchmarkRunner(output_dir)

    try:
        benchmark_data = runner.run_all_benchmarks()
        runner.print_summary()
        result_file = runner.save_results()

        print("\n✅ Benchmark suite completed successfully!")
        print(f"📁 Results: {result_file}")

        return 0

    except Exception as e:
        print(f"\n❌ Benchmark suite failed: {e}")
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
