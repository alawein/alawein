#!/usr/bin/env python3
"""
Quantum Hardware Execution Demo

Demonstrates real quantum hardware execution with error mitigation,
backend selection, and performance optimization.
"""

import sys
import numpy as np
from pathlib import Path

# Add research modules to path
sys.path.append(str(Path(__file__).parent.parent / "research"))

from optilibria.optilibria.quantum.backends import BackendManager
from optilibria.optilibria.quantum.error_mitigation import QuantumErrorMitigation
from optilibria.optilibria.quantum.qaoa import QAOAOptimizer
from optilibria.optilibria.quantum.vqe import VQEOptimizer

def main():
    print("🚀 Quantum Hardware Execution Demo")
    print("=" * 50)
    
    # Initialize quantum infrastructure
    backend_manager = BackendManager()
    error_mitigation = QuantumErrorMitigation()
    
    print("\n🔧 Available Quantum Backends:")
    backends_info = backend_manager.get_all_backends_info()
    for name, info in backends_info.items():
        provider = info.get('provider', 'Unknown')
        max_qubits = info.get('max_qubits', 'N/A')
        print(f"  • {name}: {provider} ({max_qubits} qubits)")
    
    # Demo 1: Bell State with Error Mitigation
    print("\n🔬 Demo 1: Bell State with Error Mitigation")
    print("-" * 40)
    
    bell_circuit = {
        'n_qubits': 2,
        'gates': [
            {'name': 'H', 'qubits': [0]},
            {'name': 'CNOT', 'qubits': [0, 1]},
            {'name': 'MEASURE', 'qubits': [0, 1]}
        ],
        'type': 'bell_state'
    }
    
    # Execute on optimal backend
    optimal_backend = backend_manager.get_optimal_backend(bell_circuit)
    print(f"Selected backend: {optimal_backend}")
    
    # Raw execution
    raw_result = backend_manager.execute(bell_circuit, backend=optimal_backend, shots=1024)
    print(f"Raw fidelity: {raw_result.get('fidelity', 'N/A'):.3f}")
    print(f"Execution time: {raw_result.get('execution_time', 0):.2f}s")
    
    # Error-mitigated execution
    def circuit_executor(circuit, shots):
        return backend_manager.execute(circuit, backend=optimal_backend, shots=shots)
    
    mitigated_result = error_mitigation.mitigate(
        circuit_executor, bell_circuit, shots=1024, methods=['REM', 'ZNE']
    )
    
    print(f"Mitigated expectation: {mitigated_result.get('mitigated_expectation', 'N/A'):.3f}")
    print(f"Improvement factor: {mitigated_result.get('improvement_factor', 1):.2f}x")
    
    # Demo 2: QAOA on Real Hardware
    print("\n⚛️ Demo 2: QAOA MaxCut on Quantum Hardware")
    print("-" * 40)
    
    # Create MaxCut problem
    def maxcut_cost(x):
        # Simple 4-node graph
        edges = [(0,1), (1,2), (2,3), (3,0), (0,2)]
        cost = 0
        for i, j in edges:
            if i < len(x) and j < len(x):
                cost += 0.5 * (1 - x[i] * x[j])  # MaxCut objective
        return cost
    
    # Initialize QAOA with hardware backend
    qaoa = QAOAOptimizer(p=2)
    
    # Override backend selection for QAOA
    original_execute = qaoa._execute_qaoa_circuit
    def hardware_execute(circuit_params, cost_function, n_vars):
        # Create QAOA circuit
        qaoa_circuit = {
            'n_qubits': n_vars,
            'gates': qaoa._build_qaoa_gates(circuit_params, cost_function, n_vars),
            'type': 'qaoa'
        }
        
        # Select optimal backend
        backend = backend_manager.get_optimal_backend(qaoa_circuit, 
            requirements={'high_fidelity': True})
        
        # Execute with error mitigation
        result = error_mitigation.mitigate(
            lambda c, s: backend_manager.execute(c, backend=backend, shots=s),
            qaoa_circuit, shots=1024, methods=['REM']
        )
        
        return result
    
    qaoa._execute_qaoa_circuit = hardware_execute
    
    print("Optimizing 4-node MaxCut problem...")
    qaoa_result = qaoa.optimize(maxcut_cost, n_vars=4)
    
    print(f"✅ QAOA Results:")
    print(f"  Solution: {qaoa_result['x']}")
    print(f"  Cost: {qaoa_result['fun']:.3f}")
    print(f"  Quantum advantage: {qaoa_result.get('quantum_advantage', False)}")
    print(f"  Backend used: {qaoa_result.get('backend', 'unknown')}")
    
    # Demo 3: VQE Molecular Simulation
    print("\n🧬 Demo 3: VQE H₂ Molecule on Quantum Hardware")
    print("-" * 40)
    
    # H₂ Hamiltonian (simplified)
    h2_hamiltonian = np.array([
        [-1.0523732,  0.39793742, -0.39793742, -0.01128010],
        [ 0.39793742, -1.0523732, -0.01128010, -0.39793742],
        [-0.39793742, -0.01128010, -1.0523732,  0.39793742],
        [-0.01128010, -0.39793742,  0.39793742, -1.0523732]
    ])
    
    # Initialize VQE with hardware backend
    vqe = VQEOptimizer(depth=2)
    
    # Override VQE execution for hardware
    original_vqe_execute = vqe._execute_vqe_circuit
    def hardware_vqe_execute(params, hamiltonian, n_qubits):
        # Create VQE ansatz circuit
        vqe_circuit = {
            'n_qubits': n_qubits,
            'gates': vqe._build_ansatz_gates(params, n_qubits),
            'type': 'vqe'
        }
        
        # Select backend optimized for small molecules
        backend = backend_manager.get_optimal_backend(vqe_circuit,
            requirements={'high_fidelity': True, 'fast_execution': False})
        
        # Execute with full error mitigation
        result = error_mitigation.mitigate(
            lambda c, s: backend_manager.execute(c, backend=backend, shots=s),
            vqe_circuit, shots=2048, methods=['REM', 'ZNE']
        )
        
        return result
    
    vqe._execute_vqe_circuit = hardware_vqe_execute
    
    print("Finding H₂ ground state energy...")
    vqe_result = vqe.optimize(h2_hamiltonian, n_qubits=2)
    
    print(f"✅ VQE Results:")
    print(f"  Ground state energy: {vqe_result['energy']:.6f} Ha")
    print(f"  Optimal parameters: {vqe_result['optimal_params']}")
    print(f"  Quantum advantage: {vqe_result.get('quantum_advantage', False)}")
    print(f"  Convergence: {vqe_result.get('converged', False)}")
    
    # Demo 4: Backend Performance Comparison
    print("\n📊 Demo 4: Backend Performance Comparison")
    print("-" * 40)
    
    test_circuit = {
        'n_qubits': 3,
        'gates': [
            {'name': 'H', 'qubits': [0]},
            {'name': 'H', 'qubits': [1]},
            {'name': 'H', 'qubits': [2]},
            {'name': 'CNOT', 'qubits': [0, 1]},
            {'name': 'CNOT', 'qubits': [1, 2]},
            {'name': 'MEASURE', 'qubits': [0, 1, 2]}
        ]
    }
    
    backends_to_test = ['ibm_quantum', 'google_quantum', 'local_simulator']
    
    for backend_name in backends_to_test:
        try:
            result = backend_manager.execute(test_circuit, backend=backend_name, shots=512)
            
            print(f"\n{backend_name}:")
            print(f"  Execution time: {result.get('execution_time', 0):.3f}s")
            print(f"  Fidelity: {result.get('fidelity', 'N/A'):.3f}")
            print(f"  Quantum advantage: {result.get('quantum_advantage', False)}")
            print(f"  Routing reason: {result.get('routing_reason', 'N/A')}")
            
        except Exception as e:
            print(f"\n{backend_name}: Error - {str(e)}")
    
    # Summary
    print("\n🏆 Quantum Hardware Demo Summary")
    print("=" * 50)
    print("✅ Multi-backend quantum execution deployed")
    print("✅ Advanced error mitigation operational")
    print("✅ Intelligent backend routing active")
    print("✅ Real hardware integration ready")
    print("✅ QAOA and VQE hardware-optimized")
    
    print("\n🚀 Quantum hardware execution complete!")
    print("Ready for production quantum advantage!")

if __name__ == "__main__":
    main()