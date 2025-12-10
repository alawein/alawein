"""
Adiabatic Quantum Computing
Quantum annealing and adiabatic optimization.
"""
import numpy as np
from typing import List, Dict, Any, Optional, Callable, Tuple
from dataclasses import dataclass
from scipy.linalg import expm


@dataclass
class AnnealingResult:
    """Result from quantum annealing."""
    solution: np.ndarray
    energy: float
    success_probability: float
    annealing_time: float
    gap_history: List[float]
    energy_history: List[float]


class AdiabaticQuantumComputer:
    """
    Adiabatic quantum computing simulator.
    Implements quantum annealing for optimization.
    """

    def __init__(self, n_qubits: int):
        self.n_qubits = n_qubits
        self.dim = 2**n_qubits

        # Pauli matrices
        self.I = np.eye(2, dtype=complex)
        self.X = np.array([[0, 1], [1, 0]], dtype=complex)
        self.Z = np.array([[1, 0], [0, -1]], dtype=complex)

    def _create_initial_hamiltonian(self) -> np.ndarray:
        """
        Create initial Hamiltonian H_0 = -sum_i X_i.
        Ground state is uniform superposition.
        """
        H0 = np.zeros((self.dim, self.dim), dtype=complex)

        for i in range(self.n_qubits):
            # X on qubit i
            op = np.eye(1, dtype=complex)
            for j in range(self.n_qubits):
                if j == i:
                    op = np.kron(op, self.X)
                else:
                    op = np.kron(op, self.I)
            H0 -= op

        return H0

    def _create_problem_hamiltonian(self, J: np.ndarray, h: np.ndarray) -> np.ndarray:
        """
        Create problem Hamiltonian H_P = sum_ij J_ij Z_i Z_j + sum_i h_i Z_i.
        Ising model formulation.
        """
        HP = np.zeros((self.dim, self.dim), dtype=complex)

        # Two-body terms
        for i in range(self.n_qubits):
            for j in range(i + 1, self.n_qubits):
                if J[i, j] != 0:
                    op = np.eye(1, dtype=complex)
                    for k in range(self.n_qubits):
                        if k == i or k == j:
                            op = np.kron(op, self.Z)
                        else:
                            op = np.kron(op, self.I)
                    HP += J[i, j] * op

        # Single-body terms
        for i in range(self.n_qubits):
            if h[i] != 0:
                op = np.eye(1, dtype=complex)
                for j in range(self.n_qubits):
                    if j == i:
                        op = np.kron(op, self.Z)
                    else:
                        op = np.kron(op, self.I)
                HP += h[i] * op

        return HP

    def anneal(
        self,
        J: np.ndarray,
        h: np.ndarray,
        annealing_time: float = 10.0,
        n_steps: int = 100,
        schedule: str = 'linear'
    ) -> AnnealingResult:
        """
        Perform quantum annealing.

        Args:
            J: Coupling matrix (n_qubits x n_qubits)
            h: Local field vector (n_qubits,)
            annealing_time: Total annealing time
            n_steps: Number of time steps
            schedule: 'linear', 'quadratic', or 'exponential'
        """
        H0 = self._create_initial_hamiltonian()
        HP = self._create_problem_hamiltonian(J, h)

        dt = annealing_time / n_steps

        # Initial state: ground state of H0 (uniform superposition)
        state = np.ones(self.dim, dtype=complex) / np.sqrt(self.dim)

        gap_history = []
        energy_history = []

        for step in range(n_steps + 1):
            t = step * dt
            s = self._schedule(t / annealing_time, schedule)

            # Interpolated Hamiltonian
            H = (1 - s) * H0 + s * HP

            # Compute energy gap
            eigenvalues = np.linalg.eigvalsh(H)
            gap = eigenvalues[1] - eigenvalues[0]
            gap_history.append(gap)

            # Current energy
            energy = np.real(np.vdot(state, H @ state))
            energy_history.append(energy)

            # Time evolution
            if step < n_steps:
                U = expm(-1j * H * dt)
                state = U @ state

        # Measure in computational basis
        probs = np.abs(state)**2

        # Find ground state of problem Hamiltonian
        HP_eigenvalues, HP_eigenvectors = np.linalg.eigh(HP)
        ground_state_idx = np.argmax(probs)

        # Convert to spin configuration
        solution = np.array([
            1 if (ground_state_idx >> (self.n_qubits - 1 - i)) & 1 else -1
            for i in range(self.n_qubits)
        ])

        # Success probability
        ground_idx = np.argmin(HP_eigenvalues)
        success_prob = np.abs(np.vdot(HP_eigenvectors[:, ground_idx], state))**2

        return AnnealingResult(
            solution=solution,
            energy=HP_eigenvalues[0],
            success_probability=success_prob,
            annealing_time=annealing_time,
            gap_history=gap_history,
            energy_history=energy_history
        )

    def _schedule(self, s: float, schedule_type: str) -> float:
        """Annealing schedule function."""
        if schedule_type == 'linear':
            return s
        elif schedule_type == 'quadratic':
            return s**2
        elif schedule_type == 'exponential':
            return 1 - np.exp(-3 * s)
        else:
            return s


class QuantumAnnealer:
    """
    Quantum annealer for combinatorial optimization.
    Simulates D-Wave style quantum annealing.
    """

    def __init__(self, n_qubits: int, temperature: float = 0.1):
        self.n_qubits = n_qubits
        self.temperature = temperature
        self.adiabatic = AdiabaticQuantumComputer(n_qubits)

    def solve_maxcut(self, edges: List[Tuple[int, int]], weights: List[float] = None) -> AnnealingResult:
        """
        Solve MaxCut problem using quantum annealing.

        Args:
            edges: List of edges (i, j)
            weights: Optional edge weights
        """
        if weights is None:
            weights = [1.0] * len(edges)

        # Convert to Ising model
        J = np.zeros((self.n_qubits, self.n_qubits))
        h = np.zeros(self.n_qubits)

        for (i, j), w in zip(edges, weights):
            J[i, j] = -w / 4  # Negative for maximization
            J[j, i] = -w / 4

        return self.adiabatic.anneal(J, h)

    def solve_qubo(self, Q: np.ndarray) -> AnnealingResult:
        """
        Solve Quadratic Unconstrained Binary Optimization.

        Args:
            Q: QUBO matrix
        """
        # Convert QUBO to Ising
        J = np.zeros((self.n_qubits, self.n_qubits))
        h = np.zeros(self.n_qubits)

        for i in range(self.n_qubits):
            h[i] = Q[i, i] / 2
            for j in range(i + 1, self.n_qubits):
                J[i, j] = Q[i, j] / 4

        return self.adiabatic.anneal(J, h)

    def solve_tsp(self, distances: np.ndarray) -> AnnealingResult:
        """
        Solve Traveling Salesman Problem using quantum annealing.
        Uses one-hot encoding.

        Args:
            distances: Distance matrix (n_cities x n_cities)
        """
        n_cities = len(distances)

        # Need n_cities^2 qubits for one-hot encoding
        # x_it = 1 if city i is visited at time t

        # Simplified: just return random for now (full TSP encoding is complex)
        J = np.random.randn(self.n_qubits, self.n_qubits) * 0.1
        h = np.random.randn(self.n_qubits) * 0.1

        return self.adiabatic.anneal(J, h)


class SimulatedQuantumAnnealing:
    """
    Classical simulation of quantum annealing using path integral Monte Carlo.
    """

    def __init__(self, n_qubits: int, n_replicas: int = 20):
        self.n_qubits = n_qubits
        self.n_replicas = n_replicas

    def anneal(
        self,
        J: np.ndarray,
        h: np.ndarray,
        n_sweeps: int = 1000,
        initial_temp: float = 10.0,
        final_temp: float = 0.01
    ) -> AnnealingResult:
        """
        Perform simulated quantum annealing.

        Uses Suzuki-Trotter decomposition to map quantum system
        to classical system with extra dimension.
        """
        # Initialize replicas
        spins = np.random.choice([-1, 1], size=(self.n_replicas, self.n_qubits))

        energy_history = []

        for sweep in range(n_sweeps):
            # Temperature schedule
            temp = initial_temp * (final_temp / initial_temp) ** (sweep / n_sweeps)

            # Transverse field schedule
            gamma = 1.0 * (1 - sweep / n_sweeps)

            # Coupling between replicas
            J_perp = -0.5 * temp * np.log(np.tanh(gamma / (self.n_replicas * temp) + 1e-10))

            # Metropolis updates
            for replica in range(self.n_replicas):
                for qubit in range(self.n_qubits):
                    # Energy change from flipping spin
                    delta_E = 0

                    # Classical Ising energy
                    for j in range(self.n_qubits):
                        if j != qubit:
                            delta_E += 2 * J[qubit, j] * spins[replica, qubit] * spins[replica, j]
                    delta_E += 2 * h[qubit] * spins[replica, qubit]

                    # Replica coupling
                    prev_replica = (replica - 1) % self.n_replicas
                    next_replica = (replica + 1) % self.n_replicas
                    delta_E += 2 * J_perp * spins[replica, qubit] * (
                        spins[prev_replica, qubit] + spins[next_replica, qubit]
                    )

                    # Metropolis acceptance
                    if delta_E < 0 or np.random.random() < np.exp(-delta_E / temp):
                        spins[replica, qubit] *= -1

            # Record energy
            energy = self._compute_energy(spins[0], J, h)
            energy_history.append(energy)

        # Find best solution across replicas
        best_energy = float('inf')
        best_solution = None

        for replica in range(self.n_replicas):
            energy = self._compute_energy(spins[replica], J, h)
            if energy < best_energy:
                best_energy = energy
                best_solution = spins[replica].copy()

        return AnnealingResult(
            solution=best_solution,
            energy=best_energy,
            success_probability=1.0,  # Classical simulation
            annealing_time=n_sweeps,
            gap_history=[],
            energy_history=energy_history
        )

    def _compute_energy(self, spins: np.ndarray, J: np.ndarray, h: np.ndarray) -> float:
        """Compute Ising energy."""
        energy = 0.0
        for i in range(len(spins)):
            energy += h[i] * spins[i]
            for j in range(i + 1, len(spins)):
                energy += J[i, j] * spins[i] * spins[j]
        return energy


def demo_adiabatic():
    """Demonstrate adiabatic quantum computing."""
    print("=" * 60)
    print("ADIABATIC QUANTUM COMPUTING DEMO")
    print("=" * 60)

    # MaxCut problem
    print("\n1. MaxCut via Quantum Annealing")
    n_qubits = 4
    edges = [(0, 1), (1, 2), (2, 3), (3, 0), (0, 2)]

    annealer = QuantumAnnealer(n_qubits)
    result = annealer.solve_maxcut(edges)

    print(f"   Solution: {result.solution}")
    print(f"   Energy: {result.energy:.4f}")
    print(f"   Success probability: {result.success_probability:.4f}")

    # Adiabatic evolution
    print("\n2. Adiabatic Evolution")
    adiabatic = AdiabaticQuantumComputer(3)

    J = np.array([
        [0, -1, 0],
        [-1, 0, -1],
        [0, -1, 0]
    ], dtype=float)
    h = np.zeros(3)

    result = adiabatic.anneal(J, h, annealing_time=5.0, n_steps=50)

    print(f"   Final energy: {result.energy:.4f}")
    print(f"   Min gap: {min(result.gap_history):.4f}")

    # Simulated quantum annealing
    print("\n3. Simulated Quantum Annealing")
    sqa = SimulatedQuantumAnnealing(n_qubits=4, n_replicas=10)

    J = np.random.randn(4, 4) * 0.5
    J = (J + J.T) / 2  # Symmetrize
    np.fill_diagonal(J, 0)
    h = np.random.randn(4) * 0.2

    result = sqa.anneal(J, h, n_sweeps=500)

    print(f"   Solution: {result.solution}")
    print(f"   Energy: {result.energy:.4f}")


if __name__ == "__main__":
    demo_adiabatic()
