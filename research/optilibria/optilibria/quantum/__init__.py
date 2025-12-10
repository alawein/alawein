"""
Optilibria Quantum Module
Comprehensive quantum computing algorithms and tools.
"""

# Core algorithms
from .qaoa import QAOAOptimizer
from .vqe import VQEOptimizer, create_h2_hamiltonian
from .grover import GroverSearch, create_search_oracle
from .qpe import QuantumPhaseEstimation, estimate_eigenvalue

# Simulation
from .simulator import QuantumSimulator
from .gates import QuantumGates

# Variational methods
from .variational import VariationalQuantumClassifier, QSVM

# Backends
from .backends import BackendManager

# Error mitigation
from .error_mitigation import (
    ZeroNoiseExtrapolation,
    ReadoutErrorMitigation,
    QuantumErrorMitigation,
)

# Tensor networks
from .tensor_networks import (
    MatrixProductState,
    TensorNetworkSimulator,
    DMRG,
    create_heisenberg_hamiltonian
)

# Quantum ML
from .quantum_ml import (
    QuantumNeuralNetwork,
    QuantumKernel,
    QuantumBoltzmannMachine
)

# Noise models
from .noise_models import (
    NoiseModel,
    NoiseParameters,
    NoisyQuantumSimulator,
    DepolarizingChannel,
    AmplitudeDampingChannel,
    PhaseDampingChannel,
    ReadoutError
)

# Advanced optimizers
from .advanced_optimizers import (
    ADAPTVQE,
    QITE,
    QuantumNaturalGradient,
    ROTOSOLVE,
    SPSA
)

# Circuit visualization
from .circuit_visualization import (
    QuantumCircuit,
    Gate,
    create_bell_state,
    create_ghz_state,
    create_qft,
    create_variational_ansatz
)

__all__ = [
    # Core
    "QAOAOptimizer",
    "VQEOptimizer",
    "create_h2_hamiltonian",
    "GroverSearch",
    "create_search_oracle",
    "QuantumPhaseEstimation",
    "estimate_eigenvalue",
    # Simulation
    "QuantumSimulator",
    "QuantumGates",
    # Variational
    "VariationalQuantumClassifier",
    "QSVM",
    # Backends
    "BackendManager",
    "BackendType",
    "get_best_backend",
    # Error mitigation
    "ZeroNoiseExtrapolation",
    "ReadoutErrorMitigation",
    "QuantumErrorMitigation",
    # Tensor networks
    "MatrixProductState",
    "TensorNetworkSimulator",
    "DMRG",
    "create_heisenberg_hamiltonian",
    # Quantum ML
    "QuantumNeuralNetwork",
    "QuantumKernel",
    "QuantumBoltzmannMachine",
    # Noise
    "NoiseModel",
    "NoiseParameters",
    "NoisyQuantumSimulator",
    "DepolarizingChannel",
    "AmplitudeDampingChannel",
    "PhaseDampingChannel",
    "ReadoutError",
    # Advanced optimizers
    "ADAPTVQE",
    "QITE",
    "QuantumNaturalGradient",
    "ROTOSOLVE",
    "SPSA",
    # Circuits
    "QuantumCircuit",
    "Gate",
    "create_bell_state",
    "create_ghz_state",
    "create_qft",
    "create_variational_ansatz",
]
