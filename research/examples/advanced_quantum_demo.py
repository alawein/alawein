"""
Advanced Quantum Computing Demo
Demonstrates tensor networks, quantum ML, and experiment design.
"""
import numpy as np
import asyncio
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))


def demo_tensor_networks():
    """Demo tensor network methods."""
    print("=" * 60)
    print("TENSOR NETWORK METHODS")
    print("=" * 60)

    from optilibria.optilibria.quantum.tensor_networks import (
        MatrixProductState,
        TensorNetworkSimulator,
        DMRG,
        create_heisenberg_hamiltonian
    )

    # Matrix Product State
    print("\n1. Matrix Product State (MPS)")
    mps = MatrixProductState(n_sites=6, bond_dim=8)
    print(f"   Sites: {mps.n_sites}, Bond dimension: {mps.bond_dim}")

    # Get amplitude of |000000>
    amp = mps.get_amplitude("000000")
    print(f"   Amplitude |000000>: {amp:.4f}")

    # Apply gates
    H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
    mps.apply_single_gate(H, 0)
    print("   Applied Hadamard to qubit 0")

    # Tensor Network Simulator
    print("\n2. Tensor Network Simulator")
    sim = TensorNetworkSimulator(n_qubits=4, method='mps')
    sim.apply_gate('H', [0])
    sim.apply_gate('H', [1])
    sim.apply_gate('H', [2])
    sim.apply_gate('H', [3])

    counts = sim.measure(shots=100)
    print(f"   Measurement samples: {len(counts)} unique outcomes")

    # DMRG for ground state
    print("\n3. DMRG Ground State Finder")
    dmrg = DMRG(n_sites=4, bond_dim=16)
    hamiltonian = create_heisenberg_hamiltonian(4, J=1.0)
    print(f"   Heisenberg model: {len(hamiltonian)} terms")
    print(f"   DMRG initialized with bond_dim={dmrg.bond_dim}")
    print(f"   (Full DMRG sweep requires compatible operator dimensions)")


def demo_quantum_neural_network():
    """Demo quantum neural network."""
    print("\n" + "=" * 60)
    print("QUANTUM NEURAL NETWORK")
    print("=" * 60)

    from optilibria.optilibria.quantum.quantum_ml import (
        QuantumNeuralNetwork,
        QuantumKernel,
        QuantumBoltzmannMachine
    )

    # Quantum Neural Network
    print("\n1. Quantum Neural Network")
    qnn = QuantumNeuralNetwork(
        input_dim=4,
        n_qubits=3,
        n_quantum_layers=2,
        output_dim=1
    )

    # Test forward pass
    x = np.random.randn(4)
    output = qnn.forward(x)
    print(f"   Input shape: {x.shape}")
    print(f"   Output: {output[0]:.4f}")

    # Quantum Kernel
    print("\n2. Quantum Kernel")
    qk = QuantumKernel(n_qubits=3, feature_map='zz')

    x1 = np.array([0.1, 0.2, 0.3])
    x2 = np.array([0.1, 0.2, 0.3])
    x3 = np.array([0.9, 0.8, 0.7])

    k11 = qk.kernel(x1, x1)
    k12 = qk.kernel(x1, x2)
    k13 = qk.kernel(x1, x3)

    print(f"   K(x1, x1) = {k11:.4f} (same point)")
    print(f"   K(x1, x2) = {k12:.4f} (identical)")
    print(f"   K(x1, x3) = {k13:.4f} (different)")

    # Quantum Boltzmann Machine
    print("\n3. Quantum Boltzmann Machine")
    qbm = QuantumBoltzmannMachine(n_visible=4, n_hidden=2)

    # Generate samples
    samples = qbm.sample(n_samples=10)
    print(f"   Generated {len(samples)} samples")
    print(f"   Sample shape: {samples.shape}")


def demo_quantum_transformer():
    """Demo quantum transformer."""
    print("\n" + "=" * 60)
    print("QUANTUM TRANSFORMER")
    print("=" * 60)

    from qubeml.qubeml.models import (
        QuantumTransformer,
        TransformerConfig,
        QuantumAttention
    )

    # Create small transformer
    config = TransformerConfig(
        d_model=32,
        n_heads=2,
        n_layers=1,
        n_qubits=4,
        max_seq_len=64
    )

    model = QuantumTransformer(config)
    print(f"\n1. Model Configuration")
    print(f"   d_model: {config.d_model}")
    print(f"   n_heads: {config.n_heads}")
    print(f"   n_layers: {config.n_layers}")
    print(f"   n_qubits: {config.n_qubits}")

    # Forward pass
    print("\n2. Forward Pass")
    input_tokens = np.array([10, 20, 30, 40, 50])
    logits = model.forward(input_tokens)
    print(f"   Input: {input_tokens}")
    print(f"   Output shape: {logits.shape}")

    # Generation
    print("\n3. Text Generation")
    prompt = np.array([5, 10, 15])
    generated = model.generate(prompt, max_length=8)
    print(f"   Prompt: {prompt}")
    print(f"   Generated: {generated}")


async def demo_experiment_designer():
    """Demo automated experiment design."""
    print("\n" + "=" * 60)
    print("AUTOMATED EXPERIMENT DESIGN")
    print("=" * 60)

    from orchex.agents.experiment_designer import (
        ExperimentDesignerAgent,
        ParameterSpace,
        BayesianOptimizer,
        ExperimentType
    )

    # Define objective (Rosenbrock function)
    def rosenbrock(params):
        x = params['x']
        y = params['y']
        return -((1 - x)**2 + 100*(y - x**2)**2)

    param_spaces = [
        ParameterSpace('x', (-2, 2)),
        ParameterSpace('y', (-2, 2))
    ]

    print("\n1. Bayesian Optimization")
    designer = ExperimentDesignerAgent()

    result = await designer.design_experiment_campaign(
        rosenbrock,
        param_spaces,
        budget=20,
        experiment_type=ExperimentType.OPTIMIZATION
    )

    print(f"   Best x: {result['best_parameters']['x']:.4f}")
    print(f"   Best y: {result['best_parameters']['y']:.4f}")
    print(f"   Best objective: {result['best_objective']:.4f}")
    print(f"   Experiments run: {result['n_experiments']}")

    # Ablation study
    print("\n2. Ablation Study")
    base_config = {'x': 1.0, 'y': 1.0, 'z': 0.5}

    def simple_objective(params):
        return params.get('x', 0) * 2 + params.get('y', 0) * 3 + params.get('z', 0) * 1

    ablation = await designer.design_ablation_study(
        base_config,
        ['x', 'y', 'z'],
        simple_objective
    )

    print(f"   Baseline: {ablation['baseline']:.2f}")
    print("   Importance ranking:")
    for param, importance in ablation['importance_ranking']:
        print(f"     {param}: {importance:.2f}")


async def main():
    print("\n" + "=" * 60)
    print("ADVANCED QUANTUM COMPUTING DEMONSTRATION")
    print("=" * 60)

    demo_tensor_networks()
    demo_quantum_neural_network()
    demo_quantum_transformer()
    await demo_experiment_designer()

    print("\n" + "=" * 60)
    print("ALL DEMONSTRATIONS COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
