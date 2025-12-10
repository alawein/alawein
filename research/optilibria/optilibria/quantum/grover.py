"""
Grover's Search Algorithm
Quantum search with quadratic speedup.
"""
import numpy as np
from typing import Callable, List, Optional, Dict, Any


class GroverSearch:
    """
    Grover's algorithm for unstructured search.
    Provides O(√N) search vs O(N) classical.
    """

    def __init__(self, n_qubits: int):
        self.n_qubits = n_qubits
        self.N = 2**n_qubits
        self.optimal_iterations = int(np.pi/4 * np.sqrt(self.N))

    def search(
        self,
        oracle: Callable[[int], bool],
        num_solutions: int = 1
    ) -> Dict[str, Any]:
        """
        Search for marked items using Grover's algorithm.

        Args:
            oracle: Function returning True for marked items
            num_solutions: Expected number of solutions

        Returns:
            Dict with found solutions and metadata
        """
        # Adjust iterations for multiple solutions
        iterations = int(np.pi/4 * np.sqrt(self.N / num_solutions))

        # Initialize uniform superposition
        state = np.ones(self.N, dtype=complex) / np.sqrt(self.N)

        # Apply Grover iterations
        for _ in range(iterations):
            state = self._oracle_operator(state, oracle)
            state = self._diffusion_operator(state)

        # Measure - get probabilities
        probs = np.abs(state)**2

        # Find most likely solutions
        sorted_indices = np.argsort(probs)[::-1]
        solutions = []

        for idx in sorted_indices[:num_solutions * 2]:
            if oracle(idx):
                solutions.append({
                    'index': idx,
                    'bitstring': format(idx, f'0{self.n_qubits}b'),
                    'probability': probs[idx]
                })
                if len(solutions) >= num_solutions:
                    break

        return {
            'solutions': solutions,
            'iterations': iterations,
            'quantum_speedup': np.sqrt(self.N),
            'success_probability': sum(s['probability'] for s in solutions)
        }

    def _oracle_operator(self, state: np.ndarray, oracle: Callable) -> np.ndarray:
        """Apply oracle: flip phase of marked states."""
        new_state = state.copy()
        for i in range(self.N):
            if oracle(i):
                new_state[i] *= -1
        return new_state

    def _diffusion_operator(self, state: np.ndarray) -> np.ndarray:
        """Apply diffusion operator: 2|s><s| - I."""
        mean = np.mean(state)
        return 2 * mean - state


class QuantumPhaseEstimation:
    """
    Quantum Phase Estimation algorithm.
    Estimates eigenvalues of unitary operators.
    """

    def __init__(self, precision_qubits: int = 4):
        self.precision_qubits = precision_qubits
        self.precision = 2**precision_qubits

    def estimate(
        self,
        unitary: np.ndarray,
        eigenstate: np.ndarray
    ) -> Dict[str, Any]:
        """
        Estimate the phase of a unitary's eigenvalue.

        Args:
            unitary: Unitary matrix
            eigenstate: Approximate eigenstate

        Returns:
            Dict with estimated phase and eigenvalue
        """
        # For simulation, compute exact eigenvalue
        eigenvalues, eigenvectors = np.linalg.eig(unitary)

        # Find closest eigenstate
        overlaps = [np.abs(np.vdot(eigenstate, ev))**2 for ev in eigenvectors.T]
        best_idx = np.argmax(overlaps)

        eigenvalue = eigenvalues[best_idx]
        phase = np.angle(eigenvalue) / (2 * np.pi)
        if phase < 0:
            phase += 1

        # Discretize to precision
        estimated_phase = round(phase * self.precision) / self.precision

        return {
            'phase': estimated_phase,
            'eigenvalue': np.exp(2j * np.pi * estimated_phase),
            'exact_phase': phase,
            'precision_bits': self.precision_qubits,
            'error': abs(phase - estimated_phase)
        }


def create_search_oracle(targets: List[int], n_qubits: int) -> Callable[[int], bool]:
    """Create an oracle function for given target indices."""
    target_set = set(targets)
    return lambda x: x in target_set
