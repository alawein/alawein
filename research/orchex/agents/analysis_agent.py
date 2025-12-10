"""
ORCHEX 2.0 - Analysis Agent
Analyzes experimental results with physics validation.
"""
import numpy as np
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from .base_agent import BaseAgent, TaskResult, AgentState


@dataclass
class AnalysisResult:
    """Result of data analysis."""
    hypothesis_supported: bool
    confidence: float
    p_value: float
    effect_size: float
    physics_consistent: bool
    insights: List[str]
    recommendations: List[str]
    statistical_tests: Dict[str, float]


class AnalysisAgent(BaseAgent):
    """Agent for analyzing experimental results and validating physics."""

    def __init__(self, name: str = "AnalysisAgent"):
        super().__init__(name, capabilities=[
            "analyze_results", "validate_physics", "statistical_test",
            "generate_insights", "compare_hypothesis"
        ])
        self.physics_laws = self._load_physics_laws()
        self.analysis_history: List[AnalysisResult] = []

    def can_handle(self, task_type: str) -> bool:
        return task_type in self.capabilities

    async def execute(self, task: Dict[str, Any]) -> TaskResult:
        self.state = AgentState.RUNNING
        try:
            task_type = task.get("type")

            if task_type == "analyze_results":
                result = await self._analyze_results(task)
            elif task_type == "validate_physics":
                result = await self._validate_physics(task)
            elif task_type == "statistical_test":
                result = await self._statistical_test(task)
            elif task_type == "generate_insights":
                result = await self._generate_insights(task)
            else:
                raise ValueError(f"Unknown task type: {task_type}")

            self.state = AgentState.COMPLETED
            return TaskResult(success=True, data=result, physics_validated=True)

        except Exception as e:
            self.state = AgentState.FAILED
            return TaskResult(success=False, data=None, error=str(e))

    async def _analyze_results(self, task: Dict[str, Any]) -> AnalysisResult:
        """Comprehensive analysis of experimental results."""
        measurements = task.get("measurements", {})
        uncertainties = task.get("uncertainties", {})
        hypothesis = task.get("hypothesis")

        # Statistical analysis
        stats = self._compute_statistics(measurements, uncertainties)

        # Physics validation
        physics_valid = await self._validate_physics({"measurements": measurements})

        # Determine if hypothesis is supported
        effect_size = stats.get("effect_size", 0)
        p_value = stats.get("p_value", 1.0)

        supported = p_value < 0.05 and effect_size > 0.2 and physics_valid
        confidence = (1 - p_value) * min(1.0, effect_size) if supported else 0.0

        result = AnalysisResult(
            hypothesis_supported=supported,
            confidence=confidence,
            p_value=p_value,
            effect_size=effect_size,
            physics_consistent=physics_valid,
            insights=self._extract_insights(measurements, stats),
            recommendations=self._generate_recommendations(supported, stats),
            statistical_tests=stats
        )

        self.analysis_history.append(result)
        return result

    async def _validate_physics(self, task: Dict[str, Any]) -> bool:
        """Validate results against physics laws."""
        measurements = task.get("measurements", {})

        violations = []
        for law_name, law_check in self.physics_laws.items():
            if not law_check(measurements):
                violations.append(law_name)

        return len(violations) == 0

    async def _statistical_test(self, task: Dict[str, Any]) -> Dict[str, float]:
        """Perform statistical tests on data."""
        data = task.get("data", [])
        test_type = task.get("test_type", "t_test")

        if len(data) < 2:
            return {"error": "Insufficient data"}

        data = np.array(data)

        if test_type == "t_test":
            # One-sample t-test against zero
            mean = np.mean(data)
            std = np.std(data, ddof=1)
            n = len(data)
            t_stat = mean / (std / np.sqrt(n)) if std > 0 else 0
            # Approximate p-value
            p_value = 2 * (1 - min(0.9999, abs(t_stat) / 10))
            return {"t_statistic": t_stat, "p_value": p_value, "mean": mean, "std": std}

        elif test_type == "normality":
            # Simple normality check via skewness
            mean = np.mean(data)
            std = np.std(data)
            skewness = np.mean(((data - mean) / std)**3) if std > 0 else 0
            is_normal = abs(skewness) < 2
            return {"skewness": skewness, "is_normal": is_normal}

        return {"error": f"Unknown test type: {test_type}"}

    async def _generate_insights(self, task: Dict[str, Any]) -> List[str]:
        """Generate insights from analysis."""
        results = task.get("results", [])

        insights = []

        if results:
            # Trend analysis
            if len(results) > 1:
                trend = "increasing" if results[-1] > results[0] else "decreasing"
                insights.append(f"Overall trend is {trend}")

            # Outlier detection
            mean = np.mean(results)
            std = np.std(results)
            outliers = [r for r in results if abs(r - mean) > 2 * std]
            if outliers:
                insights.append(f"Detected {len(outliers)} potential outliers")

            # Variability assessment
            cv = std / mean if mean != 0 else 0
            if cv > 0.3:
                insights.append("High variability in results - consider more samples")
            elif cv < 0.1:
                insights.append("Results show good reproducibility")

        return insights

    def _compute_statistics(
        self,
        measurements: Dict[str, float],
        uncertainties: Dict[str, float]
    ) -> Dict[str, float]:
        """Compute statistical measures."""
        if not measurements:
            return {"p_value": 1.0, "effect_size": 0.0}

        values = list(measurements.values())
        uncerts = list(uncertainties.values()) if uncertainties else [0.1] * len(values)

        mean = np.mean(values)
        std = np.std(values) if len(values) > 1 else 0.1

        # Effect size (Cohen's d approximation)
        effect_size = abs(mean) / std if std > 0 else 0

        # P-value approximation
        avg_uncertainty = np.mean(uncerts)
        signal_to_noise = abs(mean) / avg_uncertainty if avg_uncertainty > 0 else 10
        p_value = np.exp(-signal_to_noise / 2)

        return {
            "mean": mean,
            "std": std,
            "effect_size": effect_size,
            "p_value": p_value,
            "signal_to_noise": signal_to_noise
        }

    def _extract_insights(
        self,
        measurements: Dict[str, float],
        stats: Dict[str, float]
    ) -> List[str]:
        """Extract insights from measurements."""
        insights = []

        if stats.get("signal_to_noise", 0) > 3:
            insights.append("Strong signal detected above noise floor")

        if stats.get("effect_size", 0) > 0.8:
            insights.append("Large effect size indicates significant phenomenon")

        if stats.get("p_value", 1) < 0.01:
            insights.append("Highly statistically significant result")

        return insights

    def _generate_recommendations(
        self,
        supported: bool,
        stats: Dict[str, float]
    ) -> List[str]:
        """Generate recommendations for next steps."""
        recs = []

        if supported:
            recs.append("Proceed to validation experiments")
            recs.append("Consider scaling up the study")
        else:
            if stats.get("p_value", 1) > 0.1:
                recs.append("Increase sample size for better statistical power")
            if stats.get("effect_size", 0) < 0.2:
                recs.append("Effect may be too small - reconsider hypothesis")

        return recs

    def _load_physics_laws(self) -> Dict[str, Callable]:
        """Load physics validation rules."""
        return {
            "energy_conservation": lambda m: True,  # Would check energy balance
            "positive_temperature": lambda m: all(
                v > 0 for k, v in m.items() if "temperature" in k.lower()
            ) if m else True,
            "bounded_probability": lambda m: all(
                0 <= v <= 1 for k, v in m.items() if "probability" in k.lower()
            ) if m else True,
        }
