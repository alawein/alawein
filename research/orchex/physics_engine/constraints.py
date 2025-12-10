"""
ORCHEX Physics Engine - Constraint System
Enforces physical laws in autonomous research.
"""
import numpy as np
from typing import Any, Dict, List, Optional, Callable, Tuple
from dataclasses import dataclass
from enum import Enum, auto


class ConstraintType(Enum):
    """Types of physics constraints."""
    CONSERVATION = auto()
    SYMMETRY = auto()
    BOUNDARY = auto()
    THERMODYNAMIC = auto()
    QUANTUM = auto()
    RELATIVISTIC = auto()


@dataclass
class Constraint:
    """A physics constraint."""
    name: str
    constraint_type: ConstraintType
    check_function: Callable[[Dict[str, Any]], bool]
    error_function: Callable[[Dict[str, Any]], float]
    description: str
    tolerance: float = 1e-10


@dataclass
class ConstraintViolation:
    """Record of a constraint violation."""
    constraint_name: str
    violation_magnitude: float
    context: Dict[str, Any]
    suggestion: str


class PhysicsConstraintEngine:
    """
    Engine for enforcing physics constraints in research workflows.

    Ensures all hypotheses, experiments, and results respect
    fundamental physical laws.
    """

    def __init__(self):
        self.constraints: Dict[str, Constraint] = {}
        self._register_fundamental_constraints()

    def _register_fundamental_constraints(self):
        """Register fundamental physics constraints."""

        # Energy conservation
        self.register_constraint(Constraint(
            name="energy_conservation",
            constraint_type=ConstraintType.CONSERVATION,
            check_function=self._check_energy_conservation,
            error_function=self._energy_error,
            description="Total energy must be conserved in isolated systems",
            tolerance=1e-10
        ))

        # Momentum conservation
        self.register_constraint(Constraint(
            name="momentum_conservation",
            constraint_type=ConstraintType.CONSERVATION,
            check_function=self._check_momentum_conservation,
            error_function=self._momentum_error,
            description="Total momentum must be conserved in isolated systems"
        ))

        # Second law of thermodynamics
        self.register_constraint(Constraint(
            name="entropy_increase",
            constraint_type=ConstraintType.THERMODYNAMIC,
            check_function=self._check_entropy_increase,
            error_function=self._entropy_error,
            description="Entropy of isolated system cannot decrease"
        ))

        # Positive temperature
        self.register_constraint(Constraint(
            name="positive_temperature",
            constraint_type=ConstraintType.THERMODYNAMIC,
            check_function=self._check_positive_temperature,
            error_function=lambda d: abs(min(0, d.get('temperature', 1))),
            description="Absolute temperature must be positive"
        ))

        # Causality
        self.register_constraint(Constraint(
            name="causality",
            constraint_type=ConstraintType.RELATIVISTIC,
            check_function=self._check_causality,
            error_function=self._causality_error,
            description="Information cannot travel faster than light"
        ))

        # Unitarity (quantum)
        self.register_constraint(Constraint(
            name="unitarity",
            constraint_type=ConstraintType.QUANTUM,
            check_function=self._check_unitarity,
            error_function=self._unitarity_error,
            description="Quantum evolution must be unitary"
        ))

        # Normalization (quantum)
        self.register_constraint(Constraint(
            name="normalization",
            constraint_type=ConstraintType.QUANTUM,
            check_function=self._check_normalization,
            error_function=self._normalization_error,
            description="Quantum state must be normalized"
        ))

        # Heisenberg uncertainty
        self.register_constraint(Constraint(
            name="heisenberg_uncertainty",
            constraint_type=ConstraintType.QUANTUM,
            check_function=self._check_heisenberg,
            error_function=self._heisenberg_error,
            description="ΔxΔp ≥ ℏ/2"
        ))

    def register_constraint(self, constraint: Constraint):
        """Register a new constraint."""
        self.constraints[constraint.name] = constraint

    def check_all(self, data: Dict[str, Any]) -> Tuple[bool, List[ConstraintViolation]]:
        """Check all registered constraints."""
        violations = []

        for name, constraint in self.constraints.items():
            try:
                if not constraint.check_function(data):
                    error = constraint.error_function(data)
                    violations.append(ConstraintViolation(
                        constraint_name=name,
                        violation_magnitude=error,
                        context=data,
                        suggestion=self._get_suggestion(name, data)
                    ))
            except Exception:
                pass  # Constraint not applicable to this data

        return len(violations) == 0, violations

    def check_specific(
        self,
        data: Dict[str, Any],
        constraint_names: List[str]
    ) -> Tuple[bool, List[ConstraintViolation]]:
        """Check specific constraints."""
        violations = []

        for name in constraint_names:
            if name in self.constraints:
                constraint = self.constraints[name]
                if not constraint.check_function(data):
                    error = constraint.error_function(data)
                    violations.append(ConstraintViolation(
                        constraint_name=name,
                        violation_magnitude=error,
                        context=data,
                        suggestion=self._get_suggestion(name, data)
                    ))

        return len(violations) == 0, violations

    def validate_hypothesis(self, hypothesis: str) -> Tuple[bool, List[str]]:
        """Validate a hypothesis statement against physics laws."""
        violations = []

        # Check for common physics violations in text
        violation_patterns = {
            "perpetual motion": "Violates thermodynamics - no perpetual motion machines",
            "100% efficiency": "Violates Carnot limit - heat engines cannot be 100% efficient",
            "faster than light": "Violates special relativity - nothing travels faster than c",
            "negative temperature": "Temperature must be positive (in standard thermodynamics)",
            "create energy": "Violates energy conservation",
            "destroy energy": "Violates energy conservation",
            "infinite energy": "Violates energy conservation",
        }

        hypothesis_lower = hypothesis.lower()
        for pattern, message in violation_patterns.items():
            if pattern in hypothesis_lower:
                violations.append(message)

        return len(violations) == 0, violations

    def project_to_valid(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Project data to satisfy constraints (when possible)."""
        projected = data.copy()

        # Normalize quantum states
        if 'quantum_state' in projected:
            state = np.array(projected['quantum_state'])
            norm = np.linalg.norm(state)
            if norm > 0:
                projected['quantum_state'] = state / norm

        # Ensure positive temperature
        if 'temperature' in projected:
            projected['temperature'] = max(1e-10, projected['temperature'])

        # Ensure positive probabilities
        if 'probabilities' in projected:
            probs = np.array(projected['probabilities'])
            probs = np.maximum(probs, 0)
            if probs.sum() > 0:
                projected['probabilities'] = probs / probs.sum()

        return projected

    # Constraint check functions
    def _check_energy_conservation(self, data: Dict[str, Any]) -> bool:
        if 'initial_energy' in data and 'final_energy' in data:
            work = data.get('work_done', 0)
            heat = data.get('heat_added', 0)
            delta_E = data['final_energy'] - data['initial_energy']
            return np.isclose(delta_E, work + heat, atol=1e-10)
        return True

    def _check_momentum_conservation(self, data: Dict[str, Any]) -> bool:
        if 'initial_momentum' in data and 'final_momentum' in data:
            p_i = np.array(data['initial_momentum'])
            p_f = np.array(data['final_momentum'])
            external_force = data.get('external_impulse', np.zeros_like(p_i))
            return np.allclose(p_f, p_i + external_force, atol=1e-10)
        return True

    def _check_entropy_increase(self, data: Dict[str, Any]) -> bool:
        if 'initial_entropy' in data and 'final_entropy' in data:
            if data.get('isolated', False):
                return data['final_entropy'] >= data['initial_entropy'] - 1e-10
        return True

    def _check_positive_temperature(self, data: Dict[str, Any]) -> bool:
        if 'temperature' in data:
            return data['temperature'] > 0
        return True

    def _check_causality(self, data: Dict[str, Any]) -> bool:
        if 'velocity' in data:
            c = 299792458  # m/s
            v = np.linalg.norm(data['velocity']) if hasattr(data['velocity'], '__len__') else abs(data['velocity'])
            return v <= c
        return True

    def _check_unitarity(self, data: Dict[str, Any]) -> bool:
        if 'unitary_matrix' in data:
            U = np.array(data['unitary_matrix'])
            product = U @ U.conj().T
            return np.allclose(product, np.eye(U.shape[0]), atol=1e-10)
        return True

    def _check_normalization(self, data: Dict[str, Any]) -> bool:
        if 'quantum_state' in data:
            state = np.array(data['quantum_state'])
            return np.isclose(np.linalg.norm(state), 1.0, atol=1e-10)
        return True

    def _check_heisenberg(self, data: Dict[str, Any]) -> bool:
        if 'delta_x' in data and 'delta_p' in data:
            hbar = 1.054571817e-34
            return data['delta_x'] * data['delta_p'] >= hbar / 2 - 1e-40
        return True

    # Error functions
    def _energy_error(self, data: Dict[str, Any]) -> float:
        if 'initial_energy' in data and 'final_energy' in data:
            work = data.get('work_done', 0)
            heat = data.get('heat_added', 0)
            delta_E = data['final_energy'] - data['initial_energy']
            return abs(delta_E - work - heat)
        return 0

    def _momentum_error(self, data: Dict[str, Any]) -> float:
        if 'initial_momentum' in data and 'final_momentum' in data:
            p_i = np.array(data['initial_momentum'])
            p_f = np.array(data['final_momentum'])
            return np.linalg.norm(p_f - p_i)
        return 0

    def _entropy_error(self, data: Dict[str, Any]) -> float:
        if 'initial_entropy' in data and 'final_entropy' in data:
            return max(0, data['initial_entropy'] - data['final_entropy'])
        return 0

    def _causality_error(self, data: Dict[str, Any]) -> float:
        if 'velocity' in data:
            c = 299792458
            v = np.linalg.norm(data['velocity']) if hasattr(data['velocity'], '__len__') else abs(data['velocity'])
            return max(0, v - c)
        return 0

    def _unitarity_error(self, data: Dict[str, Any]) -> float:
        if 'unitary_matrix' in data:
            U = np.array(data['unitary_matrix'])
            product = U @ U.conj().T
            return np.max(np.abs(product - np.eye(U.shape[0])))
        return 0

    def _normalization_error(self, data: Dict[str, Any]) -> float:
        if 'quantum_state' in data:
            state = np.array(data['quantum_state'])
            return abs(np.linalg.norm(state) - 1.0)
        return 0

    def _heisenberg_error(self, data: Dict[str, Any]) -> float:
        if 'delta_x' in data and 'delta_p' in data:
            hbar = 1.054571817e-34
            product = data['delta_x'] * data['delta_p']
            return max(0, hbar / 2 - product)
        return 0

    def _get_suggestion(self, constraint_name: str, data: Dict[str, Any]) -> str:
        """Get suggestion for fixing constraint violation."""
        suggestions = {
            "energy_conservation": "Check for missing work or heat terms",
            "momentum_conservation": "Check for external forces or impulses",
            "entropy_increase": "Process may not be thermodynamically allowed",
            "positive_temperature": "Temperature must be > 0 K",
            "causality": "Reduce velocity below speed of light",
            "unitarity": "Ensure quantum operation is unitary",
            "normalization": "Normalize the quantum state",
            "heisenberg_uncertainty": "Cannot measure position and momentum simultaneously with arbitrary precision"
        }
        return suggestions.get(constraint_name, "Review physical assumptions")
