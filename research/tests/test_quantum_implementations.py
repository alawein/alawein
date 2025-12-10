"""
Test suite for quantum implementations.
Verifies QAOA, VQE, and ORCHEX actually work.
"""
import numpy as np
import sys
from pathlib import Path

# Add research directory to path
research_dir = Path(__file__).parent.parent
sys.path.insert(0, str(research_dir))


def test_qaoa_maxcut():
    """Test QAOA on MaxCut problem."""
    from optilibria.optilibria.quantum.qaoa import QAOAOptimizer

    # Simple 4-node graph MaxCut
    # Graph: 0-1, 1-2, 2-3, 3-0 (square)
    def maxcut_cost(x):
        edges = [(0,1), (1,2), (2,3), (3,0)]
        return -sum(x[i] != x[j] for i, j in edges)  # Negative for minimization

    qaoa = QAOAOptimizer(p=2)
    result = qaoa.optimize(maxcut_cost, n_vars=4)

    print(f"QAOA MaxCut Result:")
    print(f"  Solution: {result['x']}")
    print(f"  Cost: {result['fun']}")
    print(f"  Iterations: {result['iterations']}")

    # MaxCut of square graph should be -4 (all edges cut)
    assert result['fun'] <= -2, f"Expected cost <= -2, got {result['fun']}"
    print("  ✓ QAOA test passed!\n")


def test_vqe_h2():
    """Test VQE on H2 molecule."""
    from optilibria.optilibria.quantum.vqe import VQEOptimizer, create_h2_hamiltonian

    H, n_qubits = create_h2_hamiltonian(bond_length=0.74)

    vqe = VQEOptimizer(depth=2)
    result = vqe.optimize(H, n_qubits)

    # Exact ground state energy (from diagonalization)
    exact_energy = np.min(np.linalg.eigvalsh(H))

    print(f"VQE H2 Result:")
    print(f"  VQE Energy: {result['energy']:.6f}")
    print(f"  Exact Energy: {exact_energy:.6f}")
    print(f"  Error: {abs(result['energy'] - exact_energy):.6f}")
    print(f"  Iterations: {result['iterations']}")

    # VQE should get within 0.1 of exact
    assert abs(result['energy'] - exact_energy) < 0.1, "VQE energy too far from exact"
    print("  ✓ VQE test passed!\n")


def test_quantum_simulator():
    """Test basic quantum simulator."""
    from optilibria.optilibria.quantum.simulator import QuantumSimulator

    # Create Bell state
    sim = QuantumSimulator(2)
    sim.add_gate("H", [0])
    sim.add_gate("CNOT", [0, 1])

    state = sim.get_statevector()

    # Bell state should be (|00⟩ + |11⟩)/√2
    expected = np.array([1, 0, 0, 1]) / np.sqrt(2)

    print(f"Quantum Simulator Bell State:")
    print(f"  State: {state}")
    print(f"  Expected: {expected}")

    assert np.allclose(np.abs(state), np.abs(expected)), "Bell state incorrect"
    print("  ✓ Simulator test passed!\n")


def test_orchex_workflow():
    """Test ORCHEX multi-agent system."""
    import asyncio
    from orchex import Coordinator, HypothesisAgent, ExperimentAgent

    async def run_test():
        coord = Coordinator()
        coord.register_agent(HypothesisAgent())
        coord.register_agent(ExperimentAgent())

        # Create simple workflow
        workflow = coord.create_workflow(
            name="test_workflow",
            stages=[
                {"task_type": "generate_hypothesis", "agent": "HypothesisAgent",
                 "data": {"question": "Test question", "count": 3}},
            ]
        )

        result = await coord.execute_workflow("test_workflow")
        return result

    result = asyncio.run(run_test())

    print(f"ORCHEX Workflow Result:")
    print(f"  Success: {result['success']}")
    print(f"  Stages completed: {len(result.get('results', {}))}")

    assert result['success'], "Workflow failed"
    print("  ✓ ORCHEX test passed!\n")


def test_hybrid_optimizer():
    """Test hybrid quantum-classical optimizer."""
    from optilibria.optilibria.core.hybrid import HybridOptimizer

    # Rosenbrock function
    def rosenbrock(x):
        return sum(100*(x[i+1]-x[i]**2)**2 + (1-x[i])**2 for i in range(len(x)-1))

    optimizer = HybridOptimizer()
    x0 = np.array([0.0, 0.0])

    result = optimizer.minimize(rosenbrock, x0)

    print(f"Hybrid Optimizer Result:")
    print(f"  Solution: {result.x}")
    print(f"  Function value: {result.fun:.6f}")
    print(f"  Success: {result.success}")

    # Rosenbrock minimum is at (1, 1) with value 0
    assert result.fun < 1.0, f"Expected fun < 1.0, got {result.fun}"
    print("  ✓ Hybrid optimizer test passed!\n")


if __name__ == "__main__":
    print("=" * 60)
    print("QUANTUM IMPLEMENTATION TEST SUITE")
    print("=" * 60 + "\n")

    try:
        test_quantum_simulator()
        test_qaoa_maxcut()
        test_vqe_h2()
        test_hybrid_optimizer()
        test_orchex_workflow()

        print("=" * 60)
        print("ALL TESTS PASSED! ✓")
        print("=" * 60)
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
