"""Pure Python quantum circuit simulator."""
import numpy as np
from typing import Dict, List, Optional, Tuple
from .gates import QuantumGates

class QuantumSimulator:
    """Statevector quantum circuit simulator."""

    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.state = np.zeros(2**num_qubits, dtype=complex)
        self.state[0] = 1.0
        self.gates: List[Tuple] = []
        self._measurements: List[int] = []

    def add_gate(self, gate: str, qubits: List[int], params: Optional[List[float]] = None):
        self.gates.append((gate, qubits, params))
        self._apply_gate(gate, qubits, params)

    def _apply_gate(self, gate: str, qubits: List[int], params: Optional[List[float]] = None):
        matrix = self._get_gate_matrix(gate, params)
        if len(qubits) == 1:
            self._apply_single_qubit(matrix, qubits[0])
        elif len(qubits) == 2:
            self._apply_two_qubit(matrix, qubits[0], qubits[1])

    def _get_gate_matrix(self, gate: str, params: Optional[List[float]] = None) -> np.ndarray:
        g = QuantumGates()
        gate_map = {"H": g.H, "X": g.X, "Y": g.Y, "Z": g.Z, "S": g.S, "T": g.T,
                    "CNOT": g.CNOT, "CX": g.CNOT, "SWAP": g.SWAP}
        if gate in gate_map:
            return gate_map[gate]
        if gate == "Rx" and params: return g.Rx(params[0])
        if gate == "Ry" and params: return g.Ry(params[0])
        if gate == "Rz" and params: return g.Rz(params[0])
        raise ValueError(f"Unknown gate: {gate}")

    def _apply_single_qubit(self, gate: np.ndarray, qubit: int):
        n = self.num_qubits
        new_state = np.zeros_like(self.state)
        for i in range(2**n):
            bit = (i >> (n-1-qubit)) & 1
            i_flip = i ^ (1 << (n-1-qubit))
            if bit == 0:
                new_state[i] += gate[0,0]*self.state[i] + gate[0,1]*self.state[i_flip]
            else:
                new_state[i] += gate[1,0]*self.state[i_flip] + gate[1,1]*self.state[i]
        self.state = new_state

    def _apply_two_qubit(self, gate: np.ndarray, ctrl: int, tgt: int):
        n = self.num_qubits
        new_state = np.zeros_like(self.state)
        for i in range(2**n):
            c_bit = (i >> (n-1-ctrl)) & 1
            t_bit = (i >> (n-1-tgt)) & 1
            basis = (c_bit << 1) | t_bit
            for j in range(4):
                if gate[basis, j] != 0:
                    new_c, new_t = (j >> 1) & 1, j & 1
                    new_i = i
                    if new_c != c_bit: new_i ^= (1 << (n-1-ctrl))
                    if new_t != t_bit: new_i ^= (1 << (n-1-tgt))
                    new_state[new_i] += gate[j, basis] * self.state[i]
        self.state = new_state

    def measure(self, qubits: List[int]):
        self._measurements.extend(qubits)

    def execute(self, shots: int = 1000) -> Dict[str, int]:
        probs = np.abs(self.state)**2
        outcomes = np.random.choice(len(probs), size=shots, p=probs)
        counts = {}
        for o in outcomes:
            if self._measurements:
                bs = "".join(str((o >> (self.num_qubits-1-q)) & 1) for q in self._measurements)
            else:
                bs = format(o, f'0{self.num_qubits}b')
            counts[bs] = counts.get(bs, 0) + 1
        return counts

    def get_statevector(self) -> np.ndarray:
        return self.state.copy()
