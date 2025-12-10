"""
Quantum Phase Estimation (QPE)
Estimates eigenvalues of unitary operators with exponential precision.
"""
import numpy as np
from typing import Dict, Any, Optional, Tuple, List
from .gates import QuantumGates


class QuantumPhaseEstimation:
    """
    Quantum Phase Estimation algorithm.

    Given a unitary U and eigenstate |ψ⟩ where U|ψ⟩ = e^{2πiθ}|ψ⟩,
    estimates θ to n bits of precision using O(2^n) controlled-U operations.
    """

    def __init__(self, precision_bits: int = 4):
        self.precision_bits = precision_bits
        self.precision = 2**precision_bits

    def estimate(
        self,
        unitary: np.ndarray,
        eigenstate: Optional[np.ndarray] = None
    ) -> Dict[str, Any]:
        """
        Estimate the phase of a unitary's eigenvalue.

        Args:
            unitary: Unitary matrix U
            eigenstate: Initial state (if None, uses computational basis)

        Returns:
            Dict with estimated phase, eigenvalue, and metadata
        """
        n = int(np.log2(unitary.shape[0]))

        if eigenstate is None:
            eigenstate = np.zeros(2**n, dtype=complex)
            eigenstate[0] = 1.0

        # Full QPE simulation
        total_qubits = self.precision_bits + n
        state = self._initialize_state(eigenstate)

        # Apply Hadamards to precision register
        state = self._apply_hadamards(state, n)

        # Apply controlled-U^(2^k) operations
        state = self._apply_controlled_unitaries(state, unitary, n)

        # Apply inverse QFT to precision register
        state = self._apply_inverse_qft(state, n)

        # Measure precision register
        phase_estimate, probability = self._measure_phase(state, n)

        # Convert to actual phase
        estimated_phase = phase_estimate / self.precision
        estimated_eigenvalue = np.exp(2j * np.pi * estimated_phase)

        # Compute exact for comparison
        eigenvalues = np.linalg.eigvals(unitary)
        exact_phases = np.angle(eigenvalues) / (2 * np.pi)
        exact_phases = np.where(exact_phases < 0, exact_phases + 1, exact_phases)

        # Find closest exact phase
        closest_idx = np.argmin(np.abs(exact_phases - estimated_phase))
        exact_phase = exact_phases[closest_idx]

        return {
            'estimated_phase': estimated_phase,
            'estimated_eigenvalue': estimated_eigenvalue,
            'exact_phase': exact_phase,
            'exact_eigenvalue': eigenvalues[closest_idx],
            'error': abs(estimated_phase - exact_phase),
            'probability': probability,
            'precision_bits': self.precision_bits,
            'binary_result': format(phase_estimate, f'0{self.precision_bits}b')
        }

    def _initialize_state(self, eigenstate: np.ndarray) -> np.ndarray:
        """Initialize full QPE state: |0...0⟩ ⊗ |ψ⟩."""
        precision_state = np.zeros(self.precision, dtype=complex)
        precision_state[0] = 1.0
        return np.kron(precision_state, eigenstate)

    def _apply_hadamards(self, state: np.ndarray, n_target: int) -> np.ndarray:
        """Apply Hadamard to each precision qubit."""
        H = QuantumGates.H
        total_qubits = self.precision_bits + n_target

        for qubit in range(self.precision_bits):
            state = self._apply_single_qubit_gate(state, H, qubit, total_qubits)

        return state

    def _apply_controlled_unitaries(
        self,
        state: np.ndarray,
        unitary: np.ndarray,
        n_target: int
    ) -> np.ndarray:
        """Apply controlled-U^(2^k) for each precision qubit k."""
        total_qubits = self.precision_bits + n_target

        for k in range(self.precision_bits):
            # U^(2^k)
            power = 2**(self.precision_bits - 1 - k)
            U_power = np.linalg.matrix_power(unitary, power)

            # Apply controlled-U^(2^k) with control on qubit k
            state = self._apply_controlled_unitary(
                state, U_power, k,
                list(range(self.precision_bits, total_qubits)),
                total_qubits
            )

        return state

    def _apply_inverse_qft(self, state: np.ndarray, n_target: int) -> np.ndarray:
        """Apply inverse QFT to precision register."""
        total_qubits = self.precision_bits + n_target
        n = self.precision_bits

        # Inverse QFT = reverse order + conjugate phases
        for i in range(n // 2):
            state = self._apply_swap(state, i, n - 1 - i, total_qubits)

        for i in range(n):
            for j in range(i):
                # Controlled phase rotation (conjugate for inverse)
                angle = -np.pi / (2**(i - j))
                state = self._apply_controlled_phase(state, j, i, angle, total_qubits)

            # Hadamard
            state = self._apply_single_qubit_gate(state, QuantumGates.H, i, total_qubits)

        return state

    def _measure_phase(self, state: np.ndarray, n_target: int) -> Tuple[int, float]:
        """Measure precision register and return most likely phase."""
        # Compute probabilities for each precision register value
        target_dim = 2**n_target
        probs = np.zeros(self.precision)

        for p in range(self.precision):
            for t in range(target_dim):
                idx = p * target_dim + t
                probs[p] += np.abs(state[idx])**2

        # Return most likely outcome
        best_outcome = np.argmax(probs)
        return best_outcome, probs[best_outcome]

    def _apply_single_qubit_gate(
        self,
        state: np.ndarray,
        gate: np.ndarray,
        qubit: int,
        n_qubits: int
    ) -> np.ndarray:
        """Apply single-qubit gate."""
        new_state = np.zeros_like(state)

        for i in range(len(state)):
            bit = (i >> (n_qubits - 1 - qubit)) & 1
            i_flip = i ^ (1 << (n_qubits - 1 - qubit))

            if bit == 0:
                new_state[i] += gate[0, 0] * state[i] + gate[0, 1] * state[i_flip]
            else:
                new_state[i] += gate[1, 0] * state[i_flip] + gate[1, 1] * state[i]

        return new_state

    def _apply_controlled_unitary(
        self,
        state: np.ndarray,
        unitary: np.ndarray,
        control: int,
        targets: List[int],
        n_qubits: int
    ) -> np.ndarray:
        """Apply controlled unitary on target qubits."""
        new_state = state.copy()
        n_targets = len(targets)
        U_dim = 2**n_targets

        for i in range(len(state)):
            ctrl_bit = (i >> (n_qubits - 1 - control)) & 1

            if ctrl_bit == 1:
                # Extract target bits
                target_idx = 0
                for k, t in enumerate(targets):
                    bit = (i >> (n_qubits - 1 - t)) & 1
                    target_idx |= (bit << (n_targets - 1 - k))

                # Apply unitary
                new_state[i] = 0
                for j in range(U_dim):
                    # Compute new index with target bits set to j
                    new_i = i
                    for k, t in enumerate(targets):
                        old_bit = (i >> (n_qubits - 1 - t)) & 1
                        new_bit = (j >> (n_targets - 1 - k)) & 1
                        if old_bit != new_bit:
                            new_i ^= (1 << (n_qubits - 1 - t))

                    new_state[i] += unitary[target_idx, j] * state[new_i]

        return new_state

    def _apply_controlled_phase(
        self,
        state: np.ndarray,
        control: int,
        target: int,
        angle: float,
        n_qubits: int
    ) -> np.ndarray:
        """Apply controlled phase rotation."""
        new_state = state.copy()

        for i in range(len(state)):
            ctrl_bit = (i >> (n_qubits - 1 - control)) & 1
            tgt_bit = (i >> (n_qubits - 1 - target)) & 1

            if ctrl_bit == 1 and tgt_bit == 1:
                new_state[i] *= np.exp(1j * angle)

        return new_state

    def _apply_swap(
        self,
        state: np.ndarray,
        qubit1: int,
        qubit2: int,
        n_qubits: int
    ) -> np.ndarray:
        """Apply SWAP gate."""
        new_state = state.copy()

        for i in range(len(state)):
            bit1 = (i >> (n_qubits - 1 - qubit1)) & 1
            bit2 = (i >> (n_qubits - 1 - qubit2)) & 1

            if bit1 != bit2:
                # Swap the bits
                swapped = i ^ (1 << (n_qubits - 1 - qubit1)) ^ (1 << (n_qubits - 1 - qubit2))
                new_state[i], new_state[swapped] = state[swapped], state[i]

        return new_state


def estimate_eigenvalue(unitary: np.ndarray, precision: int = 4) -> Dict[str, Any]:
    """Convenience function to estimate eigenvalue of a unitary."""
    qpe = QuantumPhaseEstimation(precision_bits=precision)
    return qpe.estimate(unitary)
