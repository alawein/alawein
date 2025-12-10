"""
Quantum Circuit Visualization
ASCII and text-based circuit diagrams.
"""
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum


class GateType(Enum):
    """Types of quantum gates."""
    SINGLE = "single"
    CONTROLLED = "controlled"
    MULTI = "multi"
    MEASUREMENT = "measurement"
    BARRIER = "barrier"


@dataclass
class Gate:
    """Representation of a quantum gate."""
    name: str
    qubits: List[int]
    params: List[float] = None
    gate_type: GateType = GateType.SINGLE

    def __post_init__(self):
        if self.params is None:
            self.params = []


class QuantumCircuit:
    """
    Quantum circuit with visualization capabilities.
    """

    def __init__(self, n_qubits: int, name: str = "circuit"):
        self.n_qubits = n_qubits
        self.name = name
        self.gates: List[Gate] = []
        self.classical_bits = 0

    # Single-qubit gates
    def h(self, qubit: int) -> 'QuantumCircuit':
        """Add Hadamard gate."""
        self.gates.append(Gate("H", [qubit], gate_type=GateType.SINGLE))
        return self

    def x(self, qubit: int) -> 'QuantumCircuit':
        """Add X (NOT) gate."""
        self.gates.append(Gate("X", [qubit], gate_type=GateType.SINGLE))
        return self

    def y(self, qubit: int) -> 'QuantumCircuit':
        """Add Y gate."""
        self.gates.append(Gate("Y", [qubit], gate_type=GateType.SINGLE))
        return self

    def z(self, qubit: int) -> 'QuantumCircuit':
        """Add Z gate."""
        self.gates.append(Gate("Z", [qubit], gate_type=GateType.SINGLE))
        return self

    def s(self, qubit: int) -> 'QuantumCircuit':
        """Add S gate."""
        self.gates.append(Gate("S", [qubit], gate_type=GateType.SINGLE))
        return self

    def t(self, qubit: int) -> 'QuantumCircuit':
        """Add T gate."""
        self.gates.append(Gate("T", [qubit], gate_type=GateType.SINGLE))
        return self

    def rx(self, qubit: int, theta: float) -> 'QuantumCircuit':
        """Add RX rotation gate."""
        self.gates.append(Gate("RX", [qubit], [theta], gate_type=GateType.SINGLE))
        return self

    def ry(self, qubit: int, theta: float) -> 'QuantumCircuit':
        """Add RY rotation gate."""
        self.gates.append(Gate("RY", [qubit], [theta], gate_type=GateType.SINGLE))
        return self

    def rz(self, qubit: int, theta: float) -> 'QuantumCircuit':
        """Add RZ rotation gate."""
        self.gates.append(Gate("RZ", [qubit], [theta], gate_type=GateType.SINGLE))
        return self

    # Two-qubit gates
    def cx(self, control: int, target: int) -> 'QuantumCircuit':
        """Add CNOT gate."""
        self.gates.append(Gate("CX", [control, target], gate_type=GateType.CONTROLLED))
        return self

    def cnot(self, control: int, target: int) -> 'QuantumCircuit':
        """Alias for cx."""
        return self.cx(control, target)

    def cz(self, control: int, target: int) -> 'QuantumCircuit':
        """Add CZ gate."""
        self.gates.append(Gate("CZ", [control, target], gate_type=GateType.CONTROLLED))
        return self

    def swap(self, qubit1: int, qubit2: int) -> 'QuantumCircuit':
        """Add SWAP gate."""
        self.gates.append(Gate("SWAP", [qubit1, qubit2], gate_type=GateType.MULTI))
        return self

    def crx(self, control: int, target: int, theta: float) -> 'QuantumCircuit':
        """Add controlled RX gate."""
        self.gates.append(Gate("CRX", [control, target], [theta], gate_type=GateType.CONTROLLED))
        return self

    def cry(self, control: int, target: int, theta: float) -> 'QuantumCircuit':
        """Add controlled RY gate."""
        self.gates.append(Gate("CRY", [control, target], [theta], gate_type=GateType.CONTROLLED))
        return self

    def crz(self, control: int, target: int, theta: float) -> 'QuantumCircuit':
        """Add controlled RZ gate."""
        self.gates.append(Gate("CRZ", [control, target], [theta], gate_type=GateType.CONTROLLED))
        return self

    # Three-qubit gates
    def ccx(self, control1: int, control2: int, target: int) -> 'QuantumCircuit':
        """Add Toffoli (CCX) gate."""
        self.gates.append(Gate("CCX", [control1, control2, target], gate_type=GateType.MULTI))
        return self

    def toffoli(self, control1: int, control2: int, target: int) -> 'QuantumCircuit':
        """Alias for ccx."""
        return self.ccx(control1, control2, target)

    # Utility
    def barrier(self, qubits: List[int] = None) -> 'QuantumCircuit':
        """Add barrier."""
        if qubits is None:
            qubits = list(range(self.n_qubits))
        self.gates.append(Gate("BARRIER", qubits, gate_type=GateType.BARRIER))
        return self

    def measure(self, qubit: int, classical_bit: int = None) -> 'QuantumCircuit':
        """Add measurement."""
        if classical_bit is None:
            classical_bit = self.classical_bits
            self.classical_bits += 1
        self.gates.append(Gate("M", [qubit], [classical_bit], gate_type=GateType.MEASUREMENT))
        return self

    def measure_all(self) -> 'QuantumCircuit':
        """Measure all qubits."""
        for q in range(self.n_qubits):
            self.measure(q)
        return self

    def depth(self) -> int:
        """Calculate circuit depth."""
        if not self.gates:
            return 0

        qubit_depths = [0] * self.n_qubits

        for gate in self.gates:
            if gate.gate_type == GateType.BARRIER:
                continue

            max_depth = max(qubit_depths[q] for q in gate.qubits)
            for q in gate.qubits:
                qubit_depths[q] = max_depth + 1

        return max(qubit_depths)

    def gate_count(self) -> Dict[str, int]:
        """Count gates by type."""
        counts = {}
        for gate in self.gates:
            if gate.gate_type != GateType.BARRIER:
                counts[gate.name] = counts.get(gate.name, 0) + 1
        return counts

    def draw(self, output: str = 'text') -> str:
        """
        Draw the circuit.

        Args:
            output: 'text' for ASCII art, 'latex' for LaTeX
        """
        if output == 'text':
            return self._draw_text()
        elif output == 'latex':
            return self._draw_latex()
        else:
            return self._draw_text()

    def _draw_text(self) -> str:
        """Draw ASCII circuit diagram."""
        # Calculate column widths
        columns = self._layout_gates()

        if not columns:
            # Empty circuit
            lines = []
            for q in range(self.n_qubits):
                lines.append(f"q{q}: " + "-" * 20)
            return "\n".join(lines)

        # Build circuit strings
        wire_lines = [f"q{q}: " for q in range(self.n_qubits)]

        for col in columns:
            col_width = max(len(self._gate_symbol(g)) for g in col.values()) + 2

            for q in range(self.n_qubits):
                if q in col:
                    gate = col[q]
                    symbol = self._gate_symbol(gate)

                    if gate.gate_type == GateType.CONTROLLED and len(gate.qubits) > 1:
                        if q == gate.qubits[0]:  # Control
                            symbol = "*"
                        else:  # Target
                            symbol = self._gate_symbol(gate)

                    padding = col_width - len(symbol)
                    left_pad = padding // 2
                    right_pad = padding - left_pad
                    wire_lines[q] += "-" * left_pad + symbol + "-" * right_pad
                else:
                    # Check if we need vertical line for multi-qubit gate
                    in_multi = False
                    for gq, gate in col.items():
                        if gate.gate_type in [GateType.CONTROLLED, GateType.MULTI]:
                            min_q = min(gate.qubits)
                            max_q = max(gate.qubits)
                            if min_q < q < max_q:
                                in_multi = True
                                break

                    if in_multi:
                        wire_lines[q] += "-" * (col_width // 2) + "|" + "-" * (col_width - col_width // 2 - 1)
                    else:
                        wire_lines[q] += "-" * col_width

        # Add final dashes
        for q in range(self.n_qubits):
            wire_lines[q] += "---"

        return "\n".join(wire_lines)

    def _layout_gates(self) -> List[Dict[int, Gate]]:
        """Layout gates into columns."""
        columns = []
        qubit_positions = [0] * self.n_qubits

        for gate in self.gates:
            if gate.gate_type == GateType.BARRIER:
                continue

            # Find earliest column where all qubits are free
            min_col = max(qubit_positions[q] for q in gate.qubits)

            # Ensure column exists
            while len(columns) <= min_col:
                columns.append({})

            # Place gate
            for q in gate.qubits:
                columns[min_col][q] = gate
                qubit_positions[q] = min_col + 1

        return columns

    def _gate_symbol(self, gate: Gate) -> str:
        """Get ASCII symbol for gate."""
        symbols = {
            'H': '[H]',
            'X': '[X]',
            'Y': '[Y]',
            'Z': '[Z]',
            'S': '[S]',
            'T': '[T]',
            'CX': '[+]',
            'CZ': '[Z]',
            'SWAP': '[X]',
            'CCX': '[+]',
            'M': '[M]',
        }

        if gate.name in symbols:
            return symbols[gate.name]

        if gate.name.startswith('R'):
            if gate.params:
                angle = gate.params[0]
                if abs(angle - 3.14159) < 0.01:
                    return f'[{gate.name}(pi)]'
                elif abs(angle - 1.5708) < 0.01:
                    return f'[{gate.name}(pi/2)]'
                else:
                    return f'[{gate.name}({angle:.2f})]'
            return f'[{gate.name}]'

        return f'[{gate.name}]'

    def _draw_latex(self) -> str:
        """Generate LaTeX/Qcircuit representation."""
        lines = [
            "\\begin{quantikz}",
        ]

        for q in range(self.n_qubits):
            line = f"\\lstick{{$q_{q}$}} & "

            for gate in self.gates:
                if q in gate.qubits:
                    if gate.gate_type == GateType.SINGLE:
                        line += f"\\gate{{{gate.name}}} & "
                    elif gate.gate_type == GateType.CONTROLLED:
                        if q == gate.qubits[0]:
                            line += "\\ctrl{" + str(gate.qubits[1] - q) + "} & "
                        else:
                            line += f"\\targ{{}} & "
                    elif gate.gate_type == GateType.MEASUREMENT:
                        line += "\\meter{} & "
                    else:
                        line += f"\\gate{{{gate.name}}} & "
                else:
                    line += "\\qw & "

            line += "\\qw \\\\"
            lines.append(line)

        lines.append("\\end{quantikz}")

        return "\n".join(lines)

    def __str__(self) -> str:
        return self.draw()

    def __repr__(self) -> str:
        return f"QuantumCircuit({self.n_qubits}, gates={len(self.gates)})"


def create_bell_state() -> QuantumCircuit:
    """Create Bell state circuit."""
    qc = QuantumCircuit(2, "Bell State")
    qc.h(0)
    qc.cx(0, 1)
    return qc


def create_ghz_state(n_qubits: int) -> QuantumCircuit:
    """Create GHZ state circuit."""
    qc = QuantumCircuit(n_qubits, f"GHZ-{n_qubits}")
    qc.h(0)
    for i in range(n_qubits - 1):
        qc.cx(i, i + 1)
    return qc


def create_qft(n_qubits: int) -> QuantumCircuit:
    """Create Quantum Fourier Transform circuit."""
    qc = QuantumCircuit(n_qubits, f"QFT-{n_qubits}")

    import numpy as np

    for i in range(n_qubits):
        qc.h(i)
        for j in range(i + 1, n_qubits):
            angle = np.pi / (2 ** (j - i))
            qc.crz(j, i, angle)

    # Swap qubits
    for i in range(n_qubits // 2):
        qc.swap(i, n_qubits - 1 - i)

    return qc


def create_variational_ansatz(n_qubits: int, depth: int) -> QuantumCircuit:
    """Create variational ansatz circuit."""
    qc = QuantumCircuit(n_qubits, f"Ansatz-{n_qubits}x{depth}")

    import numpy as np

    for layer in range(depth):
        # Rotation layer
        for q in range(n_qubits):
            qc.ry(q, np.random.uniform(0, 2*np.pi))
            qc.rz(q, np.random.uniform(0, 2*np.pi))

        # Entangling layer
        for q in range(n_qubits - 1):
            qc.cx(q, q + 1)

        if layer < depth - 1:
            qc.barrier()

    return qc


def demo_circuit_visualization():
    """Demonstrate circuit visualization."""
    print("=" * 60)
    print("QUANTUM CIRCUIT VISUALIZATION")
    print("=" * 60)

    # Bell state
    print("\n1. Bell State Circuit")
    bell = create_bell_state()
    print(bell.draw())
    print(f"   Depth: {bell.depth()}")
    print(f"   Gates: {bell.gate_count()}")

    # GHZ state
    print("\n2. GHZ State Circuit (4 qubits)")
    ghz = create_ghz_state(4)
    print(ghz.draw())
    print(f"   Depth: {ghz.depth()}")

    # QFT
    print("\n3. Quantum Fourier Transform (3 qubits)")
    qft = create_qft(3)
    print(qft.draw())
    print(f"   Depth: {qft.depth()}")
    print(f"   Gates: {qft.gate_count()}")

    # Custom circuit
    print("\n4. Custom Circuit")
    qc = QuantumCircuit(3)
    qc.h(0).h(1).h(2)
    qc.cx(0, 1).cx(1, 2)
    qc.rz(0, 1.57).rz(1, 0.78)
    qc.measure_all()
    print(qc.draw())

    # Variational ansatz
    print("\n5. Variational Ansatz (3 qubits, depth 2)")
    ansatz = create_variational_ansatz(3, 2)
    print(ansatz.draw())
    print(f"   Depth: {ansatz.depth()}")


if __name__ == "__main__":
    demo_circuit_visualization()
