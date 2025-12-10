"""
Physics Validation Layer
Ensures all computations respect fundamental physics laws.
"""
import numpy as np
from typing import Any, Dict, List, Tuple, Optional, Callable
from dataclasses import dataclass
from enum import Enum, auto


class PhysicsLaw(Enum):
    """Fundamental physics laws for validation."""
    ENERGY_CONSERVATION = auto()
    MOMENTUM_CONSERVATION = auto()
    ANGULAR_MOMENTUM = auto()
    CHARGE_CONSERVATION = auto()
    MASS_CONSERVATION = auto()
    THERMODYNAMICS_FIRST = auto()
    THERMODYNAMICS_SECOND = auto()
    UNITARITY = auto()
    HERMITICITY = auto()
    CAUSALITY = auto()
    LORENTZ_INVARIANCE = auto()


@dataclass
class ValidationResult:
    """Result of physics validation."""
    valid: bool
    violations: List[str]
    warnings: List[str]
    confidence: float
    details: Dict[str, Any]


class PhysicsValidator:
    """
    Validates computations against fundamental physics laws.

    Ensures quantum circuits preserve unitarity, energy is conserved,
    and thermodynamic constraints are satisfied.
    """

    def __init__(self, tolerance: float = 1e-10):
        self.tolerance = tolerance
        self.validators = self._build_validators()

    def validate(
        self,
        data: Any,
        laws: List[PhysicsLaw] = None
    ) -> ValidationResult:
        """
        Validate data against specified physics laws.

        Args:
            data: Data to validate (state, operator, measurements, etc.)
            laws: List of laws to check (default: all applicable)

        Returns:
            ValidationResult with status and details
        """
        if laws is None:
            laws = list(PhysicsLaw)

        violations = []
        warnings = []
        details = {}

        for law in laws:
            if law in self.validators:
                result = self.validators[law](data)
                details[law.name] = result

                if not result.get("valid", True):
                    if result.get("severity", "error") == "error":
                        violations.append(f"{law.name}: {result.get('message', 'Failed')}")
                    else:
                        warnings.append(f"{law.name}: {result.get('message', 'Warning')}")

        valid = len(violations) == 0
        confidence = 1.0 - len(violations) * 0.2 - len(warnings) * 0.05

        return ValidationResult(
            valid=valid,
            violations=violations,
            warnings=warnings,
            confidence=max(0, confidence),
            details=details
        )

    def validate_quantum_state(self, state: np.ndarray) -> ValidationResult:
        """Validate a quantum state vector."""
        return self.validate({"type": "quantum_state", "state": state},
                           [PhysicsLaw.UNITARITY])

    def validate_hamiltonian(self, H: np.ndarray) -> ValidationResult:
        """Validate a Hamiltonian matrix."""
        return self.validate({"type": "hamiltonian", "matrix": H},
                           [PhysicsLaw.HERMITICITY])

    def validate_unitary(self, U: np.ndarray) -> ValidationResult:
        """Validate a unitary matrix."""
        return self.validate({"type": "unitary", "matrix": U},
                           [PhysicsLaw.UNITARITY])

    def validate_thermodynamics(
        self,
        initial_state: Dict[str, float],
        final_state: Dict[str, float],
        work: float = 0,
        heat: float = 0
    ) -> ValidationResult:
        """Validate thermodynamic process."""
        data = {
            "type": "thermodynamic",
            "initial": initial_state,
            "final": final_state,
            "work": work,
            "heat": heat
        }
        return self.validate(data, [PhysicsLaw.THERMODYNAMICS_FIRST,
                                    PhysicsLaw.THERMODYNAMICS_SECOND])

    def _build_validators(self) -> Dict[PhysicsLaw, Callable]:
        """Build validator functions for each physics law."""
        return {
            PhysicsLaw.UNITARITY: self._check_unitarity,
            PhysicsLaw.HERMITICITY: self._check_hermiticity,
            PhysicsLaw.ENERGY_CONSERVATION: self._check_energy_conservation,
            PhysicsLaw.THERMODYNAMICS_FIRST: self._check_first_law,
            PhysicsLaw.THERMODYNAMICS_SECOND: self._check_second_law,
            PhysicsLaw.CAUSALITY: self._check_causality,
        }

    def _check_unitarity(self, data: Any) -> Dict[str, Any]:
        """Check unitarity of quantum operations."""
        if isinstance(data, dict):
            if data.get("type") == "quantum_state":
                state = data.get("state")
                if state is not None:
                    norm = np.linalg.norm(state)
                    valid = np.isclose(norm, 1.0, atol=self.tolerance)
                    return {
                        "valid": valid,
                        "norm": norm,
                        "message": f"State norm = {norm:.10f}" if not valid else "Normalized"
                    }

            elif data.get("type") == "unitary":
                U = data.get("matrix")
                if U is not None:
                    product = U @ U.conj().T
                    identity = np.eye(U.shape[0])
                    valid = np.allclose(product, identity, atol=self.tolerance)
                    error = np.max(np.abs(product - identity))
                    return {
                        "valid": valid,
                        "max_error": error,
                        "message": f"Max deviation from identity: {error:.2e}" if not valid else "Unitary"
                    }

        return {"valid": True, "message": "Not applicable"}

    def _check_hermiticity(self, data: Any) -> Dict[str, Any]:
        """Check Hermiticity of operators."""
        if isinstance(data, dict) and data.get("type") == "hamiltonian":
            H = data.get("matrix")
            if H is not None:
                valid = np.allclose(H, H.conj().T, atol=self.tolerance)
                error = np.max(np.abs(H - H.conj().T))
                return {
                    "valid": valid,
                    "max_error": error,
                    "message": f"Max asymmetry: {error:.2e}" if not valid else "Hermitian"
                }

        return {"valid": True, "message": "Not applicable"}

    def _check_energy_conservation(self, data: Any) -> Dict[str, Any]:
        """Check energy conservation."""
        if isinstance(data, dict) and "initial_energy" in data and "final_energy" in data:
            E_i = data["initial_energy"]
            E_f = data["final_energy"]
            work = data.get("work_done", 0)
            heat = data.get("heat_added", 0)

            delta_E = E_f - E_i
            expected = work + heat
            valid = np.isclose(delta_E, expected, atol=self.tolerance)

            return {
                "valid": valid,
                "delta_E": delta_E,
                "expected": expected,
                "message": f"Energy imbalance: {delta_E - expected:.2e}" if not valid else "Conserved"
            }

        return {"valid": True, "message": "Not applicable"}

    def _check_first_law(self, data: Any) -> Dict[str, Any]:
        """Check first law of thermodynamics: dU = Q - W."""
        if isinstance(data, dict) and data.get("type") == "thermodynamic":
            initial = data.get("initial", {})
            final = data.get("final", {})
            Q = data.get("heat", 0)
            W = data.get("work", 0)

            U_i = initial.get("internal_energy", 0)
            U_f = final.get("internal_energy", 0)

            dU = U_f - U_i
            expected = Q - W
            valid = np.isclose(dU, expected, atol=self.tolerance)

            return {
                "valid": valid,
                "dU": dU,
                "Q_minus_W": expected,
                "message": f"First law violation: {dU - expected:.2e}" if not valid else "Satisfied"
            }

        return {"valid": True, "message": "Not applicable"}

    def _check_second_law(self, data: Any) -> Dict[str, Any]:
        """Check second law: entropy of isolated system never decreases."""
        if isinstance(data, dict) and data.get("type") == "thermodynamic":
            initial = data.get("initial", {})
            final = data.get("final", {})

            S_i = initial.get("entropy", 0)
            S_f = final.get("entropy", 0)

            # For isolated system, entropy must not decrease
            is_isolated = data.get("isolated", False)

            if is_isolated:
                valid = S_f >= S_i - self.tolerance
                return {
                    "valid": valid,
                    "delta_S": S_f - S_i,
                    "message": f"Entropy decreased by {S_i - S_f:.2e}" if not valid else "Satisfied"
                }

        return {"valid": True, "message": "Not applicable"}

    def _check_causality(self, data: Any) -> Dict[str, Any]:
        """Check causality constraints."""
        if isinstance(data, dict) and "velocity" in data:
            v = data["velocity"]
            c = 299792458  # Speed of light

            valid = abs(v) <= c
            return {
                "valid": valid,
                "velocity": v,
                "message": f"Superluminal velocity: {v/c:.2f}c" if not valid else "Subluminal"
            }

        return {"valid": True, "message": "Not applicable"}


# Convenience functions
def validate_state(state: np.ndarray) -> bool:
    """Quick check if quantum state is valid."""
    return PhysicsValidator().validate_quantum_state(state).valid


def validate_unitary(U: np.ndarray) -> bool:
    """Quick check if matrix is unitary."""
    return PhysicsValidator().validate_unitary(U).valid


def validate_hermitian(H: np.ndarray) -> bool:
    """Quick check if matrix is Hermitian."""
    return PhysicsValidator().validate_hamiltonian(H).valid
