"""
Parallel Solver Orchestrator

Coordinates multiple optimization solvers running in parallel with portfolio
strategy, race conditions, and early termination.
"""

import logging
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Any, Tuple
from enum import Enum
import numpy as np

logger = logging.getLogger(__name__)


class TerminationStrategy(Enum):
    """Strategy for when to terminate parallel solvers"""
    FIRST_COMPLETE = "first_complete"  # Stop when first solver finishes
    FIRST_OPTIMAL = "first_optimal"    # Stop when first finds optimal
    ALL_COMPLETE = "all_complete"      # Wait for all to finish
    TIMEOUT = "timeout"                 # Run until timeout
    CONVERGED = "converged"            # Stop when solutions converge


@dataclass
class SolverResult:
    """Result from a single solver"""
    solver_name: str
    solution: Any
    cost: float
    runtime: float
    iterations: int
    converged: bool
    metadata: Dict = field(default_factory=dict)


@dataclass
class ParallelResult:
    """Aggregated result from parallel solving"""
    best_result: SolverResult
    all_results: List[SolverResult]
    total_runtime: float
    termination_reason: str
    speedup: float  # vs sequential


class ParallelSolverOrchestrator:
    """
    Orchestrates multiple solvers running in parallel.

    Supports:
    - Portfolio solving (run different algorithms simultaneously)
    - Island model (parallel populations with migration)
    - Race conditions (stop when best found)
    - Cooperative search (share information between solvers)
    """

    def __init__(
        self,
        max_workers: Optional[int] = None,
        use_processes: bool = True,
        termination: TerminationStrategy = TerminationStrategy.FIRST_COMPLETE,
        timeout: float = 300.0,
        convergence_threshold: float = 1e-6,
    ):
        self.max_workers = max_workers
        self.use_processes = use_processes
        self.termination = termination
        self.timeout = timeout
        self.convergence_threshold = convergence_threshold
        self._results: List[SolverResult] = []

    def solve_portfolio(
        self,
        problem: Any,
        solvers: List[Tuple[str, Callable, Dict]],
        known_optimal: Optional[float] = None,
    ) -> ParallelResult:
        """
        Run multiple solvers in parallel (portfolio strategy).

        Args:
            problem: Problem instance to solve
            solvers: List of (name, solver_fn, kwargs) tuples
            known_optimal: Known optimal cost for early termination

        Returns:
            ParallelResult with best solution and all results
        """
        start_time = time.time()
        self._results = []
        termination_reason = "completed"

        executor_cls = ProcessPoolExecutor if self.use_processes else ThreadPoolExecutor

        with executor_cls(max_workers=self.max_workers or len(solvers)) as executor:
            futures = {
                executor.submit(self._run_solver, name, fn, problem, kwargs): name
                for name, fn, kwargs in solvers
            }

            for future in as_completed(futures, timeout=self.timeout):
                solver_name = futures[future]
                try:
                    result = future.result()
                    self._results.append(result)
                    logger.info(f"{solver_name}: cost={result.cost:.4f}, time={result.runtime:.2f}s")

                    # Check termination conditions
                    if self._should_terminate(result, known_optimal):
                        termination_reason = self._get_termination_reason(result, known_optimal)
                        # Cancel remaining futures
                        for f in futures:
                            f.cancel()
                        break

                except Exception as e:
                    logger.error(f"{solver_name} failed: {e}")
                    self._results.append(SolverResult(
                        solver_name=solver_name,
                        solution=None,
                        cost=float("inf"),
                        runtime=0,
                        iterations=0,
                        converged=False,
                        metadata={"error": str(e)},
                    ))

        total_runtime = time.time() - start_time

        # Find best result
        valid_results = [r for r in self._results if r.solution is not None]
        if not valid_results:
            raise RuntimeError("All solvers failed")

        best_result = min(valid_results, key=lambda r: r.cost)

        # Calculate speedup estimate
        sequential_time = sum(r.runtime for r in valid_results)
        speedup = sequential_time / total_runtime if total_runtime > 0 else 1.0

        return ParallelResult(
            best_result=best_result,
            all_results=self._results,
            total_runtime=total_runtime,
            termination_reason=termination_reason,
            speedup=speedup,
        )

    def _run_solver(
        self, name: str, solver_fn: Callable, problem: Any, kwargs: Dict
    ) -> SolverResult:
        """Run a single solver and capture result"""
        start = time.time()
        try:
            result = solver_fn(problem, **kwargs)
            runtime = time.time() - start

            # Handle different result formats
            if isinstance(result, tuple):
                solution, cost = result[:2]
                metadata = result[2] if len(result) > 2 else {}
            elif hasattr(result, "solution"):
                solution = result.solution
                cost = result.cost if hasattr(result, "cost") else float("inf")
                metadata = getattr(result, "metadata", {})
            else:
                solution = result
                cost = float("inf")
                metadata = {}

            return SolverResult(
                solver_name=name,
                solution=solution,
                cost=cost,
                runtime=runtime,
                iterations=metadata.get("iterations", 0),
                converged=metadata.get("converged", False),
                metadata=metadata,
            )
        except Exception as e:
            return SolverResult(
                solver_name=name,
                solution=None,
                cost=float("inf"),
                runtime=time.time() - start,
                iterations=0,
                converged=False,
                metadata={"error": str(e)},
            )

    def _should_terminate(self, result: SolverResult, known_optimal: Optional[float]) -> bool:
        """Check if we should terminate based on strategy"""
        if self.termination == TerminationStrategy.FIRST_COMPLETE:
            return True
        elif self.termination == TerminationStrategy.FIRST_OPTIMAL:
            if known_optimal and abs(result.cost - known_optimal) < self.convergence_threshold:
                return True
        elif self.termination == TerminationStrategy.CONVERGED:
            if len(self._results) >= 2:
                costs = [r.cost for r in self._results]
                if max(costs) - min(costs) < self.convergence_threshold:
                    return True
        return False

    def _get_termination_reason(self, result: SolverResult, known_optimal: Optional[float]) -> str:
        if self.termination == TerminationStrategy.FIRST_COMPLETE:
            return f"first_complete:{result.solver_name}"
        elif self.termination == TerminationStrategy.FIRST_OPTIMAL:
            return f"optimal_found:{result.solver_name}"
        elif self.termination == TerminationStrategy.CONVERGED:
            return "solutions_converged"
        return "completed"

