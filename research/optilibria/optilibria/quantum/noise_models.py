"""
Quantum Noise Models
Realistic noise simulation for quantum circuits.
"""
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum


class NoiseType(Enum):
    """Types of quantum noise."""
    DEPOLARIZING = "depolarizing"
    AMPLITUDE_DAMPING = "amplitude_damping"
    PHASE_DAMPING = "phase_damping"
    BIT_FLIP = "bit_flip"
    PHASE_FLIP = "phase_flip"
    THERMAL = "thermal"
    READOUT = "readout"


@dataclass
class NoiseParameters:
    """Parameters for noise model."""
    t1: float = 50e-6  # T1 relaxation time (seconds)
    t2: float = 70e-6  # T2 dephasing time (seconds)
    gate_time_1q: float = 50e-9  # Single-qubit gate time
    gate_time_2q: float = 300e-9  # Two-qubit gate time
    readout_error_0: float = 0.015  # P(1|0) readout error
    readout_error_1: float = 0.035  # P(0|1) readout error
    thermal_population: float = 0.01  # Thermal excited state population


class DepolarizingChannel:
    """
    Depolarizing noise channel.
    Applies random Pauli errors with probability p.
    """

    def __init__(self, p: float):
        self.p = p
        self.paulis = self._create_paulis()

    def _create_paulis(self) -> List[np.ndarray]:
        """Create Pauli matrices."""
        I = np.eye(2, dtype=complex)
        X = np.array([[0, 1], [1, 0]], dtype=complex)
        Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
        Z = np.array([[1, 0], [0, -1]], dtype=complex)
        return [I, X, Y, Z]

    def apply(self, rho: np.ndarray) -> np.ndarray:
        """Apply depolarizing channel to density matrix."""
        I, X, Y, Z = self.paulis

        # Single qubit depolarizing: (1-p)ρ + p/3(XρX + YρY + ZρZ)
        result = (1 - self.p) * rho
        result += (self.p / 3) * (X @ rho @ X + Y @ rho @ Y + Z @ rho @ Z)

        return result

    def apply_to_statevector(self, state: np.ndarray, qubit: int, n_qubits: int) -> np.ndarray:
        """Apply channel probabilistically to statevector."""
        if np.random.random() > self.p:
            return state

        # Choose random Pauli
        pauli_idx = np.random.randint(1, 4)  # X, Y, or Z
        pauli = self.paulis[pauli_idx]

        return self._apply_single_qubit_gate(state, pauli, qubit, n_qubits)

    def _apply_single_qubit_gate(self, state: np.ndarray, gate: np.ndarray,
                                  qubit: int, n_qubits: int) -> np.ndarray:
        """Apply single-qubit gate to statevector."""
        new_state = np.zeros_like(state)

        for i in range(len(state)):
            bit = (i >> (n_qubits - 1 - qubit)) & 1
            partner = i ^ (1 << (n_qubits - 1 - qubit))

            if bit == 0:
                new_state[i] += gate[0, 0] * state[i] + gate[0, 1] * state[partner]
                new_state[partner] += gate[1, 0] * state[i] + gate[1, 1] * state[partner]

        return new_state


class AmplitudeDampingChannel:
    """
    Amplitude damping channel.
    Models T1 relaxation (energy decay).
    """

    def __init__(self, gamma: float):
        self.gamma = gamma
        self.K0 = np.array([[1, 0], [0, np.sqrt(1 - gamma)]], dtype=complex)
        self.K1 = np.array([[0, np.sqrt(gamma)], [0, 0]], dtype=complex)

    @classmethod
    def from_t1(cls, t1: float, gate_time: float) -> 'AmplitudeDampingChannel':
        """Create channel from T1 time and gate duration."""
        gamma = 1 - np.exp(-gate_time / t1)
        return cls(gamma)

    def apply(self, rho: np.ndarray) -> np.ndarray:
        """Apply amplitude damping to density matrix."""
        return self.K0 @ rho @ self.K0.conj().T + self.K1 @ rho @ self.K1.conj().T

    def apply_to_statevector(self, state: np.ndarray, qubit: int, n_qubits: int) -> Tuple[np.ndarray, bool]:
        """
        Apply channel to statevector with measurement-based simulation.
        Returns (new_state, decay_occurred).
        """
        # Calculate probability of decay
        p_decay = 0.0
        for i in range(len(state)):
            bit = (i >> (n_qubits - 1 - qubit)) & 1
            if bit == 1:
                p_decay += self.gamma * np.abs(state[i])**2

        if np.random.random() < p_decay:
            # Decay occurred - apply K1
            new_state = np.zeros_like(state)
            for i in range(len(state)):
                bit = (i >> (n_qubits - 1 - qubit)) & 1
                if bit == 1:
                    partner = i ^ (1 << (n_qubits - 1 - qubit))
                    new_state[partner] += np.sqrt(self.gamma) * state[i]

            # Normalize
            norm = np.linalg.norm(new_state)
            if norm > 0:
                new_state /= norm
            return new_state, True
        else:
            # No decay - apply K0
            new_state = state.copy()
            for i in range(len(state)):
                bit = (i >> (n_qubits - 1 - qubit)) & 1
                if bit == 1:
                    new_state[i] *= np.sqrt(1 - self.gamma)

            # Normalize
            norm = np.linalg.norm(new_state)
            if norm > 0:
                new_state /= norm
            return new_state, False


class PhaseDampingChannel:
    """
    Phase damping channel.
    Models T2 dephasing (loss of coherence).
    """

    def __init__(self, gamma: float):
        self.gamma = gamma

    @classmethod
    def from_t2(cls, t2: float, gate_time: float) -> 'PhaseDampingChannel':
        """Create channel from T2 time and gate duration."""
        gamma = 1 - np.exp(-gate_time / t2)
        return cls(gamma)

    def apply(self, rho: np.ndarray) -> np.ndarray:
        """Apply phase damping to density matrix."""
        result = rho.copy()
        # Damp off-diagonal elements
        result[0, 1] *= np.sqrt(1 - self.gamma)
        result[1, 0] *= np.sqrt(1 - self.gamma)
        return result

    def apply_to_statevector(self, state: np.ndarray, qubit: int, n_qubits: int) -> np.ndarray:
        """Apply random phase with probability gamma."""
        if np.random.random() < self.gamma:
            # Apply random Z rotation
            phase = np.exp(1j * np.random.uniform(0, 2*np.pi))
            new_state = state.copy()

            for i in range(len(state)):
                bit = (i >> (n_qubits - 1 - qubit)) & 1
                if bit == 1:
                    new_state[i] *= phase

            return new_state

        return state


class ReadoutError:
    """
    Readout/measurement error model.
    """

    def __init__(self, p0_to_1: float = 0.015, p1_to_0: float = 0.035):
        self.p0_to_1 = p0_to_1  # Probability of measuring 1 when state is 0
        self.p1_to_0 = p1_to_0  # Probability of measuring 0 when state is 1

        # Confusion matrix
        self.confusion = np.array([
            [1 - p0_to_1, p0_to_1],
            [p1_to_0, 1 - p1_to_0]
        ])

    def apply(self, counts: Dict[str, int]) -> Dict[str, int]:
        """Apply readout error to measurement counts."""
        n_qubits = len(next(iter(counts.keys())))
        noisy_counts = {}

        for bitstring, count in counts.items():
            for _ in range(count):
                noisy_bits = []
                for bit in bitstring:
                    true_bit = int(bit)
                    # Apply confusion matrix
                    if np.random.random() < self.confusion[true_bit, 1 - true_bit]:
                        noisy_bits.append(str(1 - true_bit))
                    else:
                        noisy_bits.append(bit)

                noisy_bitstring = ''.join(noisy_bits)
                noisy_counts[noisy_bitstring] = noisy_counts.get(noisy_bitstring, 0) + 1

        return noisy_counts

    def get_calibration_matrix(self, n_qubits: int) -> np.ndarray:
        """Get full calibration matrix for n qubits."""
        # Tensor product of single-qubit confusion matrices
        cal_matrix = self.confusion.copy()

        for _ in range(n_qubits - 1):
            cal_matrix = np.kron(cal_matrix, self.confusion)

        return cal_matrix


class NoiseModel:
    """
    Complete noise model for quantum circuit simulation.
    """

    def __init__(self, params: NoiseParameters = None):
        self.params = params or NoiseParameters()
        self._init_channels()

    def _init_channels(self):
        """Initialize noise channels from parameters."""
        # Single-qubit gate noise
        self.amp_damp_1q = AmplitudeDampingChannel.from_t1(
            self.params.t1, self.params.gate_time_1q
        )
        self.phase_damp_1q = PhaseDampingChannel.from_t2(
            self.params.t2, self.params.gate_time_1q
        )

        # Two-qubit gate noise (higher error)
        self.amp_damp_2q = AmplitudeDampingChannel.from_t1(
            self.params.t1, self.params.gate_time_2q
        )
        self.phase_damp_2q = PhaseDampingChannel.from_t2(
            self.params.t2, self.params.gate_time_2q
        )

        # Depolarizing noise
        p_1q = 1 - np.exp(-self.params.gate_time_1q / self.params.t2)
        p_2q = 1 - np.exp(-self.params.gate_time_2q / self.params.t2)
        self.depol_1q = DepolarizingChannel(p_1q * 0.1)
        self.depol_2q = DepolarizingChannel(p_2q * 0.1)

        # Readout error
        self.readout = ReadoutError(
            self.params.readout_error_0,
            self.params.readout_error_1
        )

    def apply_gate_noise(self, state: np.ndarray, qubits: List[int],
                         n_qubits: int, is_two_qubit: bool = False) -> np.ndarray:
        """Apply noise after a gate operation."""
        for qubit in qubits:
            if is_two_qubit:
                state = self.depol_2q.apply_to_statevector(state, qubit, n_qubits)
                state, _ = self.amp_damp_2q.apply_to_statevector(state, qubit, n_qubits)
                state = self.phase_damp_2q.apply_to_statevector(state, qubit, n_qubits)
            else:
                state = self.depol_1q.apply_to_statevector(state, qubit, n_qubits)
                state, _ = self.amp_damp_1q.apply_to_statevector(state, qubit, n_qubits)
                state = self.phase_damp_1q.apply_to_statevector(state, qubit, n_qubits)

        return state

    def apply_readout_noise(self, counts: Dict[str, int]) -> Dict[str, int]:
        """Apply readout noise to measurement results."""
        return self.readout.apply(counts)


class NoisyQuantumSimulator:
    """
    Quantum simulator with realistic noise.
    """

    def __init__(self, n_qubits: int, noise_model: NoiseModel = None):
        self.n_qubits = n_qubits
        self.noise_model = noise_model or NoiseModel()
        self.state = np.zeros(2**n_qubits, dtype=complex)
        self.state[0] = 1.0
        self.gates = []

    def reset(self):
        """Reset to |0...0> state."""
        self.state = np.zeros(2**self.n_qubits, dtype=complex)
        self.state[0] = 1.0
        self.gates = []

    def h(self, qubit: int):
        """Apply Hadamard gate with noise."""
        H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
        self.state = self._apply_single_gate(H, qubit)
        self.state = self.noise_model.apply_gate_noise(
            self.state, [qubit], self.n_qubits, is_two_qubit=False
        )
        self.gates.append(('H', [qubit]))

    def x(self, qubit: int):
        """Apply X gate with noise."""
        X = np.array([[0, 1], [1, 0]], dtype=complex)
        self.state = self._apply_single_gate(X, qubit)
        self.state = self.noise_model.apply_gate_noise(
            self.state, [qubit], self.n_qubits, is_two_qubit=False
        )
        self.gates.append(('X', [qubit]))

    def rz(self, qubit: int, theta: float):
        """Apply RZ gate with noise."""
        RZ = np.array([
            [np.exp(-1j*theta/2), 0],
            [0, np.exp(1j*theta/2)]
        ], dtype=complex)
        self.state = self._apply_single_gate(RZ, qubit)
        self.state = self.noise_model.apply_gate_noise(
            self.state, [qubit], self.n_qubits, is_two_qubit=False
        )
        self.gates.append(('RZ', [qubit], theta))

    def cnot(self, control: int, target: int):
        """Apply CNOT gate with noise."""
        self.state = self._apply_cnot(control, target)
        self.state = self.noise_model.apply_gate_noise(
            self.state, [control, target], self.n_qubits, is_two_qubit=True
        )
        self.gates.append(('CNOT', [control, target]))

    def _apply_single_gate(self, gate: np.ndarray, qubit: int) -> np.ndarray:
        """Apply single-qubit gate."""
        n = self.n_qubits
        new_state = np.zeros_like(self.state)

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            partner = i ^ (1 << (n - 1 - qubit))

            if bit == 0:
                new_state[i] += gate[0, 0] * self.state[i] + gate[0, 1] * self.state[partner]
            else:
                new_state[i] += gate[1, 0] * self.state[partner] + gate[1, 1] * self.state[i]

        return new_state

    def _apply_cnot(self, control: int, target: int) -> np.ndarray:
        """Apply CNOT gate."""
        n = self.n_qubits
        new_state = self.state.copy()

        for i in range(2**n):
            ctrl_bit = (i >> (n - 1 - control)) & 1
            if ctrl_bit == 1:
                partner = i ^ (1 << (n - 1 - target))
                new_state[i], new_state[partner] = self.state[partner], self.state[i]

        return new_state

    def measure(self, shots: int = 1000) -> Dict[str, int]:
        """Measure all qubits with readout noise."""
        probs = np.abs(self.state)**2

        # Sample from distribution
        counts = {}
        samples = np.random.choice(len(self.state), size=shots, p=probs)

        for s in samples:
            bitstring = format(s, f'0{self.n_qubits}b')
            counts[bitstring] = counts.get(bitstring, 0) + 1

        # Apply readout noise
        noisy_counts = self.noise_model.apply_readout_noise(counts)

        return noisy_counts

    def get_fidelity(self, ideal_state: np.ndarray) -> float:
        """Calculate fidelity with ideal state."""
        return np.abs(np.vdot(ideal_state, self.state))**2


def demo_noise_models():
    """Demonstrate noise models."""
    print("=" * 60)
    print("QUANTUM NOISE MODELS DEMO")
    print("=" * 60)

    # Create noisy simulator
    params = NoiseParameters(
        t1=50e-6,
        t2=70e-6,
        readout_error_0=0.02,
        readout_error_1=0.05
    )

    noise_model = NoiseModel(params)
    sim = NoisyQuantumSimulator(2, noise_model)

    # Create Bell state
    print("\n1. Bell State with Noise")
    sim.h(0)
    sim.cnot(0, 1)

    # Ideal Bell state
    ideal = np.array([1, 0, 0, 1], dtype=complex) / np.sqrt(2)
    fidelity = sim.get_fidelity(ideal)
    print(f"   Fidelity with ideal: {fidelity:.4f}")

    # Measure
    counts = sim.measure(shots=1000)
    print(f"   Measurement counts: {counts}")

    # Compare with noiseless
    print("\n2. Noise Comparison")

    # Run multiple trials
    fidelities = []
    for _ in range(10):
        sim.reset()
        sim.h(0)
        sim.cnot(0, 1)
        fidelities.append(sim.get_fidelity(ideal))

    print(f"   Mean fidelity: {np.mean(fidelities):.4f}")
    print(f"   Std fidelity: {np.std(fidelities):.4f}")


if __name__ == "__main__":
    demo_noise_models()
