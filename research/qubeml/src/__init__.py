"""
QubeML: Quantum Machine Learning Platform

Quantum-enhanced machine learning for materials discovery with physics-informed
neural networks and quantum advantage where it matters most.
"""

__version__ = "2.0.0"
__author__ = "Meshal Alawein"
__email__ = "meshal@berkeley.edu"

# Core quantum ML components
from .quantum import (
    QuantumNeuralNetwork,
    QuantumLayer,
    VariationalQuantumCircuit,
    QuantumFeatureMap,
)

# Materials informatics
from .materials import (
    CrystalGraphNet,
    BandStructurePredictor,
    MaterialsDatabase,
    SuperconductorPredictor,
)

# Physics-informed components
from .physics import (
    ConservationLayer,
    SymmetryLayer,
    PhysicsConstraints,
    CrystalSymmetry,
)

# Applications
from .applications import (
    SuperconductorDiscovery,
    QuantumMaterialsDesign,
    MaterialsOptimization,
)

# Utilities
from .utils import (
    load_materials_dataset,
    quantum_advantage_analysis,
    physics_validation,
)

__all__ = [
    # Core
    "QuantumNeuralNetwork",
    "QuantumLayer",
    "VariationalQuantumCircuit",
    # Materials
    "CrystalGraphNet",
    "BandStructurePredictor",
    "SuperconductorPredictor",
    # Physics
    "ConservationLayer",
    "SymmetryLayer",
    "PhysicsConstraints",
    # Applications
    "SuperconductorDiscovery",
    "QuantumMaterialsDesign",
    # Utils
    "load_materials_dataset",
    "quantum_advantage_analysis",
]