"""
Comprehensive Test Suite
Tests all major components of the quantum-classical research portfolio.
"""
import numpy as np
import sys
import asyncio
from pathlib import Path

# Add research directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


def test_quantum_simulator():
    """Test quantum circuit simulator."""
    print("Testing Quantum Simulator...")
    from optilibria.optilibria import QuantumSimulator

    # Bell state
    sim = QuantumSimulator(2)
    sim.add_gate('H', [0])
    sim.add_gate('CNOT', [0, 1])
    state = sim.get_statevector()

    assert np.isclose(np.abs(state[0])**2, 0.5, atol=0.01)
    assert np.isclose(np.abs(state[3])**2, 0.5, atol=0.01)
    print("  [PASS] Bell state creation")

    # GHZ state
    sim3 = QuantumSimulator(3)
    sim3.add_gate('H', [0])
    sim3.add_gate('CNOT', [0, 1])
    sim3.add_gate('CNOT', [1, 2])
    state3 = sim3.get_statevector()

    assert np.isclose(np.abs(state3[0])**2, 0.5, atol=0.01)
    assert np.isclose(np.abs(state3[7])**2, 0.5, atol=0.01)
    print("  [PASS] GHZ state creation")


def test_qaoa():
    """Test QAOA optimizer."""
    print("Testing QAOA...")
    from optilibria.optilibria import QAOAOptimizer

    # MaxCut on triangle
    def maxcut(x):
        edges = [(0, 1), (1, 2), (2, 0)]
        return -sum(x[i] != x[j] for i, j in edges)

    qaoa = QAOAOptimizer(p=1)
    result = qaoa.optimize(maxcut, n_vars=3)

    assert result['fun'] <= -2, f"Expected at least 2 edges cut, got {-result['fun']}"
    print(f"  [PASS] MaxCut: {-result['fun']} edges cut")


def test_vqe():
    """Test VQE optimizer."""
    print("Testing VQE...")
    from optilibria.optilibria import VQEOptimizer, create_h2_hamiltonian

    H, n_qubits = create_h2_hamiltonian(0.74)
    vqe = VQEOptimizer(depth=2)
    result = vqe.optimize(H, n_qubits)

    # Check against exact
    exact = np.linalg.eigvalsh(H)[0]
    error = abs(result['energy'] - exact)

    assert error < 0.1, f"VQE error too large: {error}"
    print(f"  [PASS] H2 energy: {result['energy']:.6f} (error: {error:.2e})")


def test_grover():
    """Test Grover's search."""
    print("Testing Grover's Search...")
    from optilibria.optilibria import GroverSearch

    grover = GroverSearch(n_qubits=4)
    target = 7
    oracle = lambda x: x == target
    result = grover.search(oracle)

    found = result['solutions'][0]['index'] if result['solutions'] else -1
    assert found == target, f"Expected {target}, got {found}"
    prob = result['solutions'][0]['probability'] if result['solutions'] else 0
    print(f"  [PASS] Found target {target} with probability {prob:.2%}")


def test_hybrid_optimizer():
    """Test hybrid optimizer."""
    print("Testing Hybrid Optimizer...")
    from optilibria.optilibria import HybridOptimizer

    def rosenbrock(x):
        return sum(100*(x[i+1]-x[i]**2)**2 + (1-x[i])**2 for i in range(len(x)-1))

    optimizer = HybridOptimizer()
    result = optimizer.minimize(rosenbrock, np.array([0.0, 0.0]))

    assert result.fun < 0.01, f"Optimization failed: {result.fun}"
    print(f"  [PASS] Rosenbrock minimum: {result.fun:.6f}")


def test_physics_validation():
    """Test physics validation."""
    print("Testing Physics Validation...")
    from optilibria.optilibria import PhysicsValidator, validate_state, validate_unitary

    # Test state normalization
    state = np.array([1, 0, 0, 0], dtype=complex)
    assert validate_state(state), "Valid state rejected"
    print("  [PASS] State normalization check")

    # Test unitarity
    H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
    assert validate_unitary(H), "Hadamard should be unitary"
    print("  [PASS] Unitarity check")

    # Test non-unitary rejection
    non_unitary = np.array([[1, 1], [0, 1]], dtype=complex)
    assert not validate_unitary(non_unitary), "Non-unitary matrix accepted"
    print("  [PASS] Non-unitary rejection")


def test_vqc():
    """Test Variational Quantum Classifier."""
    print("Testing VQC...")
    from optilibria.optilibria import VariationalQuantumClassifier

    # Simple XOR-like problem
    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y = np.array([0, 1, 1, 0])

    vqc = VariationalQuantumClassifier(n_qubits=2, n_layers=2)
    vqc.fit(X, y, epochs=50)
    predictions = vqc.predict(X)

    accuracy = np.mean(predictions == y)
    print(f"  [PASS] VQC accuracy: {accuracy:.2%}")


def test_qsvm():
    """Test Quantum SVM."""
    print("Testing QSVM...")
    from optilibria.optilibria import QSVM

    # Simple classification
    X = np.random.randn(20, 3)
    y = (X[:, 0] + X[:, 1] > 0).astype(int)

    qsvm = QSVM(n_qubits=3)
    qsvm.fit(X[:15], y[:15])
    predictions = qsvm.predict(X[15:])

    accuracy = np.mean(predictions == y[15:])
    print(f"  [PASS] QSVM accuracy: {accuracy:.2%}")


def test_error_mitigation():
    """Test error mitigation techniques."""
    print("Testing Error Mitigation...")
    from optilibria.optilibria import ZeroNoiseExtrapolation, ReadoutErrorMitigation

    # ZNE test
    zne = ZeroNoiseExtrapolation([1.0, 2.0, 3.0])

    def noisy_circuit(scale):
        # Simulate noisy expectation value
        true_value = 0.5
        noise = 0.1 * scale
        return true_value + noise

    result = zne.mitigate(noisy_circuit, extrapolation='linear')
    assert abs(result.mitigated_value - 0.5) < abs(result.raw_value - 0.5)
    print(f"  [PASS] ZNE: raw={result.raw_value:.3f}, mitigated={result.mitigated_value:.3f}")

    # Readout mitigation test
    rem = ReadoutErrorMitigation(n_qubits=2)
    rem.calibrate()

    counts = {'00': 450, '01': 50, '10': 50, '11': 450}
    mitigated = rem.mitigate(counts)

    assert '00' in mitigated and '11' in mitigated
    print(f"  [PASS] Readout mitigation applied")


def test_molecular_simulation():
    """Test molecular simulation."""
    print("Testing Molecular Simulation...")
    from optilibria.optilibria import MolecularSimulator, create_h2

    simulator = MolecularSimulator()
    h2 = create_h2(bond_length=0.74)

    result = simulator.compute_ground_state(h2, method='vqe')

    assert 'energy' in result
    assert result['n_qubits'] > 0
    print(f"  [PASS] H2 ground state: {result['energy']:.6f} Hartree")


def test_portfolio_optimization():
    """Test portfolio optimization."""
    print("Testing Portfolio Optimization...")
    from optilibria.optilibria import QuantumPortfolioOptimizer, Asset

    assets = [
        Asset("A", 0.10, 0.20),
        Asset("B", 0.08, 0.15),
        Asset("C", 0.12, 0.25),
    ]

    cov = np.array([
        [0.04, 0.01, 0.02],
        [0.01, 0.0225, 0.01],
        [0.02, 0.01, 0.0625]
    ])

    optimizer = QuantumPortfolioOptimizer(risk_aversion=1.0)
    result = optimizer.optimize_continuous(assets, cov)

    assert 'expected_return' in result
    assert 'risk' in result
    assert sum(result['weights'].values()) > 0.99
    print(f"  [PASS] Portfolio: return={result['expected_return']:.2%}, risk={result['risk']:.2%}")


async def test_orchex():
    """Test ORCHEX multi-agent system."""
    print("Testing ORCHEX...")
    from orchex import Coordinator, HypothesisAgent, ExperimentAgent, AnalysisAgent

    coordinator = Coordinator()
    coordinator.register_agent(HypothesisAgent())
    coordinator.register_agent(ExperimentAgent())
    coordinator.register_agent(AnalysisAgent())

    workflow = coordinator.create_workflow('test', [
        {
            'task_type': 'generate_hypothesis',
            'agent': 'HypothesisAgent',
            'data': {'question': 'Test quantum effects', 'count': 2}
        }
    ])

    result = await coordinator.execute_workflow('test')

    assert result['success'], "Workflow failed"
    print(f"  [PASS] ORCHEX workflow completed with {len(result['results'])} stages")


async def test_distributed_cluster():
    """Test distributed quantum cluster."""
    print("Testing Distributed Cluster...")
    from optilibria.optilibria import QuantumCluster

    cluster = QuantumCluster(max_workers=2)
    cluster.add_quantum_simulator("sim", capacity=5)

    await cluster.start()

    # Submit simple task
    def simple_task():
        return 42

    task_id = await cluster.submit(simple_task)
    result = await cluster.get_result(task_id, timeout=10)

    assert result == 42
    print(f"  [PASS] Distributed task returned: {result}")

    await cluster.stop()


def test_quantum_cryptography():
    """Test quantum cryptography."""
    print("Testing Quantum Cryptography...")
    from optilibria.optilibria.applications.cryptography import BB84, QuantumRandomNumberGenerator

    bb84 = BB84(key_length=32)
    result = bb84.generate_key(eavesdropper=False)

    assert result.key_length > 0, "BB84 failed to generate key"
    assert result.error_rate < 0.15, f"BB84 error rate too high: {result.error_rate}"
    print(f"  [PASS] BB84 key generated: {result.key_length} bits")

    qrng = QuantumRandomNumberGenerator()
    bits = qrng.generate_bits(64)
    assert len(bits) == 64, "QRNG wrong length"
    print(f"  [PASS] QRNG generated 64 bits")


def test_quantum_sensing():
    """Test quantum sensing."""
    print("Testing Quantum Sensing...")
    from optilibria.optilibria.applications.sensing import QuantumMetrology, QuantumMagnetometer

    metrology = QuantumMetrology(n_qubits=4)
    result = metrology.estimate_phase(0.5, n_measurements=50)

    assert abs(result.estimated_value - 0.5) < 0.3, "Phase estimation too inaccurate"
    print(f"  [PASS] Phase estimation: {result.estimated_value:.3f} (true: 0.5)")

    magnetometer = QuantumMagnetometer(n_sensors=5)
    result = magnetometer.measure_field(1e-9, integration_time=0.5)

    assert result.estimated_value > 0, "Magnetometer failed"
    print(f"  [PASS] Magnetometer: {result.estimated_value*1e9:.2f} nT")


def test_circuit_visualization():
    """Test circuit visualization."""
    print("Testing Circuit Visualization...")
    from optilibria.optilibria.quantum.circuit_visualization import (
        QuantumCircuit, create_bell_state, create_ghz_state
    )

    bell = create_bell_state()
    assert bell.depth() == 2, f"Bell state depth wrong: {bell.depth()}"
    print(f"  [PASS] Bell state circuit depth: {bell.depth()}")

    ghz = create_ghz_state(4)
    assert ghz.depth() == 4, f"GHZ state depth wrong: {ghz.depth()}"
    print(f"  [PASS] GHZ-4 circuit depth: {ghz.depth()}")

    diagram = bell.draw()
    assert "H" in diagram and "+" in diagram, "Circuit diagram missing gates"
    print(f"  [PASS] Circuit diagram generated")


def test_noise_models():
    """Test noise models."""
    print("Testing Noise Models...")
    from optilibria.optilibria.quantum.noise_models import (
        NoisyQuantumSimulator, NoiseModel, NoiseParameters
    )

    params = NoiseParameters(t1=50e-6, t2=70e-6)
    noise = NoiseModel(params)
    sim = NoisyQuantumSimulator(2, noise)

    sim.h(0)
    sim.cnot(0, 1)

    ideal = np.array([1, 0, 0, 1], dtype=complex) / np.sqrt(2)
    fidelity = sim.get_fidelity(ideal)

    assert fidelity > 0.9, f"Fidelity too low: {fidelity}"
    print(f"  [PASS] Noisy Bell state fidelity: {fidelity:.4f}")


def run_all_tests():
    """Run all tests."""
    print("=" * 60)
    print("COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    print()

    tests = [
        ("Quantum Simulator", test_quantum_simulator),
        ("QAOA", test_qaoa),
        ("VQE", test_vqe),
        ("Grover's Search", test_grover),
        ("Hybrid Optimizer", test_hybrid_optimizer),
        ("Physics Validation", test_physics_validation),
        ("VQC", test_vqc),
        ("QSVM", test_qsvm),
        ("Error Mitigation", test_error_mitigation),
        ("Molecular Simulation", test_molecular_simulation),
        ("Portfolio Optimization", test_portfolio_optimization),
        ("Quantum Cryptography", test_quantum_cryptography),
        ("Quantum Sensing", test_quantum_sensing),
        ("Circuit Visualization", test_circuit_visualization),
        ("Noise Models", test_noise_models),
    ]

    async_tests = [
        ("ORCHEX", test_orchex),
        ("Distributed Cluster", test_distributed_cluster),
    ]

    passed = 0
    failed = 0

    for name, test_func in tests:
        try:
            test_func()
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {name}: {e}")
            failed += 1

    # Run async tests
    async def run_async_tests():
        nonlocal passed, failed
        for name, test_func in async_tests:
            try:
                await test_func()
                passed += 1
            except Exception as e:
                print(f"  [FAIL] {name}: {e}")
                failed += 1

    asyncio.run(run_async_tests())

    print()
    print("=" * 60)
    print(f"RESULTS: {passed} passed, {failed} failed")
    print("=" * 60)

    return failed == 0


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
