"""
Quantum Finance Demo
Demonstrates portfolio optimization using quantum algorithms.
"""
import numpy as np
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from optilibria.optilibria.applications.finance import (
    QuantumPortfolioOptimizer,
    QuantumRiskAnalyzer,
    create_sample_assets,
    Asset,
    Portfolio
)


def demo_discrete_optimization():
    """Demo discrete portfolio selection with QAOA."""
    print("=" * 60)
    print("DISCRETE PORTFOLIO SELECTION (QAOA)")
    print("=" * 60)

    assets, cov = create_sample_assets()

    print("\nAvailable Assets:")
    for a in assets:
        print(f"  {a.symbol}: Return={a.expected_return:.1%}, Vol={a.volatility:.1%}")

    optimizer = QuantumPortfolioOptimizer(risk_aversion=2.0)

    print("\nSelecting 3 best assets using QAOA...")
    result = optimizer.optimize_discrete(assets, cov, n_select=3)

    print(f"\nSelected Assets: {result['selected_assets']}")
    print(f"Expected Return: {result['expected_return']:.2%}")
    print(f"Risk (Volatility): {result['risk']:.2%}")
    print(f"Sharpe Ratio: {result['sharpe_ratio']:.2f}")
    print(f"Quantum Iterations: {result['quantum_iterations']}")


def demo_continuous_optimization():
    """Demo continuous portfolio optimization."""
    print("\n" + "=" * 60)
    print("CONTINUOUS PORTFOLIO OPTIMIZATION")
    print("=" * 60)

    assets, cov = create_sample_assets()

    optimizer = QuantumPortfolioOptimizer(risk_aversion=1.0)

    print("\nOptimizing portfolio weights...")
    result = optimizer.optimize_continuous(assets, cov)

    print("\nOptimal Weights:")
    for symbol, weight in result['weights'].items():
        if weight > 0.01:
            print(f"  {symbol}: {weight:.1%}")

    print(f"\nExpected Return: {result['expected_return']:.2%}")
    print(f"Risk (Volatility): {result['risk']:.2%}")
    print(f"Sharpe Ratio: {result['sharpe_ratio']:.2f}")


def demo_efficient_frontier():
    """Demo efficient frontier computation."""
    print("\n" + "=" * 60)
    print("EFFICIENT FRONTIER")
    print("=" * 60)

    assets, cov = create_sample_assets()

    optimizer = QuantumPortfolioOptimizer()

    print("\nComputing efficient frontier...")
    frontier = optimizer.efficient_frontier(assets, cov, n_points=10)

    print("\nEfficient Frontier Points:")
    print(f"{'Return':>10} {'Risk':>10} {'Sharpe':>10}")
    print("-" * 32)
    for ret, risk, sharpe in zip(frontier['returns'], frontier['risks'], frontier['sharpe_ratios']):
        print(f"{ret:>10.2%} {risk:>10.2%} {sharpe:>10.2f}")

    # Find max Sharpe
    max_sharpe_idx = np.argmax(frontier['sharpe_ratios'])
    print(f"\nMax Sharpe Portfolio:")
    print(f"  Return: {frontier['returns'][max_sharpe_idx]:.2%}")
    print(f"  Risk: {frontier['risks'][max_sharpe_idx]:.2%}")
    print(f"  Sharpe: {frontier['sharpe_ratios'][max_sharpe_idx]:.2f}")


def demo_risk_analysis():
    """Demo risk analysis."""
    print("\n" + "=" * 60)
    print("RISK ANALYSIS")
    print("=" * 60)

    assets, cov = create_sample_assets()

    # Create equal-weight portfolio
    weights = np.ones(len(assets)) / len(assets)
    portfolio = Portfolio(assets=assets, weights=weights)

    print(f"\nPortfolio: Equal-weight across {len(assets)} assets")
    print(f"Expected Return: {portfolio.expected_return:.2%}")

    analyzer = QuantumRiskAnalyzer(n_scenarios=10000)

    # VaR analysis
    var_result = analyzer.monte_carlo_var(portfolio, cov, confidence=0.95, horizon_days=1)

    print(f"\nValue at Risk (95%, 1-day):")
    print(f"  VaR: {var_result['VaR']:.2%}")
    print(f"  CVaR (Expected Shortfall): {var_result['CVaR']:.2%}")
    print(f"  Daily Volatility: {var_result['volatility']:.2%}")

    # Stress testing
    scenarios = {
        "Market Crash": {"AAPL": -0.30, "GOOGL": -0.35, "JPM": -0.40, "JNJ": -0.15, "XOM": -0.25, "PG": -0.10},
        "Tech Selloff": {"AAPL": -0.25, "GOOGL": -0.30, "JPM": 0.05, "JNJ": 0.02, "XOM": 0.0, "PG": 0.03},
        "Energy Crisis": {"AAPL": -0.05, "GOOGL": -0.05, "JPM": -0.10, "JNJ": 0.0, "XOM": 0.30, "PG": -0.05},
        "Bull Market": {"AAPL": 0.20, "GOOGL": 0.25, "JPM": 0.15, "JNJ": 0.10, "XOM": 0.08, "PG": 0.12},
    }

    print("\nStress Test Results:")
    stress_results = analyzer.stress_test(portfolio, cov, scenarios)
    for scenario, impact in stress_results.items():
        print(f"  {scenario}: {impact:+.2%}")


def main():
    print("\n" + "=" * 60)
    print("QUANTUM FINANCE DEMONSTRATION")
    print("=" * 60)

    demo_discrete_optimization()
    demo_continuous_optimization()
    demo_efficient_frontier()
    demo_risk_analysis()

    print("\n" + "=" * 60)
    print("DEMONSTRATION COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()
