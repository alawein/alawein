# 📚 Quantum-Classical Research Portfolio Index

## Quick Navigation

| Category                  | Description                    | Entry Point   |
| ------------------------- | ------------------------------ | ------------- |
| [Optilibria](#optilibria) | Quantum optimization framework | `optilibria/` |
| [ORCHEX](#orchex)         | Autonomous research agents     | `orchex/`     |
| [QubeML](#qubeml)         | Quantum machine learning       | `qubeml/`     |
| [QMatSim](#qmatsim)       | Materials discovery            | `qmatsim/`    |
| [Examples](#examples)     | Demo scripts                   | `examples/`   |
| [Tests](#tests)           | Test suites                    | `tests/`      |
| [Benchmarks](#benchmarks) | Performance tests              | `benchmarks/` |

---

## Optilibria

### Core Algorithms

| File                   | Description                      | Key Classes              |
| ---------------------- | -------------------------------- | ------------------------ |
| `quantum/qaoa.py`      | Quantum Approximate Optimization | `QAOAOptimizer`          |
| `quantum/vqe.py`       | Variational Quantum Eigensolver  | `VQEOptimizer`           |
| `quantum/grover.py`    | Grover's Search Algorithm        | `GroverSearch`           |
| `quantum/qpe.py`       | Quantum Phase Estimation         | `QuantumPhaseEstimation` |
| `quantum/simulator.py` | Statevector Simulator            | `QuantumSimulator`       |
| `quantum/gates.py`     | Quantum Gate Matrices            | `QuantumGates`           |

### Advanced Quantum

| File                               | Description             | Key Classes                                        |
| ---------------------------------- | ----------------------- | -------------------------------------------------- |
| `quantum/variational.py`           | Variational Classifiers | `VariationalQuantumClassifier`, `QSVM`             |
| `quantum/backends.py`              | Multi-Backend Support   | `BackendManager`                                   |
| `quantum/error_mitigation.py`      | Error Mitigation        | `ZeroNoiseExtrapolation`, `ReadoutErrorMitigation` |
| `quantum/tensor_networks.py`       | Tensor Network Methods  | `MatrixProductState`, `DMRG`                       |
| `quantum/quantum_ml.py`            | Quantum Neural Networks | `QuantumNeuralNetwork`, `QuantumKernel`            |
| `quantum/noise_models.py`          | Noise Simulation        | `NoiseModel`, `NoisyQuantumSimulator`              |
| `quantum/advanced_optimizers.py`   | Advanced Optimizers     | `ADAPTVQE`, `QITE`, `SPSA`, `ROTOSOLVE`            |
| `quantum/adiabatic.py`             | Adiabatic Computing     | `AdiabaticQuantumComputer`, `QuantumAnnealer`      |
| `quantum/circuit_visualization.py` | Circuit Diagrams        | `QuantumCircuit`, `create_bell_state`              |

### Physics & Validation

| File                    | Description         | Key Classes        |
| ----------------------- | ------------------- | ------------------ |
| `physics/validation.py` | Physics Constraints | `PhysicsValidator` |
| `core/hybrid.py`        | Hybrid Optimizer    | `HybridOptimizer`  |

### Applications

| File                           | Description            | Key Classes                               |
| ------------------------------ | ---------------------- | ----------------------------------------- |
| `applications/chemistry.py`    | Molecular Simulation   | `MolecularSimulator`, `Molecule`          |
| `applications/finance.py`      | Portfolio Optimization | `QuantumPortfolioOptimizer`               |
| `applications/cryptography.py` | Quantum Cryptography   | `BB84`, `E91`, `QRNG`                     |
| `applications/sensing.py`      | Quantum Sensing        | `QuantumMetrology`, `QuantumMagnetometer` |

### Distributed Computing

| File                     | Description     | Key Classes                        |
| ------------------------ | --------------- | ---------------------------------- |
| `distributed/cluster.py` | Quantum Cluster | `QuantumCluster`, `HybridWorkflow` |

---

## ORCHEX

### Agents

| File                            | Description           | Key Classes               |
| ------------------------------- | --------------------- | ------------------------- |
| `agents/base_agent.py`          | Base Agent Class      | `BaseAgent`, `AgentState` |
| `agents/hypothesis_agent.py`    | Hypothesis Generation | `HypothesisAgent`         |
| `agents/experiment_agent.py`    | Experiment Design     | `ExperimentAgent`         |
| `agents/analysis_agent.py`      | Result Analysis       | `AnalysisAgent`           |
| `agents/experiment_designer.py` | Bayesian Optimization | `ExperimentDesignerAgent` |

### Orchestration

| File                            | Description              | Key Classes               |
| ------------------------------- | ------------------------ | ------------------------- |
| `orchestrator/coordinator.py`   | Multi-Agent Coordination | `Coordinator`             |
| `physics_engine/constraints.py` | Physics Constraints      | `PhysicsConstraintEngine` |

---

## QubeML

### Models

| File                            | Description         | Key Classes                              |
| ------------------------------- | ------------------- | ---------------------------------------- |
| `models/quantum_transformer.py` | Quantum Transformer | `QuantumTransformer`, `QuantumAttention` |

---

## QMatSim

### Discovery

| File                              | Description         | Key Classes                  |
| --------------------------------- | ------------------- | ---------------------------- |
| `discovery/materials_pipeline.py` | Materials Discovery | `MaterialsDiscoveryPipeline` |

---

## Examples

| File                            | Description                        |
| ------------------------------- | ---------------------------------- |
| `quantum_ml_demo.py`            | VQC and QSVM demonstration         |
| `full_research_pipeline.py`     | Complete ORCHEX workflow           |
| `materials_discovery_demo.py`   | Superconductor discovery           |
| `distributed_computing_demo.py` | Parallel quantum workloads         |
| `finance_demo.py`               | Portfolio optimization             |
| `chemistry_demo.py`             | Molecular ground states            |
| `advanced_quantum_demo.py`      | Tensor networks, QNN, transformers |

---

## Tests

| File                              | Description                |
| --------------------------------- | -------------------------- |
| `test_quantum_implementations.py` | Core algorithm tests       |
| `test_comprehensive.py`           | Full test suite (13 tests) |

---

## Benchmarks

| File                    | Description                  |
| ----------------------- | ---------------------------- |
| `quantum_benchmarks.py` | Performance benchmarking     |
| `BENCHMARK_REPORT.md`   | Generated performance report |

---

## Usage Examples

### Quick Start

```python
from optilibria.optilibria import QAOAOptimizer, VQEOptimizer

# QAOA for MaxCut
qaoa = QAOAOptimizer(p=2)
result = qaoa.optimize(cost_function, n_vars=6)

# VQE for molecular ground state
vqe = VQEOptimizer(depth=2)
energy = vqe.optimize(hamiltonian, n_qubits=4)
```

### ORCHEX Multi-Agent

```python
from orchex import Coordinator, HypothesisAgent, ExperimentAgent

coordinator = Coordinator()
coordinator.register_agent(HypothesisAgent())
coordinator.register_agent(ExperimentAgent())

result = await coordinator.execute_workflow("discovery")
```

### Quantum Finance

```python
from optilibria.optilibria import QuantumPortfolioOptimizer, Asset

assets = [Asset("AAPL", 0.15, 0.25), Asset("GOOGL", 0.12, 0.22)]
optimizer = QuantumPortfolioOptimizer()
portfolio = optimizer.optimize_continuous(assets, covariance)
```

### Materials Discovery

```python
from qmatsim.qmatsim.discovery import discover_superconductors

candidates = await discover_superconductors(target_tc=300)
```

---

## Run Commands

```bash
# Run all tests
python tests/test_comprehensive.py

# Run benchmarks
python benchmarks/quantum_benchmarks.py

# Run specific demos
python examples/quantum_ml_demo.py
python examples/finance_demo.py
python examples/advanced_quantum_demo.py
```

---

## Dependencies

**Required:**

- Python 3.9+
- NumPy
- SciPy

**Optional:**

- Qiskit (IBM Quantum backend)
- Cirq (Google backend)
- PennyLane (Xanadu backend)

---

## Statistics

- **Total Python Files:** 597
- **Example Scripts:** 7
- **Test Files:** 2
- **Comprehensive Tests:** 13
- **All Tests Passing:** ✅
