"""
Quantum Finance Applications
Portfolio optimization and risk analysis using quantum algorithms.
"""
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field


@dataclass
class Asset:
    """Represents a financial asset."""
    symbol: str
    expected_return: float
    volatility: float
    sector: str = "general"


@dataclass
class Portfolio:
    """Represents a portfolio of assets."""
    assets: List[Asset]
    weights: np.ndarray

    @property
    def n_assets(self) -> int:
        return len(self.assets)

    @property
    def expected_return(self) -> float:
        returns = np.array([a.expected_return for a in self.assets])
        return np.dot(self.weights, returns)

    @property
    def symbols(self) -> List[str]:
        return [a.symbol for a in self.assets]


class QuantumPortfolioOptimizer:
    """
    Quantum-enhanced portfolio optimization.
    Uses QAOA for discrete allocation and VQE for continuous optimization.
    """

    def __init__(self, risk_aversion: float = 1.0):
        self.risk_aversion = risk_aversion

    def optimize_discrete(
        self,
        assets: List[Asset],
        covariance_matrix: np.ndarray,
        n_select: int,
        budget: float = 1.0
    ) -> Dict[str, Any]:
        """
        Discrete portfolio selection using QAOA.
        Select n_select assets from the universe.
        """
        n_assets = len(assets)

        # Build QUBO for portfolio selection
        # Objective: maximize return - risk_aversion * variance
        returns = np.array([a.expected_return for a in assets])

        def portfolio_cost(x):
            # x is binary vector indicating asset selection
            selected = x.astype(bool)
            if selected.sum() == 0:
                return 1000  # Penalty for empty portfolio

            # Equal weight among selected
            weights = selected / selected.sum()

            # Expected return
            ret = np.dot(weights, returns)

            # Variance
            var = weights @ covariance_matrix @ weights

            # Penalty for wrong number of assets
            count_penalty = 10 * abs(selected.sum() - n_select)

            return -ret + self.risk_aversion * var + count_penalty

        # Run QAOA
        from ..quantum.qaoa import QAOAOptimizer
        qaoa = QAOAOptimizer(p=2)
        result = qaoa.optimize(portfolio_cost, n_vars=n_assets)

        # Extract selected assets
        selected = result['x'].astype(bool)
        selected_assets = [assets[i] for i in range(n_assets) if selected[i]]
        weights = np.zeros(n_assets)
        if selected.sum() > 0:
            weights[selected] = 1.0 / selected.sum()

        portfolio = Portfolio(assets=assets, weights=weights)

        return {
            'portfolio': portfolio,
            'selected_assets': [a.symbol for a in selected_assets],
            'expected_return': portfolio.expected_return,
            'risk': np.sqrt(weights @ covariance_matrix @ weights),
            'sharpe_ratio': portfolio.expected_return / np.sqrt(weights @ covariance_matrix @ weights + 1e-10),
            'quantum_iterations': result['iterations']
        }

    def optimize_continuous(
        self,
        assets: List[Asset],
        covariance_matrix: np.ndarray,
        target_return: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Continuous portfolio optimization.
        Find optimal weights using hybrid quantum-classical optimization.
        """
        n_assets = len(assets)
        returns = np.array([a.expected_return for a in assets])

        def portfolio_objective(weights):
            # Normalize weights
            weights = np.abs(weights)
            weights = weights / (weights.sum() + 1e-10)

            # Expected return
            ret = np.dot(weights, returns)

            # Variance
            var = weights @ covariance_matrix @ weights

            # Objective: minimize risk for given return (or maximize Sharpe)
            if target_return is not None:
                return var + 100 * (ret - target_return) ** 2
            else:
                # Maximize Sharpe ratio (minimize negative Sharpe)
                return -ret / (np.sqrt(var) + 1e-10) + self.risk_aversion * var

        # Use hybrid optimizer
        from ..core.hybrid import HybridOptimizer
        optimizer = HybridOptimizer()

        x0 = np.ones(n_assets) / n_assets
        result = optimizer.minimize(portfolio_objective, x0)

        # Normalize final weights
        weights = np.abs(result.x)
        weights = weights / weights.sum()

        portfolio = Portfolio(assets=assets, weights=weights)

        return {
            'portfolio': portfolio,
            'weights': dict(zip([a.symbol for a in assets], weights)),
            'expected_return': portfolio.expected_return,
            'risk': np.sqrt(weights @ covariance_matrix @ weights),
            'sharpe_ratio': portfolio.expected_return / np.sqrt(weights @ covariance_matrix @ weights + 1e-10)
        }

    def efficient_frontier(
        self,
        assets: List[Asset],
        covariance_matrix: np.ndarray,
        n_points: int = 20
    ) -> Dict[str, Any]:
        """Compute the efficient frontier."""
        returns = np.array([a.expected_return for a in assets])
        min_ret = returns.min()
        max_ret = returns.max()

        target_returns = np.linspace(min_ret, max_ret, n_points)
        frontier_risks = []
        frontier_returns = []
        frontier_weights = []

        for target in target_returns:
            result = self.optimize_continuous(assets, covariance_matrix, target_return=target)
            frontier_returns.append(result['expected_return'])
            frontier_risks.append(result['risk'])
            frontier_weights.append(result['weights'])

        return {
            'returns': frontier_returns,
            'risks': frontier_risks,
            'weights': frontier_weights,
            'sharpe_ratios': [r / (s + 1e-10) for r, s in zip(frontier_returns, frontier_risks)]
        }


class QuantumRiskAnalyzer:
    """Quantum-enhanced risk analysis."""

    def __init__(self, n_scenarios: int = 1000):
        self.n_scenarios = n_scenarios

    def monte_carlo_var(
        self,
        portfolio: Portfolio,
        covariance_matrix: np.ndarray,
        confidence: float = 0.95,
        horizon_days: int = 1
    ) -> Dict[str, float]:
        """
        Compute Value at Risk using Monte Carlo simulation.
        """
        returns = np.array([a.expected_return for a in portfolio.assets])
        weights = portfolio.weights

        # Daily returns (assuming annual returns given)
        daily_returns = returns / 252
        daily_cov = covariance_matrix / 252

        # Generate scenarios
        scenarios = np.random.multivariate_normal(
            daily_returns,
            daily_cov,
            self.n_scenarios * horizon_days
        )

        # Portfolio returns for each scenario
        portfolio_returns = scenarios @ weights

        # Reshape for multi-day horizon
        if horizon_days > 1:
            portfolio_returns = portfolio_returns.reshape(self.n_scenarios, horizon_days).sum(axis=1)

        # Compute VaR
        var = -np.percentile(portfolio_returns, (1 - confidence) * 100)
        cvar = -portfolio_returns[portfolio_returns <= -var].mean()

        return {
            'VaR': var,
            'CVaR': cvar,
            'confidence': confidence,
            'horizon_days': horizon_days,
            'expected_return': portfolio_returns.mean(),
            'volatility': portfolio_returns.std()
        }

    def stress_test(
        self,
        portfolio: Portfolio,
        covariance_matrix: np.ndarray,
        scenarios: Dict[str, Dict[str, float]]
    ) -> Dict[str, float]:
        """
        Stress test portfolio under different scenarios.

        Args:
            scenarios: Dict of scenario_name -> {asset_symbol: return_shock}
        """
        results = {}

        for scenario_name, shocks in scenarios.items():
            # Apply shocks
            shocked_returns = []
            for asset in portfolio.assets:
                base_return = asset.expected_return
                shock = shocks.get(asset.symbol, 0)
                shocked_returns.append(base_return + shock)

            # Compute portfolio return under shock
            portfolio_return = np.dot(portfolio.weights, shocked_returns)
            results[scenario_name] = portfolio_return

        return results


def create_sample_assets() -> Tuple[List[Asset], np.ndarray]:
    """Create sample assets for testing."""
    assets = [
        Asset("AAPL", 0.15, 0.25, "tech"),
        Asset("GOOGL", 0.12, 0.22, "tech"),
        Asset("JPM", 0.10, 0.20, "finance"),
        Asset("JNJ", 0.08, 0.15, "healthcare"),
        Asset("XOM", 0.06, 0.18, "energy"),
        Asset("PG", 0.07, 0.12, "consumer"),
    ]

    # Sample covariance matrix
    n = len(assets)
    volatilities = np.array([a.volatility for a in assets])

    # Correlation matrix with some structure
    corr = np.eye(n)
    corr[0, 1] = corr[1, 0] = 0.7  # Tech stocks correlated
    corr[0, 2] = corr[2, 0] = 0.3
    corr[1, 2] = corr[2, 1] = 0.3

    # Convert to covariance
    cov = np.outer(volatilities, volatilities) * corr

    return assets, cov
