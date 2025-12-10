"""
Advanced Quantum Optimization Algorithms
ADAPT-VQE, QITE, and other cutting-edge methods.
"""
import numpy as np
from typing import List, Dict, Any, Optional, Callable, Tuple
from dataclasses import dataclass
from scipy.optimize import minimize
from scipy.linalg import expm


@dataclass
class OptimizationResult:
    """Result from quantum optimization."""
    optimal_value: float
    optimal_params: np.ndarray
    iterations: int
    history: List[float]
    converged: bool
    metadata: Dict[str, Any] = None


class ADAPTVQE:
    """
    ADAPT-VQE: Adaptive Derivative-Assembled Pseudo-Trotter VQE.
    Dynamically grows the ansatz based on gradient information.
    """

    def __init__(
        self,
        n_qubits: int,
        operator_pool: List[np.ndarray] = None,
        gradient_threshold: float = 1e-3,
        max_iterations: int = 50
    ):
        self.n_qubits = n_qubits
        self.operator_pool = operator_pool or self._default_pool()
        self.gradient_threshold = gradient_threshold
        self.max_iterations = max_iterations
        self.selected_operators = []
        self.parameters = []

    def _default_pool(self) -> List[Tuple[np.ndarray, str]]:
        """Create default operator pool (single and double excitations)."""
        pool = []

        # Pauli matrices
        X = np.array([[0, 1], [1, 0]], dtype=complex)
        Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
        Z = np.array([[1, 0], [0, -1]], dtype=complex)
        I = np.eye(2, dtype=complex)

        # Single excitation operators
        for i in range(self.n_qubits):
            for j in range(i + 1, self.n_qubits):
                # XY - YX type
                op = self._create_excitation_operator(i, j, 'single')
                pool.append((op, f'S_{i}{j}'))

        # Double excitation operators (for larger systems)
        if self.n_qubits >= 4:
            for i in range(self.n_qubits):
                for j in range(i + 1, self.n_qubits):
                    for k in range(j + 1, self.n_qubits):
                        for l in range(k + 1, self.n_qubits):
                            op = self._create_excitation_operator(i, j, 'double', k, l)
                            pool.append((op, f'D_{i}{j}{k}{l}'))

        return pool

    def _create_excitation_operator(self, i: int, j: int, exc_type: str,
                                     k: int = None, l: int = None) -> np.ndarray:
        """Create fermionic excitation operator."""
        n = self.n_qubits
        dim = 2**n

        # Simplified: create anti-Hermitian operator
        op = np.zeros((dim, dim), dtype=complex)

        if exc_type == 'single':
            # Single excitation: a†_j a_i - a†_i a_j
            for state in range(dim):
                bits = [(state >> (n - 1 - q)) & 1 for q in range(n)]

                # a†_j a_i term
                if bits[i] == 1 and bits[j] == 0:
                    new_state = state ^ (1 << (n - 1 - i)) ^ (1 << (n - 1 - j))
                    parity = sum(bits[min(i,j)+1:max(i,j)]) % 2
                    op[new_state, state] = 1j * ((-1)**parity)

                # -a†_i a_j term
                if bits[j] == 1 and bits[i] == 0:
                    new_state = state ^ (1 << (n - 1 - j)) ^ (1 << (n - 1 - i))
                    parity = sum(bits[min(i,j)+1:max(i,j)]) % 2
                    op[new_state, state] = -1j * ((-1)**parity)

        return op

    def _compute_gradient(self, hamiltonian: np.ndarray, state: np.ndarray,
                          operator: np.ndarray) -> float:
        """Compute gradient of energy with respect to operator."""
        # Gradient = 2 * Re(<ψ|[H, A]|ψ>)
        commutator = hamiltonian @ operator - operator @ hamiltonian
        gradient = 2 * np.real(np.vdot(state, commutator @ state))
        return gradient

    def _apply_ansatz(self, initial_state: np.ndarray, params: np.ndarray) -> np.ndarray:
        """Apply current ansatz to initial state."""
        state = initial_state.copy()

        for i, (op, _) in enumerate(self.selected_operators):
            # Apply exp(i * theta * A)
            U = expm(1j * params[i] * op)
            state = U @ state

        return state

    def optimize(
        self,
        hamiltonian: np.ndarray,
        initial_state: np.ndarray = None
    ) -> OptimizationResult:
        """
        Run ADAPT-VQE optimization.

        Args:
            hamiltonian: System Hamiltonian
            initial_state: Initial state (default: |0...0>)
        """
        n = self.n_qubits

        if initial_state is None:
            initial_state = np.zeros(2**n, dtype=complex)
            initial_state[0] = 1.0

        self.selected_operators = []
        self.parameters = []
        history = []

        current_state = initial_state.copy()

        for iteration in range(self.max_iterations):
            # Compute gradients for all operators in pool
            gradients = []
            for op, name in self.operator_pool:
                grad = abs(self._compute_gradient(hamiltonian, current_state, op))
                gradients.append((grad, op, name))

            # Select operator with largest gradient
            gradients.sort(key=lambda x: x[0], reverse=True)
            max_grad, best_op, best_name = gradients[0]

            # Check convergence
            if max_grad < self.gradient_threshold:
                break

            # Add operator to ansatz
            self.selected_operators.append((best_op, best_name))
            self.parameters.append(0.0)

            # Optimize all parameters
            def cost(params):
                state = self._apply_ansatz(initial_state, params)
                return np.real(np.vdot(state, hamiltonian @ state))

            result = minimize(
                cost,
                np.array(self.parameters),
                method='BFGS',
                options={'maxiter': 100}
            )

            self.parameters = list(result.x)
            current_state = self._apply_ansatz(initial_state, result.x)
            energy = result.fun
            history.append(energy)

            print(f"Iteration {iteration}: Added {best_name}, Energy = {energy:.6f}")

        return OptimizationResult(
            optimal_value=history[-1] if history else 0,
            optimal_params=np.array(self.parameters),
            iterations=len(history),
            history=history,
            converged=len(history) < self.max_iterations,
            metadata={'operators': [name for _, name in self.selected_operators]}
        )


class QITE:
    """
    Quantum Imaginary Time Evolution.
    Ground state preparation via imaginary time evolution.
    """

    def __init__(
        self,
        n_qubits: int,
        dt: float = 0.1,
        max_steps: int = 100,
        convergence_threshold: float = 1e-6
    ):
        self.n_qubits = n_qubits
        self.dt = dt
        self.max_steps = max_steps
        self.convergence_threshold = convergence_threshold

    def evolve(
        self,
        hamiltonian: np.ndarray,
        initial_state: np.ndarray = None
    ) -> OptimizationResult:
        """
        Perform imaginary time evolution.

        |ψ(τ)> = exp(-H*τ)|ψ(0)> / ||exp(-H*τ)|ψ(0)>||
        """
        n = self.n_qubits

        if initial_state is None:
            # Start with uniform superposition
            initial_state = np.ones(2**n, dtype=complex) / np.sqrt(2**n)

        state = initial_state.copy()
        history = []

        for step in range(self.max_steps):
            # Compute energy
            energy = np.real(np.vdot(state, hamiltonian @ state))
            history.append(energy)

            # Check convergence
            if len(history) > 1 and abs(history[-1] - history[-2]) < self.convergence_threshold:
                break

            # Imaginary time step: |ψ> -> exp(-H*dt)|ψ>
            # Use first-order approximation: (1 - H*dt)|ψ>
            state = state - self.dt * (hamiltonian @ state)

            # Normalize
            state = state / np.linalg.norm(state)

        return OptimizationResult(
            optimal_value=history[-1],
            optimal_params=state,  # Final state
            iterations=len(history),
            history=history,
            converged=len(history) < self.max_steps
        )


class QuantumNaturalGradient:
    """
    Quantum Natural Gradient Descent.
    Uses Fisher information metric for better optimization.
    """

    def __init__(
        self,
        n_qubits: int,
        learning_rate: float = 0.1,
        regularization: float = 1e-4
    ):
        self.n_qubits = n_qubits
        self.learning_rate = learning_rate
        self.regularization = regularization

    def _compute_fubini_study_metric(
        self,
        params: np.ndarray,
        ansatz: Callable[[np.ndarray], np.ndarray]
    ) -> np.ndarray:
        """
        Compute Fubini-Study metric tensor.
        g_ij = Re(<∂_i ψ|∂_j ψ>) - <∂_i ψ|ψ><ψ|∂_j ψ>
        """
        n_params = len(params)
        epsilon = 1e-5

        state = ansatz(params)
        metric = np.zeros((n_params, n_params))

        # Compute parameter derivatives
        derivatives = []
        for i in range(n_params):
            params_plus = params.copy()
            params_plus[i] += epsilon
            params_minus = params.copy()
            params_minus[i] -= epsilon

            deriv = (ansatz(params_plus) - ansatz(params_minus)) / (2 * epsilon)
            derivatives.append(deriv)

        # Compute metric tensor
        for i in range(n_params):
            for j in range(i, n_params):
                # <∂_i ψ|∂_j ψ>
                term1 = np.real(np.vdot(derivatives[i], derivatives[j]))

                # <∂_i ψ|ψ><ψ|∂_j ψ>
                term2 = np.real(np.vdot(derivatives[i], state) * np.vdot(state, derivatives[j]))

                metric[i, j] = term1 - term2
                metric[j, i] = metric[i, j]

        return metric

    def optimize(
        self,
        cost_function: Callable[[np.ndarray], float],
        ansatz: Callable[[np.ndarray], np.ndarray],
        initial_params: np.ndarray,
        max_iterations: int = 100
    ) -> OptimizationResult:
        """
        Optimize using quantum natural gradient.
        """
        params = initial_params.copy()
        history = []

        for iteration in range(max_iterations):
            # Compute cost
            cost = cost_function(params)
            history.append(cost)

            # Compute gradient
            epsilon = 1e-5
            gradient = np.zeros(len(params))
            for i in range(len(params)):
                params_plus = params.copy()
                params_plus[i] += epsilon
                params_minus = params.copy()
                params_minus[i] -= epsilon
                gradient[i] = (cost_function(params_plus) - cost_function(params_minus)) / (2 * epsilon)

            # Compute metric tensor
            metric = self._compute_fubini_study_metric(params, ansatz)

            # Regularize metric
            metric += self.regularization * np.eye(len(params))

            # Natural gradient: g^{-1} * gradient
            try:
                natural_gradient = np.linalg.solve(metric, gradient)
            except np.linalg.LinAlgError:
                natural_gradient = gradient

            # Update parameters
            params = params - self.learning_rate * natural_gradient

            # Check convergence
            if np.linalg.norm(gradient) < 1e-6:
                break

        return OptimizationResult(
            optimal_value=history[-1],
            optimal_params=params,
            iterations=len(history),
            history=history,
            converged=np.linalg.norm(gradient) < 1e-6
        )


class ROTOSOLVE:
    """
    Rotosolve optimizer.
    Analytical optimization for rotation gates.
    """

    def __init__(self, n_params: int):
        self.n_params = n_params

    def optimize(
        self,
        cost_function: Callable[[np.ndarray], float],
        initial_params: np.ndarray,
        max_iterations: int = 50
    ) -> OptimizationResult:
        """
        Optimize using Rotosolve.
        For each parameter, find optimal angle analytically.
        """
        params = initial_params.copy()
        history = []

        for iteration in range(max_iterations):
            cost = cost_function(params)
            history.append(cost)

            # Optimize each parameter
            for i in range(len(params)):
                # Evaluate at three points
                params_0 = params.copy()
                params_0[i] = 0

                params_pi2 = params.copy()
                params_pi2[i] = np.pi / 2

                params_pi = params.copy()
                params_pi[i] = np.pi

                f_0 = cost_function(params_0)
                f_pi2 = cost_function(params_pi2)
                f_pi = cost_function(params_pi)

                # Fit sinusoid: f(θ) = A*sin(θ + φ) + B
                # Analytical solution for optimal θ
                A = np.sqrt((f_0 - f_pi)**2 + (2*f_pi2 - f_0 - f_pi)**2) / 2
                B = (f_0 + f_pi) / 2

                if A > 1e-10:
                    phi = np.arctan2(2*f_pi2 - f_0 - f_pi, f_0 - f_pi)
                    # Optimal angle minimizes A*sin(θ + φ) + B
                    theta_opt = -phi - np.pi/2
                else:
                    theta_opt = params[i]

                params[i] = theta_opt

            # Check convergence
            if len(history) > 1 and abs(history[-1] - history[-2]) < 1e-8:
                break

        return OptimizationResult(
            optimal_value=history[-1],
            optimal_params=params,
            iterations=len(history),
            history=history,
            converged=len(history) < max_iterations
        )


class SPSA:
    """
    Simultaneous Perturbation Stochastic Approximation.
    Gradient-free optimization suitable for noisy quantum systems.
    """

    def __init__(
        self,
        a: float = 0.1,
        c: float = 0.1,
        A: float = 10,
        alpha: float = 0.602,
        gamma: float = 0.101
    ):
        self.a = a
        self.c = c
        self.A = A
        self.alpha = alpha
        self.gamma = gamma

    def optimize(
        self,
        cost_function: Callable[[np.ndarray], float],
        initial_params: np.ndarray,
        max_iterations: int = 100
    ) -> OptimizationResult:
        """
        Optimize using SPSA.
        """
        params = initial_params.copy()
        history = []

        for k in range(max_iterations):
            # Gain sequences
            a_k = self.a / (k + 1 + self.A)**self.alpha
            c_k = self.c / (k + 1)**self.gamma

            # Random perturbation direction
            delta = 2 * np.random.randint(0, 2, len(params)) - 1

            # Evaluate at perturbed points
            f_plus = cost_function(params + c_k * delta)
            f_minus = cost_function(params - c_k * delta)

            # Gradient estimate
            gradient = (f_plus - f_minus) / (2 * c_k * delta)

            # Update
            params = params - a_k * gradient

            # Record cost
            cost = cost_function(params)
            history.append(cost)

        return OptimizationResult(
            optimal_value=history[-1],
            optimal_params=params,
            iterations=len(history),
            history=history,
            converged=True
        )


def demo_advanced_optimizers():
    """Demonstrate advanced optimizers."""
    print("=" * 60)
    print("ADVANCED QUANTUM OPTIMIZERS DEMO")
    print("=" * 60)

    # Create simple 2-qubit Hamiltonian
    n_qubits = 2
    X = np.array([[0, 1], [1, 0]], dtype=complex)
    Z = np.array([[1, 0], [0, -1]], dtype=complex)
    I = np.eye(2, dtype=complex)

    H = -np.kron(Z, Z) - 0.5 * (np.kron(X, I) + np.kron(I, X))

    print(f"\nHamiltonian eigenvalues: {np.linalg.eigvalsh(H)}")
    exact_gs = np.linalg.eigvalsh(H)[0]
    print(f"Exact ground state: {exact_gs:.6f}")

    # QITE
    print("\n1. Quantum Imaginary Time Evolution (QITE)")
    qite = QITE(n_qubits, dt=0.05, max_steps=200)
    result = qite.evolve(H)
    print(f"   QITE energy: {result.optimal_value:.6f}")
    print(f"   Iterations: {result.iterations}")
    print(f"   Error: {abs(result.optimal_value - exact_gs):.2e}")

    # SPSA
    print("\n2. SPSA Optimizer")

    def ansatz_cost(params):
        # Simple variational ansatz
        state = np.array([1, 0, 0, 0], dtype=complex)

        # RY rotations
        for i, theta in enumerate(params[:2]):
            c, s = np.cos(theta/2), np.sin(theta/2)
            RY = np.array([[c, -s], [s, c]], dtype=complex)
            if i == 0:
                U = np.kron(RY, I)
            else:
                U = np.kron(I, RY)
            state = U @ state

        # CNOT
        CNOT = np.array([[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]], dtype=complex)
        state = CNOT @ state

        # More rotations
        for i, theta in enumerate(params[2:]):
            c, s = np.cos(theta/2), np.sin(theta/2)
            RY = np.array([[c, -s], [s, c]], dtype=complex)
            if i == 0:
                U = np.kron(RY, I)
            else:
                U = np.kron(I, RY)
            state = U @ state

        return np.real(np.vdot(state, H @ state))

    spsa = SPSA(a=0.2, c=0.1)
    result = spsa.optimize(ansatz_cost, np.random.randn(4) * 0.1, max_iterations=100)
    print(f"   SPSA energy: {result.optimal_value:.6f}")
    print(f"   Error: {abs(result.optimal_value - exact_gs):.2e}")

    # Rotosolve
    print("\n3. Rotosolve Optimizer")
    roto = ROTOSOLVE(n_params=4)
    result = roto.optimize(ansatz_cost, np.random.randn(4) * 0.1, max_iterations=20)
    print(f"   Rotosolve energy: {result.optimal_value:.6f}")
    print(f"   Iterations: {result.iterations}")
    print(f"   Error: {abs(result.optimal_value - exact_gs):.2e}")


if __name__ == "__main__":
    demo_advanced_optimizers()
