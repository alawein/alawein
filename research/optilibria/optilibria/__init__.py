"""
 ██████╗ ██████╗ ████████╗██╗██╗     ██╗██████╗ ██████╗ ██╗ █████╗
██╔═══██╗██╔══██╗╚══██╔══╝██║██║     ██║██╔══██╗██╔══██╗██║██╔══██╗
██║   ██║██████╔╝   ██║   ██║██║     ██║██████╔╝██████╔╝██║███████║
██║   ██║██╔═══╝    ██║   ██║██║     ██║██╔══██╗██╔══██╗██║██╔══██║
╚██████╔╝██║        ██║   ██║███████╗██║██████╔╝██║  ██║██║██║  ██║
 ╚═════╝ ╚═╝        ╚═╝   ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝

Optilibria: Quantum-Enhanced Optimization Framework
A universal optimization platform combining classical algorithms with quantum computing.
"""

__version__ = "2.0.0"
__author__ = "Meshal Alawein"
__email__ = "meshal@berkeley.edu"

# Core - only import what exists
from .core.hybrid import HybridOptimizer, OptimizationResult

# Quantum algorithms
from .quantum.qaoa import QAOAOptimizer
from .quantum.vqe import VQEOptimizer, create_h2_hamiltonian
from .quantum.simulator import QuantumSimulator
from .quantum.gates import QuantumGates

# Additional quantum algorithms
from .quantum.grover import GroverSearch, QuantumPhaseEstimation as QPE_Grover, create_search_oracle
from .quantum.qpe import QuantumPhaseEstimation, estimate_eigenvalue
from .quantum.variational import VariationalQuantumClassifier, QSVM
from .quantum.backends import BackendManager, BackendType, get_best_backend

# Physics validation
from .physics.validation import PhysicsValidator, PhysicsLaw, validate_state, validate_unitary

# Error mitigation
from .quantum.error_mitigation import (
    ZeroNoiseExtrapolation,
    ProbabilisticErrorCancellation,
    ReadoutErrorMitigation,
    SymmetryVerification,
    CompositeMitigation,
    MitigationResult
)

# Distributed computing
from .distributed.cluster import (
    QuantumCluster,
    ComputeResource,
    DistributedTask,
    ResourceType,
    HybridWorkflow
)

# Applications
from .applications.chemistry import (
    Molecule,
    MolecularSimulator,
    create_h2,
    create_h2o,
    create_lih
)

from .applications.finance import (
    Asset,
    Portfolio,
    QuantumPortfolioOptimizer,
    QuantumRiskAnalyzer
)

__all__ = [
    # Core
    "HybridOptimizer",
    "OptimizationResult",
    # Quantum algorithms
    "QAOAOptimizer",
    "VQEOptimizer",
    "create_h2_hamiltonian",
    "GroverSearch",
    "QuantumPhaseEstimation",
    "estimate_eigenvalue",
    "create_search_oracle",
    # Quantum ML
    "VariationalQuantumClassifier",
    "QSVM",
    # Infrastructure
    "QuantumSimulator",
    "QuantumGates",
    "BackendManager",
    "BackendType",
    "get_best_backend",
    # Physics
    "PhysicsValidator",
    "PhysicsLaw",
    "validate_state",
    "validate_unitary",
    # Error mitigation
    "ZeroNoiseExtrapolation",
    "ProbabilisticErrorCancellation",
    "ReadoutErrorMitigation",
    "SymmetryVerification",
    "CompositeMitigation",
    "MitigationResult",
    # Distributed
    "QuantumCluster",
    "ComputeResource",
    "DistributedTask",
    "ResourceType",
    "HybridWorkflow",
    # Chemistry
    "Molecule",
    "MolecularSimulator",
    "create_h2",
    "create_h2o",
    "create_lih",
    # Finance
    "Asset",
    "Portfolio",
    "QuantumPortfolioOptimizer",
    "QuantumRiskAnalyzer",
]
