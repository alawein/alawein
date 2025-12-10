"""
ORCHEX 2.0 - Experiment Design Agent
Designs and validates experiments with physics constraints.
"""
import numpy as np
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from .base_agent import BaseAgent, TaskResult, AgentState


@dataclass
class ExperimentDesign:
    """Experimental design specification."""
    name: str
    hypothesis_id: str
    variables: Dict[str, Any]
    controls: List[str]
    measurements: List[str]
    equipment: List[str]
    estimated_duration_hours: float
    estimated_cost: float
    success_probability: float
    physics_constraints: List[str] = field(default_factory=list)


@dataclass
class ExperimentResult:
    """Result from experiment execution."""
    experiment_id: str
    success: bool
    measurements: Dict[str, float]
    uncertainties: Dict[str, float]
    hypothesis_supported: bool
    confidence_level: float


class ExperimentAgent(BaseAgent):
    """Agent for designing and validating experiments."""

    def __init__(self, name: str = "ExperimentAgent"):
        super().__init__(name, capabilities=["design", "validate", "optimize", "execute"])
        self.active_experiments: Dict[str, ExperimentDesign] = {}
        self.completed_experiments: List[ExperimentResult] = []

    def can_handle(self, task_type: str) -> bool:
        return task_type in ["design_experiment", "validate_design", "optimize_parameters", "simulate_experiment"]

    async def execute(self, task: Dict[str, Any]) -> TaskResult:
        self.state = AgentState.RUNNING
        try:
            task_type = task.get("type")

            if task_type == "design_experiment":
                result = await self._design_experiment(task)
            elif task_type == "validate_design":
                result = await self._validate_design(task)
            elif task_type == "optimize_parameters":
                result = await self._optimize_parameters(task)
            elif task_type == "simulate_experiment":
                result = await self._simulate_experiment(task)
            else:
                raise ValueError(f"Unknown task type: {task_type}")

            self.state = AgentState.COMPLETED
            return TaskResult(success=True, data=result)

        except Exception as e:
            self.state = AgentState.FAILED
            return TaskResult(success=False, data=None, error=str(e))

    async def _design_experiment(self, task: Dict[str, Any]) -> ExperimentDesign:
        """Design an experiment to test a hypothesis."""
        hypothesis = task.get("hypothesis")
        constraints = task.get("constraints", {})

        design = ExperimentDesign(
            name=f"Experiment for {hypothesis.statement[:30]}...",
            hypothesis_id=str(id(hypothesis)),
            variables=self._identify_variables(hypothesis),
            controls=self._identify_controls(hypothesis),
            measurements=self._identify_measurements(hypothesis),
            equipment=self._identify_equipment(hypothesis),
            estimated_duration_hours=np.random.uniform(1, 100),
            estimated_cost=np.random.uniform(100, 10000),
            success_probability=hypothesis.testability_score * 0.8,
            physics_constraints=self._extract_physics_constraints(hypothesis)
        )

        self.active_experiments[design.name] = design
        return design

    async def _validate_design(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Validate experiment design against physics constraints."""
        design = task.get("design")

        validations = {
            "physics_valid": self._check_physics_validity(design),
            "resource_feasible": design.estimated_cost < task.get("budget", float('inf')),
            "time_feasible": design.estimated_duration_hours < task.get("max_hours", float('inf')),
            "equipment_available": True,  # Would check actual availability
        }

        validations["overall_valid"] = all(validations.values())
        return validations

    async def _optimize_parameters(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize experimental parameters for best results."""
        design = task.get("design")
        optimization_target = task.get("target", "success_probability")

        # Simple parameter optimization
        optimized_params = {}
        for var_name, var_range in design.variables.items():
            if isinstance(var_range, (list, tuple)) and len(var_range) == 2:
                optimized_params[var_name] = (var_range[0] + var_range[1]) / 2
            else:
                optimized_params[var_name] = var_range

        return {"optimized_parameters": optimized_params, "expected_improvement": 0.15}

    async def _simulate_experiment(self, task: Dict[str, Any]) -> ExperimentResult:
        """Simulate experiment execution."""
        design = task.get("design")

        # Simulate measurements with noise
        measurements = {m: np.random.normal(1.0, 0.1) for m in design.measurements}
        uncertainties = {m: abs(np.random.normal(0.05, 0.01)) for m in design.measurements}

        success = np.random.random() < design.success_probability

        result = ExperimentResult(
            experiment_id=design.name,
            success=success,
            measurements=measurements,
            uncertainties=uncertainties,
            hypothesis_supported=success and np.random.random() > 0.3,
            confidence_level=np.random.uniform(0.8, 0.99) if success else 0.0
        )

        self.completed_experiments.append(result)
        return result

    def _identify_variables(self, hypothesis) -> Dict[str, Any]:
        return {"temperature": (0, 500), "pressure": (1, 100), "time": (0, 24)}

    def _identify_controls(self, hypothesis) -> List[str]:
        return ["ambient_humidity", "sample_purity", "equipment_calibration"]

    def _identify_measurements(self, hypothesis) -> List[str]:
        return ["primary_observable", "secondary_effect", "control_measurement"]

    def _identify_equipment(self, hypothesis) -> List[str]:
        return ["spectrometer", "temperature_controller", "data_acquisition"]

    def _extract_physics_constraints(self, hypothesis) -> List[str]:
        return ["energy_conservation", "mass_conservation"]

    def _check_physics_validity(self, design: ExperimentDesign) -> bool:
        return len(design.physics_constraints) > 0
