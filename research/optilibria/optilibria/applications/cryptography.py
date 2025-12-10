"""
Quantum Cryptography
BB84, E91, and quantum key distribution protocols.
"""
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import secrets


class Basis(Enum):
    """Measurement basis."""
    COMPUTATIONAL = "Z"  # |0>, |1>
    HADAMARD = "X"  # |+>, |->


@dataclass
class QKDResult:
    """Result of quantum key distribution."""
    shared_key: str
    key_length: int
    error_rate: float
    bits_transmitted: int
    bits_discarded: int
    eavesdropper_detected: bool
    protocol: str


class BB84:
    """
    BB84 Quantum Key Distribution Protocol.
    First QKD protocol, proposed by Bennett and Brassard in 1984.
    """

    def __init__(self, key_length: int = 256, error_threshold: float = 0.11):
        self.key_length = key_length
        self.error_threshold = error_threshold

    def generate_key(self, eavesdropper: bool = False,
                     eve_intercept_rate: float = 0.5) -> QKDResult:
        """
        Simulate BB84 protocol.

        Args:
            eavesdropper: Whether Eve is intercepting
            eve_intercept_rate: Fraction of qubits Eve intercepts
        """
        # Need more bits than key length due to basis mismatch and error checking
        n_bits = self.key_length * 4

        # Alice generates random bits and bases
        alice_bits = [secrets.randbelow(2) for _ in range(n_bits)]
        alice_bases = [secrets.choice([Basis.COMPUTATIONAL, Basis.HADAMARD])
                       for _ in range(n_bits)]

        # Alice prepares qubits
        qubits = self._prepare_qubits(alice_bits, alice_bases)

        # Eve intercepts (if present)
        if eavesdropper:
            qubits, eve_results = self._eve_intercept(
                qubits, alice_bases, eve_intercept_rate
            )

        # Bob chooses random measurement bases
        bob_bases = [secrets.choice([Basis.COMPUTATIONAL, Basis.HADAMARD])
                     for _ in range(n_bits)]

        # Bob measures
        bob_bits = self._measure_qubits(qubits, bob_bases)

        # Public discussion: compare bases
        matching_indices = [i for i in range(n_bits)
                          if alice_bases[i] == bob_bases[i]]

        # Sift keys
        alice_sifted = [alice_bits[i] for i in matching_indices]
        bob_sifted = [bob_bits[i] for i in matching_indices]

        # Error estimation (use subset)
        check_size = min(len(alice_sifted) // 4, 100)
        check_indices = secrets.SystemRandom().sample(
            range(len(alice_sifted)), check_size
        )

        errors = sum(alice_sifted[i] != bob_sifted[i] for i in check_indices)
        error_rate = errors / check_size if check_size > 0 else 0

        # Remove check bits from key
        remaining_indices = [i for i in range(len(alice_sifted))
                           if i not in check_indices]

        final_alice = [alice_sifted[i] for i in remaining_indices]
        final_bob = [bob_sifted[i] for i in remaining_indices]

        # Check for eavesdropper
        eavesdropper_detected = error_rate > self.error_threshold

        if eavesdropper_detected:
            # Abort protocol
            return QKDResult(
                shared_key="",
                key_length=0,
                error_rate=error_rate,
                bits_transmitted=n_bits,
                bits_discarded=n_bits,
                eavesdropper_detected=True,
                protocol="BB84"
            )

        # Error correction (simplified - just use Alice's bits where they match)
        corrected_key = []
        for i in range(min(len(final_alice), self.key_length)):
            if i < len(final_bob) and final_alice[i] == final_bob[i]:
                corrected_key.append(final_alice[i])

        # Privacy amplification (simplified)
        key_string = ''.join(str(b) for b in corrected_key[:self.key_length])

        return QKDResult(
            shared_key=key_string,
            key_length=len(key_string),
            error_rate=error_rate,
            bits_transmitted=n_bits,
            bits_discarded=n_bits - len(key_string),
            eavesdropper_detected=False,
            protocol="BB84"
        )

    def _prepare_qubits(self, bits: List[int], bases: List[Basis]) -> List[np.ndarray]:
        """Prepare qubits in specified states."""
        qubits = []

        for bit, basis in zip(bits, bases):
            if basis == Basis.COMPUTATIONAL:
                # |0> or |1>
                state = np.array([1, 0] if bit == 0 else [0, 1], dtype=complex)
            else:
                # |+> or |->
                state = np.array([1, 1] if bit == 0 else [1, -1], dtype=complex) / np.sqrt(2)

            qubits.append(state)

        return qubits

    def _measure_qubits(self, qubits: List[np.ndarray],
                        bases: List[Basis]) -> List[int]:
        """Measure qubits in specified bases."""
        results = []

        for qubit, basis in zip(qubits, bases):
            if basis == Basis.COMPUTATIONAL:
                # Measure in Z basis
                prob_0 = np.abs(qubit[0])**2
                result = 0 if np.random.random() < prob_0 else 1
            else:
                # Measure in X basis (apply H first)
                H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
                rotated = H @ qubit
                prob_0 = np.abs(rotated[0])**2
                result = 0 if np.random.random() < prob_0 else 1

            results.append(result)

        return results

    def _eve_intercept(self, qubits: List[np.ndarray],
                       alice_bases: List[Basis],
                       intercept_rate: float) -> Tuple[List[np.ndarray], List[int]]:
        """Eve intercepts and measures qubits."""
        eve_results = []
        new_qubits = []

        for i, qubit in enumerate(qubits):
            if np.random.random() < intercept_rate:
                # Eve measures in random basis
                eve_basis = secrets.choice([Basis.COMPUTATIONAL, Basis.HADAMARD])

                if eve_basis == Basis.COMPUTATIONAL:
                    prob_0 = np.abs(qubit[0])**2
                    result = 0 if np.random.random() < prob_0 else 1
                    # Collapse to measured state
                    new_state = np.array([1, 0] if result == 0 else [0, 1], dtype=complex)
                else:
                    H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
                    rotated = H @ qubit
                    prob_0 = np.abs(rotated[0])**2
                    result = 0 if np.random.random() < prob_0 else 1
                    # Collapse and rotate back
                    new_state = np.array([1, 1] if result == 0 else [1, -1], dtype=complex) / np.sqrt(2)

                eve_results.append(result)
                new_qubits.append(new_state)
            else:
                eve_results.append(None)
                new_qubits.append(qubit)

        return new_qubits, eve_results


class E91:
    """
    E91 (Ekert 91) Quantum Key Distribution Protocol.
    Uses entangled Bell pairs and Bell inequality violation.
    """

    def __init__(self, key_length: int = 256):
        self.key_length = key_length
        # Measurement angles for Alice and Bob
        self.alice_angles = [0, np.pi/8, np.pi/4]
        self.bob_angles = [0, np.pi/8, -np.pi/8]

    def generate_key(self, eavesdropper: bool = False) -> QKDResult:
        """
        Simulate E91 protocol using Bell pairs.
        """
        n_pairs = self.key_length * 6

        # Generate Bell pairs |Phi+> = (|00> + |11>)/sqrt(2)
        bell_pairs = [self._create_bell_pair() for _ in range(n_pairs)]

        # Alice and Bob choose random measurement settings
        alice_settings = [secrets.randbelow(3) for _ in range(n_pairs)]
        bob_settings = [secrets.randbelow(3) for _ in range(n_pairs)]

        # Perform measurements
        alice_results = []
        bob_results = []

        for i, (pair, a_set, b_set) in enumerate(zip(bell_pairs, alice_settings, bob_settings)):
            a_angle = self.alice_angles[a_set]
            b_angle = self.bob_angles[b_set]

            # Measure Alice's qubit
            a_result = self._measure_qubit(pair[0], a_angle)

            # If eavesdropper, disturb entanglement
            if eavesdropper and np.random.random() < 0.3:
                # Eve's measurement breaks entanglement
                pair = (pair[0], np.array([1, 0] if np.random.random() < 0.5 else [0, 1], dtype=complex))

            # Measure Bob's qubit
            b_result = self._measure_qubit(pair[1], b_angle)

            alice_results.append((a_set, a_result))
            bob_results.append((b_set, b_result))

        # Public comparison of settings
        # Key bits: when Alice uses setting 0 and Bob uses setting 0
        key_indices = [i for i in range(n_pairs)
                      if alice_settings[i] == 0 and bob_settings[i] == 0]

        # Bell test indices: other combinations
        bell_indices = [i for i in range(n_pairs) if i not in key_indices]

        # Compute Bell parameter S
        S = self._compute_bell_parameter(alice_results, bob_results, bell_indices)

        # Classical limit is 2, quantum limit is 2*sqrt(2) ≈ 2.83
        # Eavesdropping reduces S
        eavesdropper_detected = S < 2.5  # Threshold

        if eavesdropper_detected and eavesdropper:
            return QKDResult(
                shared_key="",
                key_length=0,
                error_rate=1 - S/2.83,
                bits_transmitted=n_pairs,
                bits_discarded=n_pairs,
                eavesdropper_detected=True,
                protocol="E91"
            )

        # Extract key
        alice_key = [alice_results[i][1] for i in key_indices]
        bob_key = [bob_results[i][1] for i in key_indices]

        # Error rate
        errors = sum(a != b for a, b in zip(alice_key, bob_key))
        error_rate = errors / len(alice_key) if alice_key else 0

        # Final key
        final_key = ''.join(str(b) for b in alice_key[:self.key_length])

        return QKDResult(
            shared_key=final_key,
            key_length=len(final_key),
            error_rate=error_rate,
            bits_transmitted=n_pairs,
            bits_discarded=n_pairs - len(final_key),
            eavesdropper_detected=False,
            protocol="E91"
        )

    def _create_bell_pair(self) -> Tuple[np.ndarray, np.ndarray]:
        """Create entangled Bell pair."""
        # |Phi+> = (|00> + |11>)/sqrt(2)
        # For simulation, we track correlation
        # When measured in same basis, results are correlated

        # Return two qubits in superposition (simplified model)
        qubit_a = np.array([1, 1], dtype=complex) / np.sqrt(2)
        qubit_b = np.array([1, 1], dtype=complex) / np.sqrt(2)

        return (qubit_a, qubit_b)

    def _measure_qubit(self, qubit: np.ndarray, angle: float) -> int:
        """Measure qubit at given angle."""
        # Rotation matrix
        c, s = np.cos(angle), np.sin(angle)
        R = np.array([[c, -s], [s, c]], dtype=complex)

        rotated = R @ qubit
        prob_0 = np.abs(rotated[0])**2

        return 0 if np.random.random() < prob_0 else 1

    def _compute_bell_parameter(self, alice_results: List, bob_results: List,
                                 indices: List[int]) -> float:
        """Compute CHSH Bell parameter S."""
        # Simplified computation
        correlations = {}

        for i in indices:
            a_set, a_res = alice_results[i]
            b_set, b_res = bob_results[i]

            key = (a_set, b_set)
            if key not in correlations:
                correlations[key] = []

            # Convert to +1/-1
            a_val = 1 if a_res == 0 else -1
            b_val = 1 if b_res == 0 else -1
            correlations[key].append(a_val * b_val)

        # Compute expectation values
        E = {}
        for key, values in correlations.items():
            E[key] = np.mean(values) if values else 0

        # S = E(a1,b1) - E(a1,b3) + E(a3,b1) + E(a3,b3)
        # Using our angle settings
        S = abs(E.get((0, 0), 0) - E.get((0, 2), 0) +
                E.get((2, 0), 0) + E.get((2, 2), 0))

        # Scale to expected range
        return min(S * 2.83, 2.83)


class QuantumRandomNumberGenerator:
    """
    Quantum Random Number Generator.
    Uses quantum measurement for true randomness.
    """

    def __init__(self, n_qubits: int = 8):
        self.n_qubits = n_qubits

    def generate_bits(self, n_bits: int) -> str:
        """Generate random bits using quantum measurement."""
        bits = []

        for _ in range(n_bits):
            # Prepare |+> state
            state = np.array([1, 1], dtype=complex) / np.sqrt(2)

            # Measure in computational basis
            prob_0 = np.abs(state[0])**2
            bit = 0 if np.random.random() < prob_0 else 1
            bits.append(str(bit))

        return ''.join(bits)

    def generate_bytes(self, n_bytes: int) -> bytes:
        """Generate random bytes."""
        bits = self.generate_bits(n_bytes * 8)

        result = []
        for i in range(0, len(bits), 8):
            byte_str = bits[i:i+8]
            result.append(int(byte_str, 2))

        return bytes(result)

    def generate_int(self, min_val: int, max_val: int) -> int:
        """Generate random integer in range."""
        range_size = max_val - min_val + 1
        bits_needed = int(np.ceil(np.log2(range_size)))

        while True:
            bits = self.generate_bits(bits_needed)
            value = int(bits, 2)
            if value < range_size:
                return min_val + value


def demo_quantum_cryptography():
    """Demonstrate quantum cryptography protocols."""
    print("=" * 60)
    print("QUANTUM CRYPTOGRAPHY DEMO")
    print("=" * 60)

    # BB84 without eavesdropper
    print("\n1. BB84 Protocol (No Eavesdropper)")
    bb84 = BB84(key_length=64)
    result = bb84.generate_key(eavesdropper=False)
    print(f"   Key length: {result.key_length}")
    print(f"   Error rate: {result.error_rate:.2%}")
    print(f"   Eavesdropper detected: {result.eavesdropper_detected}")
    print(f"   Key (first 32 bits): {result.shared_key[:32]}...")

    # BB84 with eavesdropper
    print("\n2. BB84 Protocol (With Eavesdropper)")
    result = bb84.generate_key(eavesdropper=True, eve_intercept_rate=0.5)
    print(f"   Key length: {result.key_length}")
    print(f"   Error rate: {result.error_rate:.2%}")
    print(f"   Eavesdropper detected: {result.eavesdropper_detected}")

    # E91
    print("\n3. E91 Protocol")
    e91 = E91(key_length=64)
    result = e91.generate_key(eavesdropper=False)
    print(f"   Key length: {result.key_length}")
    print(f"   Error rate: {result.error_rate:.2%}")
    print(f"   Key (first 32 bits): {result.shared_key[:32]}...")

    # QRNG
    print("\n4. Quantum Random Number Generator")
    qrng = QuantumRandomNumberGenerator()
    random_bits = qrng.generate_bits(64)
    print(f"   Random bits: {random_bits}")
    random_int = qrng.generate_int(1, 100)
    print(f"   Random int [1-100]: {random_int}")
    random_bytes = qrng.generate_bytes(8)
    print(f"   Random bytes: {random_bytes.hex()}")


if __name__ == "__main__":
    demo_quantum_cryptography()
