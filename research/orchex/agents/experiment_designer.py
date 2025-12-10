"""
Automated Experiment Designer Agent
Uses Bayesian optimization and active learning for experiment design.
"""
import numpy as np
from scipy.special import erf
from typing import Dict, List, Any, Optional, Callable, Tuple
from dataclasses import dataclass, field
from enum import Enum
import asyncio


class ExperimentType(Enum):
    """Types of experiments."""
    PARAMETER_SWEEP = "parameter_sweep"
    OPTIMIZATION = "optimization"
    EXPLORATION = "exploration"
    VALIDATION = "validation"
    ABLATION = "ablation"


@dataclass
class ParameterSpace:
    """Defines the parameter space for experiments."""
    name: str
    bounds: Tuple[float, float]
    param_type: str = "continuous"  # continuous, discrete, categorical
    values: List[Any] = None  # For categorical
    log_scale: bool = False


@dataclass
class ExperimentConfig:
    """Configuration for an experiment."""
    experiment_id: str
    experiment_type: ExperimentType
    parameters: Dict[str, Any]
    objective: str
    constraints: List[str] = field(default_factory=list)
    budget: int = 100
    priority: int = 0


@dataclass
class ExperimentObservation:
    """Result of a single experiment."""
    parameters: Dict[str, float]
    objective_value: float
    constraint_values: Dict[str, float] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = 0.0


class GaussianProcess:
    """
    Simple Gaussian Process for surrogate modeling.
    """

    def __init__(self, length_scale: float = 1.0, noise: float = 0.1):
        self.length_scale = length_scale
        self.noise = noise
        self.X_train = None
        self.y_train = None
        self.K_inv = None

    def _kernel(self, X1: np.ndarray, X2: np.ndarray) -> np.ndarray:
        """RBF kernel."""
        sq_dist = np.sum(X1**2, axis=1, keepdims=True) + \
                  np.sum(X2**2, axis=1) - 2 * X1 @ X2.T
        return np.exp(-sq_dist / (2 * self.length_scale**2))

    def fit(self, X: np.ndarray, y: np.ndarray):
        """Fit the GP to observations."""
        self.X_train = X
        self.y_train = y

        K = self._kernel(X, X) + self.noise**2 * np.eye(len(X))
        self.K_inv = np.linalg.inv(K)

    def predict(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Predict mean and variance at new points."""
        if self.X_train is None:
            return np.zeros(len(X)), np.ones(len(X))

        K_s = self._kernel(X, self.X_train)
        K_ss = self._kernel(X, X)

        mu = K_s @ self.K_inv @ self.y_train
        var = np.diag(K_ss - K_s @ self.K_inv @ K_s.T)
        var = np.maximum(var, 1e-10)

        return mu, var


class AcquisitionFunction:
    """Acquisition functions for Bayesian optimization."""

    @staticmethod
    def expected_improvement(mu: np.ndarray, sigma: np.ndarray, best_y: float, xi: float = 0.01) -> np.ndarray:
        """Expected Improvement acquisition function."""
        sigma = np.maximum(sigma, 1e-10)
        imp = mu - best_y - xi
        Z = imp / sigma
        ei = imp * (0.5 * (1 + erf(Z / np.sqrt(2)))) + \
             sigma * np.exp(-Z**2 / 2) / np.sqrt(2 * np.pi)
        return ei

    @staticmethod
    def upper_confidence_bound(mu: np.ndarray, sigma: np.ndarray, beta: float = 2.0) -> np.ndarray:
        """Upper Confidence Bound acquisition function."""
        return mu + beta * sigma

    @staticmethod
    def probability_of_improvement(mu: np.ndarray, sigma: np.ndarray, best_y: float, xi: float = 0.01) -> np.ndarray:
        """Probability of Improvement acquisition function."""
        sigma = np.maximum(sigma, 1e-10)
        Z = (mu - best_y - xi) / sigma
        return 0.5 * (1 + erf(Z / np.sqrt(2)))


class BayesianOptimizer:
    """
    Bayesian Optimization for experiment design.
    """

    def __init__(
        self,
        parameter_spaces: List[ParameterSpace],
        acquisition: str = 'ei'
    ):
        self.parameter_spaces = parameter_spaces
        self.acquisition = acquisition
        self.gp = GaussianProcess()
        self.observations: List[ExperimentObservation] = []
        self.best_observation: Optional[ExperimentObservation] = None

    def suggest(self, n_suggestions: int = 1) -> List[Dict[str, float]]:
        """Suggest next experiments to run."""
        if len(self.observations) < 5:
            # Random exploration initially
            return [self._random_sample() for _ in range(n_suggestions)]

        # Fit GP
        X = np.array([[obs.parameters[p.name] for p in self.parameter_spaces]
                      for obs in self.observations])
        y = np.array([obs.objective_value for obs in self.observations])
        self.gp.fit(X, y)

        # Optimize acquisition function
        suggestions = []
        for _ in range(n_suggestions):
            best_x = self._optimize_acquisition()
            suggestions.append({p.name: best_x[i] for i, p in enumerate(self.parameter_spaces)})

        return suggestions

    def _random_sample(self) -> Dict[str, float]:
        """Generate random sample from parameter space."""
        sample = {}
        for p in self.parameter_spaces:
            if p.param_type == 'continuous':
                if p.log_scale:
                    sample[p.name] = np.exp(np.random.uniform(np.log(p.bounds[0]), np.log(p.bounds[1])))
                else:
                    sample[p.name] = np.random.uniform(p.bounds[0], p.bounds[1])
            elif p.param_type == 'discrete':
                sample[p.name] = np.random.randint(int(p.bounds[0]), int(p.bounds[1]) + 1)
            elif p.param_type == 'categorical':
                sample[p.name] = np.random.choice(p.values)
        return sample

    def _optimize_acquisition(self, n_restarts: int = 10) -> np.ndarray:
        """Optimize acquisition function."""
        best_x = None
        best_acq = -np.inf

        for _ in range(n_restarts):
            # Random starting point
            x0 = np.array([np.random.uniform(p.bounds[0], p.bounds[1])
                          for p in self.parameter_spaces])

            # Simple grid search around starting point
            for _ in range(50):
                # Evaluate acquisition
                mu, var = self.gp.predict(x0.reshape(1, -1))
                sigma = np.sqrt(var)

                best_y = max(obs.objective_value for obs in self.observations)

                if self.acquisition == 'ei':
                    acq = AcquisitionFunction.expected_improvement(mu, sigma, best_y)[0]
                elif self.acquisition == 'ucb':
                    acq = AcquisitionFunction.upper_confidence_bound(mu, sigma)[0]
                else:
                    acq = AcquisitionFunction.probability_of_improvement(mu, sigma, best_y)[0]

                if acq > best_acq:
                    best_acq = acq
                    best_x = x0.copy()

                # Random perturbation
                x0 += np.random.randn(len(x0)) * 0.1
                # Clip to bounds
                for i, p in enumerate(self.parameter_spaces):
                    x0[i] = np.clip(x0[i], p.bounds[0], p.bounds[1])

        return best_x

    def observe(self, observation: ExperimentObservation):
        """Record an observation."""
        self.observations.append(observation)

        if self.best_observation is None or observation.objective_value > self.best_observation.objective_value:
            self.best_observation = observation

    def get_best(self) -> Optional[ExperimentObservation]:
        """Get best observation so far."""
        return self.best_observation


class ExperimentDesignerAgent:
    """
    Autonomous agent for designing and scheduling experiments.
    """

    def __init__(self, name: str = "ExperimentDesigner"):
        self.name = name
        self.optimizers: Dict[str, BayesianOptimizer] = {}
        self.experiment_queue: List[ExperimentConfig] = []
        self.completed_experiments: List[ExperimentObservation] = []

    async def design_experiment_campaign(
        self,
        objective_function: Callable,
        parameter_spaces: List[ParameterSpace],
        budget: int = 50,
        experiment_type: ExperimentType = ExperimentType.OPTIMIZATION
    ) -> Dict[str, Any]:
        """
        Design and run an experiment campaign.
        """
        campaign_id = f"campaign_{len(self.optimizers)}"

        # Create optimizer
        optimizer = BayesianOptimizer(parameter_spaces)
        self.optimizers[campaign_id] = optimizer

        results = []

        for iteration in range(budget):
            # Get suggestion
            suggestions = optimizer.suggest(n_suggestions=1)
            params = suggestions[0]

            # Run experiment
            try:
                objective_value = objective_function(params)
            except Exception as e:
                objective_value = -np.inf

            # Record observation
            observation = ExperimentObservation(
                parameters=params,
                objective_value=objective_value,
                timestamp=iteration
            )
            optimizer.observe(observation)
            results.append(observation)

            if iteration % 10 == 0:
                best = optimizer.get_best()
                print(f"Iteration {iteration}: Best = {best.objective_value:.4f}")

        best = optimizer.get_best()

        return {
            'campaign_id': campaign_id,
            'best_parameters': best.parameters,
            'best_objective': best.objective_value,
            'all_observations': results,
            'n_experiments': len(results)
        }

    async def design_ablation_study(
        self,
        base_config: Dict[str, Any],
        ablation_params: List[str],
        objective_function: Callable
    ) -> Dict[str, Any]:
        """
        Design ablation study to understand parameter importance.
        """
        results = {}

        # Baseline
        baseline_value = objective_function(base_config)
        results['baseline'] = baseline_value

        # Ablate each parameter
        for param in ablation_params:
            if param in base_config:
                ablated_config = base_config.copy()
                # Set to default/zero
                if isinstance(base_config[param], (int, float)):
                    ablated_config[param] = 0
                elif isinstance(base_config[param], bool):
                    ablated_config[param] = not base_config[param]

                ablated_value = objective_function(ablated_config)
                results[f'without_{param}'] = ablated_value
                results[f'{param}_importance'] = baseline_value - ablated_value

        # Rank by importance
        importance_ranking = sorted(
            [(p, results.get(f'{p}_importance', 0)) for p in ablation_params],
            key=lambda x: abs(x[1]),
            reverse=True
        )

        return {
            'baseline': baseline_value,
            'ablation_results': results,
            'importance_ranking': importance_ranking
        }

    async def design_parameter_sweep(
        self,
        parameter_spaces: List[ParameterSpace],
        objective_function: Callable,
        n_points_per_dim: int = 10
    ) -> Dict[str, Any]:
        """
        Design a parameter sweep experiment.
        """
        results = []

        # Generate grid
        grids = []
        for p in parameter_spaces:
            if p.param_type == 'continuous':
                grids.append(np.linspace(p.bounds[0], p.bounds[1], n_points_per_dim))
            elif p.param_type == 'discrete':
                grids.append(np.arange(p.bounds[0], p.bounds[1] + 1))
            else:
                grids.append(p.values)

        # Create meshgrid for 2D case
        if len(parameter_spaces) == 2:
            X, Y = np.meshgrid(grids[0], grids[1])
            Z = np.zeros_like(X)

            for i in range(X.shape[0]):
                for j in range(X.shape[1]):
                    params = {
                        parameter_spaces[0].name: X[i, j],
                        parameter_spaces[1].name: Y[i, j]
                    }
                    Z[i, j] = objective_function(params)
                    results.append({'params': params, 'value': Z[i, j]})

            return {
                'grid_x': X,
                'grid_y': Y,
                'values': Z,
                'results': results,
                'best_params': results[np.argmax([r['value'] for r in results])]['params']
            }

        # General case: random sampling
        for _ in range(n_points_per_dim ** len(parameter_spaces)):
            params = {}
            for i, p in enumerate(parameter_spaces):
                params[p.name] = np.random.choice(grids[i])

            value = objective_function(params)
            results.append({'params': params, 'value': value})

        return {
            'results': results,
            'best_params': results[np.argmax([r['value'] for r in results])]['params']
        }


async def demo_experiment_designer():
    """Demonstrate the experiment designer."""
    print("=" * 60)
    print("EXPERIMENT DESIGNER DEMO")
    print("=" * 60)

    # Define objective function (Branin function)
    def branin(params):
        x1 = params['x1']
        x2 = params['x2']
        a, b, c = 1, 5.1/(4*np.pi**2), 5/np.pi
        r, s, t = 6, 10, 1/(8*np.pi)
        return -(a*(x2 - b*x1**2 + c*x1 - r)**2 + s*(1-t)*np.cos(x1) + s)

    # Define parameter space
    param_spaces = [
        ParameterSpace('x1', (-5, 10)),
        ParameterSpace('x2', (0, 15))
    ]

    designer = ExperimentDesignerAgent()

    # Run optimization campaign
    result = await designer.design_experiment_campaign(
        branin,
        param_spaces,
        budget=30
    )

    print(f"\nBest parameters: {result['best_parameters']}")
    print(f"Best objective: {result['best_objective']:.4f}")
    print(f"Total experiments: {result['n_experiments']}")


if __name__ == "__main__":
    asyncio.run(demo_experiment_designer())
